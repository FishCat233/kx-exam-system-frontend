import { API_ENDPOINTS } from './config'
import { http } from './request'

// 导出考试数据
export async function exportExamData(examId: number): Promise<Blob> {
  return http.download(API_ENDPOINTS.EXPORT(examId))
}

// 下载 Blob 文件
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
