import type { Student, StudentDetail } from '@/pages/admin/types/admin'

import { API_ENDPOINTS } from './config'
import { http } from './request'

// 学生创建请求类型
export interface StudentCreateRequest {
  student_id: string
  name: string
}

function mapSubmitStatus(status: string): Student['submitStatus'] {
  switch (status) {
    case 'not_started':
    case 'in_progress':
    case 'submitted':
    case 'force_submitted':
      return status
    case 'ongoing':
      return 'in_progress'
    case 'forced_submit':
      return 'force_submitted'
    default:
      return 'not_started'
  }
}

// 获取考生列表
export async function fetchStudentList(examId: number): Promise<Student[]> {
  const result = await http.get<
    {
      id: number
      student_id: string
      name: string
      login_code: string
      login_time: string | null
      submit_time: string | null
      submit_status: string
    }[]
  >(API_ENDPOINTS.STUDENT.LIST(examId))

  // 转换后端数据格式到前端格式
  return result.map((item) => ({
    id: item.id,
    studentId: item.student_id,
    name: item.name,
    loginCode: item.login_code,
    loginTime: item.login_time,
    submitTime: item.submit_time,
    submitStatus: mapSubmitStatus(item.submit_status),
  }))
}

// 获取考生详情
export async function fetchStudentDetail(id: number): Promise<StudentDetail> {
  const result = await http.get<{
    id: number
    exam_id: number
    student_id: string
    name: string
    login_code: string
    login_code_used: boolean
    login_time: string | null
    submit_time: string | null
    submit_status: string
    is_fullscreen: boolean
    created_at: string
    updated_at: string
    logs: {
      id: number
      operation_type: string
      description: string
      level: string
      created_at: string
    }[]
    codes: {
      id: number
      problem_id: number
      saved_at: string
    }[]
  }>(API_ENDPOINTS.STUDENT.DETAIL(id))

  const logs = result.logs ?? []

  // 转换后端数据格式到前端格式
  return {
    id: result.id,
    studentId: result.student_id,
    name: result.name,
    loginCode: result.login_code,
    loginTime: result.login_time,
    submitTime: result.submit_time,
    submitStatus: mapSubmitStatus(result.submit_status),
    logs: logs.map((log) => ({
      id: log.id,
      operationType: log.operation_type,
      description: log.description,
      level: log.level as 'normal' | 'warning' | 'critical',
      timestamp: log.created_at,
    })),
  }
}

// 强制收卷
export async function forceSubmitStudent(
  id: number
): Promise<{ success: boolean; submitTime?: string; message?: string }> {
  try {
    const result = await http.post<{
      student_id: number
      submit_time: string
      status: string
    }>(API_ENDPOINTS.STUDENT.FORCE_SUBMIT(id))
    return { success: true, submitTime: result.submit_time }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '强制收卷失败',
    }
  }
}

// 删除考生
export async function deleteStudent(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    await http.delete(API_ENDPOINTS.STUDENT.DELETE(id))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除失败',
    }
  }
}

// 批量导入考生
export async function importStudents(
  examId: number,
  students: StudentCreateRequest[]
): Promise<{ success: boolean; importedCount?: number; message?: string }> {
  try {
    const result = await http.post<{ imported_count: number }>(
      API_ENDPOINTS.STUDENT.IMPORT(examId),
      students
    )
    return { success: true, importedCount: result.imported_count }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '导入失败',
    }
  }
}

// 手动添加单个考生
export async function createStudent(
  examId: number,
  student: StudentCreateRequest
): Promise<{ success: boolean; message?: string }> {
  const result = await importStudents(examId, [student])
  return {
    success: result.success,
    message: result.message,
  }
}
