import { Alert, Form, Input, Modal, Typography } from 'antd'
import { useEffect } from 'react'

import type { StudentCreateRequest } from '@/api/student'

const { Paragraph, Text } = Typography

interface StudentBatchImportModalProps {
  visible: boolean
  loading?: boolean
  onCancel: () => void
  onSubmit: (students: StudentCreateRequest[]) => Promise<void>
}

function parseStudentLines(rawText: string): StudentCreateRequest[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new Error('请输入至少一条考生记录')
  }

  const students = lines.map((line, index) => {
    const normalizedLine = line.replace(/，/g, ',')
    const parts = normalizedLine
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)

    if (parts.length !== 2) {
      throw new Error(`第 ${index + 1} 行格式错误，请使用“学号,姓名”`)
    }

    const [student_id, name] = parts

    if (!/^\d+$/.test(student_id)) {
      throw new Error(`第 ${index + 1} 行学号格式错误，必须为纯数字`)
    }

    if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(name)) {
      throw new Error(`第 ${index + 1} 行姓名格式错误，必须为中文或英文`)
    }

    return { student_id, name }
  })

  const duplicatedIds = students
    .map((student) => student.student_id)
    .filter((studentId, index, ids) => ids.indexOf(studentId) !== index)

  if (duplicatedIds.length > 0) {
    throw new Error(`导入内容中存在重复学号：${Array.from(new Set(duplicatedIds)).join('、')}`)
  }

  return students
}

export function StudentBatchImportModal({
  visible,
  loading = false,
  onCancel,
  onSubmit,
}: StudentBatchImportModalProps) {
  const [form] = Form.useForm<{ studentsText: string }>()

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const students = parseStudentLines(values.studentsText)
    await onSubmit(students)
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="批量导入考生"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="开始导入"
      cancelText="取消"
      width={640}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        className="mt-4 mb-4"
        message={'每行一条记录，格式为"学号,姓名"'}
        description={
          <div>
            <Paragraph className="mb-2">支持英文逗号和中文逗号，例如：</Paragraph>
            <Text code>20240001,张三</Text>
            <br />
            <Text code>20240002，李四</Text>
          </div>
        }
      />
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="studentsText"
          label="考生列表"
          rules={[{ required: true, message: '请输入要导入的考生列表' }]}
        >
          <Input.TextArea
            rows={12}
            placeholder={'20240001,张三\n20240002,李四'}
            spellCheck={false}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
