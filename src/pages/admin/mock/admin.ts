import type {
  AdminVerifyResult,
  DashboardData,
  Student,
  StudentDetail,
  OperationLog,
  ExamStatus,
  Admin,
  AdminLoginResponse,
  CreateAdminRequest,
  UpdateAdminRequest,
  ChangePasswordRequest,
  ForceChangePasswordRequest,
} from '../types/admin'

const MOCK_ADMIN_TOKEN = 'mock_admin_token_123456'
const MOCK_SUPER_ADMIN_TOKEN = 'mock_super_admin_token_123456'

interface StudentCreatePayload {
  student_id: string
  name: string
}

let mockStudents: Student[] = [
  {
    id: 1,
    studentId: '2021001',
    name: '张三',
    loginCode: 'ABC123',
    loginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    submitTime: null,
    submitStatus: 'in_progress',
  },
  {
    id: 2,
    studentId: '2021002',
    name: '李四',
    loginCode: 'DEF456',
    loginTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    submitTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    submitStatus: 'submitted',
  },
  {
    id: 3,
    studentId: '2021003',
    name: '王五',
    loginCode: 'GHI789',
    loginTime: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    submitTime: null,
    submitStatus: 'in_progress',
  },
  {
    id: 4,
    studentId: '2021004',
    name: '赵六',
    loginCode: 'JKL012',
    loginTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    submitTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    submitStatus: 'force_submitted',
  },
  {
    id: 5,
    studentId: '2021005',
    name: '钱七',
    loginCode: 'MNO345',
    loginTime: null,
    submitTime: null,
    submitStatus: 'not_started',
  },
]

function generateMockLoginCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function cloneStudent(student: Student): Student {
  return { ...student }
}

export async function verifyAdminToken(token: string): Promise<AdminVerifyResult> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const isValid = token === MOCK_ADMIN_TOKEN || token === MOCK_SUPER_ADMIN_TOKEN
  const isSuperAdmin = token === MOCK_SUPER_ADMIN_TOKEN

  return {
    valid: isValid,
    admin_info: isValid
      ? {
          id: 1,
          username: isSuperAdmin ? 'admin' : 'teacher1',
          name: isSuperAdmin ? '超级管理员' : '张老师',
          is_active: true,
          role: isSuperAdmin ? 'super_admin' : 'admin',
        }
      : undefined,
  }
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ success: boolean; data?: AdminLoginResponse; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (username === 'admin' && password === 'admin123') {
    return {
      success: true,
      data: {
        token: MOCK_SUPER_ADMIN_TOKEN,
        admin: {
          id: 1,
          username: 'admin',
          name: '超级管理员',
          is_active: true,
          role: 'super_admin',
        },
      },
    }
  }

  if (username === 'teacher1' && password === 'teacher123') {
    return {
      success: true,
      data: {
        token: MOCK_ADMIN_TOKEN,
        admin: {
          id: 2,
          username: 'teacher1',
          name: '张老师',
          is_active: true,
          role: 'admin',
        },
      },
    }
  }

  return {
    success: false,
    message: '账号或密码错误',
  }
}

export async function fetchAdminList(isActive?: boolean): Promise<Admin[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const admins: Admin[] = [
    {
      id: 1,
      username: 'admin',
      name: '超级管理员',
      is_active: true,
      role: 'super_admin',
      remark: '系统默认超级管理员',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      username: 'teacher1',
      name: '张老师',
      is_active: true,
      role: 'admin',
      remark: 'C语言课程教师',
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      username: 'teacher2',
      name: '李老师',
      is_active: false,
      role: 'admin',
      remark: '已停用账号',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  if (isActive !== undefined) {
    return admins.filter((admin) => admin.is_active === isActive)
  }

  return admins
}

export async function createAdmin(
  data: CreateAdminRequest
): Promise<{ success: boolean; admin?: Admin; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (data.username === 'admin') {
    return {
      success: false,
      message: '管理员账号已存在',
    }
  }

  const newAdmin: Admin = {
    id: Date.now(),
    username: data.username,
    name: data.name || null,
    is_active: true,
    role: 'admin',
    remark: data.remark || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return {
    success: true,
    admin: newAdmin,
  }
}

export async function updateAdmin(
  _id: number,
  data: UpdateAdminRequest
): Promise<{ success: boolean; admin?: Admin; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const updatedAdmin: Admin = {
    id: 1,
    username: 'teacher1',
    name: data.name || '张老师',
    is_active: data.is_active !== undefined ? data.is_active : true,
    role: 'admin',
    remark: data.remark || 'C语言课程教师',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }

  return {
    success: true,
    admin: updatedAdmin,
  }
}

export async function deleteAdmin(_id: number): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
  }
}

export async function deactivateAdmin(
  _id: number
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
  }
}

