export interface ExamInfo {
  id: number
  name: string
  subject: string
  duration: number
  startTime: string
  endTime: string
  status?: string
  pledgeContent?: string
}

export interface LoginFormData {
  studentId: string
  name: string
  loginCode: string
  pledgeAgreed: boolean
}

export type ProblemType = 'coding' | 'single_choice' | 'multiple_choice'

export interface ProblemOption {
  id: string
  content: string
  is_correct: boolean
}

export interface Problem {
  id: number
  examId: number
  title: string
  content: string
  type: ProblemType
  options: ProblemOption[] | null
  orderNum: number
}

export interface ProblemSummary {
  id: number
  title: string
  type: ProblemType
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

export interface NewProblemMessage {
  message: string
  problemTitle: string
}

export interface StudentLoginPayload {
  studentToken: string
  examInfo: ExamInfo
  problems: ProblemSummary[]
}

export interface FullscreenPayload {
  websocketToken: string
  wsUrl: string
}

export interface StudentExamSession {
  studentToken: string
  websocketToken: string
  wsUrl: string
  examInfo: ExamInfo
  problems: Problem[]
}
