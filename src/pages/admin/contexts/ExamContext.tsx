import type { ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

import type { Exam } from '../types/admin'

interface ExamContextType {
  currentExam: Exam | null
  setCurrentExam: (exam: Exam | null) => void
  currentExamId: number | null
  examListVersion: number
  notifyExamListChanged: () => void
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export function ExamProvider({ children }: { children: ReactNode }) {
  const [currentExam, setCurrentExam] = useState<Exam | null>(null)
  const [examListVersion, setExamListVersion] = useState(0)

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
        examListVersion,
        notifyExamListChanged: () => setExamListVersion((v) => v + 1),
      }}
    >
      {children}
    </ExamContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExam() {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider')
  }
  return context
}
