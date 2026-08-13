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

function getStatusConfig(status?: string): { text: string; className: string } {
  switch (status) {
    case 'ongoing':
      return { text: '进行中', className: 'border-kx-green text-kx-green' }
    case 'not_started':
      return { text: '未开始', className: 'border-kx-blue text-kx-blue' }
    case 'ended':
      return { text: '已结束', className: 'border-kx-subtext text-kx-subtext' }
    default:
      return { text: '待确认', className: 'border-kx-surface1 text-kx-subtext' }
  }
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
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
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-kx-text">{examInfo.name}</h2>
          <p className="mt-1 text-sm text-kx-subtext">{examInfo.subject}</p>
        </div>
        <span
          className={`shrink-0 rounded-md border bg-white px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.text}
        </span>
      </div>

      {(examInfo.status === 'ongoing' || examInfo.status === 'not_started') && countdown > 0 && (
        <div className="mt-4 border-t border-kx-surface0 pt-4">
          <span className="text-sm text-kx-subtext">
            {examInfo.status === 'ongoing' ? '剩余时间' : '距离开始'}
          </span>
          <div className="data-mono mt-1 text-2xl font-bold text-kx-blue">
            {formatCountdown(countdown)}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3 border-t border-kx-surface0 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="shrink-0 text-xs text-kx-subtext">时长</span>
          <span className="data-mono text-sm font-medium text-kx-text">
            {examInfo.duration} 分钟
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="shrink-0 text-xs text-kx-subtext">开始</span>
          <span className="data-mono text-sm font-medium text-kx-text">
            {formatDateTime(examInfo.startTime)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="shrink-0 text-xs text-kx-subtext">结束</span>
          <span className="data-mono text-sm font-medium text-kx-text">
            {formatDateTime(examInfo.endTime)}
          </span>
        </div>
      </div>
    </section>
  )
}

export default ExamInfoCard
