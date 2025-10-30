import { NextRequest, NextResponse } from 'next/server';
import { CVGeneratorInput, CVGeneratorOutput } from '@/types/chat';

/**
 * POST /api/workflows/cv-generator
 * Trigger CV Generation workflow via n8n
 * Sends candidate profile to Gemini-powered CV Generator
 */
export async function POST(req: NextRequest) {
  try {
    const body: CVGeneratorInput = await req.json();

    // Validate required fields
    if (!body.profileId || !body.candidateProfile) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId and candidateProfile' },
        { status: 400 }
      );
    }

    // Trigger n8n CV Generator workflow
    const n8nWebhookUrl = process.env.N8N_CV_GENERATOR_WEBHOOK;
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: 'N8N CV Generator webhook not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'cv.generate',
        data: body,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[CV Generator] Workflow failed:', response.status);
      return NextResponse.json(
        { error: 'Failed to generate CV' },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log('[CV Generator] Workflow triggered:', body.profileId);

    return NextResponse.json(
      {
        success: true,
        message: 'CV generation started',
        profileId: body.profileId,
        workflowId: result.workflowId || 'pending',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[CV Generator] Error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger CV generation' },
      { status: 500 }
    );
  }
}
