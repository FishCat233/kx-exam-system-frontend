import { API_ENDPOINTS } from './config'
import { http } from './request'

export interface Exam {
  id: number
  name: string
  subject: string
  duration: number
  start_time: string
  end_time: string
  status: 'not_started' | 'ongoing' | 'ended'
}

// 获取考试列表
export async function fetchExamList(): Promise<Exam[]> {
  const result = await http.get<
    {
      id: number
      name: string
      subject: string
      duration: number
      start_time: string
      end_time: string
      status: string
    }[]
  >(API_ENDPOINTS.EXAM.LIST)

  return result.map((item) => ({
    id: item.id,
    name: item.name,
    subject: item.subject,
    duration: item.duration,
    start_time: item.start_time,
    end_time: item.end_time,
    status: item.status as 'not_started' | 'ongoing' | 'ended',
  }))
}

// 获取考试详情
export async function fetchExamDetail(examId: number): Promise<Exam> {
  const result = await http.get<{
    id: number
    name: string
    subject: string
    duration: number
    start_time: string
    end_time: string
    status: string
  }>(API_ENDPOINTS.EXAM.DETAIL(examId))

  return {
    id: result.id,
    name: result.name,
    subject: result.subject,
    duration: result.duration,
    start_time: result.start_time,
    end_time: result.end_time,
    status: result.status as 'not_started' | 'ongoing' | 'ended',
  }
}
