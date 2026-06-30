import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '✅', title: 'Smart Task Management', desc: 'Create, track, and complete tasks with one click.' },
  { icon: '🔒', title: 'Clerk Authentication', desc: 'Secure sign-in via email, Google, or GitHub.' },
  { icon: '💳', title: 'Stripe Payments', desc: 'One-time $4.99 upgrade to Pro — no subscriptions.' },
  { icon: '⚡', title: 'Real-time Sync', desc: 'Data synced instantly across all your devices.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-primary-600">TaskFlow Pro</span>
        <div className="flex gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-secondary text-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary text-sm">Get Started Free</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="btn-primary text-sm">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-3xl mx-auto">
        <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          Portfolio-worthy full-stack app
        </span>
        <h1 className="mt-6 text-5xl font-extrabold text-gray-900 leading-tight">
          The only task manager<br />
          <span className="text-primary-600">you'll ever need</span>
        </h1>
        <p className="mt-5 text-xl text-gray-500">
          Sign up free. Manage up to 5 tasks at no cost. Upgrade to Pro for $4.99 once and unlock everything forever.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="btn-primary text-base px-6 py-3">Start for free →</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
              Open Dashboard →
            </Link>
          </SignedIn>
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
        Built with React · Express · Prisma · Clerk · Stripe · Deployed on Vercel + Railway
      </footer>
    </div>
  )
}
