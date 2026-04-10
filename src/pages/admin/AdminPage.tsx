import { Spin, Result, Button } from 'antd'
import { useEffect, useState } from 'react'

import { AdminLayout } from './components/AdminLayout'
import { verifyAdminToken } from './mock/admin'

export function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  // 使用原生 URL API 获取 token 参数
  const token = new URLSearchParams(window.location.search).get('token')

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setIsValid(false)
        setIsLoading(false)
        return
      }

      try {
        const result = await verifyAdminToken(token)
        setIsValid(result.valid)
      } catch {
        setIsValid(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkToken()
  }, [token])

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spin size="large" tip="验证中..." />
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Result
          status="403"
          title="403"
          subTitle={
            <div>
              <p>抱歉，您没有权限访问此页面</p>
              <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
                {token ? `Token "${token}" 无效` : '缺少 Token 参数'}
              </p>
              <p style={{ fontSize: 12, color: '#1890ff', marginTop: 8 }}>
                提示：请使用 URL 参数 token=123456 访问
              </p>
            </div>
          }
          extra={
            <Button type="primary" onClick={() => (window.location.href = '/')}>
              返回首页
            </Button>
          }
        />
      </div>
    )
  }

  return <AdminLayout />
}
