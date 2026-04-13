import type { ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

import type { Exam } from '@/api/exam'

interface ExamContextType {
  currentExam: Exam | null
  setCurrentExam: (exam: Exam | null) => void
  currentExamId: number | null
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export function ExamProvider({ children }: { children: ReactNode }) {
  const [currentExam, setCurrentExam] = useState<Exam | null>(null)

  const handleSetCurrentExam = useCallback((exam: Exam | null) => {
    setCurrentExam(exam)
    // 保存到 localStorage，刷新页面后保持选择
    if (exam) {
      localStorage.setItem('admin_current_exam_id', exam.id.toString())
    } else {
      localStorage.removeItem('admin_current_exam_id')
    }
  }, [])

  return (
    <ExamContext.Provider
      value={{
        currentExam,
        setCurrentExam: handleSetCurrentExam,
        currentExamId: currentExam?.id ?? null,
      }}
    >
      {children}
    </ExamContext.Provider>
  )
}

export function useExam() {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider')
  }
  return context
}
