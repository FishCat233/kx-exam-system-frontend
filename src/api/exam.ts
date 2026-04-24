import type { Exam, CreateExamRequest, UpdateExamRequest } from '@/pages/admin/types/admin'

import { API_ENDPOINTS } from './config'
import { http } from './request'

export interface ExamApiResponse {
  id: number
  name: string
  subject: string
  duration: number
  start_time: string
  end_time: string
  actual_start_time?: string
  actual_end_time?: string
  status: string
  pledge_content: string
  created_at: string
  updated_at: string
}

function mapExamResponse(data: ExamApiResponse): Exam {
  return {
    id: data.id,
    name: data.name,
    subject: data.subject,
    duration: data.duration,
    start_time: data.start_time,
    end_time: data.end_time,
    actual_start_time: data.actual_start_time,
    actual_end_time: data.actual_end_time,
    status: data.status as Exam['status'],
    pledge_content: data.pledge_content,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// 获取考试列表
export async function fetchExamList(): Promise<Exam[]> {
  const result = await http.get<ExamApiResponse[]>(API_ENDPOINTS.EXAM.LIST)
  return result.map(mapExamResponse)
}

// 获取考试详情
export async function fetchExamDetail(examId: number): Promise<Exam> {
  const result = await http.get<ExamApiResponse>(API_ENDPOINTS.EXAM.DETAIL(examId))
  return mapExamResponse(result)
}

// 创建考试
export async function createExam(data: CreateExamRequest): Promise<Exam> {
  const result = await http.post<ExamApiResponse>(API_ENDPOINTS.EXAM.CREATE, data)
  return mapExamResponse(result)
}

// 更新考试
export async function updateExam(examId: number, data: UpdateExamRequest): Promise<Exam> {
  const result = await http.put<ExamApiResponse>(API_ENDPOINTS.EXAM.UPDATE(examId), data)
  return mapExamResponse(result)
}

// 删除考试
export async function deleteExam(examId: number): Promise<void> {
  await http.delete(API_ENDPOINTS.EXAM.DELETE(examId))
}
