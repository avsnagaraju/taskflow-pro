import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '✅', title: 'Smart Task Management', desc: 'Create, track, and complete tasks with one click.' },
  { icon: '🔒', title: 'Secure Auth', desc: 'Email + password login with bcrypt hashing and JWT sessions.' },
  { icon: '💳', title: 'One-time Upgrade', desc: 'Pay $4.99 once to unlock Pro — no subscriptions ever.' },
  { icon: '⚡', title: 'Instant Sync', desc: 'All your tasks saved and synced to the database in real time.' },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-primary-600">TaskFlow Pro</span>
        <div className="flex gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-sm">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-3xl mx-auto">
        <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          Full-stack portfolio project — React + Express + Prisma + SQLite
        </span>
        <h1 className="mt-6 text-5xl font-extrabold text-gray-900 leading-tight">
          The only task manager<br />
          <span className="text-primary-600">you will ever need</span>
        </h1>
        <p className="mt-5 text-xl text-gray-500">
          Sign up free. Manage up to 5 tasks at no cost. Upgrade to Pro for $4.99 once and unlock everything forever.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
              Open Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Start for free
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="card text-center">
            <span className="text-3xl">{f.icon}</span>
            <h3 className="mt-3 font-semibold text-gray-800">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-center py-6 text-sm text-gray-400">
        Built with React · Express · Prisma · SQLite · Deployed on Vercel + Railway
      </footer>
    </div>
  )
}
