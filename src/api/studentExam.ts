import type { ExamInfo, Problem } from '@/types'

import { API_ENDPOINTS } from './config'
import { http } from './request'

interface PublicExamResponse {
  id: number
  name: string
  subject: string
  duration: number
  start_time: string
  end_time: string
  status: string
  pledge_content?: string | null
}

interface ProblemOptionResponse {
  id: string
  content: string
  is_correct: boolean
}

interface PublicExamDetailResponse extends PublicExamResponse {
  problems: Array<{
    id: number
    exam_id: number
    title: string
    content: string
    type: 'coding' | 'single_choice' | 'multiple_choice'
    options: ProblemOptionResponse[] | null
    order_num: number
  }>
}

function mapExamInfo(exam: PublicExamResponse): ExamInfo {
  return {
    id: exam.id,
    name: exam.name,
    subject: exam.subject,
    duration: exam.duration,
    startTime: exam.start_time,
    endTime: exam.end_time,
    status: exam.status,
    pledgeContent: exam.pledge_content ?? '',
  }
}

function mapProblem(problem: PublicExamDetailResponse['problems'][number]): Problem {
  return {
    id: problem.id,
    examId: problem.exam_id,
    title: problem.title,
    content: problem.content,
    type: problem.type,
    options: problem.options,
    orderNum: problem.order_num,
  }
}

export async function fetchPublicExamList(): Promise<ExamInfo[]> {
  const result = await http.get<PublicExamResponse[]>(API_ENDPOINTS.EXAM.LIST, { authMode: 'none' })
  return result.map(mapExamInfo)
}

export async function fetchPublicExamDetail(
  examId: number
): Promise<{ examInfo: ExamInfo; problems: Problem[] }> {
  const result = await http.get<PublicExamDetailResponse>(API_ENDPOINTS.EXAM.DETAIL(examId), {
    authMode: 'none',
  })

  return {
    examInfo: mapExamInfo(result),
    problems: result.problems.map(mapProblem).sort((a, b) => a.orderNum - b.orderNum),
  }
}
