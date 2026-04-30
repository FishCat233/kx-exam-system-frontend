interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <button className={`btn-gradient ${className ?? ''}`} {...props}>
      {children}
    </button>
  )
}
