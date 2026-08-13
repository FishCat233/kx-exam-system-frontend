import type { ExamInfo, Problem, ProblemOption } from '@/types'

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
}

interface StudentExamProblemsResponse {
  exam_info: {
    id: number
    name: string
    subject: string
    duration: number
    start_time: string
    end_time: string
    status: string
  }
  problems: Array<{
    id: number
    exam_id: number
    title: string
    content: string
    type: 'coding' | 'single_choice' | 'multiple_choice'
    options: ProblemOption[] | null
    order_num: number
    created_at: string
    updated_at: string
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
  }
}

function mapProblem(problem: StudentExamProblemsResponse['problems'][number]): Problem {
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

export async function fetchStudentExamProblems(): Promise<{
  examInfo: ExamInfo
  problems: Problem[]
}> {
  const result = await http.get<StudentExamProblemsResponse>(
    API_ENDPOINTS.STUDENT_SIDE.EXAM_PROBLEMS,
    { authMode: 'student' }
  )

  return {
    examInfo: mapExamInfo(result.exam_info),
    problems: result.problems.map(mapProblem).sort((a, b) => a.orderNum - b.orderNum),
  }
}
