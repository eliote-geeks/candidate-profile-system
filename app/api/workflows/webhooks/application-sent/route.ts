import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationOutput } from '@/types/chat';

/**
 * POST /api/workflows/webhooks/application-sent
 * Webhook receiver for Application Sender output from n8n
 * Stores application confirmation and status in database
 */
export async function POST(req: NextRequest) {
  try {
    const body: ApplicationOutput = await req.json();

    // Validate required fields
    if (!body.profileId || !body.jobId || !body.applicationId) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId, jobId, and applicationId' },
        { status: 400 }
      );
    }

    // Verify profile and job exist
    const [profile, job] = await Promise.all([
      prisma.candidate.findUnique({ where: { id: body.profileId } }),
      prisma.jobOffer.findUnique({ where: { id: body.jobId } }),
    ]);

    if (!profile || !job) {
      return NextResponse.json(
        { error: 'Profile or Job not found' },
        { status: 404 }
      );
    }

    // Store application in database
    // First, try to find existing application
    const existingApplication = await prisma.application.findFirst({
      where: {
        candidate_id: body.profileId,
        job_offer_id: body.jobId,
      },
    });

    let application;
    if (existingApplication) {
      // Update existing application
      application = await prisma.application.update({
        where: { id: existingApplication.id },
        data: {
          status: body.status,
          sent_at: body.status === 'sent' ? new Date() : undefined,
          last_status_update: new Date(),
        },
      });
    } else {
      // Create new application
      application = await prisma.application.create({
        data: {
          candidate_id: body.profileId,
          job_offer_id: body.jobId,
          status: body.status,
          sent_at: body.status === 'sent' ? new Date() : undefined,
          cv_url: '',
          sent_to_email: body.recipientEmail || '',
        },
      });
    }

    // TODO: Log audit trail (AuditLog model needs to be created)

    console.log('[Application Webhook] Application received:', `${body.profileId}_${body.jobId}`);
    console.log('[Application Webhook] Status:', body.status);
    console.log('[Application Webhook] Application ID:', body.applicationId);

    if (body.status === 'failed' && body.errorMessage) {
      console.error('[Application Webhook] Error:', body.errorMessage);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application status received and stored',
        profileId: body.profileId,
        jobId: body.jobId,
        applicationId: body.applicationId,
        applicationRecordId: application.id,
        status: body.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Application Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process application webhook' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workflows/webhooks/application-sent?profileId=xxx&jobId=yyy
 * Retrieve stored application status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const jobId = searchParams.get('jobId');

    if (!profileId || !jobId) {
      return NextResponse.json(
        { error: 'Missing required parameters: profileId and jobId' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        candidate_id: profileId,
        job_offer_id: jobId,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Application Webhook GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve application status' },
      { status: 500 }
    );
  }
}
