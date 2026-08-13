import { clearStudentSession, getStudentToken } from '@/utils/studentSession'

import { API_CONFIG } from './config'

// 后端响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 请求配置
interface RequestConfig extends RequestInit {
  timeout?: number
  authMode?: 'admin' | 'student' | 'none'
}

// API 错误类
export class ApiError extends Error {
  code: number
  data?: unknown

  constructor(code: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

// 获取存储的 Token
function getToken(authMode: RequestConfig['authMode'] = 'admin'): string | null {
  if (authMode === 'student') {
    return getStudentToken()
  }
  if (authMode === 'none') {
    return null
  }
  return localStorage.getItem('admin_token')
}

// 业务性 401（如登录凭证错误）透出后端原因，token 类错误统一映射为登录过期
const TOKEN_ERROR_HINTS = ['token', 'authorization', 'bearer']

function normalizeUnauthorizedDetail(detail: string): string {
  const lower = detail.toLowerCase()
  if (TOKEN_ERROR_HINTS.some((hint) => lower.includes(hint))) {
    return '登录已过期，请重新登录'
  }
  return detail
}

function handleUnauthorized(authMode: RequestConfig['authMode'] = 'admin'): void {
  if (authMode === 'student') {
    clearStudentSession()
    window.location.href = '/login'
    return
  }
  if (authMode === 'admin') {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    window.location.href = '/admin'
  }
}

// 构建完整 URL
function buildUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) {
    return endpoint
  }
  const baseUrl = API_CONFIG.BASE_URL
  return `${baseUrl}${endpoint}`
}

// 请求超时包装
function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new ApiError(0, '请求超时')), timeout)
    ),
  ])
}

// 从非信封格式的错误响应体（如 FastAPI 原生 {detail} 校验错误）中提取可读信息
function extractErrorMessage(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    return ''
  }
  const record = data as Record<string, unknown>
  if (typeof record.detail === 'string') {
    return record.detail
  }
  if (Array.isArray(record.detail)) {
    return record.detail
      .map((item) =>
        typeof (item as { msg?: unknown })?.msg === 'string' ? (item as { msg: string }).msg : ''
      )
      .filter(Boolean)
      .join('；')
  }
  if (typeof record.message === 'string') {
    return record.message
  }
  return ''
}

// 核心请求函数
export async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { timeout = API_CONFIG.TIMEOUT, headers = {}, authMode = 'admin', ...restConfig } = config

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // 合并自定义 headers
  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      requestHeaders[key] = value
    }
  })

  // 添加认证头
  const token = getToken(authMode)
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const url = buildUrl(endpoint)

  try {
    const response = await fetchWithTimeout(
      url,
      {
        ...restConfig,
        headers: requestHeaders,
      },
      timeout
    )

    // 处理 401 未授权
    if (response.status === 401) {
      // 优先透出后端具体原因（如登录凭证错误），而非一律判为登录过期
      let detail = '登录已过期，请重新登录'
      try {
        const body = (await response.json()) as { detail?: unknown; message?: unknown }
        const reason =
          typeof body?.detail === 'string'
            ? body.detail
            : typeof body?.message === 'string'
              ? body.message
              : ''
        if (reason) {
          detail = normalizeUnauthorizedDetail(reason)
        }
      } catch {
        // 响应体不是 JSON，保留默认文案
      }
      handleUnauthorized(authMode)
      throw new ApiError(401, detail)
    }

    // 解析响应体
    let data: unknown
    try {
      data = await response.json()
    } catch {
      // 非 JSON 响应（如文件下载）
      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}`)
      }
      return response as unknown as T
    }

    // 响应不是 { code, message, data } 信封格式（如 FastAPI 原生校验错误），按 HTTP 状态处理
    if (
      typeof data !== 'object' ||
      data === null ||
      typeof (data as { code?: unknown }).code !== 'number'
    ) {
      if (!response.ok) {
        throw new ApiError(response.status, extractErrorMessage(data) || `HTTP ${response.status}`)
      }
      return data as T
    }

    const envelope = data as ApiResponse<T>

    // 处理业务错误（后端返回的 code 不为 200）
    if (envelope.code !== 200) {
      // 如果是 401，处理未授权
      if (envelope.code === 401) {
        handleUnauthorized(authMode)
      }
      throw new ApiError(envelope.code, envelope.message, envelope.data)
    }

    return envelope.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // 网络错误或其他错误
    throw new ApiError(0, error instanceof Error ? error.message : '网络请求失败')
  }
}

// HTTP 方法封装
export const http = {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'GET' })
  },

  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'DELETE' })
  },

  // 用于文件下载，返回 Blob
  download(endpoint: string, config?: RequestConfig): Promise<Blob> {
    const authMode = config?.authMode ?? 'admin'
    const token = getToken(authMode)
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return fetch(buildUrl(endpoint), {
      ...config,
      method: 'GET',
      headers,
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized(authMode)
        }
        throw new ApiError(response.status, `HTTP ${response.status}`)
      }
      return response.blob()
    })
  },
}
