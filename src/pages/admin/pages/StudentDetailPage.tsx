import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  LoginOutlined,
  FullscreenOutlined,
  SaveOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import {
  Card,
  Descriptions,
  Timeline,
  Tag,
  Button,
  Spin,
  Empty,
  Typography,
  Space,
  Badge,
  Alert,
} from 'antd'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

import { API_CONFIG } from '@/api/config'
import { fetchStudentDetail as fetchStudentDetailApi } from '@/api/student'

import * as mockAdmin from '../mock/admin'
import type { StudentDetail, LogLevel, SubmitStatus } from '../types/admin'

const { Title } = Typography

const logLevelMap: Record<LogLevel, { color: string; text: string; icon: React.ReactNode }> = {
  normal: { color: 'default', text: '普通', icon: <CheckCircleOutlined /> },
  warning: { color: 'warning', text: '警告', icon: <WarningOutlined /> },
  critical: { color: 'error', text: '严重', icon: <CloseCircleOutlined /> },
}

const submitStatusMap: Record<SubmitStatus, { text: string; color: string }> = {
  not_started: { text: '未开始', color: 'default' },
  in_progress: { text: '进行中', color: 'processing' },
  submitted: { text: '已交卷', color: 'success' },
  force_submitted: { text: '强制收卷', color: 'error' },
}

function formatTime(isoString: string | null): string {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('zh-CN')
}

function getOperationIcon(operationType: string): React.ReactNode {
  switch (operationType) {
    case 'login':
      return <LoginOutlined />
    case 'fullscreen_enter':
    case 'fullscreen_exit':
      return <FullscreenOutlined />
    case 'code_save':
      return <SaveOutlined />
    case 'visibility_change':
      return <WarningOutlined />
    default:
      return <ClockCircleOutlined />
  }
}

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setLoading(true)
      setLoadError(null)
      try {
        const data = API_CONFIG.USE_MOCK
          ? await mockAdmin.fetchStudentDetail(Number(id))
          : await fetchStudentDetailApi(Number(id))
        setStudent(data)
      } catch (error) {
        setStudent(null)
        setLoadError(error instanceof Error ? error.message : '考生详情加载失败')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleBack = () => {
    navigate('/admin/students')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (!student) {
    return (
      <div style={{ marginTop: 100 }}>
        {loadError && (
          <Alert
            type="error"
            showIcon
            message="考生详情加载失败"
            description={loadError}
            style={{ margin: '0 auto 24px', maxWidth: 640 }}
          />
        )}
        <Empty description={loadError ? '暂时无法查看考生信息' : '未找到考生信息'}>
          <Button type="primary" onClick={handleBack}>
            返回列表
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          考生详情
        </Title>
      </div>

      <Card title="基本信息" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="学号">{student.studentId}</Descriptions.Item>
          <Descriptions.Item label="姓名">{student.name}</Descriptions.Item>
          <Descriptions.Item label="登陆码">
            <Typography.Text copyable style={{ fontFamily: 'monospace' }}>
              {student.loginCode}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="登录时间">{formatTime(student.loginTime)}</Descriptions.Item>
          <Descriptions.Item label="交卷时间">{formatTime(student.submitTime)}</Descriptions.Item>
          <Descriptions.Item label="交卷状态">
            <Badge
              status={
                student.submitStatus === 'in_progress'
                  ? 'processing'
                  : student.submitStatus === 'submitted'
                    ? 'success'
                    : student.submitStatus === 'force_submitted'
                      ? 'error'
                      : 'default'
              }
              text={submitStatusMap[student.submitStatus].text}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="操作记录">
        {student.logs.length === 0 ? (
          <Empty description="暂无操作记录" />
        ) : (
          <Timeline
            mode="left"
            items={student.logs.map((log) => ({
              dot: (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor:
                      log.level === 'critical'
                        ? '#ff4d4f'
                        : log.level === 'warning'
                          ? '#faad14'
                          : '#52c41a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                  }}
                >
                  {getOperationIcon(log.operationType)}
                </div>
              ),
              label: (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {formatTime(log.timestamp)}
                </Typography.Text>
              ),
              children: (
                <div style={{ marginLeft: 16 }}>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Typography.Text strong>{log.description}</Typography.Text>
                    <Space>
                      <Tag color={logLevelMap[log.level].color}>{logLevelMap[log.level].text}</Tag>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {log.operationType}
                      </Typography.Text>
                    </Space>
                  </Space>
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </div>
  )
}
