interface StatusDotProps {
  color: 'green' | 'red' | 'yellow' | 'gray'
  animate?: boolean
  className?: string
}

const colorMap = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  gray: 'bg-slate-500',
} as const

export function StatusDot({ color, animate = false, className }: StatusDotProps) {
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full ${colorMap[color]} ${animate ? 'animate-pulse' : ''} ${className ?? ''}`}
    />
  )
}
