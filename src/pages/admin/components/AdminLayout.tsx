import {
  DashboardOutlined,
  TeamOutlined,
  FileZipOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Avatar, Dropdown, Badge, theme, Modal, Form, Input, message } from 'antd'
import type { MenuProps } from 'antd'
import { useState, useMemo } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'

import { useAuth } from '../hooks/useAuth'
import { changePassword } from '../mock/admin'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 使用 Mock 数据
      const result = await changePassword({ new_password: values.newPassword })

      if (result.success) {
        message.success('密码修改成功')
        form.resetFields()
        onClose()
      } else {
        message.error(result.message || '密码修改失败')
      }
    } catch {
      // 表单验证失败
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="修改密码"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6个字符' },
            { max: 100, message: '密码最多100个字符' },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed] = useState(false)
  const { adminInfo, isSuperAdmin, logout } = useAuth()
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        key: '/admin/dashboard',
        icon: <DashboardOutlined />,
        label: '仪表盘',
      },
      {
        key: '/admin/students',
        icon: <TeamOutlined />,
        label: '考生管理',
      },
      {
        key: '/admin/export',
        icon: <FileZipOutlined />,
        label: '阅卷导出',
      },
    ]

    if (isSuperAdmin) {
      items.push({
        key: '/admin/admins',
        icon: <SafetyCertificateOutlined />,
        label: '管理员管理',
      })
    }

    return items
  }, [isSuperAdmin])

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      content: '退出后需要重新登录才能访问管理后台',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        logout()
        window.location.href = '/admin'
      },
    })
  }

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true)
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'username',
      label: (
        <span style={{ color: '#999', fontSize: 12 }}>{adminInfo?.username || '未知用户'}</span>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'changePassword',
      icon: <KeyOutlined />,
      label: '修改密码',
      onClick: handleChangePassword,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 'bold',
            color: '#1890ff',
          }}
        >
          {collapsed ? '考试' : '考试管理系统'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: borderRadiusLG,
                transition: 'background 0.3s',
              }}
              className="hover:bg-gray-100"
            >
              <Badge dot color={adminInfo?.is_active ? 'green' : 'red'}>
                <Avatar icon={<UserOutlined />} />
              </Badge>
              <span style={{ marginLeft: 8 }}>
                {adminInfo?.name || adminInfo?.username || '管理员'}
              </span>
              <DownOutlined style={{ fontSize: 12 }} />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />
    </Layout>
  )
}
