'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { evaluateCandidateProfile } from '@/lib/profileCompletion'

interface ProfileCheckResult {
  hasProfile: boolean
  isLoading: boolean
  error: string | null
}

interface ProfileCheckOptions {
  autoRedirect?: boolean
}

/**
 * Hook to check if user has completed their profile.
 * @param enabled - When true, triggers the profile check.
 * @param options - Optional configuration (autoRedirect to onboarding when incomplete).
 */
export function useProfileCheck(
  enabled: boolean = true,
  options: ProfileCheckOptions = {},
): ProfileCheckResult {
  const router = useRouter()
  const [hasProfile, setHasProfile] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { autoRedirect = true } = options

  useEffect(() => {
    let isMounted = true

    if (!enabled) {
      setIsLoading(false)
      return
    }

    const checkProfile = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        let userEmail: string | undefined

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            userEmail = parsed?.email
          } catch (parseErr) {
            console.warn('[useProfileCheck] Unable to parse stored user', parseErr)
          }
        }

        const response = await fetch('/api/profiles/me', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
            ...(userEmail ? { 'X-User-Email': userEmail } : {}),
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        const profileData = data?.data ?? {}
        const candidate = profileData.candidate
        const completion =
          typeof profileData.profileCompleted === 'boolean'
            ? {
                complete: profileData.profileCompleted as boolean,
                missingFields: Array.isArray(profileData.missingFields)
                  ? (profileData.missingFields as string[])
                  : [],
              }
            : evaluateCandidateProfile(candidate)

        if (!isMounted) {
          return
        }

        setHasProfile(completion.complete)

        if (autoRedirect && !completion.complete) {
          console.log(
            '[useProfileCheck] Redirecting to onboarding - missing fields:',
            completion.missingFields,
          )
          router.push('/onboarding')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error checking profile'
        console.error('[useProfileCheck]', errorMessage)

        if (!isMounted) {
          return
        }

        setError(errorMessage)
        setHasProfile(false)

        if (autoRedirect) {
          console.log('[useProfileCheck] Redirecting to onboarding - error checking profile')
          router.push('/onboarding')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkProfile()

    return () => {
      isMounted = false
    }
  }, [router, enabled, autoRedirect])

  return { hasProfile, isLoading, error }
}
