import type { Problem, CreateProblemRequest, UpdateProblemRequest } from '../types/admin'

const mockProblems: Map<number, Problem[]> = new Map([
  [
    1,
    [
      {
        id: 1,
        exam_id: 1,
        title: 'Hello World',
        content:
          '# Hello World\n\n编写一个程序，输出 "Hello, World!"\n\n## 输入\n\n无\n\n## 输出\n\n输出一行，内容为 `Hello, World!`',
        order_num: 1,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        exam_id: 1,
        title: '两数之和',
        content:
          '# 两数之和\n\n给定两个整数 a 和 b，输出它们的和。\n\n## 输入\n\n两个整数 a 和 b，用空格分隔。\n\n## 输出\n\n一个整数，表示 a + b 的结果。\n\n## 样例\n\n输入：`3 5`\n输出：`8`',
        order_num: 2,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        exam_id: 1,
        title: '判断奇偶数',
        content:
          '# 判断奇偶数\n\n给定一个整数，判断它是奇数还是偶数。\n\n## 输入\n\n一个整数 n。\n\n## 输出\n\n如果 n 是偶数，输出 `even`；如果是奇数，输出 `odd`。',
        order_num: 3,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  ],
  [
    2,
    [
      {
        id: 4,
        exam_id: 2,
        title: '变量交换',
        content:
          '# 变量交换\n\n交换两个变量的值。\n\n## 输入\n\n两个整数 a 和 b。\n\n## 输出\n\n交换后的两个整数，用空格分隔。',
        order_num: 1,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  ],
])

export async function fetchProblemList(examId: number): Promise<Problem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const problems = mockProblems.get(examId) || []
  return [...problems].sort((a, b) => a.order_num - b.order_num)
}

export async function createProblem(
  examId: number,
  data: CreateProblemRequest
): Promise<{ success: boolean; problem?: Problem; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newProblem: Problem = {
    id: Date.now(),
    exam_id: examId,
    title: data.title,
    content: data.content,
    order_num: data.order_num,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const problems = mockProblems.get(examId) || []
  problems.push(newProblem)
  mockProblems.set(examId, problems)

  return {
    success: true,
    problem: newProblem,
  }
}

export async function updateProblem(
  id: number,
  data: UpdateProblemRequest
): Promise<{ success: boolean; problem?: Problem; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  for (const [examId, problems] of mockProblems.entries()) {
    const index = problems.findIndex((p) => p.id === id)
    if (index !== -1) {
      const updatedProblem: Problem = {
        ...problems[index],
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.order_num !== undefined && { order_num: data.order_num }),
        updated_at: new Date().toISOString(),
      }

      problems[index] = updatedProblem
      mockProblems.set(examId, problems)

      return {
        success: true,
        problem: updatedProblem,
      }
    }
  }

  return {
    success: false,
    message: '题目不存在',
  }
}

export async function deleteProblem(id: number): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  for (const [examId, problems] of mockProblems.entries()) {
    const index = problems.findIndex((p) => p.id === id)
    if (index !== -1) {
      problems.splice(index, 1)
      mockProblems.set(examId, problems)

      return {
        success: true,
      }
    }
  }

  return {
    success: false,
    message: '题目不存在',
  }
}
