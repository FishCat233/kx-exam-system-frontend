import {
  EyeOutlined,
  StopOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { Table, Button, Space, Input, Card, Typography, Modal, message, Tooltip, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { fetchStudentList, forceSubmitStudent, exportExamData } from '../mock/admin'
import type { Student, SubmitStatus } from '../types/admin'

const { Title } = Typography
const { Search } = Input
const { confirm } = Modal

const submitStatusMap: Record<SubmitStatus, { text: string; color: string }> = {
  not_started: { text: '未开始', color: 'default' },
  ongoing: { text: '进行中', color: 'processing' },
  submitted: { text: '已交卷', color: 'success' },
  forced_submit: { text: '强制收卷', color: 'error' },
}

function formatTime(isoString: string | null): string {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('zh-CN')
}

export function StudentListPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [exporting, setExporting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchStudentList()
      setStudents(data)
      setFilteredStudents(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (!value.trim()) {
      setFilteredStudents(students)
      return
    }

    const filtered = students.filter(
      (student) =>
        student.name.includes(value) ||
        student.studentId.includes(value) ||
        student.loginCode.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredStudents(filtered)
  }

  const handleViewDetail = (id: number) => {
    navigate(`/admin/students/${id}`)
  }

  const handleForceSubmit = (student: Student) => {
    confirm({
      title: '确认强制收卷？',
      content: `您确定要强制收卷考生 "${student.name}"（${student.studentId}）的试卷吗？此操作不可撤销。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await forceSubmitStudent(student.id)
          message.success(`已成功对 "${student.name}" 强制收卷`)
          loadData()
        } catch {
          message.error('强制收卷失败，请重试')
        }
      },
    })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportExamData()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `考生数据_${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('导出成功')
    } catch {
      message.error('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const columns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '登陆码',
      dataIndex: 'loginCode',
      key: 'loginCode',
      width: 120,
      render: (code: string) => (
        <Typography.Text copyable style={{ fontFamily: 'monospace' }}>
          {code}
        </Typography.Text>
      ),
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 180,
      render: (time: string | null) => formatTime(time),
      sorter: (a, b) => {
        if (!a.loginTime) return 1
        if (!b.loginTime) return -1
        return new Date(a.loginTime).getTime() - new Date(b.loginTime).getTime()
      },
    },
    {
      title: '交卷时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 180,
      render: (time: string | null) => formatTime(time),
    },
    {
      title: '交卷状态',
      dataIndex: 'submitStatus',
      key: 'submitStatus',
      width: 120,
      render: (status: SubmitStatus) => (
        <Badge
          status={
            status === 'ongoing'
              ? 'processing'
              : status === 'submitted'
                ? 'success'
                : status === 'forced_submit'
                  ? 'error'
                  : 'default'
          }
          text={submitStatusMap[status].text}
        />
      ),
      filters: [
        { text: '未开始', value: 'not_started' },
        { text: '进行中', value: 'ongoing' },
        { text: '已交卷', value: 'submitted' },
        { text: '强制收卷', value: 'forced_submit' },
      ],
      onFilter: (value, record) => record.submitStatus === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetail(record.id)}
            >
              详情
            </Button>
          </Tooltip>
          {record.submitStatus === 'ongoing' && (
            <Tooltip title="强制收卷">
              <Button
                danger
                icon={<StopOutlined />}
                size="small"
                onClick={() => handleForceSubmit(record)}
              >
                收卷
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          考生管理
        </Title>
        <Space>
          <Search
            placeholder="搜索学号/姓名/登陆码"
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExport}
            loading={exporting}
          >
            导出
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}