export async function activateAdmin(_id: number): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
  }
}

export async function forceChangePassword(
  _id: number,
  _data: ForceChangePasswordRequest
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
  }
}

export async function changePassword(
  _data: ChangePasswordRequest
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const now = new Date()
  const endTime = new Date(now.getTime() + 45 * 60 * 1000)

  return {
    examStatus: 'ongoing' as ExamStatus,
    countdown: 45 * 60,
    submitCount: 23,
    totalStudents: 50,
    startTime: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
    endTime: endTime.toISOString(),
    recentLogs: [
      {
        id: 1,
        studentName: '张三',
        timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
        description: '切换浏览器标签页',
        level: 'warning',
      },
      {
        id: 2,
        studentName: '李四',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        description: '退出全屏模式',
        level: 'critical',
      },
      {
        id: 3,
        studentName: '王五',
        timestamp: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
        description: 'WebSocket 连接断开',
        level: 'critical',
      },
      {
        id: 4,
        studentName: '赵六',
        timestamp: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
        description: '切换浏览器标签页',
        level: 'warning',
      },
      {
        id: 5,
        studentName: '钱七',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        description: '切换浏览器标签页',
        level: 'warning',
      },
    ],
  }
}

export async function fetchStudentList(): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockStudents.map(cloneStudent)
}

export async function fetchStudentDetail(id: number): Promise<StudentDetail> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const now = new Date()
  const targetStudent = mockStudents.find((student) => student.id === id) ?? mockStudents[0]

  const logs: OperationLog[] = [
    {
      id: 1,
      operationType: 'login',
      description: '考生登录系统',
      level: 'normal',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      operationType: 'fullscreen_enter',
      description: '进入全屏模式',
      level: 'normal',
      timestamp: new Date(now.getTime() - 29 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      operationType: 'code_save',
      description: '保存题目 1 代码',
      level: 'normal',
      timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      operationType: 'visibility_change',
      description: '切换浏览器标签页',
      level: 'warning',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      operationType: 'code_save',
      description: '保存题目 2 代码',
      level: 'normal',
      timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
    },
  ]

  return {
    ...cloneStudent(targetStudent),
    logs,
  }
}

export async function forceSubmitStudent(
  id: number
): Promise<{ success: boolean; submitTime?: string; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  mockStudents = mockStudents.map((student) =>
    student.id === id
      ? {
          ...student,
          submitStatus: 'force_submitted',
          submitTime: new Date().toISOString(),
        }
      : student
  )

  return {
    success: true,
    submitTime: new Date().toISOString(),
  }
}

export async function createStudent(
  data: StudentCreatePayload
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (mockStudents.some((student) => student.studentId === data.student_id)) {
    return {
      success: false,
      message: '该学号已存在',
    }
  }

  mockStudents = [
    {
      id: Date.now(),
      studentId: data.student_id,
      name: data.name,
      loginCode: generateMockLoginCode(),
      loginTime: null,
      submitTime: null,
      submitStatus: 'not_started',
    },
    ...mockStudents,
  ]

  return {
    success: true,
  }
}

export async function importStudents(
  students: StudentCreatePayload[]
): Promise<{ success: boolean; importedCount?: number; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const duplicatedExisting = students.find((student) =>
    mockStudents.some((current) => current.studentId === student.student_id)
  )
  if (duplicatedExisting) {
    return {
      success: false,
      message: `学号已存在：${duplicatedExisting.student_id}`,
    }
  }

  const duplicateInsidePayload = students.find(
    (student, index) =>
      students.findIndex((current) => current.student_id === student.student_id) !== index
  )
  if (duplicateInsidePayload) {
    return {
      success: false,
      message: `导入内容中存在重复学号：${duplicateInsidePayload.student_id}`,
    }
  }

  const newStudents = students.map((student, index) => ({
    id: Date.now() + index,
    studentId: student.student_id,
    name: student.name,
    loginCode: generateMockLoginCode(),
    loginTime: null,
    submitTime: null,
    submitStatus: 'not_started' as const,
  }))

  mockStudents = [...newStudents, ...mockStudents]

  return {
    success: true,
    importedCount: students.length,
  }
}

export async function exportExamData(): Promise<Blob> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const content = '模拟导出数据'
  return new Blob([content], { type: 'application/zip' })
}
