import {
  DashboardOutlined,
  TeamOutlined,
  FileZipOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Avatar, Dropdown, Badge, theme, Modal, Form, Input, message } from 'antd'
import type { MenuProps } from 'antd'
import { useState, useMemo } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'

import { changePassword as changePasswordApi } from '@/api/admin'
import { API_CONFIG } from '@/api/config'

import { useAuth } from '../hooks/useAuth'
import * as mockAdmin from '../mock/admin'

import { ExamSelector } from './ExamSelector'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 根据配置选择使用 Mock 或真实 API
      const result = API_CONFIG.USE_MOCK
        ? await mockAdmin.changePassword({ new_password: values.newPassword })
        : await changePasswordApi({ new_password: values.newPassword })

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
        key: '/admin/export',
        icon: <FileZipOutlined />,
        label: '阅卷导出',
      },
    ]

    if (isSuperAdmin) {
      items.push(
        {
          key: '/admin/students',
          icon: <TeamOutlined />,
          label: '考生管理',
        },
        {
          key: '/admin/exams',
          icon: <CalendarOutlined />,
          label: '考试管理',
        },
        {
          key: '/admin/admins',
          icon: <SafetyCertificateOutlined />,
          label: '管理员管理',
        }
      )
    }

    items.push({
      key: '/admin/problems',
      icon: <FileTextOutlined />,
      label: '试题管理',
    })

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
      label: <span className="text-slate-400 text-xs">{adminInfo?.username || '未知用户'}</span>,
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
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-sm">
        <div
          className={`h-16 flex items-center justify-center border-b border-slate-200 font-bold text-blue-500 ${collapsed ? 'text-sm' : 'text-lg'}`}
        >
          {collapsed ? '考试' : '考试管理系统'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="!border-r-0"
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="px-6 flex items-center justify-between shadow-sm"
        >
          <ExamSelector />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{ borderRadius: borderRadiusLG }}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 transition-colors hover:bg-slate-100"
            >
              <Badge dot color={adminInfo?.is_active ? 'green' : 'red'}>
                <Avatar icon={<UserOutlined />} />
              </Badge>
              <span className="ml-2">{adminInfo?.name || adminInfo?.username || '管理员'}</span>
              <DownOutlined className="text-xs" />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
          className="m-6 p-6 min-h-[280px]"
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
