import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 400 }
      )
    }

    // Appeler le webhook n8n pour logout
    const response = await fetch(
      'https://reveilart4arist.com/webhook/auth-logout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      }
    )

    const data = await response.json()

    // Retourner la réponse du webhook
    return NextResponse.json(
      {
        success: data.success === true,
        message: data.message || 'Déconnexion réussie',
      },
      { status: response.ok ? 200 : 401 }
    )
  } catch (error) {
    console.error('Erreur dans /api/auth/logout:', error)
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
