export type ExamStatus = 'not_started' | 'ongoing' | 'ended'

export type SubmitStatus = 'not_started' | 'ongoing' | 'submitted' | 'forced_submit'

export type LogLevel = 'normal' | 'warning' | 'critical'

export interface AdminInfo {
  id: number
  username: string
  name: string | null
  is_active: boolean
}

export interface Admin {
  id: number
  username: string
  name: string | null
  is_active: boolean
  remark: string | null
  created_at: string
  updated_at: string
}

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface AdminLoginResponse {
  token: string
  admin: AdminInfo
}

export interface CreateAdminRequest {
  username: string
  password: string
  name?: string
  remark?: string
}

export interface UpdateAdminRequest {
  name?: string
  remark?: string
  is_active?: boolean
}

export interface ChangePasswordRequest {
  new_password: string
}

export interface ForceChangePasswordRequest {
  new_password: string
}

export interface AdminVerifyResult {
  valid: boolean
  admin_info?: AdminInfo
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
