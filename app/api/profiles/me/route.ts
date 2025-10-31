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

    // Si pas de token, retourner le fallback (pas d'erreur)
    if (!token) {
      console.log('No token provided, returning fallback profile')
      return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
    }

    // Appeler le webhook n8n pour récupérer le profil
    try {
      console.log('Fetching profile from n8n webhook...')
      const response = await fetch('https://reveilart4arist.com/webhook/get-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })

      console.log('Webhook response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Webhook returned data:', data.success)
        if (data.success && data.data) {
          return NextResponse.json(
            { success: true, data: data.data },
            { status: 200 }
          )
        }
      } else {
        console.log('Webhook returned non-ok status:', response.status)
      }
    } catch (fetchError) {
      console.error('Webhook fetch error:', fetchError)
    }

    // Si le webhook échoue ou n'existe pas, retourner le fallback
    console.log('Returning fallback profile due to webhook failure or error')
    return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
  } catch (error) {
    console.error('Erreur dans /api/profiles/me:', error)
    return NextResponse.json(FALLBACK_PROFILE, { status: 200 })
  }
}
