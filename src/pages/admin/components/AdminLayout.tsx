import {
  DashboardOutlined,
  TeamOutlined,
  FileZipOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Avatar, Dropdown, Badge, theme } from 'antd'
import type { MenuProps } from 'antd'
import { useState, useMemo } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

// 获取当前 URL 中的 token 参数
function useToken() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search))
  return searchParams.get('token')
}

// 构建带 token 的 URL
function buildUrlWithToken(path: string, token: string | null): string {
  return token ? `${path}?token=${token}` : path
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed] = useState(false)
  const token = useToken()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: buildUrlWithToken('/admin/dashboard', token),
        icon: <DashboardOutlined />,
        label: '仪表盘',
      },
      {
        key: buildUrlWithToken('/admin/students', token),
        icon: <TeamOutlined />,
        label: '考生管理',
      },
      {
        key: buildUrlWithToken('/admin/export', token),
        icon: <FileZipOutlined />,
        label: '阅卷导出',
      },
    ],
    [token]
  )

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  const handleLogout = () => {
    window.location.href = '/'
  }

  const userMenuItems: MenuProps['items'] = [
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
          selectedKeys={[buildUrlWithToken(location.pathname, token)]}
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
              <Badge dot color="green">
                <Avatar icon={<UserOutlined />} />
              </Badge>
              <span style={{ marginLeft: 8 }}>管理员</span>
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
    </Layout>
  )
}
