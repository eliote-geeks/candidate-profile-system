import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CVGeneratorOutput } from '@/types/chat';

/**
 * POST /api/workflows/webhooks/cv-generated
 * Webhook receiver for CV Generator output from n8n
 * Stores generated CV in database for later use in applications
 */
export async function POST(req: NextRequest) {
  try {
    const body: CVGeneratorOutput = await req.json();

    // Validate required fields
    if (!body.profileId || !body.cvContent) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId and cvContent' },
        { status: 400 }
      );
    }

    // Verify profile exists
    const profile = await prisma.candidate.findUnique({
      where: { id: body.profileId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Store CV in database as a Document
    const cv = await prisma.document.create({
      data: {
        candidate_id: body.profileId,
        type: 'cv',
        version: body.cvFormat || 'pdf',
        content: body.cvContent || '',
        template_used: body.cvFormat,
      },
    });

    // TODO: Log CV generation (SystemLog schema needs to be updated)

    console.log('[CV Webhook] CV generated and stored:', body.profileId);
    console.log('[CV Webhook] CV Format:', body.cvFormat);
    if (body.compatibilityScore) {
      console.log('[CV Webhook] Compatibility Score:', body.compatibilityScore);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'CV received and stored',
        profileId: body.profileId,
        jobId: body.jobId,
        cvId: cv.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CV Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process CV webhook' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workflows/webhooks/cv-generated?profileId=xxx&jobId=yyy
 * Retrieve stored CV for a profile or job
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const jobId = searchParams.get('jobId');

    if (!profileId) {
      return NextResponse.json(
        { error: 'Missing required parameter: profileId' },
        { status: 400 }
      );
    }

    const cv = await prisma.document.findFirst({
      where: {
        candidate_id: profileId,
        type: 'cv',
      },
    });

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cv,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CV Webhook GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve CV' },
      { status: 500 }
    );
  }
}
