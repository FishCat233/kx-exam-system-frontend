import { Form, Input, Modal, Switch, message } from 'antd'
import { useEffect } from 'react'

import type { Admin, CreateAdminRequest, UpdateAdminRequest } from '../types/admin'

interface AdminFormModalProps {
  visible: boolean
  admin: Admin | null
  onCancel: () => void
  onSubmit: (values: CreateAdminRequest | UpdateAdminRequest) => Promise<void>
  loading?: boolean
}

export function AdminFormModal({
  visible,
  admin,
  onCancel,
  onSubmit,
  loading = false,
}: AdminFormModalProps) {
  const [form] = Form.useForm()
  const isEditing = !!admin

  useEffect(() => {
    if (visible && admin) {
      form.setFieldsValue({
        username: admin.username,
        name: admin.name,
        remark: admin.remark,
        is_active: admin.is_active,
      })
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({ is_active: true })
    }
  }, [visible, admin, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
      if (!isEditing) {
        form.resetFields()
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      }
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={isEditing ? '编辑管理员' : '创建管理员'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={isEditing ? '保存' : '创建'}
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off" className="mt-4">
        <Form.Item
          name="username"
          label="账号"
          rules={[
            { required: !isEditing, message: '请输入账号' },
            { min: 3, message: '账号至少3个字符' },
            { max: 50, message: '账号最多50个字符' },
          ]}
        >
          <Input placeholder="请输入账号" disabled={isEditing} autoFocus={!isEditing} />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 100, message: '密码最多100个字符' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label="显示名称"
          rules={[{ max: 100, message: '显示名称最多100个字符' }]}
        >
          <Input placeholder="请输入显示名称" />
        </Form.Item>

        <Form.Item name="remark" label="备注" rules={[{ max: 500, message: '备注最多500个字符' }]}>
          <Input.TextArea placeholder="请输入备注" rows={3} showCount maxLength={500} />
        </Form.Item>

        {isEditing && (
          <Form.Item name="is_active" label="启用状态" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
