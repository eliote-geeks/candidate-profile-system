import { NextRequest, NextResponse } from 'next/server'
import { evaluateCandidateProfile } from '@/lib/profileCompletion'
import { prisma } from '@/lib/prisma'

const FALLBACK_PROFILE = {
  success: true,
  data: {
    user: {
      id: 'unknown',
      email: 'user@example.com',
      firstName: 'Utilisateur',
      lastName: 'Candidat',
      isVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    candidate: null,
    profileCompleted: false,
    missingFields: [],
    statistics: {
      total: 0,
      sent: 0,
      responded: 0,
      interview: 0,
      accepted: 0,
    },
    recentApplications: [],
  },
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const emailHeader = request.headers.get('x-user-email')
    const token = authHeader?.replace('Bearer ', '')

    let emailFromToken: string | undefined

    if (token) {
      try {
        const sessionRow = await prisma.$queryRaw<{ email: string }[]>`
          SELECT u.email
          FROM sessions s
          JOIN users u ON u.id = s.user_id
          WHERE s.access_token = ${token}
          AND s.expires_at > NOW()
          LIMIT 1
        `

        emailFromToken = sessionRow[0]?.email
      } catch (error) {
        console.error('[API] Unable to verify token in sessions table:', error)
      }
    }

    const email = emailHeader ?? emailFromToken

    if (!email) {
      console.log('[API] GET /profiles/me -> email not resolved, returning fallback')
      return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
    }

    const candidate = await prisma.candidate.findUnique({ where: { email } })

    const userRow = await prisma.$queryRaw<{ first_name: string | null; last_name: string | null }[]>`
      SELECT first_name, last_name
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    const completion = evaluateCandidateProfile(candidate)

    const data = {
      user: {
        id: candidate?.id ?? 'local-user',
        email,
        firstName: userRow[0]?.first_name ?? candidate?.first_name ?? '',
        lastName: userRow[0]?.last_name ?? candidate?.last_name ?? '',
        isVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      candidate,
      profileCompleted: completion.complete,
      missingFields: completion.missingFields,
      statistics: {
        total: 0,
        sent: 0,
        responded: 0,
        interview: 0,
        accepted: 0,
      },
      recentApplications: [],
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('Erreur dans /api/profiles/me:', error)
    return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
  }
}
