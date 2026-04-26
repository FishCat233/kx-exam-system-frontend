import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Modal, Form, Input, InputNumber, message, Radio, Button, Space, Checkbox } from 'antd'
import { useEffect, useState } from 'react'

import { API_CONFIG } from '@/api/config'
import { createProblem, updateProblem } from '@/api/problem'

import * as mockProblem from '../mock/problem'
import type {
  Problem,
  CreateProblemRequest,
  UpdateProblemRequest,
  ProblemType,
  ProblemOption,
} from '../types/admin'

interface ProblemFormModalProps {
  visible: boolean
  examId: number
  problem?: Problem | null
  onClose: () => void
  onSuccess: () => void
}

const PROBLEM_TYPE_OPTIONS = [
  { label: '编程题', value: 'coding' },
  { label: '单选题', value: 'single_choice' },
  { label: '多选题', value: 'multiple_choice' },
]

export function ProblemFormModal({
  visible,
  examId,
  problem,
  onClose,
  onSuccess,
}: ProblemFormModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [problemType, setProblemType] = useState<ProblemType>('coding')
  const [options, setOptions] = useState<ProblemOption[]>([])
  const isEditing = !!problem

  useEffect(() => {
    if (visible && problem) {
      setProblemType(problem.type)
      setOptions(problem.options || [])
      form.setFieldsValue({
        title: problem.title,
        content: problem.content,
        type: problem.type,
        order_num: problem.order_num,
      })
    } else if (visible) {
      setProblemType('coding')
      setOptions([])
      form.resetFields()
      form.setFieldsValue({ type: 'coding', order_num: 1 })
    }
  }, [visible, problem, form])

  const handleTypeChange = (value: ProblemType) => {
    setProblemType(value)
    form.setFieldsValue({ type: value })

    // 切换到选择题时，如果选项为空，自动添加两个空选项
    if (value !== 'coding' && options.length === 0) {
      setOptions([
        { id: 'A', content: '', is_correct: false },
        { id: 'B', content: '', is_correct: false },
      ])
    }
  }

  const handleAddOption = () => {
    const nextId = String.fromCharCode(65 + options.length) // A, B, C, D...
    setOptions([...options, { id: nextId, content: '', is_correct: false }])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    // 重新生成选项ID
    const reindexedOptions = newOptions.map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(65 + i),
    }))
    setOptions(reindexedOptions)
  }

  const handleOptionChange = (
    index: number,
    field: keyof ProblemOption,
    value: string | boolean
  ) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }

    // 单选题只能有一个正确答案
    if (field === 'is_correct' && value === true && problemType === 'single_choice') {
      newOptions.forEach((opt, i) => {
        if (i !== index) {
          opt.is_correct = false
        }
      })
    }

    setOptions(newOptions)
  }

  const validateOptions = (): boolean => {
    if (problemType === 'coding') {
      return true
    }

    if (options.length < 2) {
      message.error('选择题至少需要2个选项')
      return false
    }

    for (const opt of options) {
      if (!opt.content.trim()) {
        message.error('选项内容不能为空')
        return false
      }
    }

    const correctCount = options.filter((opt) => opt.is_correct).length

    if (problemType === 'single_choice' && correctCount !== 1) {
      message.error('单选题必须有且只有一个正确答案')
      return false
    }

    if (problemType === 'multiple_choice' && correctCount < 1) {
      message.error('多选题至少需要一个正确答案')
      return false
    }

    return true
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      if (!validateOptions()) {
        return
      }

      setLoading(true)

      const submitData = {
        ...values,
        options: problemType === 'coding' ? undefined : options,
      }

      if (isEditing && problem) {
        const updateData: UpdateProblemRequest = submitData

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
        const createData: CreateProblemRequest = submitData

        const result = API_CONFIG.USE_MOCK
          ? await mockProblem.createProblem(examId, createData)
          : { success: true, problem: await createProblem(examId, createData) }

        if (result.success) {
          message.success('题目添加成功')
          onSuccess()
          onClose()
          form.resetFields()
          setOptions([])
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
    setOptions([])
    setProblemType('coding')
    onClose()
  }

  const isChoiceProblem = problemType !== 'coding'

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
          name="type"
          label="题目类型"
          rules={[{ required: true, message: '请选择题目类型' }]}
        >
          <Radio.Group
            options={PROBLEM_TYPE_OPTIONS}
            onChange={(e) => handleTypeChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          />
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
            rows={isChoiceProblem ? 6 : 12}
            placeholder={
              isChoiceProblem
                ? '请输入题目内容（支持 Markdown 格式）\n\n示例：\n# 题目描述\n\n这是一道选择题...'
                : '请输入题目内容（支持 Markdown 格式）\n\n示例：\n# 题目描述\n\n编写一个程序...\n\n## 输入\n输入一行...\n\n## 输出\n输出一行...\n\n## 样例\n输入：`1 2`\n输出：`3`'
            }
          />
        </Form.Item>

        {/* 选择题选项编辑区域 */}
        {isChoiceProblem && (
          <Form.Item label="选项设置" required>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: 8,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        borderRadius: '50%',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}
                    >
                      {option.id}
                    </span>
                    <Input
                      placeholder={`选项 ${option.id} 内容`}
                      value={option.content}
                      onChange={(e) => handleOptionChange(index, 'content', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Checkbox
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(index, 'is_correct', e.target.checked)}
                    >
                      正确答案
                    </Checkbox>
                    {options.length > 2 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveOption(index)}
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddOption}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                  disabled={options.length >= 10}
                >
                  添加选项 (最多10个)
                </Button>
              </Space>
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
