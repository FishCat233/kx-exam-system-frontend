import { BookOutlined, ReloadOutlined } from '@ant-design/icons'
import { Select, Space, Typography, Button, message } from 'antd'
import { useEffect, useState, useCallback } from 'react'

import { fetchExamList, type Exam } from '@/api/exam'
import { API_CONFIG } from '@/api/config'

import { useExam } from '../contexts/ExamContext'

const { Text } = Typography
const { Option } = Select

// Mock 考试数据
const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    name: '2024年春季C语言期末考试',
    subject: 'C语言程序设计',
    duration: 120,
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    status: 'ongoing',
  },
  {
    id: 2,
    name: '2024年秋季C语言期中考试',
    subject: 'C语言程序设计',
    duration: 90,
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 90000000).toISOString(),
    status: 'not_started',
  },
]

export function ExamSelector() {
  const { setCurrentExam, currentExamId } = useExam()
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
  }, [loadExams])

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
      <BookOutlined style={{ color: '#1890ff' }} />
      <Text strong>当前考试：</Text>
      <Select
        value={currentExamId ?? undefined}
        onChange={handleExamChange}
        loading={loading}
        style={{ minWidth: 280 }}
        placeholder="请选择考试"
        optionLabelProp="label"
      >
        {exams.map((exam) => (
          <Option
            key={exam.id}
            value={exam.id}
            label={`${exam.name} (${getStatusText(exam.status)})`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text strong>{exam.name}</Text>
              <Space size="small">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {exam.subject}
                </Text>
                <Text type={getStatusColor(exam.status)} style={{ fontSize: 12 }}>
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
