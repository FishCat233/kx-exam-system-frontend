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

// 清除认证信息并跳转登录页
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
      handleUnauthorized(authMode)
      throw new ApiError(401, '登录已过期，请重新登录')
    }

    // 解析响应体
    let data: ApiResponse<T>
    try {
      data = await response.json()
    } catch {
      // 非 JSON 响应（如文件下载）
      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}`)
      }
      return response as unknown as T
    }

    // 处理业务错误（后端返回的 code 不为 200）
    if (data.code !== 200) {
      // 如果是 401，处理未授权
      if (data.code === 401) {
        handleUnauthorized(authMode)
      }
      throw new ApiError(data.code, data.message, data.data)
    }

    return data.data
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
