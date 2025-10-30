import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    { status: 200 }
  );
}
