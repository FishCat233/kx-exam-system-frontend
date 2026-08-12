import { useEffect, useState } from 'react'

import type { ExamInfo } from '../../types'

interface ExamInfoCardProps {
  examInfo: ExamInfo
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusConfig(status?: string): { text: string; className: string; dotColor: string } {
  switch (status) {
    case 'ongoing':
      return {
        text: '进行中',
        className: 'bg-green-50 text-green-700 border-green-200',
        dotColor: 'bg-green-500',
      }
    case 'not_started':
      return {
        text: '未开始',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-500',
      }
    case 'ended':
      return {
        text: '已结束',
        className: 'bg-slate-100 text-slate-600 border-slate-200',
        dotColor: 'bg-slate-400',
      }
    default:
      return {
        text: '待确认',
        className: 'bg-slate-50 text-slate-600 border-slate-200',
        dotColor: 'bg-slate-400',
      }
  }
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '已结束'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`
  }
  return `${secs}秒`
}

function ExamInfoCard({ examInfo }: ExamInfoCardProps) {
  const status = getStatusConfig(examInfo.status)
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    const calculateCountdown = () => {
      if (examInfo.status === 'ongoing') {
        const endTime = new Date(examInfo.endTime).getTime()
        const now = Date.now()
        const diff = Math.max(0, Math.floor((endTime - now) / 1000))
        setCountdown(diff)
      } else if (examInfo.status === 'not_started') {
        const startTime = new Date(examInfo.startTime).getTime()
        const now = Date.now()
        const diff = Math.max(0, Math.floor((startTime - now) / 1000))
        setCountdown(diff)
      }
    }

    calculateCountdown()
    const timer = window.setInterval(calculateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [examInfo])

  return (
    <div className="card-base p-6 shadow-xl shadow-slate-200/50">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900">{examInfo.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{examInfo.subject}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dotColor}`} />
          {status.text}
        </span>
      </div>

      {(examInfo.status === 'ongoing' || examInfo.status === 'not_started') && countdown > 0 && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              {examInfo.status === 'ongoing' ? '剩余时间' : '距离开始'}
            </span>
            <span className="text-lg font-bold text-blue-600">{formatCountdown(countdown)}</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <svg
              className="h-4 w-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-slate-500">时长</span>
            <span className="ml-2 font-medium text-slate-900">{examInfo.duration} 分钟</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <svg
              className="h-4 w-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-slate-500">开始</span>
            <span className="ml-2 font-medium text-slate-900">
              {formatDateTime(examInfo.startTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <svg
              className="h-4 w-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="10" y1="14" x2="14" y2="18" />
              <line x1="14" y1="14" x2="10" y2="18" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-slate-500">结束</span>
            <span className="ml-2 font-medium text-slate-900">
              {formatDateTime(examInfo.endTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamInfoCard
