export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  TIMEOUT: 30000,
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
}

export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    ADMIN_LOGIN: '/api/auth/admin/login',
    ADMIN_VERIFY: '/api/auth/admin/verify',
    STUDENT_LOGIN: '/api/auth/student/login',
    STUDENT_FULLSCREEN: '/api/auth/student/fullscreen',
  },
  CODE: {
    DETAIL: (problemId: number) => `/api/code/${problemId}`,
    SAVE: (problemId: number) => `/api/code/${problemId}`,
    SUBMIT: (problemId: number) => `/api/code/${problemId}/submit`,
  },
  // 管理员相关
  ADMIN: {
    LIST: '/api/admin/admins',
    DETAIL: (id: number) => `/api/admin/admins/${id}`,
    CREATE: '/api/admin/admins',
    UPDATE: (id: number) => `/api/admin/admins/${id}`,
    DELETE: (id: number) => `/api/admin/admins/${id}`,
    DEACTIVATE: (id: number) => `/api/admin/admins/${id}/deactivate`,
    ACTIVATE: (id: number) => `/api/admin/admins/${id}/activate`,
    FORCE_CHANGE_PASSWORD: (id: number) => `/api/admin/admins/${id}/force-change-password`,
    CHANGE_PASSWORD: '/api/admin/change-password',
  },
  // 考生相关
  STUDENT: {
    LIST: (examId: number) => `/api/admin/exams/${examId}/students`,
    DETAIL: (id: number) => `/api/admin/students/${id}`,
    IMPORT: (examId: number) => `/api/admin/exams/${examId}/students`,
    FORCE_SUBMIT: (id: number) => `/api/admin/students/${id}/force-submit`,
    DELETE: (id: number) => `/api/admin/students/${id}`,
  },
  // 仪表盘
  DASHBOARD: (examId: number) => `/api/admin/dashboard/${examId}`,
  // 导出
  EXPORT: (examId: number) => `/api/admin/exams/${examId}/export`,
  // 考试
  EXAM: {
    LIST: '/api/exams',
    DETAIL: (id: number) => `/api/exams/${id}`,
    CREATE: '/api/exams',
    UPDATE: (id: number) => `/api/exams/${id}`,
    DELETE: (id: number) => `/api/exams/${id}`,
  },
  // 题目
  PROBLEM: {
    LIST: (examId: number) => `/api/exams/${examId}/problems`,
    CREATE: (examId: number) => `/api/exams/${examId}/problems`,
    UPDATE: (id: number) => `/api/problems/${id}`,
    DELETE: (id: number) => `/api/problems/${id}`,
  },
} as const
