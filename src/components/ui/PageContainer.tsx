interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={`page-center py-10 ${className ?? ''}`}>{children}</div>
}
