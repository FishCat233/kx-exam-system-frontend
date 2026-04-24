import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Table, Button, Space, Tag, message, Modal, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { API_CONFIG } from '@/api/config'
import { fetchExamList, deleteExam, updateExam } from '@/api/exam'

import { ExamFormModal } from '../components/ExamFormModal'
import { useAuth } from '../hooks/useAuth'
import * as mockExam from '../mock/exam'
import type { Exam, ExamStatus } from '../types/admin'

const { confirm } = Modal
const { Option } = Select

const statusMap: Record<ExamStatus, { text: string; color: string }> = {
  not_started: { text: '未开始', color: 'default' },
  ongoing: { text: '进行中', color: 'processing' },
  ended: { text: '已结束', color: 'success' },
}

export function ExamManagementPage() {
  const { isSuperAdmin } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)

  const loadExams = async () => {
    setLoading(true)
    try {
      const data = API_CONFIG.USE_MOCK ? await mockExam.fetchExamList() : await fetchExamList()
      setExams(data)
    } catch {
      message.error('加载考试列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExams()
  }, [])

  const filteredExams =
    statusFilter === 'all' ? exams : exams.filter((exam) => exam.status === statusFilter)

  const handleCreate = () => {
    setEditingExam(null)
    setModalVisible(true)
  }

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam)
    setModalVisible(true)
  }

  const handleDelete = (exam: Exam) => {
    confirm({
      title: '确认删除考试？',
      content: `确定要删除考试 "${exam.name}" 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = API_CONFIG.USE_MOCK
            ? await mockExam.deleteExam(exam.id)
            : { success: true }

          if (API_CONFIG.USE_MOCK && !result.success) {
            message.error(result.message || '删除失败')
            return
          }

          if (!API_CONFIG.USE_MOCK) {
            await deleteExam(exam.id)
          }

          message.success('考试删除成功')
          loadExams()
        } catch {
          message.error('删除失败')
        }
      },
    })
  }

  const handleStartExam = (exam: Exam) => {
    confirm({
      title: '确认开启考试？',
      content: `确定要开启考试 "${exam.name}" 吗？开启后考生可以登录参加考试。`,
      okText: '确认开启',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = API_CONFIG.USE_MOCK
            ? await mockExam.updateExam(exam.id, { status: 'ongoing' })
            : { success: true, exam: await updateExam(exam.id, { status: 'ongoing' }) }

          if (result.success) {
            message.success('考试已开启')
            loadExams()
          } else {
            message.error(result.message || '开启失败')
          }
        } catch {
          message.error('开启失败')
        }
      },
    })
  }

  const handleEndExam = (exam: Exam) => {
    confirm({
      title: '确认结束考试？',
      content: `确定要结束考试 "${exam.name}" 吗？结束后所有考生将被强制交卷。`,
      okText: '确认结束',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = API_CONFIG.USE_MOCK
            ? await mockExam.updateExam(exam.id, { status: 'ended' })
            : { success: true, exam: await updateExam(exam.id, { status: 'ended' }) }

          if (result.success) {
            message.success('考试已结束')
            loadExams()
          } else {
            message.error(result.message || '结束失败')
          }
        } catch {
          message.error('结束失败')
        }
      },
    })
  }

  const columns = [
    {
      title: '考试名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} 分钟`,
    },
    {
      title: '开考时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ExamStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: unknown, exam: Exam) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(exam)} />
          </Tooltip>

          {exam.status === 'not_started' && isSuperAdmin && (
            <Tooltip title="开启考试">
              <Button
                type="text"
                icon={<PlayCircleOutlined style={{ color: '#52c41a' }} />}
                onClick={() => handleStartExam(exam)}
              />
            </Tooltip>
          )}

          {exam.status === 'ongoing' && isSuperAdmin && (
            <Tooltip title="结束考试">
              <Button
                type="text"
                icon={<StopOutlined style={{ color: '#ff4d4f' }} />}
                onClick={() => handleEndExam(exam)}
              />
            </Tooltip>
          )}

          {exam.status === 'not_started' && isSuperAdmin && (
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(exam)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <span>状态筛选：</span>
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
            <Option value="all">全部</Option>
            <Option value="not_started">未开始</Option>
            <Option value="ongoing">进行中</Option>
            <Option value="ended">已结束</Option>
          </Select>
        </Space>

        {isSuperAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建考试
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredExams}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <ExamFormModal
        visible={modalVisible}
        exam={editingExam}
        onClose={() => setModalVisible(false)}
        onSuccess={loadExams}
      />
    </div>
  )
}
