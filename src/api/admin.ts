import type {
  Admin,
  AdminInfo,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminVerifyResult,
  ChangePasswordRequest,
  CreateAdminRequest,
  ForceChangePasswordRequest,
  UpdateAdminRequest,
} from '@/pages/admin/types/admin'

import { API_ENDPOINTS } from './config'
import { http } from './request'

// 管理员登录
export async function loginAdmin(
  data: AdminLoginRequest
): Promise<{ success: boolean; data?: AdminLoginResponse; message?: string }> {
  try {
    const result = await http.post<AdminLoginResponse>(API_ENDPOINTS.AUTH.ADMIN_LOGIN, data)
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '登录失败',
    }
  }
}

// 验证管理员 Token
export async function verifyAdminToken(token: string): Promise<AdminVerifyResult> {
  try {
    const result = await http.post<{ valid: boolean; admin_info?: AdminInfo }>(
      API_ENDPOINTS.AUTH.ADMIN_VERIFY,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return {
      valid: result.valid,
      admin_info: result.admin_info,
    }
  } catch {
    return { valid: false }
  }
}

// 获取管理员列表
export async function fetchAdminList(isActive?: boolean): Promise<Admin[]> {
  const params = isActive !== undefined ? `?is_active=${isActive}` : ''
  return http.get<Admin[]>(`${API_ENDPOINTS.ADMIN.LIST}${params}`)
}

// 获取管理员详情
export async function fetchAdminDetail(id: number): Promise<Admin> {
  return http.get<Admin>(API_ENDPOINTS.ADMIN.DETAIL(id))
}

// 创建管理员
export async function createAdmin(
  data: CreateAdminRequest
): Promise<{ success: boolean; admin?: Admin; message?: string }> {
  try {
    const result = await http.post<Admin>(API_ENDPOINTS.ADMIN.CREATE, data)
    return { success: true, admin: result }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '创建失败',
    }
  }
}

// 更新管理员
export async function updateAdmin(
  id: number,
  data: UpdateAdminRequest
): Promise<{ success: boolean; admin?: Admin; message?: string }> {
  try {
    const result = await http.put<Admin>(API_ENDPOINTS.ADMIN.UPDATE(id), data)
    return { success: true, admin: result }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新失败',
    }
  }
}

// 删除管理员
export async function deleteAdmin(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    await http.delete(API_ENDPOINTS.ADMIN.DELETE(id))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除失败',
    }
  }
}

// 停用管理员
export async function deactivateAdmin(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    await http.post(API_ENDPOINTS.ADMIN.DEACTIVATE(id))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '停用失败',
    }
  }
}

// 启用管理员
export async function activateAdmin(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    await http.post(API_ENDPOINTS.ADMIN.ACTIVATE(id))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '启用失败',
    }
  }
}

// 强制修改密码
export async function forceChangePassword(
  id: number,
  data: ForceChangePasswordRequest
): Promise<{ success: boolean; message?: string }> {
  try {
    await http.post(API_ENDPOINTS.ADMIN.FORCE_CHANGE_PASSWORD(id), data)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '密码重置失败',
    }
  }
}

// 修改自己密码
export async function changePassword(
  data: ChangePasswordRequest
): Promise<{ success: boolean; message?: string }> {
  try {
    await http.post(API_ENDPOINTS.ADMIN.CHANGE_PASSWORD, data)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '密码修改失败',
    }
  }
}
