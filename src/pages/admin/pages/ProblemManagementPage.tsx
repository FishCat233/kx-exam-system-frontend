import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Table, Button, Space, message, Modal, Card, Alert, Tag } from 'antd'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { API_CONFIG } from '@/api/config'
import { fetchProblemList, deleteProblem } from '@/api/problem'

import { ProblemFormModal } from '../components/ProblemFormModal'
import { useExam } from '../contexts/ExamContext'
import * as mockProblem from '../mock/problem'
import type { Problem, ProblemType } from '../types/admin'

const { confirm } = Modal

const PROBLEM_TYPE_MAP: Record<ProblemType, { label: string; color: string }> = {
  coding: { label: '编程题', color: 'blue' },
  single_choice: { label: '单选题', color: 'green' },
  multiple_choice: { label: '多选题', color: 'orange' },
}

export function ProblemManagementPage() {
  const { currentExam } = useExam()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null)

  const loadProblems = async () => {
    if (!currentExam) return

    setLoading(true)
    try {
      const data = API_CONFIG.USE_MOCK
        ? await mockProblem.fetchProblemList(currentExam.id)
        : await fetchProblemList(currentExam.id)
      setProblems(data)
    } catch {
      message.error('加载题目列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentExam) {
      loadProblems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExam])

  const handleCreate = () => {
    setEditingProblem(null)
    setModalVisible(true)
  }

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem)
    setModalVisible(true)
  }

  const handleDelete = (problem: Problem) => {
    confirm({
      title: '确认删除题目？',
      content: `确定要删除题目 "${problem.title}" 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = API_CONFIG.USE_MOCK
            ? await mockProblem.deleteProblem(problem.id)
            : { success: true }

          if (API_CONFIG.USE_MOCK && !result.success) {
            message.error(result.message || '删除失败')
            return
          }

          if (!API_CONFIG.USE_MOCK) {
            await deleteProblem(problem.id)
          }

          message.success('题目删除成功')
          loadProblems()
        } catch {
          message.error('删除失败')
        }
      },
    })
  }

  const handlePreview = (problem: Problem) => {
    setPreviewProblem(problem)
  }

  const columns = [
    {
      title: '顺序',
      dataIndex: 'order_num',
      key: 'order_num',
      width: 80,
      sorter: (a: Problem, b: Problem) => a.order_num - b.order_num,
    },
    {
      title: '题目标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '题目类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: ProblemType) => (
        <Tag color={PROBLEM_TYPE_MAP[type].color}>{PROBLEM_TYPE_MAP[type].label}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, problem: Problem) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(problem)}>
            预览
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(problem)}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(problem)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  if (!currentExam) {
    return (
      <Alert
        message="请先选择考试"
        description="请在顶部选择器中选择要管理的考试，或先创建一个新考试。"
        type="info"
        showIcon
      />
    )
  }

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              试题管理 - {currentExam.name}
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {currentExam.subject}
              </Tag>
            </span>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              添加题目
            </Button>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Table
          columns={columns}
          dataSource={problems}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 道题`,
          }}
        />
      </Card>

      <ProblemFormModal
        visible={modalVisible}
        examId={currentExam.id}
        problem={editingProblem}
        onClose={() => setModalVisible(false)}
        onSuccess={loadProblems}
      />

      <Modal
        title={previewProblem?.title}
        open={!!previewProblem}
        onCancel={() => setPreviewProblem(null)}
        footer={[
          <Button key="close" onClick={() => setPreviewProblem(null)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {previewProblem && (
          <div className="markdown-body" style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <Tag color={PROBLEM_TYPE_MAP[previewProblem.type].color}>
                {PROBLEM_TYPE_MAP[previewProblem.type].label}
              </Tag>
            </div>
            <ReactMarkdown>{previewProblem.content}</ReactMarkdown>

            {/* 显示选择题选项 */}
            {previewProblem.type !== 'coding' && previewProblem.options && (
              <div
                style={{ marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}
              >
                <h4 style={{ marginBottom: 16 }}>选项：</h4>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {previewProblem.options.map((option) => (
                    <div
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        backgroundColor: option.is_correct ? '#f6ffed' : 'white',
                        border: `1px solid ${option.is_correct ? '#b7eb8f' : '#d9d9d9'}`,
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
                          backgroundColor: option.is_correct ? '#52c41a' : '#1890ff',
                          color: 'white',
                          borderRadius: '50%',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}
                      >
                        {option.id}
                      </span>
                      <span style={{ flex: 1 }}>{option.content}</span>
                      {option.is_correct && <Tag color="success">正确答案</Tag>}
                    </div>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
