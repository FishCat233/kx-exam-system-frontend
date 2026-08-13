interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return <span className={`font-medium text-kx-text ${className ?? ''}`}>{children}</span>
}
