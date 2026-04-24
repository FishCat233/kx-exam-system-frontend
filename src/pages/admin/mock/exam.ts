import type { Exam, CreateExamRequest, UpdateExamRequest } from '../types/admin'

const mockExams: Exam[] = [
  {
    id: 1,
    name: '2024年春季C语言期末考试',
    subject: 'C语言程序设计',
    duration: 120,
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    actual_start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'ongoing',
    pledge_content:
      '# 考前承诺书\n\n我承诺：\n1. 独立完成考试，不抄袭他人代码\n2. 不与他人交流考试内容\n3. 不使用任何外部资料\n4. 遵守考试纪律',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: '2024年秋季C语言期中考试',
    subject: 'C语言程序设计',
    duration: 90,
    start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    status: 'not_started',
    pledge_content: '# 考前承诺书\n\n我承诺：\n1. 独立完成考试\n2. 不抄袭他人代码\n3. 遵守考试纪律',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: '2024年春季C语言补考',
    subject: 'C语言程序设计',
    duration: 120,
    start_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
    actual_start_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    actual_end_time: new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000
    ).toISOString(),
    status: 'ended',
    pledge_content: '# 考前承诺书\n\n我承诺诚信考试。',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function fetchExamList(): Promise<Exam[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...mockExams]
}

export async function createExam(
  data: CreateExamRequest
): Promise<{ success: boolean; exam?: Exam; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newExam: Exam = {
    id: Date.now(),
    name: data.name,
    subject: data.subject,
    duration: data.duration,
    start_time: data.start_time,
    end_time: data.end_time,
    status: 'not_started',
    pledge_content: data.pledge_content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockExams.push(newExam)

  return {
    success: true,
    exam: newExam,
  }
}

export async function updateExam(
  id: number,
  data: UpdateExamRequest
): Promise<{ success: boolean; exam?: Exam; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockExams.findIndex((e) => e.id === id)
  if (index === -1) {
    return {
      success: false,
      message: '考试不存在',
    }
  }

  const updatedExam: Exam = {
    ...mockExams[index],
    ...(data.name && { name: data.name }),
    ...(data.subject && { subject: data.subject }),
    ...(data.duration && { duration: data.duration }),
    ...(data.start_time && { start_time: data.start_time }),
    ...(data.end_time && { end_time: data.end_time }),
    ...(data.pledge_content && { pledge_content: data.pledge_content }),
    ...(data.status && { status: data.status }),
    updated_at: new Date().toISOString(),
  }

  if (data.status === 'ongoing' && !updatedExam.actual_start_time) {
    updatedExam.actual_start_time = new Date().toISOString()
  }

  if (data.status === 'ended' && !updatedExam.actual_end_time) {
    updatedExam.actual_end_time = new Date().toISOString()
  }

  mockExams[index] = updatedExam

  return {
    success: true,
    exam: updatedExam,
  }
}

export async function deleteExam(id: number): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockExams.findIndex((e) => e.id === id)
  if (index === -1) {
    return {
      success: false,
      message: '考试不存在',
    }
  }

  mockExams.splice(index, 1)

  return {
    success: true,
  }
}
