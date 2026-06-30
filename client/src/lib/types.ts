export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  clerkId: string
  email: string
  isPremium: boolean
  taskCount: number
}
