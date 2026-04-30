import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  KeyOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Typography,
  Modal,
  message,
  Tooltip,
  Tag,
  Select,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState, useCallback } from 'react'

import {
  fetchAdminList as fetchAdminListApi,
  createAdmin as createAdminApi,
  updateAdmin as updateAdminApi,
  deleteAdmin as deleteAdminApi,
  deactivateAdmin as deactivateAdminApi,
  activateAdmin as activateAdminApi,
  forceChangePassword as forceChangePasswordApi,
} from '@/api/admin'
import { API_CONFIG } from '@/api/config'

import { AdminFormModal } from '../components/AdminFormModal'
import * as mockAdmin from '../mock/admin'
import type { Admin, CreateAdminRequest, UpdateAdminRequest } from '../types/admin'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
const { confirm } = Modal

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleString('zh-CN')
}

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined)

  const [modalVisible, setModalVisible] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [passwordModalAdmin, setPasswordModalAdmin] = useState<Admin | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [passwordModalLoading, setPasswordModalLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = API_CONFIG.USE_MOCK
        ? await mockAdmin.fetchAdminList(isActiveFilter)
        : await fetchAdminListApi(isActiveFilter)
      setAdmins(data)
      setFilteredAdmins(data)
    } finally {
      setLoading(false)
    }
  }, [isActiveFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredAdmins(admins)
      return
    }

    const filtered = admins.filter(
      (admin) =>
        admin.username.toLowerCase().includes(searchText.toLowerCase()) ||
        (admin.name && admin.name.includes(searchText)) ||
        (admin.remark && admin.remark.includes(searchText))
    )
    setFilteredAdmins(filtered)
  }, [searchText, admins])

  const handleCreate = () => {
    setEditingAdmin(null)
    setModalVisible(true)
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setModalVisible(true)
  }

  const handleModalSubmit = async (values: CreateAdminRequest | UpdateAdminRequest) => {
    setModalLoading(true)
    try {
      if (editingAdmin) {
        const result = API_CONFIG.USE_MOCK
          ? await mockAdmin.updateAdmin(editingAdmin.id, values as UpdateAdminRequest)
          : await updateAdminApi(editingAdmin.id, values as UpdateAdminRequest)
        if (result.success) {
          message.success('更新成功')
          setModalVisible(false)
          loadData()
        } else {
          message.error(result.message || '更新失败')
        }
      } else {
        const result = API_CONFIG.USE_MOCK
          ? await mockAdmin.createAdmin(values as CreateAdminRequest)
          : await createAdminApi(values as CreateAdminRequest)
        if (result.success) {
          message.success('创建成功')
          setModalVisible(false)
          loadData()
        } else {
          message.error(result.message || '创建失败')
        }
      }
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = (admin: Admin) => {
    confirm({
      title: '确认删除？',
      content: `您确定要删除管理员 "${admin.name || admin.username}" 吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = API_CONFIG.USE_MOCK
            ? await mockAdmin.deleteAdmin(admin.id)
            : await deleteAdminApi(admin.id)
          if (result.success) {
            message.success('删除成功')
            loadData()
          } else {
            message.error(result.message || '删除失败')
          }
        } catch {
          message.error('删除失败')
        }
      },
    })
  }

  const handleDeactivate = (admin: Admin) => {
    confirm({
      title: '确认停用？',
      content: `您确定要停用管理员 "${admin.name || admin.username}" 吗？停用后该管理员将无法登录。`,
      okText: '确认停用',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = API_CONFIG.USE_MOCK
            ? await mockAdmin.deactivateAdmin(admin.id)
            : await deactivateAdminApi(admin.id)
          if (result.success) {
            message.success('停用成功')
            loadData()
          } else {
            message.error(result.message || '停用失败')
          }
        } catch {
          message.error('停用失败')
        }
      },
    })
  }

  const handleActivate = async (admin: Admin) => {
    try {
      const result = API_CONFIG.USE_MOCK
        ? await mockAdmin.activateAdmin(admin.id)
        : await activateAdminApi(admin.id)
      if (result.success) {
        message.success('启用成功')
        loadData()
      } else {
        message.error(result.message || '启用失败')
      }
    } catch {
      message.error('启用失败')
    }
  }

  const handleChangePassword = (admin: Admin) => {
    setPasswordModalAdmin(admin)
    setNewPassword('')
    setPasswordModalVisible(true)
  }

  const handlePasswordModalOk = async () => {
    if (!newPassword || newPassword.length < 6) {
      message.error('密码至少6个字符')
      return
    }
    if (newPassword.length > 100) {
      message.error('密码最多100个字符')
      return
    }

    if (!passwordModalAdmin) return

    setPasswordModalLoading(true)
    try {
      const result = API_CONFIG.USE_MOCK
        ? await mockAdmin.forceChangePassword(passwordModalAdmin.id, { new_password: newPassword })
        : await forceChangePasswordApi(passwordModalAdmin.id, { new_password: newPassword })
      if (result.success) {
        message.success('密码修改成功')
        setPasswordModalVisible(false)
        setNewPassword('')
      } else {
        message.error(result.message || '密码修改失败')
      }
    } catch {
      message.error('密码修改失败')
    } finally {
      setPasswordModalLoading(false)
    }
  }

  const columns: ColumnsType<Admin> = [
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: '显示名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string | null) => name || '-',
    },
    {
      title: '启用状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>{isActive ? '启用' : '停用'}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (remark: string | null) => remark || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time: string) => formatTime(time),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      render: (time: string) => formatTime(time),
      sorter: (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>

          {record.is_active ? (
            <Tooltip title="停用">
              <Button
                danger
                icon={<StopOutlined />}
                size="small"
                onClick={() => handleDeactivate(record)}
              >
                停用
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="启用">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleActivate(record)}
              >
                启用
              </Button>
            </Tooltip>
          )}

          <Tooltip title="重置密码">
            <Button
              icon={<KeyOutlined />}
              size="small"
              onClick={() => handleChangePassword(record)}
            >
              重置密码
            </Button>
          </Tooltip>

          <Tooltip title="删除">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="!mb-0">
          管理员管理
        </Title>
        <Space>
          <Select
            placeholder="筛选状态"
            allowClear
            className="w-[120px]"
            value={isActiveFilter}
            onChange={(value) => setIsActiveFilter(value)}
          >
            <Option value={true}>启用</Option>
            <Option value={false}>停用</Option>
          </Select>
          <Search
            placeholder="搜索账号/名称/备注"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[250px]"
            prefix={<SearchOutlined />}
          />
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建管理员
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredAdmins}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <AdminFormModal
        visible={modalVisible}
        admin={editingAdmin}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
      />

      <Modal
        title="重置密码"
        open={passwordModalVisible}
        onOk={handlePasswordModalOk}
        onCancel={() => {
          setPasswordModalVisible(false)
          setNewPassword('')
        }}
        confirmLoading={passwordModalLoading}
        okText="确认"
        cancelText="取消"
      >
        <div className="mt-4">
          <Text>
            正在为管理员 <strong>{passwordModalAdmin?.name || passwordModalAdmin?.username}</strong>{' '}
            重置密码
          </Text>
          <Input.Password
            placeholder="请输入新密码（6-100字符）"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-4"
          />
        </div>
      </Modal>
    </div>
  )
}
