import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'

import type { StudentCreateRequest } from '@/api/student'

interface StudentFormModalProps {
  visible: boolean
  loading?: boolean
  onCancel: () => void
  onSubmit: (values: StudentCreateRequest) => Promise<void>
}

export function StudentFormModal({
  visible,
  loading = false,
  onCancel,
  onSubmit,
}: StudentFormModalProps) {
  const [form] = Form.useForm<StudentCreateRequest>()

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="手动添加考生"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="添加"
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off" style={{ marginTop: 16 }}>
        <Form.Item
          name="student_id"
          label="学号"
          rules={[
            { required: true, message: '请输入学号' },
            { pattern: /^\d+$/, message: '学号必须为纯数字' },
          ]}
        >
          <Input placeholder="请输入学号" autoFocus />
        </Form.Item>
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: '请输入姓名' },
            { pattern: /^[\u4e00-\u9fa5]+$/, message: '姓名必须为中文' },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
