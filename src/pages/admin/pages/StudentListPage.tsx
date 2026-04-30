import {
  EyeOutlined,
  StopOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Typography,
  Modal,
  message,
  Tooltip,
  Badge,
  Empty,
  Result,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { API_CONFIG } from '@/api/config'
import {
  buildExportFilename,
  exportExamData as exportExamDataApi,
  downloadBlob,
} from '@/api/export'
import {
  createStudent as createStudentApi,
  fetchStudentList as fetchStudentListApi,
  forceSubmitStudent as forceSubmitStudentApi,
  importStudents as importStudentsApi,
  type StudentCreateRequest,
} from '@/api/student'

import { StudentBatchImportModal } from '../components/StudentBatchImportModal'
import { StudentFormModal } from '../components/StudentFormModal'
import { useExam } from '../contexts/ExamContext'
import { useAuth } from '../hooks/useAuth'
import * as mockAdmin from '../mock/admin'
import type { Student, SubmitStatus } from '../types/admin'

const { Title } = Typography
const { Search } = Input
const { confirm } = Modal

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

export function StudentListPage() {
  const navigate = useNavigate()
  const { currentExam, currentExamId } = useExam()
  const { isSuperAdmin } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [exporting, setExporting] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [batchImportVisible, setBatchImportVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    if (!currentExamId || !isSuperAdmin) {
      setStudents([])
      setFilteredStudents([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = API_CONFIG.USE_MOCK
        ? await mockAdmin.fetchStudentList()
        : await fetchStudentListApi(currentExamId)
      setStudents(data)
      setFilteredStudents(data)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '加载考生列表失败')
    } finally {
      setLoading(false)
    }
  }, [currentExamId, isSuperAdmin])

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

  const handleCreateStudent = async (values: StudentCreateRequest) => {
    if (!currentExamId) {
      message.warning('请先选择考试')
      return
    }

    setSubmitting(true)
    try {
      const result = API_CONFIG.USE_MOCK
        ? await mockAdmin.createStudent(values)
        : await createStudentApi(currentExamId, values)

      if (!result.success) {
        message.error(result.message || '添加考生失败')
        return
      }

      message.success('考生添加成功')
      setCreateModalVisible(false)
      await loadData()
    } finally {
      setSubmitting(false)
    }
  }

  const handleBatchImport = async (values: StudentCreateRequest[]) => {
    if (!currentExamId) {
      message.warning('请先选择考试')
      return
    }

    setSubmitting(true)
    try {
      const result = API_CONFIG.USE_MOCK
        ? await mockAdmin.importStudents(values)
        : await importStudentsApi(currentExamId, values)

      if (!result.success) {
        message.error(result.message || '批量导入失败')
        return
      }

      message.success(`成功导入 ${result.importedCount ?? values.length} 名考生`)
      setBatchImportVisible(false)
      await loadData()
    } finally {
      setSubmitting(false)
    }
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
          const result = API_CONFIG.USE_MOCK
            ? await mockAdmin.forceSubmitStudent(student.id)
            : await forceSubmitStudentApi(student.id)
          if (result.success) {
            message.success(`已成功对 "${student.name}" 强制收卷`)
            loadData()
          } else {
            message.error(result.message || '强制收卷失败')
          }
        } catch {
          message.error('强制收卷失败，请重试')
        }
      },
    })
  }

  const handleExport = async () => {
    if (!currentExamId) return
    setExporting(true)
    try {
      const blob = API_CONFIG.USE_MOCK
        ? await mockAdmin.exportExamData()
        : await exportExamDataApi(currentExamId)
      downloadBlob(blob, buildExportFilename(currentExam?.name))
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
        <Typography.Text copyable className="font-mono">
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
            status === 'in_progress'
              ? 'processing'
              : status === 'submitted'
                ? 'success'
                : status === 'force_submitted'
                  ? 'error'
                  : 'default'
          }
          text={submitStatusMap[status].text}
        />
      ),
      filters: [
        { text: '未开始', value: 'not_started' },
        { text: '进行中', value: 'in_progress' },
        { text: '已交卷', value: 'submitted' },
        { text: '强制收卷', value: 'force_submitted' },
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
          {record.submitStatus === 'in_progress' && (
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

  if (!isSuperAdmin) {
    return <Result status="403" title="无权限访问" subTitle="考生管理仅对超级管理员开放。" />
  }

  if (!currentExamId) {
    return (
      <Empty
        description="请先在顶部选择一个考试，再进行考生管理"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="!mb-0">
          考生管理
        </Title>
        <Space>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            手动添加
          </Button>
          <Button icon={<UploadOutlined />} onClick={() => setBatchImportVisible(true)}>
            批量导入
          </Button>
          <Search
            placeholder="搜索学号/姓名/登陆码"
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            className="w-[250px]"
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

      <Typography.Paragraph type="secondary" className="-mt-2 mb-4">
        当前考试：{currentExam?.name || `考试 ${currentExamId}`}
        。可手动添加单个考生，或按“学号,姓名”格式批量导入。
      </Typography.Paragraph>

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

      <StudentFormModal
        visible={createModalVisible}
        loading={submitting}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={handleCreateStudent}
      />

      <StudentBatchImportModal
        visible={batchImportVisible}
        loading={submitting}
        onCancel={() => setBatchImportVisible(false)}
        onSubmit={handleBatchImport}
      />
    </div>
  )
}
