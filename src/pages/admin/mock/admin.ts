import type {
  AdminVerifyResult,
  DashboardData,
  Student,
  StudentDetail,
  OperationLog,
  ExamStatus,
} from '../types/admin'

const MOCK_ADMIN_TOKEN = '123456'

export async function verifyAdminToken(token: string): Promise<AdminVerifyResult> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    valid: token === MOCK_ADMIN_TOKEN,
    adminInfo:
      token === MOCK_ADMIN_TOKEN
        ? {
            id: 1,
            name: '管理员',
            role: 'admin',
          }
        : undefined,
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

  const students: Student[] = [
    {
      id: 1,
      studentId: '2021001',
      name: '张三',
      loginCode: 'ABC123',
      loginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      submitTime: null,
      submitStatus: 'ongoing',
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
      submitStatus: 'ongoing',
    },
    {
      id: 4,
      studentId: '2021004',
      name: '赵六',
      loginCode: 'JKL012',
      loginTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      submitTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      submitStatus: 'forced_submit',
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

  return students
}

export async function fetchStudentDetail(id: number): Promise<StudentDetail> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const now = new Date()

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
    id,
    studentId: '2021001',
    name: '张三',
    loginCode: 'ABC123',
    loginTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    submitTime: null,
    submitStatus: 'ongoing',
    logs,
  }
}

export async function forceSubmitStudent(
  _id: number
): Promise<{ success: boolean; submitTime: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    submitTime: new Date().toISOString(),
  }
}

export async function exportExamData(): Promise<Blob> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const content = '模拟导出数据'
  return new Blob([content], { type: 'application/zip' })
}
