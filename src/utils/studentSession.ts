import type { StudentExamSession } from '@/types'

const STUDENT_SESSION_KEY = 'student_exam_session'

export function saveStudentSession(session: StudentExamSession): void {
  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session))
}

export function getStudentSession(): StudentExamSession | null {
  const rawSession = localStorage.getItem(STUDENT_SESSION_KEY)
  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as StudentExamSession
  } catch {
    clearStudentSession()
    return null
  }
}

export function getStudentToken(): string | null {
  return getStudentSession()?.studentToken ?? null
}

export function clearStudentSession(): void {
  localStorage.removeItem(STUDENT_SESSION_KEY)
}
