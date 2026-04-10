export interface ExamInfo {
  id: number
  name: string
  subject: string
  duration: number
  startTime: string
  endTime: string
}

export interface LoginFormData {
  studentId: string
  name: string
  loginCode: string
  pledgeAgreed: boolean
}

export interface Problem {
  id: number
  examId: number
  title: string
  content: string
  orderNum: number
}

export interface StudentCode {
  problemId: number
  code: string
  savedAt?: string
}

export type ExamStatus = 'ongoing' | 'warning' | 'ending'

export type WebSocketStatus = 'connected' | 'disconnected' | 'connecting'

export interface WebSocketMessage {
  type: string
  data?: unknown
}

export interface ExamStatusMessage {
  status: string
  remainingTime: number
}

export interface WarningMessage {
  message: string
  level: 'normal' | 'warning' | 'critical'
}

export interface ForceSubmitMessage {
  reason: string
}
