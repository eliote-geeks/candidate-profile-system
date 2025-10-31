import { NextRequest, NextResponse } from 'next/server'

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
    // Récupérer le token du header Authorization
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 401 }
      )
    }

    // Appeler le webhook n8n pour récupérer le profil
    try {
      const response = await fetch('https://reveilart4arist.com/webhook/get-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          return NextResponse.json(
            { success: true, data: data.data },
            { status: 200 }
          )
        }
      }
    } catch (fetchError) {
      console.error('Webhook fetch error:', fetchError)
    }

    // Si le webhook échoue ou n'existe pas, retourner le fallback
    return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
  } catch (error) {
    console.error('Erreur dans /api/profiles/me:', error)
    return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
  }
}
