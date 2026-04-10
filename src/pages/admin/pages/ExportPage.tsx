import {
  DownloadOutlined,
  FileZipOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { Card, Button, Typography, Space, Alert, List, Divider, Steps, message } from 'antd'
import { useState } from 'react'

import { exportExamData } from '../mock/admin'

const { Title, Text, Paragraph } = Typography

export function ExportPage() {
  const [exporting, setExporting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleExport = async () => {
    setExporting(true)
    setCurrentStep(1)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentStep(2)

      const blob = await exportExamData()
      setCurrentStep(3)

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `考试数据_${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setCurrentStep(4)
      message.success('导出成功！')
    } catch {
      message.error('导出失败，请重试')
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
      title: '操作日志',
      description: '考试期间的所有操作记录，包括切屏、全屏切换等异常行为',
      icon: <FileTextOutlined />,
    },
  ]

  const steps = [
    { title: '准备', description: '准备导出数据' },
    { title: '收集', description: '收集考生信息' },
    { title: '打包', description: '打包代码文件' },
    { title: '下载', description: '开始下载' },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        阅卷导出
      </Title>

      <Alert
        message="导出说明"
        description="导出功能将生成一个 ZIP 压缩包，包含所有考生的基本信息、提交的代码文件以及操作日志。请妥善保管导出文件。"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Card title="导出内容" style={{ marginBottom: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={exportItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: '#f0f5ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1890ff',
                      fontSize: 24,
                    }}
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
        <Card style={{ marginBottom: 24 }}>
          <Steps current={currentStep} items={steps} />
        </Card>
      )}

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={5}>开始导出</Title>
            <Paragraph type="secondary">
              点击下方的导出按钮，系统将自动收集并打包所有考试数据。
              导出过程可能需要一些时间，请耐心等待。
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exporting}
            block
            style={{ height: 48, fontSize: 16 }}
          >
            {exporting ? '导出中...' : '导出考试数据'}
          </Button>

          <Divider />

          <Space direction="vertical" size="small">
            <Text type="secondary">
              <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              导出文件格式：ZIP 压缩包
            </Text>
            <Text type="secondary">
              <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              代码文件格式：.c 源文件
            </Text>
            <Text type="secondary">
              <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              日志文件格式：JSON / CSV
            </Text>
          </Space>
        </Space>
      </Card>
    </div>
  )
}
