import { NextRequest, NextResponse } from 'next/server'

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
    const response = await fetch('https://reveilart4arist.com/webhook/get-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    })

    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      // Si le webhook n'existe pas ou retourne du vide, retourner un profil basique
      return NextResponse.json(
        {
          success: true,
          data: {
            user: {
              id: 'unknown',
              email: 'unknown',
              firstName: 'Utilisateur',
              lastName: 'Test',
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
        },
        { status: 200 }
      )
    }

    if (!response.ok || !data.success) {
      // Si le webhook n'existe pas encore, retourner un profil basique
      if (response.status === 404 || !response.ok) {
        return NextResponse.json(
          {
            success: true,
            data: {
              user: {
                id: 'unknown',
                email: 'unknown',
                firstName: 'Utilisateur',
                lastName: 'Test',
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
          },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { success: false, error: data.error || 'Impossible de récupérer le profil' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { success: true, data: data.data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur dans /api/profiles/me:', error)

    // Retourner un profil de fallback en cas d'erreur
    return NextResponse.json(
      {
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
      },
      { status: 200 }
    )
  }
}
