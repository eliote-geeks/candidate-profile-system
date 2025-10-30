import { NextRequest, NextResponse } from 'next/server';
import { JobAnalyzerInput } from '@/types/chat';

/**
 * POST /api/workflows/job-analyzer
 * Trigger Job Analysis workflow via n8n
 * Uses Gemini to analyze job match with candidate profile
 */
export async function POST(req: NextRequest) {
  try {
    const body: JobAnalyzerInput = await req.json();

    // Validate required fields
    if (!body.profileId || !body.jobId || !body.jobOffer || !body.candidateProfile) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId, jobId, jobOffer, candidateProfile' },
        { status: 400 }
      );
    }

    // Trigger n8n Job Analyzer workflow
    const n8nWebhookUrl = process.env.N8N_JOB_ANALYZER_WEBHOOK;
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: 'N8N Job Analyzer webhook not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'job.analyze',
        data: body,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[Job Analyzer] Workflow failed:', response.status);
      return NextResponse.json(
        { error: 'Failed to analyze job' },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log('[Job Analyzer] Workflow triggered:', body.profileId, 'for job:', body.jobId);

    return NextResponse.json(
      {
        success: true,
        message: 'Job analysis started',
        profileId: body.profileId,
        jobId: body.jobId,
        workflowId: result.workflowId || 'pending',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[Job Analyzer] Error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger job analysis' },
      { status: 500 }
    );
  }
}
