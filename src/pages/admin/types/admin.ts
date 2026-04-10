export type ExamStatus = 'not_started' | 'ongoing' | 'ended'

export type SubmitStatus = 'not_started' | 'ongoing' | 'submitted' | 'forced_submit'

export type LogLevel = 'normal' | 'warning' | 'critical'

export interface AdminInfo {
  id: number
  name: string
  role: string
}

export interface AdminVerifyResult {
  valid: boolean
  adminInfo?: AdminInfo
}

export interface RecentLog {
  id: number
  studentName: string
  timestamp: string
  description: string
  level: LogLevel
}

export interface DashboardData {
  examStatus: ExamStatus
  countdown: number
  submitCount: number
  totalStudents: number
  startTime: string
  endTime: string
  recentLogs: RecentLog[]
}

export interface Student {
  id: number
  studentId: string
  name: string
  loginCode: string
  loginTime: string | null
  submitTime: string | null
  submitStatus: SubmitStatus
}

export interface OperationLog {
  id: number
  operationType: string
  description: string
  level: LogLevel
  timestamp: string
}

export interface StudentDetail extends Student {
  logs: OperationLog[]
}
