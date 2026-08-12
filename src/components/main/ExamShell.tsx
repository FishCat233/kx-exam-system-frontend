import type { ReactNode } from 'react'

interface ExamShellProps {
  statusBar: ReactNode
  children: ReactNode
}

export function ExamShell({ statusBar, children }: ExamShellProps) {
  return (
    <div className="fixed inset-0 flex flex-col bg-kx-base">
      {statusBar}
      {children}
    </div>
  )
}
