import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/webhooks/n8n
 * Receive job offers and workflow results from n8n
 * Called by n8n workflows to update candidate data and job matches
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('[N8N Webhook] Received event:', body.event);
    console.log('[N8N Webhook] Payload:', JSON.stringify(body, null, 2));

    // Handle different event types from n8n workflows
    switch (body.event) {
      case 'jobs.found':
        return handleJobsFound(body);
      case 'cv.generated':
        return handleCVGenerated(body);
      case 'application.sent':
        return handleApplicationSent(body);
      case 'workflow.error':
        return handleWorkflowError(body);
      default:
        console.warn(`[N8N Webhook] Unknown event type: ${body.event}`);
        return NextResponse.json(
          { success: true, message: 'Event received' },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error('[N8N Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

/**
 * Handle job offers found by n8n scraper
 */
async function handleJobsFound(payload: any) {
  const { profileId, jobs, timestamp } = payload;

  console.log(`[N8N] Found ${jobs?.length || 0} jobs for profile: ${profileId}`);

  // TODO: Store jobs in database
  // TODO: Update user's dashboard with new jobs
  // TODO: Send notification to candidate

  // Example structure of job data
  // {
  //   externalId: 'job_123',
  //   title: 'Senior Developer',
  //   company: 'TechCorp',
  //   location: 'Douala',
  //   salary: 'Negotiable',
  //   description: '...',
  //   url: 'https://...',
  //   relevanceScore: 0.95,
  //   matchedSkills: ['React', 'Node.js'],
  // }

  return NextResponse.json(
    {
      success: true,
      message: `${jobs?.length || 0} jobs processed`,
      profileId,
      timestamp,
    },
    { status: 200 }
  );
}

/**
 * Handle CV generation completion
 */
async function handleCVGenerated(payload: any) {
  const { profileId, cvUrl, timestamp } = payload;

  console.log(`[N8N] CV generated for profile: ${profileId}`);
  console.log(`[N8N] CV URL: ${cvUrl}`);

  // TODO: Store CV URL in user profile
  // TODO: Make CV available for download in dashboard

  return NextResponse.json(
    {
      success: true,
      message: 'CV generation acknowledged',
      profileId,
      timestamp,
    },
    { status: 200 }
  );
}

/**
 * Handle application submission
 */
async function handleApplicationSent(payload: any) {
  const { profileId, jobId, applicationId, timestamp } = payload;

  console.log(`[N8N] Application sent for profile: ${profileId}, job: ${jobId}`);

  // TODO: Update application status in database
  // TODO: Track application metrics

  return NextResponse.json(
    {
      success: true,
      message: 'Application recorded',
      profileId,
      applicationId,
      timestamp,
    },
    { status: 200 }
  );
}

/**
 * Handle workflow errors
 */
async function handleWorkflowError(payload: any) {
  const { profileId, error, workflowName, timestamp } = payload;

  console.error(
    `[N8N] Workflow error for profile ${profileId}: ${error?.message || 'Unknown error'}`
  );
  console.error(`[N8N] Workflow: ${workflowName}`);

  // TODO: Log error for debugging
  // TODO: Notify admin or user if critical

  return NextResponse.json(
    {
      success: true,
      message: 'Error logged',
      profileId,
      timestamp,
    },
    { status: 200 }
  );
}
