import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/auth/logout
 * Invalidate user session and logout
 * @param req - Request with Authorization header containing Bearer token
 * @returns Success/error response
 */
export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')?.trim()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token manquant dans le header Authorization' },
        { status: 401 }
      )
    }

    console.log('[LOGOUT] Attempting to delete session for token:', token.substring(0, 20) + '...')

    // Delete session from database
    // Using raw query to avoid type issues with prisma
    const deleteResult = await prisma.$queryRaw<{ id: string }[]>`
      DELETE FROM sessions
      WHERE access_token = ${token}
      RETURNING id
    `

    if (!deleteResult || deleteResult.length === 0) {
      console.warn('[LOGOUT] Session not found for token:', token.substring(0, 20) + '...')
      return NextResponse.json(
        { success: false, error: 'Session non trouvée ou déjà expirée' },
        { status: 401 }
      )
    }

    console.log('[LOGOUT] Session deleted successfully:', deleteResult[0].id)

    return NextResponse.json(
      {
        success: true,
        message: 'Déconnexion réussie',
        sessionId: deleteResult[0].id,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[LOGOUT] Error during logout:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la déconnexion',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
