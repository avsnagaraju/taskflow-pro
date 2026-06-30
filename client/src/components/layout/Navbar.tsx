import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  isPremium?: boolean
}

export default function Navbar({ isPremium }: NavbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-600">TaskFlow</span>
          {isPremium && (
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm py-1.5 px-3"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
