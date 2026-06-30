import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach Clerk JWT on every request
api.interceptors.request.use(async (config) => {
  // window.__clerk is set by ClerkProvider
  const token = await window.__clerk?.session?.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// Augment Window so TypeScript doesn't complain
declare global {
  interface Window {
    __clerk?: { session?: { getToken: () => Promise<string | null> } }
  }
}
