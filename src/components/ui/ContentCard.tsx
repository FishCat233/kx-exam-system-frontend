interface ContentCardProps {
  children: React.ReactNode
  className?: string
}

export function ContentCard({ children, className }: ContentCardProps) {
  return <div className={`card-base p-8 md:p-10 ${className ?? ''}`}>{children}</div>
}
