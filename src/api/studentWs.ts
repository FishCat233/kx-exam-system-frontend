import { API_ENDPOINTS } from './config'
import { http } from './request'

export async function reportWsFailure(reason?: string): Promise<void> {
  await http.post<unknown>(API_ENDPOINTS.WS.REPORT, { reason }, { authMode: 'student' })
}
