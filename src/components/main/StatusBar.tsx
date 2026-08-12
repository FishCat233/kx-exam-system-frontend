import { useState, useEffect, useCallback } from 'react'

import { StatusDot } from '../../components/ui'
import { useExamStore } from '../../store/examStore'
import type { WebSocketStatus, ExamStatus } from '../../types'

interface StatusBarProps {
  onRefreshProblems?: () => void
  refreshingProblems?: boolean
}

function calculateCountdown(endTime: string): string {
  const end = new Date(endTime).getTime()
  const now = new Date().getTime()
  const diff = end - now

  if (diff <= 0) {
    return '00:00:00'
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function getCountdownColor(remainingSeconds: number): string {
  if (remainingSeconds < 300) return 'text-kx-red'
  if (remainingSeconds < 600) return 'text-kx-yellow'
  return 'text-kx-blue'
}

const wsColorMap: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  connected: 'green',
  connecting: 'yellow',
  disconnected: 'red',
}

const examColorMap: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  ongoing: 'green',
  warning: 'yellow',
  ending: 'red',
}

function WsStatusIcon({ status }: { status: WebSocketStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return { label: '已连接', animate: false }
      case 'connecting':
        return { label: '连接中', animate: true }
      case 'disconnected':
        return { label: '已断开', animate: true }
      default:
        return { label: '未知', animate: false }
    }
  }

  const config = getStatusConfig()
  const color = wsColorMap[status] ?? 'gray'

  return (
    <div className="flex items-center gap-2" title={`WebSocket: ${config.label}`}>
      <StatusDot color={color} animate={config.animate} />
      <span className="text-xs text-kx-text hidden sm:inline">{config.label}</span>
    </div>
  )
}

function ExamStatusIcon({ status }: { status: ExamStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ongoing':
        return { text: '进行中', animate: false }
      case 'warning':
        return { text: '警告', animate: true }
      case 'ending':
        return { text: '即将结束', animate: true }
      default:
        return { text: '未知', animate: false }
    }
  }

  const config = getStatusConfig()
  const color = examColorMap[status] ?? 'gray'

  return (
    <div className="flex items-center gap-2">
      <StatusDot color={color} animate={config.animate} />
      <span className="text-xs font-medium text-kx-text hidden sm:inline">{config.text}</span>
    </div>
  )
}

export function StatusBar({ onRefreshProblems, refreshingProblems = false }: StatusBarProps) {
  const endTime = useExamStore((state) => state.endTime)
  const wsStatus = useExamStore((state) => state.wsStatus)
  const examStatus = useExamStore((state) => state.examStatus)
  const pendingSubmit = useExamStore((state) => state.pendingSubmit)
  const setPendingSubmit = useExamStore((state) => state.setPendingSubmit)

  const [countdown, setCountdown] = useState(() =>
    endTime ? calculateCountdown(endTime) : '00:00:00'
  )

  const updateCountdown = useCallback(() => {
    if (endTime) {
      setCountdown(calculateCountdown(endTime))
    }
  }, [endTime])

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [updateCountdown])

  const getRemainingSeconds = useCallback(() => {
    if (!endTime) return 0
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    return Math.max(0, Math.floor((end - now) / 1000))
  }, [endTime])

  const remainingSeconds = getRemainingSeconds()
  const countdownColor = getCountdownColor(remainingSeconds)

  const isSubmitting = pendingSubmit
  const buttonsDisabled = refreshingProblems || isSubmitting || !onRefreshProblems

  return (
    <header className="h-16 shrink-0 bg-white border-b border-kx-surface0 grid grid-cols-3 items-center px-4 lg:px-6">
      <div className="flex items-center gap-4 lg:gap-6 justify-self-start">
        <div className="flex items-center gap-2">
          <span className="text-xs text-kx-subtext hidden sm:inline">连接</span>
          <WsStatusIcon status={wsStatus} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-kx-subtext hidden sm:inline">状态</span>
          <ExamStatusIcon status={examStatus} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-wide text-kx-subtext">剩余时间</span>
        <span className={`data-mono text-2xl lg:text-3xl font-bold leading-none ${countdownColor}`}>
          {countdown}
        </span>
      </div>

      <div className="flex items-center gap-2 justify-self-end">
        <button
          type="button"
          onClick={onRefreshProblems}
          disabled={buttonsDisabled}
          className="btn-outline px-3 py-2 text-sm flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${refreshingProblems ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m14.836 2A8.001 8.001 0 005.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-14.84-2m14.84 2H15"
            />
          </svg>
          <span>{refreshingProblems ? '刷新中...' : '刷新题目'}</span>
        </button>

        <button
          onClick={() => setPendingSubmit(true)}
          disabled={isSubmitting}
          className="btn-danger px-4 lg:px-6 py-2 text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{isSubmitting ? '交卷中...' : '交卷'}</span>
        </button>
      </div>
    </header>
  )
}
