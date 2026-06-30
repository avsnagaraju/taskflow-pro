import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../lib/api'
import type { Task } from '../lib/types'

export function useTasks() {
  const { isLoaded, isSignedIn } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Task[]>('/tasks')
      setTasks(data)
    } catch {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchTasks()
  }, [isLoaded, isSignedIn, fetchTasks])

  const createTask = async (payload: Partial<Task>) => {
    const { data } = await api.post<Task>('/tasks', payload)
    setTasks((prev) => [data, ...prev])
    return data
  }

  const updateTask = async (id: string, payload: Partial<Task>) => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, payload)
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks }
}
