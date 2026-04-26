import type {
  Problem,
  CreateProblemRequest,
  UpdateProblemRequest,
  ProblemOption,
} from '@/pages/admin/types/admin'

import { API_ENDPOINTS } from './config'
import { http } from './request'

export interface ProblemApiResponse {
  id: number
  exam_id: number
  title: string
  content: string
  type: 'coding' | 'single_choice' | 'multiple_choice'
  options: ProblemOption[] | null
  order_num: number
  created_at: string
  updated_at: string
}

function mapProblemResponse(data: ProblemApiResponse): Problem {
  return {
    id: data.id,
    exam_id: data.exam_id,
    title: data.title,
    content: data.content,
    type: data.type,
    options: data.options,
    order_num: data.order_num,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// 获取题目列表
export async function fetchProblemList(examId: number): Promise<Problem[]> {
  const result = await http.get<ProblemApiResponse[]>(API_ENDPOINTS.PROBLEM.LIST(examId))
  return result.map(mapProblemResponse).sort((a, b) => a.order_num - b.order_num)
}

// 创建题目
export async function createProblem(examId: number, data: CreateProblemRequest): Promise<Problem> {
  const result = await http.post<ProblemApiResponse>(API_ENDPOINTS.PROBLEM.CREATE(examId), data)
  return mapProblemResponse(result)
}

// 更新题目
export async function updateProblem(
  problemId: number,
  data: UpdateProblemRequest
): Promise<Problem> {
  const result = await http.put<ProblemApiResponse>(API_ENDPOINTS.PROBLEM.UPDATE(problemId), data)
  return mapProblemResponse(result)
}

// 删除题目
export async function deleteProblem(problemId: number): Promise<void> {
  await http.delete(API_ENDPOINTS.PROBLEM.DELETE(problemId))
}
