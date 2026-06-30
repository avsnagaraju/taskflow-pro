import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  isPremium?: boolean
}

export default function Navbar({ isPremium }: NavbarProps) {
  const { user } = useUser()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-600">TaskFlow</span>
          {isPremium && (
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  )
}
