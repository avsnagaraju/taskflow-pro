import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import PremiumBanner from '../components/ui/PremiumBanner'
import { useTasks } from '../hooks/useTasks'
import { useProfile } from '../hooks/useProfile'
import type { Task } from '../lib/types'

const FREE_LIMIT = 5

export default function Dashboard() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const { profile, loading: profileLoading, startCheckout } = useProfile()
  const [showForm, setShowForm] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [filter, setFilter] = useState<Task['status'] | 'ALL'>('ALL')

  const isPremium = profile?.isPremium ?? false
  const canCreate = isPremium || tasks.length < FREE_LIMIT
  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter)

  const handleCreate = async (data: Partial<Task>) => {
    await createTask(data)
    setShowForm(false)
  }

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      await startCheckout()
    } catch {
      setUpgrading(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isPremium={isPremium} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              {!isPremium && ` · ${Math.max(0, FREE_LIMIT - tasks.length)} free remaining`}
            </p>
          </div>
          {!showForm && (
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              disabled={!canCreate}
              title={!canCreate ? 'Upgrade to Pro to add more tasks' : undefined}
            >
              + New Task
            </button>
          )}
        </div>

        {/* Premium upgrade banner */}
        {!isPremium && (
          <PremiumBanner
            taskCount={tasks.length}
            onUpgrade={handleUpgrade}
            upgrading={upgrading}
          />
        )}

        {/* Task creation form */}
        {showForm && (
          <TaskForm
            isPremium={isPremium}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No tasks here</p>
            <p className="text-sm mt-1">Click "+ New Task" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isPremium={isPremium}
                onStatusChange={(id, status) => updateTask(id, { status })}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
