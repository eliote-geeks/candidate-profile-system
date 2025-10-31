import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'job_automation_db',
  user: process.env.DB_USER || 'n8n_user',
  password: process.env.DB_PASSWORD || '',
})

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token du header Authorization ou du body
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 401 }
      )
    }

    // Chercher l'utilisateur associé au token dans la table sessions
    const sessionResult = await pool.query(
      'SELECT user_id FROM sessions WHERE access_token = $1 AND expires_at > NOW() LIMIT 1',
      [token]
    )

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Token invalide ou expiré' },
        { status: 401 }
      )
    }

    const userId = sessionResult.rows[0].user_id

    // Récupérer les infos utilisateur
    const userResult = await pool.query(
      `SELECT
        id, email, first_name, last_name, is_verified, is_active, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const user = userResult.rows[0]

    // Récupérer le profil candidat (s'il existe)
    const candidateResult = await pool.query(
      `SELECT
        id, first_name, last_name, email, phone, location, current_title, years_experience,
        education_level, skills, languages, desired_positions, desired_sectors, desired_locations,
        min_salary, contract_types, base_cv_url, linkedin_url, portfolio_url, active, created_at, updated_at
       FROM candidates
       WHERE email = $1`,
      [user.email]
    )

    const candidate = candidateResult.rows[0] || null

    // Récupérer les statistiques des candidatures
    let applicationStats = { total: 0, sent: 0, responded: 0, interview: 0, accepted: 0 }

    if (candidate) {
      const statsResult = await pool.query(
        `SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'sent') as sent,
          COUNT(*) FILTER (WHERE response_received = true) as responded,
          COUNT(*) FILTER (WHERE interview_scheduled = true) as interview,
          COUNT(*) FILTER (WHERE outcome = 'accepted') as accepted
         FROM applications
         WHERE candidate_id = $1`,
        [candidate.id]
      )

      if (statsResult.rows.length > 0) {
        const row = statsResult.rows[0]
        applicationStats = {
          total: parseInt(row.total),
          sent: parseInt(row.sent),
          responded: parseInt(row.responded),
          interview: parseInt(row.interview),
          accepted: parseInt(row.accepted),
        }
      }
    }

    // Récupérer les dernières candidatures
    let recentApplications = []
    if (candidate) {
      const appsResult = await pool.query(
        `SELECT
          a.id, a.status, a.sent_at, a.response_received, a.interview_scheduled, a.outcome,
          j.title, j.location, c.name as company_name
         FROM applications a
         LEFT JOIN job_offers j ON a.job_offer_id = j.id
         LEFT JOIN companies c ON a.company_id = c.id
         WHERE a.candidate_id = $1
         ORDER BY a.sent_at DESC
         LIMIT 10`,
        [candidate.id]
      )

      recentApplications = appsResult.rows
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isVerified: user.is_verified,
            isActive: user.is_active,
            createdAt: user.created_at,
          },
          candidate: candidate
            ? {
                id: candidate.id,
                firstName: candidate.first_name,
                lastName: candidate.last_name,
                email: candidate.email,
                phone: candidate.phone,
                location: candidate.location,
                currentTitle: candidate.current_title,
                yearsExperience: candidate.years_experience,
                educationLevel: candidate.education_level,
                skills: candidate.skills,
                languages: candidate.languages,
                desiredPositions: candidate.desired_positions,
                desiredSectors: candidate.desired_sectors,
                desiredLocations: candidate.desired_locations,
                minSalary: candidate.min_salary,
                contractTypes: candidate.contract_types,
                cvUrl: candidate.base_cv_url,
                linkedinUrl: candidate.linkedin_url,
                portfolioUrl: candidate.portfolio_url,
                active: candidate.active,
              }
            : null,
          statistics: applicationStats,
          recentApplications: recentApplications,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur dans /api/profiles/me:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}
