import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SuccessPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card text-center max-w-md w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.name ? `Welcome to Pro, ${user.name}!` : "You're now Pro!"}
        </h1>
        <p className="text-gray-500 mt-2">
          Your account has been upgraded. All Pro features are now unlocked.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-left">
          {['Unlimited tasks', 'Priority labels', 'Due date tracking', 'Pro badge'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500 font-bold">✓</span> {f}
            </div>
          ))}
        </div>

        <Link to="/dashboard" className="btn-primary mt-6 inline-block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
