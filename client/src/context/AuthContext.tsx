import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../lib/api'

export interface AuthUser {
  id: string
  email: string
  name: string
  isPremium: boolean
}

interface AuthContextType {
  user: AuthUser | null
  isLoaded: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'tf_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api
        .get<AuthUser & { taskCount: number }>('/users/me')
        .then(({ data }) => setUser(data))
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem(TOKEN_KEY)
          delete api.defaults.headers.common['Authorization']
        })
        .finally(() => setIsLoaded(true))
    } else {
      setIsLoaded(true)
    }
  }, [])

  const saveSession = (token: string, userData: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    })
    saveSession(data.token, data.user)
  }

  const register = async (email: string, password: string, name: string) => {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/register', {
      email,
      password,
      name,
    })
    saveSession(data.token, data.user)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const refreshUser = async () => {
    const { data } = await api.get<AuthUser & { taskCount: number }>('/users/me')
    setUser(data)
  }

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
