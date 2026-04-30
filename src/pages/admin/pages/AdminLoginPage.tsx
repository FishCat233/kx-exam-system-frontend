import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { useState } from 'react'

import { useAuth } from '../hooks/useAuth'

const { Title } = Typography

interface LoginFormValues {
  username: string
  password: string
}

interface AdminLoginPageProps {
  onLoginSuccess: () => void
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const result = await login(values.username, values.password)
      if (result.success) {
        message.success('登录成功')
        onLoginSuccess()
      } else {
        message.error(result.message || '登录失败')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <Card className="w-[400px] rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Title level={3} className="!mb-0 text-blue-500">
            考试管理系统
          </Title>
          <Typography.Text type="secondary">管理员登录</Typography.Text>
        </div>

        <Form<LoginFormValues>
          name="adminLogin"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入账号' },
              { min: 3, message: '账号至少3个字符' },
              { max: 50, message: '账号最多50个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入账号" autoFocus />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 100, message: '密码最多100个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
