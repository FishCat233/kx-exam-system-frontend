import type {
  ExamInfo,
  FullscreenPayload,
  LoginFormData,
  Problem,
  ProblemSummary,
  StudentLoginPayload,
} from '@/types'

import { API_ENDPOINTS } from './config'
import { http } from './request'

interface StudentLoginApiResponse {
  student_token: string
  exam_info: {
    id: number
    name: string
    subject: string
    duration: number
    start_time: string
    end_time: string
    status: string
    pledge_content?: string | null
  }
  problems: Array<{
    id: number
    title: string
    order_num: number
  }>
}

interface FullscreenApiResponse {
  websocket_token: string
  ws_url: string
}

function mapExamInfo(exam: StudentLoginApiResponse['exam_info']): ExamInfo {
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

function mapProblemSummaries(problems: StudentLoginApiResponse['problems']): ProblemSummary[] {
  return problems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    orderNum: problem.order_num,
  }))
}

export async function loginStudent(
  examId: number,
  formData: LoginFormData
): Promise<StudentLoginPayload> {
  const result = await http.post<StudentLoginApiResponse>(
    API_ENDPOINTS.AUTH.STUDENT_LOGIN,
    {
      student_id: formData.studentId,
      name: formData.name,
      login_code: formData.loginCode,
      exam_id: examId,
    },
    { authMode: 'none' }
  )

  return {
    studentToken: result.student_token,
    examInfo: mapExamInfo(result.exam_info),
    problems: mapProblemSummaries(result.problems),
  }
}

export async function reportStudentFullscreen(
  studentToken: string,
  success: boolean,
  reason?: string
): Promise<FullscreenPayload> {
  const result = await http.post<FullscreenApiResponse>(
    API_ENDPOINTS.AUTH.STUDENT_FULLSCREEN,
    { success, reason },
    {
      authMode: 'none',
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    }
  )

  return {
    websocketToken: result.websocket_token,
    wsUrl: result.ws_url,
  }
}

export async function buildStudentExamSession(
  loginPayload: StudentLoginPayload,
  fullscreenPayload: FullscreenPayload
): Promise<{
  examInfo: ExamInfo
  problems: Problem[]
  studentToken: string
  websocketToken: string
  wsUrl: string
}> {
  return {
    studentToken: loginPayload.studentToken,
    websocketToken: fullscreenPayload.websocketToken,
    wsUrl: fullscreenPayload.wsUrl,
    examInfo: loginPayload.examInfo,
    problems: loginPayload.problems.map(
      (problem): Problem => ({
        id: problem.id,
        examId: loginPayload.examInfo.id,
        title: problem.title,
        content: '题目内容加载中，请稍候...',
        type: problem.type,
        options: null,
        orderNum: problem.orderNum,
      })
    ),
  }
}
