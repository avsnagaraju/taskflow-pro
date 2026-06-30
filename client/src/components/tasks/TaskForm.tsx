import { useState } from 'react'
import type { Task } from '../../lib/types'

interface TaskFormProps {
  isPremium: boolean
  onSubmit: (data: Partial<Task>) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({ isPremium, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate || null,
        status: 'TODO',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="font-semibold text-gray-800">New Task</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="input resize-none"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
        />
      </div>

      {isPremium && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
