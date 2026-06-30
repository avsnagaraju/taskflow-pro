import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'

export default function SuccessPage() {
  const { refetch } = useProfile()

  // Re-fetch profile so isPremium reflects payment
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 2000)
    return () => clearTimeout(timer)
  }, [refetch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card text-center max-w-md w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">You're now a Pro!</h1>
        <p className="text-gray-500 mt-2">
          Payment successful. Unlock all features and take your productivity to the next level.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-left">
          {['Unlimited tasks', 'Priority labels', 'Due date tracking', 'Board view (soon)'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500 font-bold">✓</span> {f}
            </div>
          ))}
        </div>
        <Link to="/dashboard" className="btn-primary mt-6 inline-block">
          Go to Dashboard →
        </Link>
      </div>
    </div>
  )
}
