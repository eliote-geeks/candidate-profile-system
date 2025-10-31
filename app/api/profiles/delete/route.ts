import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 401 }
      )
    }

    // Appeler le webhook n8n pour supprimer le compte
    const response = await fetch('https://reveilart4arist.com/webhook/delete-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Impossible de supprimer le compte' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Compte supprimé' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur dans /api/profiles/delete:', error)

    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
