import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Valider les champs requis
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Appeler le webhook n8n
    const response = await fetch(
      'https://reveilart4arist.com/webhook/auth-login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

    const data = await response.json()

    // Vérifier la réponse du webhook
    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Identifiants invalides' },
        { status: response.status }
      )
    }

    // Retourner la réponse réussie avec les données
    return NextResponse.json(
      {
        success: true,
        data: {
          user: data.data.user,
          token: data.data.token,
          refreshToken: data.data.refreshToken,
          expiresAt: data.data.expiresAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur dans /api/auth/login:', error)
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
