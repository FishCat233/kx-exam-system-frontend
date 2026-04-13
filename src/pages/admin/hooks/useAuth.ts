import { useState, useEffect, useCallback, useSyncExternalStore, useRef } from 'react'

import { loginAdmin, verifyAdminToken } from '../mock/admin'

const TOKEN_KEY = 'admin_token'
const ADMIN_INFO_KEY = 'admin_info'

export interface AdminInfo {
  id: number
  username: string
  name: string | null
  is_active: boolean
}

export interface UseAuthReturn {
  token: string | null
  adminInfo: AdminInfo | null
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  verifyToken: () => Promise<boolean>
}

// 缓存快照，避免每次返回新对象引用导致无限循环
let cachedAuth: { token: string | null; adminInfo: AdminInfo | null } | null = null
let cachedToken: string | null = null
let cachedAdminInfo: string | null = null

function getStoredAuth(): { token: string | null; adminInfo: AdminInfo | null } {
  const storedToken = localStorage.getItem(TOKEN_KEY)
  const storedAdminInfo = localStorage.getItem(ADMIN_INFO_KEY)

  // 如果 localStorage 数据没有变化，返回缓存的快照
  if (storedToken === cachedToken && storedAdminInfo === cachedAdminInfo && cachedAuth) {
    return cachedAuth
  }

  // 更新缓存
  cachedToken = storedToken
  cachedAdminInfo = storedAdminInfo

  if (storedToken && storedAdminInfo) {
    try {
      cachedAuth = {
        token: storedToken,
        adminInfo: JSON.parse(storedAdminInfo) as AdminInfo,
      }
      return cachedAuth
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(ADMIN_INFO_KEY)
    }
  }
  cachedAuth = { token: null, adminInfo: null }
  return cachedAuth
}

export function useAuth(): UseAuthReturn {
  const isMountedRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)

  const auth = useSyncExternalStore(
    (callback) => {
      const handleStorage = () => {
        // 清除缓存，强制重新读取
        cachedAuth = null
        callback()
      }
      window.addEventListener('storage', handleStorage)
      return () => window.removeEventListener('storage', handleStorage)
    },
    () => getStoredAuth(),
    () => ({ token: null, adminInfo: null })
  )

  const { token, adminInfo } = auth

  useEffect(() => {
    // 使用 requestAnimationFrame 避免在 effect 中同步调用 setState
    const timer = requestAnimationFrame(() => {
      if (!isMountedRef.current) {
        isMountedRef.current = true
        setIsLoading(false)
      }
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  const isAuthenticated = !!token && !!adminInfo
  const isSuperAdmin = adminInfo?.username === 'admin'

  const login = useCallback(
    async (
      username: string,
      password: string
    ): Promise<{ success: boolean; message?: string }> => {
      // 使用 Mock 数据
      const result = await loginAdmin(username, password)

      if (result.success && result.data) {
        const { token: newToken, admin } = result.data
        localStorage.setItem(TOKEN_KEY, newToken)
        localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(admin))
        window.dispatchEvent(new Event('storage'))
        return { success: true }
      }

      return { success: false, message: result.message || '登录失败' }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_INFO_KEY)
    window.dispatchEvent(new Event('storage'))
  }, [])

  const verifyToken = useCallback(async (): Promise<boolean> => {
    if (!token) return false

    // 使用 Mock 数据
    const result = await verifyAdminToken(token)

    if (result.valid) {
      if (result.admin_info) {
        localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(result.admin_info))
        window.dispatchEvent(new Event('storage'))
      }
      return true
    }

    logout()
    return false
  }, [token, logout])

  return {
    token,
    adminInfo,
    isAuthenticated,
    isSuperAdmin,
    isLoading,
    login,
    logout,
    verifyToken,
  }
}
