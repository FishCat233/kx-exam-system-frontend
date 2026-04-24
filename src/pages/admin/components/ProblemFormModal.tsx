import { Modal, Form, Input, InputNumber, message } from 'antd'
import { useEffect, useState } from 'react'

import { API_CONFIG } from '@/api/config'
import { createProblem, updateProblem } from '@/api/problem'

import * as mockProblem from '../mock/problem'
import type { Problem, CreateProblemRequest, UpdateProblemRequest } from '../types/admin'

interface ProblemFormModalProps {
  visible: boolean
  examId: number
  problem?: Problem | null
  onClose: () => void
  onSuccess: () => void
}

export function ProblemFormModal({
  visible,
  examId,
  problem,
  onClose,
  onSuccess,
}: ProblemFormModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEditing = !!problem

  useEffect(() => {
    if (visible && problem) {
      form.setFieldsValue({
        title: problem.title,
        content: problem.content,
        order_num: problem.order_num,
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, problem, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (isEditing && problem) {
        const updateData: UpdateProblemRequest = values

        const result = API_CONFIG.USE_MOCK
          ? await mockProblem.updateProblem(problem.id, updateData)
          : { success: true, problem: await updateProblem(problem.id, updateData) }

        if (result.success) {
          message.success('题目更新成功')
          onSuccess()
          onClose()
        } else {
          message.error(result.message || '题目更新失败')
        }
      } else {
        const createData: CreateProblemRequest = values

        const result = API_CONFIG.USE_MOCK
          ? await mockProblem.createProblem(examId, createData)
          : { success: true, problem: await createProblem(examId, createData) }

        if (result.success) {
          message.success('题目添加成功')
          onSuccess()
          onClose()
          form.resetFields()
        } else {
          message.error(result.message || '题目添加失败')
        }
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
      title={isEditing ? '编辑题目' : '添加题目'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" autoComplete="off" style={{ marginTop: 16 }}>
        <Form.Item
          name="title"
          label="题目标题"
          rules={[
            { required: true, message: '请输入题目标题' },
            { min: 1, message: '题目标题至少1个字符' },
            { max: 200, message: '题目标题最多200个字符' },
          ]}
        >
          <Input placeholder="请输入题目标题" />
        </Form.Item>

        <Form.Item
          name="order_num"
          label="顺序号"
          rules={[
            { required: true, message: '请输入顺序号' },
            { type: 'number', min: 1, message: '顺序号至少为1' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入顺序号，用于排序" min={1} />
        </Form.Item>

        <Form.Item
          name="content"
          label="题目内容"
          rules={[
            { required: true, message: '请输入题目内容' },
            { min: 1, message: '题目内容不能为空' },
          ]}
        >
          <Input.TextArea
            rows={12}
            placeholder="请输入题目内容（支持 Markdown 格式）&#10;&#10;示例：&#10;# 题目描述&#10;&#10;编写一个程序...&#10;&#10;## 输入&#10;输入一行...&#10;&#10;## 输出&#10;输出一行...&#10;&#10;## 样例&#10;输入：`1 2`&#10;输出：`3`"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
