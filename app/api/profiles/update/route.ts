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

    const body = await request.json()

    // Appeler le webhook n8n pour mettre à jour le profil
    const response = await fetch('https://reveilart4arist.com/webhook/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token, ...body }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Impossible de mettre à jour le profil' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { success: true, data: data.data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur dans /api/profiles/update:', error)

    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
