import type { DashboardData, ExamStatus, LogLevel } from '@/pages/admin/types/admin'

import { API_ENDPOINTS } from './config'
import { http } from './request'

// 获取仪表盘数据
export async function fetchDashboardData(examId: number): Promise<DashboardData> {
  const result = await http.get<{
    exam_status: string
    countdown: number
    submit_count: number
    total_count: number
    start_time: string
    end_time: string
    actual_start_time: string | null
    actual_end_time: string | null
    recent_logs: {
      id: number
      student_name: string
      student_id: string
      operation_type: string
      description: string
      level: string
      created_at: string
    }[]
  }>(API_ENDPOINTS.DASHBOARD(examId))

  // 转换后端数据格式到前端格式
  return {
    examStatus: result.exam_status as ExamStatus,
    countdown: result.countdown,
    submitCount: result.submit_count,
    totalStudents: result.total_count,
    startTime: result.start_time,
    endTime: result.end_time,
    recentLogs: result.recent_logs.map((log) => ({
      id: log.id,
      studentName: log.student_name,
      timestamp: log.created_at,
      description: log.description,
      level: log.level as LogLevel,
    })),
  }
}
