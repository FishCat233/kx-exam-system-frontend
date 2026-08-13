interface StatusDotProps {
  color: 'green' | 'red' | 'yellow' | 'gray'
  animate?: boolean
  className?: string
}

const colorMap = {
  green: 'text-kx-green',
  red: 'text-kx-red',
  yellow: 'text-kx-yellow',
  gray: 'text-kx-subtext',
} as const

export function StatusDot({ color, animate = false, className }: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={`w-2.5 h-2.5 status-dot ${colorMap[color]} ${animate ? 'status-dot--flash' : ''} ${className ?? ''}`}
    />
  )
}
