'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface OnboardingGateProps {
  children: ReactNode
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (!token) {
      router.replace('/login?next=/onboarding')
      return
    }

    setAuthorized(true)
  }, [router])

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <div className="max-w-sm text-center space-y-4">
          <h2 className="text-xl font-semibold">Connexion requise</h2>
          <p className="text-sm text-slate-400">
            Nous te redirigeons vers la page de connexion pour continuer la création de ton profil.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
