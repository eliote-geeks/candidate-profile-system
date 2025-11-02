import { NextRequest, NextResponse } from 'next/server'
import { evaluateCandidateProfile } from '@/lib/profileCompletion'
import { prisma } from '@/lib/prisma'

// Convert snake_case object to camelCase
const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(item => toCamelCase(item))
  if (typeof obj !== 'object') return obj

  return Object.keys(obj).reduce((result: any, key: string) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = toCamelCase(obj[key])
    return result
  }, {})
}

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

    // Convert candidate fields from snake_case to camelCase for frontend
    const candidateInCamelCase = candidate ? toCamelCase(candidate) : null

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
      candidate: candidateInCamelCase,
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

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 401 }
      )
    }

    // Get email from token
    const sessionRow = await prisma.$queryRaw<{ email: string }[]>`
      SELECT u.email
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.access_token = ${token}
      AND s.expires_at > NOW()
      LIMIT 1
    `

    const email = sessionRow[0]?.email

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email non trouvé' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Convert camelCase from frontend to snake_case for database
    const snakeCaseData: Record<string, any> = {}

    const fieldMapping: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      currentTitle: 'current_title',
      yearsExperience: 'years_experience',
      educationLevel: 'education_level',
      minSalary: 'min_salary',
      linkedinUrl: 'linkedin_url',
      portfolioUrl: 'portfolio_url',
      contractTypes: 'contract_types',
      desiredPositions: 'desired_positions',
      desiredSectors: 'desired_sectors',
      desiredLocations: 'desired_locations',
      baseCvUrl: 'base_cv_url',
    }

    // Map camelCase fields to snake_case
    Object.entries(body).forEach(([key, value]) => {
      const dbKey = fieldMapping[key] || key
      snakeCaseData[dbKey] = value
    })

    // Update candidate profile
    const updated = await prisma.candidate.upsert({
      where: { email },
      update: snakeCaseData,
      create: {
        email,
        first_name: snakeCaseData.first_name || '',
        last_name: snakeCaseData.last_name || '',
        ...snakeCaseData,
      },
    })

    // Convert response back to camelCase
    const response = toCamelCase(updated)

    return NextResponse.json({ success: true, data: response }, { status: 200 })
  } catch (error) {
    console.error('Erreur dans PUT /api/profiles/me:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
