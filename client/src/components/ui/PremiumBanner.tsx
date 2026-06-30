interface PremiumBannerProps {
  taskCount: number
  onUpgrade: () => void
  upgrading: boolean
}

const FREE_LIMIT = 5

export default function PremiumBanner({ taskCount, onUpgrade, upgrading }: PremiumBannerProps) {
  const remaining = Math.max(0, FREE_LIMIT - taskCount)

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold text-amber-900">Upgrade to Pro</h3>
          <p className="text-sm text-amber-700 mt-0.5">
            {remaining > 0
              ? `${remaining} free task${remaining !== 1 ? 's' : ''} remaining. `
              : "You've reached the free limit. "}
            Unlock unlimited tasks, priority labels, due dates & more.
          </p>
        </div>
        <button
          onClick={onUpgrade}
          disabled={upgrading}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors shrink-0 disabled:opacity-50"
        >
          {upgrading ? 'Redirecting...' : 'Upgrade — $4.99'}
        </button>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-amber-700">
        {['Unlimited tasks', 'Priority labels', 'Due dates', 'Board view (coming soon)'].map((f) => (
          <span key={f} className="flex items-center gap-1">
            <span>✓</span> {f}
          </span>
        ))}
      </div>
    </div>
  )
}
