import { BookOutlined, ReloadOutlined } from '@ant-design/icons'
import { Select, Space, Typography, Button, message } from 'antd'
import { useEffect, useState, useCallback } from 'react'

import { API_CONFIG } from '@/api/config'
import { fetchExamList } from '@/api/exam'

import { useExam } from '../contexts/ExamContext'
import { MOCK_EXAMS } from '../mock/exam'
import type { Exam } from '../types/admin'

const { Text } = Typography
const { Option } = Select

export function ExamSelector() {
  const { setCurrentExam, currentExamId, examListVersion } = useExam()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)

  const loadExams = useCallback(async () => {
    setLoading(true)
    try {
      const data = API_CONFIG.USE_MOCK ? MOCK_EXAMS : await fetchExamList()
      setExams(data)

      // 如果没有当前选中的考试，尝试从 localStorage 恢复或选择第一个
      if (!currentExamId && data.length > 0) {
        const savedExamId = localStorage.getItem('admin_current_exam_id')
        if (savedExamId) {
          const savedExam = data.find((e) => e.id === Number(savedExamId))
          if (savedExam) {
            setCurrentExam(savedExam)
          } else {
            setCurrentExam(data[0])
          }
        } else {
          setCurrentExam(data[0])
        }
      }
    } catch {
      message.error('加载考试列表失败')
    } finally {
      setLoading(false)
    }
  }, [currentExamId, setCurrentExam])

  useEffect(() => {
    loadExams()
  }, [loadExams, examListVersion])

  const handleExamChange = (examId: number) => {
    const exam = exams.find((e) => e.id === examId)
    if (exam) {
      setCurrentExam(exam)
    }
  }

  const getStatusText = (status: Exam['status']) => {
    switch (status) {
      case 'not_started':
        return '未开始'
      case 'ongoing':
        return '进行中'
      case 'ended':
        return '已结束'
      default:
        return status
    }
  }

  const getStatusColor = (
    status: Exam['status']
  ): 'secondary' | 'success' | 'danger' | undefined => {
    switch (status) {
      case 'not_started':
        return 'secondary'
      case 'ongoing':
        return 'success'
      case 'ended':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <Space>
      <BookOutlined className="text-blue-500" />
      <Text strong>当前考试：</Text>
      <Select
        value={currentExamId ?? undefined}
        onChange={handleExamChange}
        loading={loading}
        className="min-w-[280px]"
        placeholder="请选择考试"
        optionLabelProp="label"
      >
        {exams.map((exam) => (
          <Option
            key={exam.id}
            value={exam.id}
            label={`${exam.name} (${getStatusText(exam.status)})`}
          >
            <div className="flex flex-col gap-1">
              <Text strong>{exam.name}</Text>
              <Space size="small">
                <Text type="secondary" className="text-xs">
                  {exam.subject}
                </Text>
                <Text type={getStatusColor(exam.status)} className="text-xs">
                  {getStatusText(exam.status)}
                </Text>
              </Space>
            </div>
          </Option>
        ))}
      </Select>
      <Button icon={<ReloadOutlined />} loading={loading} onClick={loadExams} size="small" />
    </Space>
  )
}
