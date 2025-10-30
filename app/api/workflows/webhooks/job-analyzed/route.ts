import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobAnalyzerOutput } from '@/types/chat';

/**
 * POST /api/workflows/webhooks/job-analyzed
 * Webhook receiver for Job Analyzer output from n8n
 * Stores job match analysis results in database
 */
export async function POST(req: NextRequest) {
  try {
    const body: JobAnalyzerOutput = await req.json();

    // Validate required fields
    if (!body.profileId || !body.jobId) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId and jobId' },
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

    // Store analysis in database
    const analysis = await prisma.jobAnalysis.upsert({
      where: {
        profileId_jobId: {
          profileId: body.profileId,
          jobId: body.jobId,
        },
      },
      update: {
        matchPercentage: body.matchPercentage,
        matchedSkills: body.matchedSkills,
        missingSkills: body.missingSkills,
        salaryMatch: body.salaryMatch,
        locationMatch: body.locationMatch,
        analysis: body.analysis,
        recommendation: body.recommendation,
        status: 'completed',
        workflowId: body.workflowId || null,
        errorMessage: null,
      },
      create: {
        profileId: body.profileId,
        jobId: body.jobId,
        matchPercentage: body.matchPercentage,
        matchedSkills: body.matchedSkills,
        missingSkills: body.missingSkills,
        salaryMatch: body.salaryMatch,
        locationMatch: body.locationMatch,
        analysis: body.analysis,
        recommendation: body.recommendation,
        status: 'completed',
        workflowId: body.workflowId || null,
      },
    });

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        profileId: body.profileId,
        action: 'job_analyzed',
        details: {
          jobId: body.jobId,
          matchPercentage: body.matchPercentage,
          recommendation: body.recommendation,
        },
      },
    });

    console.log('[Job Analysis Webhook] Analysis received:', `${body.profileId}_${body.jobId}`);
    console.log('[Job Analysis Webhook] Match:', body.matchPercentage + '%');
    console.log('[Job Analysis Webhook] Recommendation:', body.recommendation);

    return NextResponse.json(
      {
        success: true,
        message: 'Job analysis received and stored',
        profileId: body.profileId,
        jobId: body.jobId,
        analysisId: analysis.id,
        matchPercentage: body.matchPercentage,
        recommendation: body.recommendation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Job Analysis Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process job analysis webhook' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workflows/webhooks/job-analyzed?profileId=xxx&jobId=yyy
 * Retrieve stored job analysis for a profile and job
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

    const analysis = await prisma.jobAnalysis.findUnique({
      where: {
        profileId_jobId: {
          profileId,
          jobId,
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        analysis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Job Analysis Webhook GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis' },
      { status: 500 }
    );
  }
}
