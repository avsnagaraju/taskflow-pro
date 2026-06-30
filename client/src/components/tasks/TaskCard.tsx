import type { Task } from '../../lib/types'

const STATUS_COLORS = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}

const PRIORITY_COLORS = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
}

interface TaskCardProps {
  task: Task
  isPremium: boolean
  onStatusChange: (id: string, status: Task['status']) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, isPremium, onStatusChange, onDelete }: TaskCardProps) {
  const nextStatus: Record<Task['status'], Task['status']> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: 'TODO',
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>

            {isPremium && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            )}

            {isPremium && task.dueDate && (
              <span className="text-xs text-gray-500">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={() => onStatusChange(task.id, nextStatus[task.status])}
            className="text-xs btn-secondary py-1 px-2"
          >
            {task.status === 'DONE' ? 'Reopen' : 'Advance'}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-red-600 hover:text-red-800 transition-colors py-1 px-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
