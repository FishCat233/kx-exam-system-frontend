import { API_ENDPOINTS } from './config'
import { http } from './request'

export async function fetchStudentCode(
  problemId: number
): Promise<{ code: string; savedAt: string | null }> {
  const result = await http.get<{ code: string; saved_at: string | null }>(
    API_ENDPOINTS.CODE.DETAIL(problemId),
    { authMode: 'student' }
  )

  return {
    code: result.code,
    savedAt: result.saved_at,
  }
}

export async function saveStudentCode(
  problemId: number,
  code: string
): Promise<{ savedAt: string }> {
  const result = await http.post<{ saved_at: string }>(
    API_ENDPOINTS.CODE.SAVE(problemId),
    { code },
    { authMode: 'student' }
  )

  return {
    savedAt: result.saved_at,
  }
}

export async function submitStudentExam(problemId: number): Promise<{
  submitTime: string
  status: string
}> {
  const result = await http.post<{ submit_time: string; status: string }>(
    API_ENDPOINTS.CODE.SUBMIT(problemId),
    undefined,
    { authMode: 'student' }
  )

  return {
    submitTime: result.submit_time,
    status: result.status,
  }
}
