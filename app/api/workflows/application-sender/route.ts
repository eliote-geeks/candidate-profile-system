import { NextRequest, NextResponse } from 'next/server';
import { ApplicationInput } from '@/types/chat';

/**
 * POST /api/workflows/application-sender
 * Trigger Application Sender workflow via n8n
 * Sends job application with generated CV
 */
export async function POST(req: NextRequest) {
  try {
    const body: ApplicationInput = await req.json();

    // Validate required fields
    if (!body.profileId || !body.jobId || !body.jobOffer || !body.cvContent || !body.candidateEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId, jobId, jobOffer, cvContent, candidateEmail' },
        { status: 400 }
      );
    }

    // Trigger n8n Application Sender workflow
    const n8nWebhookUrl = process.env.N8N_APPLICATION_SENDER_WEBHOOK;
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: 'N8N Application Sender webhook not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'application.send',
        data: body,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[Application Sender] Workflow failed:', response.status);
      return NextResponse.json(
        { error: 'Failed to send application' },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log('[Application Sender] Workflow triggered:', body.profileId, 'for job:', body.jobId);

    return NextResponse.json(
      {
        success: true,
        message: 'Application sent successfully',
        profileId: body.profileId,
        jobId: body.jobId,
        applicationId: result.applicationId || 'pending',
        workflowId: result.workflowId || 'pending',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[Application Sender] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send application' },
      { status: 500 }
    );
  }
}
