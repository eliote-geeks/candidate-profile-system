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
    const application = await prisma.application.upsert({
      where: {
        profileId_jobId: {
          profileId: body.profileId,
          jobId: body.jobId,
        },
      },
      update: {
        status: body.status,
        sentAt: body.status === 'sent' ? new Date() : undefined,
        confirmationUrl: body.confirmationUrl,
        recipientEmail: body.recipientEmail,
        errorMessage: body.errorMessage || null,
      },
      create: {
        profileId: body.profileId,
        jobId: body.jobId,
        status: body.status,
        sentAt: body.status === 'sent' ? new Date() : undefined,
        confirmationUrl: body.confirmationUrl,
        recipientEmail: body.recipientEmail,
        errorMessage: body.errorMessage || null,
      },
    });

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        profileId: body.profileId,
        action: 'application_sent',
        details: {
          jobId: body.jobId,
          applicationId: body.applicationId,
          status: body.status,
          recipientEmail: body.recipientEmail,
        },
      },
    });

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

    const application = await prisma.application.findUnique({
      where: {
        profileId_jobId: {
          profileId,
          jobId,
        },
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
