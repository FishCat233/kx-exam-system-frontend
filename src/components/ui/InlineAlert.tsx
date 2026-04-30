interface InlineAlertProps {
  variant: 'error' | 'warning' | 'info'
  message: string
  className?: string
}

const variantConfig = {
  error: {
    container: 'alert-error',
    icon: 'text-red-500',
    text: 'text-red-600',
  },
  warning: {
    container: 'alert-warning',
    icon: 'text-yellow-500',
    text: 'text-yellow-700',
  },
  info: {
    container: 'flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg',
    icon: 'text-blue-500',
    text: 'text-blue-700',
  },
} as const

function ExclamationIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function InlineAlert({ variant, message, className }: InlineAlertProps) {
  const config = variantConfig[variant]

  return (
    <div className={`${config.container} ${className ?? ''}`}>
      {variant === 'info' ? (
        <InfoIcon className={config.icon} />
      ) : (
        <ExclamationIcon className={config.icon} />
      )}
      <span className={`text-sm ${config.text}`}>{message}</span>
    </div>
  )
}
