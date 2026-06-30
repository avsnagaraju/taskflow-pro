import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import type { UserProfile } from '../lib/types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get<UserProfile>('/users/me')
      setProfile(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchProfile()
    else setLoading(false)
  }, [user, fetchProfile])

  const startCheckout = async () => {
    await api.post('/payments/upgrade')
    // Full reload ensures AuthContext reinitializes with isPremium: true
    window.location.href = '/success'
  }

  return { profile, loading, startCheckout, refetch: fetchProfile }
}
