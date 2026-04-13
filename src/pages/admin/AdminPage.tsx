import { Spin, Result, Button } from 'antd'
import { useEffect, useState } from 'react'

import { AdminLayout } from './components/AdminLayout'
import { ExamProvider } from './contexts/ExamContext'
import { useAuth } from './hooks/useAuth'
import { AdminLoginPage } from './pages/AdminLoginPage'

export function AdminPage() {
  const { isAuthenticated, isLoading, verifyToken } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      if (isLoading) {
        return
      }

      if (isAuthenticated) {
        const valid = await verifyToken()
        if (!valid) {
          setShowLogin(true)
        }
      } else {
        setShowLogin(true)
      }
      setVerifying(false)
    }

    checkAuth()
  }, [isLoading, isAuthenticated, verifyToken])

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  if (isLoading || verifying) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spin size="large" description="验证中..." />
      </div>
    )
  }

  if (showLogin) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Result
          status="403"
          title="403"
          subTitle={
            <div>
              <p>抱歉，您没有权限访问此页面</p>
              <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>请先登录</p>
            </div>
          }
          extra={
            <Button type="primary" onClick={() => setShowLogin(true)}>
              去登录
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <ExamProvider>
      <AdminLayout />
    </ExamProvider>
  )
}
