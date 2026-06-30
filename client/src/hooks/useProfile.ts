import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../lib/api'
import type { UserProfile } from '../lib/types'

export function useProfile() {
  const { isLoaded, isSignedIn } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const { data } = await api.get<UserProfile>('/users/me')
      setProfile(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchProfile()
  }, [isLoaded, isSignedIn])

  const startCheckout = async () => {
    const { data } = await api.post<{ url: string }>('/payments/checkout')
    window.location.href = data.url
  }

  return { profile, loading, startCheckout, refetch: fetchProfile }
}
