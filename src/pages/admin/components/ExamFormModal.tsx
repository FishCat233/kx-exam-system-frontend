import { Modal, Form, Input, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { API_CONFIG } from '@/api/config'
import { createExam, updateExam } from '@/api/exam'

import * as mockExam from '../mock/exam'
import type { Exam, CreateExamRequest, UpdateExamRequest } from '../types/admin'

interface ExamFormModalProps {
  visible: boolean
  exam?: Exam | null
  onClose: () => void
  onSuccess: () => void
}

function serializeLocalDateTime(value: dayjs.Dayjs): string {
  return value.second(0).millisecond(0).format('YYYY-MM-DDTHH:mm:ss')
}

function calculateDurationMinutes(
  startTime?: dayjs.Dayjs | null,
  endTime?: dayjs.Dayjs | null
): number | null {
  if (!startTime || !endTime || !endTime.isAfter(startTime)) {
    return null
  }
  return endTime.diff(startTime, 'minute')
}

export function ExamFormModal({ visible, exam, onClose, onSuccess }: ExamFormModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEditing = !!exam
  const isNotStarted = exam?.status === 'not_started'
  const startTime = Form.useWatch('start_time', form)
  const endTime = Form.useWatch('end_time', form)
  const durationMinutes = calculateDurationMinutes(startTime, endTime)

  useEffect(() => {
    if (visible && exam) {
      form.setFieldsValue({
        name: exam.name,
        subject: exam.subject,
        start_time: dayjs(exam.start_time),
        end_time: dayjs(exam.end_time),
        pledge_content: exam.pledge_content,
      })
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
        pledge_content:
          '# 考前承诺书\n\n我承诺：\n1. 独立完成考试，不抄袭他人代码\n2. 不与他人交流考试内容\n3. 不使用任何外部资料\n4. 遵守考试纪律',
      })
    }
  }, [visible, exam, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const formattedValues = {
        ...values,
        duration: durationMinutes ?? 0,
        start_time: serializeLocalDateTime(values.start_time),
        end_time: serializeLocalDateTime(values.end_time),
      }

      if (isEditing && exam) {
        // 如果不是未开始状态，只允许修改部分字段
        const updateData: UpdateExamRequest = isNotStarted
          ? formattedValues
          : { pledge_content: formattedValues.pledge_content }

        const result = API_CONFIG.USE_MOCK
          ? await mockExam.updateExam(exam.id, updateData)
          : { success: true, exam: await updateExam(exam.id, updateData) }

        if (result.success) {
          message.success('考试更新成功')
          onSuccess()
          onClose()
        } else {
          message.error('考试更新失败')
        }
      } else {
        const createData: CreateExamRequest = formattedValues

        const result = API_CONFIG.USE_MOCK
          ? await mockExam.createExam(createData)
          : { success: true, exam: await createExam(createData) }

        if (result.success) {
          message.success('考试创建成功')
          onSuccess()
          onClose()
          form.resetFields()
        } else {
          message.error(result.message || '考试创建失败')
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

  const disabledFields = isEditing && !isNotStarted

  return (
    <Modal
      title={isEditing ? '编辑考试' : '创建考试'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={700}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" autoComplete="off" className="mt-4">
        <Form.Item
          name="name"
          label="考试名称"
          rules={[
            { required: true, message: '请输入考试名称' },
            { min: 1, message: '考试名称至少1个字符' },
            { max: 100, message: '考试名称最多100个字符' },
          ]}
        >
          <Input placeholder="请输入考试名称" disabled={disabledFields} />
        </Form.Item>

        <Form.Item
          name="subject"
          label="考试科目"
          rules={[
            { required: true, message: '请输入考试科目' },
            { min: 1, message: '考试科目至少1个字符' },
            { max: 50, message: '考试科目最多50个字符' },
          ]}
        >
          <Input placeholder="请输入考试科目" disabled={disabledFields} />
        </Form.Item>

        <Form.Item
          name="start_time"
          label="开考时间"
          rules={[{ required: true, message: '请选择开考时间' }]}
        >
          <DatePicker
            showTime
            className="w-full"
            placeholder="请选择开考时间"
            format="YYYY-MM-DD HH:mm"
            disabled={disabledFields}
          />
        </Form.Item>

        <Form.Item
          name="end_time"
          label="结束时间"
          rules={[
            { required: true, message: '请选择结束时间' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startTime = getFieldValue('start_time')
                if (!value || !startTime || value.isAfter(startTime)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('结束时间必须晚于开考时间'))
              },
            }),
          ]}
        >
          <DatePicker
            showTime
            className="w-full"
            placeholder="请选择结束时间"
            format="YYYY-MM-DD HH:mm"
            disabled={disabledFields}
          />
        </Form.Item>

        <Form.Item label="考试时长（自动计算）">
          <Input
            value={
              durationMinutes === null
                ? '请选择有效的开始时间和结束时间'
                : `${durationMinutes} 分钟`
            }
            readOnly
            disabled
          />
        </Form.Item>

        <Form.Item
          name="pledge_content"
          label="考前承诺书"
          rules={[
            { required: true, message: '请输入考前承诺书' },
            { min: 1, message: '考前承诺书不能为空' },
          ]}
        >
          <Input.TextArea rows={8} placeholder="请输入考前承诺书（支持 Markdown 格式）" />
        </Form.Item>

        {disabledFields && (
          <div className="text-yellow-500 mb-4">
            注意：考试已开始或已结束，只能修改考前承诺书内容。
          </div>
        )}
      </Form>
    </Modal>
  )
}
