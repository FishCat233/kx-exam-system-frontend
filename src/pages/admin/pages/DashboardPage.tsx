import {
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState, useCallback } from 'react'

import { API_CONFIG } from '@/api/config'
import { fetchDashboardData as fetchDashboardDataApi } from '@/api/dashboard'
import {
  buildExportFilename,
  exportExamData as exportExamDataApi,
  downloadBlob,
} from '@/api/export'

import { useExam } from '../contexts/ExamContext'
import * as mockAdmin from '../mock/admin'
import type { DashboardData, RecentLog, LogLevel } from '../types/admin'

const { Title } = Typography

const examStatusMap: Record<string, { text: string; color: string }> = {
  not_started: { text: '未开始', color: 'default' },
  ongoing: { text: '进行中', color: 'processing' },
  ended: { text: '已结束', color: 'success' },
  pending: { text: '准备中', color: 'warning' },
  cancelled: { text: '已取消', color: 'error' },
}

const logLevelMap: Record<LogLevel, { color: string; text: string }> = {
  normal: { color: 'default', text: '普通' },
  warning: { color: 'warning', text: '警告' },
  critical: { color: 'error', text: '严重' },
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleString('zh-CN')
}

export function DashboardPage() {
  const { currentExam, currentExamId } = useExam()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [exporting, setExporting] = useState(false)

  const loadData = useCallback(async () => {
    if (!currentExamId) return
    setLoading(true)
    try {
      const result = API_CONFIG.USE_MOCK
        ? await mockAdmin.fetchDashboardData()
        : await fetchDashboardDataApi(currentExamId)
      setData(result)
      setCountdown(result.countdown)
    } finally {
      setLoading(false)
    }
  }, [currentExamId])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const handleExport = async () => {
    if (!currentExamId) return
    setExporting(true)
    try {
      const blob = API_CONFIG.USE_MOCK
        ? await mockAdmin.exportExamData()
        : await exportExamDataApi(currentExamId)
      downloadBlob(blob, buildExportFilename(currentExam?.name))
    } finally {
      setExporting(false)
    }
  }

  const logColumns: ColumnsType<RecentLog> = [
    {
      title: '考生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 120,
    },
    {
      title: '异常时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => formatTime(timestamp),
    },
    {
      title: '异常描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: LogLevel) => (
        <Tag color={logLevelMap[level].color}>{logLevelMap[level].text}</Tag>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="!mb-0">
          考试仪表盘
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExport}
            loading={exporting}
          >
            导出数据
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="考试状态"
              value={data ? (examStatusMap[data.examStatus]?.text ?? '未知状态') : '-'}
              prefix={
                data && (
                  <Badge
                    status={
                      data.examStatus === 'ongoing'
                        ? 'processing'
                        : data.examStatus === 'ended'
                          ? 'success'
                          : 'default'
                    }
                  />
                )
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="剩余时间"
              value={formatDuration(countdown)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: countdown < 300 ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="交卷人数"
              value={data ? `${data.submitCount} / ${data.totalStudents}` : '-'}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="在线人数"
              value={data ? data.totalStudents - data.submitCount : '-'}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card title="考试时间信息" loading={loading}>
            <Space direction="vertical" className="w-full">
              <div>
                <Typography.Text type="secondary">开始时间：</Typography.Text>
                <Typography.Text>{data ? formatTime(data.startTime) : '-'}</Typography.Text>
              </div>
              <div>
                <Typography.Text type="secondary">结束时间：</Typography.Text>
                <Typography.Text>{data ? formatTime(data.endTime) : '-'}</Typography.Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="交卷统计" loading={loading}>
            <Space direction="vertical" className="w-full">
              <div>
                <Typography.Text type="secondary">已交卷：</Typography.Text>
                <Typography.Text type="success">{data?.submitCount || 0} 人</Typography.Text>
              </div>
              <div>
                <Typography.Text type="secondary">未交卷：</Typography.Text>
                <Typography.Text type="warning">
                  {data ? data.totalStudents - data.submitCount : 0} 人
                </Typography.Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <WarningOutlined />
            <span>最近异常记录</span>
            <Tag color="red">{data?.recentLogs.length || 0}</Tag>
          </Space>
        }
        loading={loading}
        className="mt-4"
      >
        <Table
          columns={logColumns}
          dataSource={data?.recentLogs || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  )
}
