import {
  AppstoreOutlined,
  DownloadOutlined,
  FileZipOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  List,
  Divider,
  Steps,
  message,
  Empty,
  Tag,
} from 'antd'
import { useState } from 'react'

import { API_CONFIG } from '@/api/config'
import {
  buildExportFilename,
  downloadBlob,
  exportExamData as exportExamDataApi,
} from '@/api/export'

import { useExam } from '../contexts/ExamContext'
import * as mockAdmin from '../mock/admin'

const { Title, Text, Paragraph } = Typography

export function ExportPage() {
  const { currentExam, currentExamId } = useExam()
  const [exporting, setExporting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleExport = async () => {
    if (!currentExamId) {
      message.warning('请先选择一个考试')
      return
    }

    setExporting(true)
    setCurrentStep(0)

    try {
      setCurrentStep(1)

      const blob = API_CONFIG.USE_MOCK
        ? await mockAdmin.exportExamData()
        : await exportExamDataApi(currentExamId)
      setCurrentStep(2)

      downloadBlob(blob, buildExportFilename(currentExam?.name))
      setCurrentStep(3)
      message.success('阅卷导出已开始下载')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '导出失败，请重试')
      setCurrentStep(0)
    } finally {
      setExporting(false)
    }
  }

  const exportItems = [
    {
      title: '考生信息',
      description: '包含所有考生的学号、姓名、登录时间、交卷时间等基本信息',
      icon: <FileTextOutlined />,
    },
    {
      title: '考生代码',
      description: '所有考生提交的 C 语言代码文件，按考生分类整理',
      icon: <FileZipOutlined />,
    },
    {
      title: '阅卷模板',
      description: '自动生成 grading_template.csv，便于按题录入分数、总分与评语',
      icon: <ReadOutlined />,
    },
    {
      title: '考试元数据与日志',
      description: '包含考生清单、题目清单、操作日志 CSV/JSON 和考试摘要',
      icon: <FileTextOutlined />,
    },
  ]

  const steps = [
    { title: '准备', description: '准备导出数据' },
    { title: '收集', description: '收集考生、题目和日志信息' },
    { title: '打包', description: '生成阅卷 ZIP 压缩包' },
    { title: '完成', description: '浏览器开始下载文件' },
  ]

  return (
    <div>
      <Title level={4} className="mb-6">
        阅卷导出
      </Title>

      <Alert
        message="导出说明"
        description="导出功能将生成一个 ZIP 压缩包，包含阅卷模板、考生清单、题目清单、操作日志以及按考生整理的代码文件。请妥善保管导出文件。"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        className="mb-6"
      />

      {!currentExamId ? (
        <Card className="mb-6">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="请先在顶部选择一个考试，再执行阅卷导出"
          />
        </Card>
      ) : (
        <Card title="当前导出对象" className="mb-6">
          <Space direction="vertical" size="small">
            <Space>
              <Text type="secondary">考试名称：</Text>
              <Text strong>{currentExam?.name || `考试 ${currentExamId}`}</Text>
            </Space>
            <Space>
              <Text type="secondary">考试 ID：</Text>
              <Tag color="blue">{currentExamId}</Tag>
            </Space>
            {currentExam?.subject && (
              <Space>
                <Text type="secondary">考试科目：</Text>
                <Text>{currentExam.subject}</Text>
              </Space>
            )}
          </Space>
        </Card>
      )}

      <Card title="导出内容" className="mb-6">
        <List
          itemLayout="horizontal"
          dataSource={exportItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div
                    className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-2xl"
                  >
                    {item.icon}
                  </div>
                }
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

      {exporting && (
        <Card className="mb-6">
          <Steps current={currentStep} items={steps} />
        </Card>
      )}

      <Card>
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={5}>开始导出</Title>
            <Paragraph type="secondary">
              点击下方按钮后，系统会为当前考试生成一份可直接用于阅卷和归档的 ZIP 文件。
              若考生和题目较多，导出过程可能需要一些时间。
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exporting}
            disabled={!currentExamId}
            block
            className="h-12 text-base"
          >
            {exporting ? '导出中...' : '导出阅卷数据'}
          </Button>

          <Divider />

          <Space direction="vertical" size="small">
            <Text type="secondary">
              <CheckCircleOutlined className="mr-2 text-green-500" />
              导出文件格式：ZIP 压缩包
            </Text>
            <Text type="secondary">
              <CheckCircleOutlined className="mr-2 text-green-500" />
              内含文件：`grading_template.csv`、`students.csv`、`problems.csv`
            </Text>
            <Text type="secondary">
              <CheckCircleOutlined className="mr-2 text-green-500" />
              代码文件格式：按考生目录拆分的 `.c` 源文件
            </Text>
            <Text type="secondary">
              <CheckCircleOutlined className="mr-2 text-green-500" />
              日志文件格式：`operation_logs.csv` 与 `operation_logs.json`
            </Text>
            <Text type="secondary">
              <AppstoreOutlined className="mr-2 text-blue-500" />
              建议先确认顶部已切换到正确考试，再进行导出
            </Text>
          </Space>
        </Space>
      </Card>
    </div>
  )
}
