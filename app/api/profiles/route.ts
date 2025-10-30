import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/profiles
 * Create a new candidate profile in job_automation_db
 * @param req - Request containing candidate profile data with snake_case field names
 * @returns Candidate ID and confirmation message
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.first_name || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name and email' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingProfile = await prisma.candidate.findUnique({
      where: { email: body.email },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Convert string arrays from chat to arrays
    const skills = typeof body.skills === 'string' ? body.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : body.skills || [];
    const languages = typeof body.languages === 'string' ? body.languages.split(',').map((l: string) => l.trim()).filter((l: string) => l) : body.languages || [];
    const desired_positions = typeof body.desired_positions === 'string' ? body.desired_positions.split(',').map((p: string) => p.trim()).filter((p: string) => p) : body.desired_positions || [];
    const desired_sectors = typeof body.desired_sectors === 'string' ? body.desired_sectors.split(',').map((s: string) => s.trim()).filter((s: string) => s) : body.desired_sectors || [];
    const desired_locations = typeof body.desired_locations === 'string' ? body.desired_locations.split(',').map((l: string) => l.trim()).filter((l: string) => l) : body.desired_locations || [];
    const contract_types = Array.isArray(body.contract_types) ? body.contract_types : [];

    // Create candidate in database
    const candidate = await prisma.candidate.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name || '',
        email: body.email,
        phone: body.phone || null,
        location: body.location || null,
        current_title: body.current_title || null,
        years_experience: body.years_experience ? parseInt(body.years_experience) : null,
        education_level: body.education_level || null,
        skills: skills,
        languages: languages,
        desired_positions: desired_positions,
        desired_sectors: desired_sectors,
        desired_locations: desired_locations,
        min_salary: body.min_salary ? parseInt(body.min_salary) : null,
        contract_types: contract_types,
        linkedin_url: body.linkedin_url || null,
        portfolio_url: body.portfolio_url || null,
        base_cv_url: body.base_cv_url || null,
        active: true,
      },
    });

    console.log('[API] New candidate created:', candidate.id);

    // Trigger n8n webhook to start job search workflow (optional)
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      triggerN8nWorkflow(n8nWebhookUrl, candidate).catch((err) =>
        console.error('[N8N] Background webhook error:', err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Candidate profile created successfully',
        profileId: candidate.id,
        candidateId: candidate.id,
        email: candidate.email,
        redirectUrl: '/dashboard',
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API] Error creating profile:', errorMessage);
    console.error('[API] Full error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create profile',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/profiles
 * Retrieve all candidates (admin only - requires authentication in production)
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Add authentication check in production

    const candidates = await prisma.candidate.findMany({
      include: {
        applications: true,
        documents: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        count: candidates.length,
        candidates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to trigger n8n workflow
 */
async function triggerN8nWorkflow(webhookUrl: string, profile: any) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'profile.created',
        data: profile,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[N8N] Webhook failed:', response.status);
    }
  } catch (error) {
    console.error('[N8N] Webhook error:', error);
  }
}
