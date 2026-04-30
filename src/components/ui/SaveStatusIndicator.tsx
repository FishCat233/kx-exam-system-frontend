type SaveStatus = 'saving' | 'unsaved' | 'saved'

interface SaveStatusIndicatorProps {
  status: SaveStatus | null
  isDark?: boolean
}

function SpinningIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const statusConfig = {
  saving: {
    icon: SpinningIcon,
    text: '保存中...',
    lightColor: 'text-yellow-600',
    darkColor: 'text-yellow-400',
  },
  unsaved: {
    icon: WarningIcon,
    text: '未保存',
    lightColor: 'text-orange-600',
    darkColor: 'text-orange-400',
  },
  saved: {
    icon: CheckIcon,
    text: '已保存',
    lightColor: 'text-green-600',
    darkColor: 'text-green-400',
  },
} as const

export function SaveStatusIndicator({ status, isDark = false }: SaveStatusIndicatorProps) {
  if (status === null) return null

  const config = statusConfig[status]
  const Icon = config.icon
  const colorClass = isDark ? config.darkColor : config.lightColor

  return (
    <span className="flex items-center gap-1.5 text-sm">
      <Icon className={colorClass} />
      <span className={`${colorClass} hidden sm:inline`}>{config.text}</span>
    </span>
  )
}
