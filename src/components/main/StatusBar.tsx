import { useState, useEffect, useCallback } from 'react'

import { useExamStore } from '../../store/examStore'
import type { WebSocketStatus, ExamStatus } from '../../types'

interface StatusBarProps {
  onRefreshProblems?: () => void
  onSubmit: () => void
  refreshingProblems?: boolean
  submitting?: boolean
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
  if (remainingSeconds < 300) return 'text-red-600'
  if (remainingSeconds < 600) return 'text-orange-500'
  return 'text-blue-600'
}

function WsStatusIcon({ status }: { status: WebSocketStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return { color: 'bg-green-500', animate: '', label: '已连接' }
      case 'connecting':
        return { color: 'bg-yellow-500', animate: 'animate-pulse', label: '连接中' }
      case 'disconnected':
        return { color: 'bg-red-500', animate: 'animate-pulse', label: '已断开' }
      default:
        return { color: 'bg-gray-500', animate: '', label: '未知' }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex items-center gap-2" title={`WebSocket: ${config.label}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.animate}`} />
      <span className="text-xs text-gray-500 hidden sm:inline">{config.label}</span>
    </div>
  )
}

function ExamStatusIcon({ status }: { status: ExamStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ongoing':
        return {
          icon: 'bg-green-500',
          text: '进行中',
          textColor: 'text-green-600',
          animate: '',
        }
      case 'warning':
        return {
          icon: 'bg-yellow-500',
          text: '警告',
          textColor: 'text-yellow-600',
          animate: 'animate-pulse',
        }
      case 'ending':
        return {
          icon: 'bg-red-500',
          text: '即将结束',
          textColor: 'text-red-600',
          animate: 'animate-pulse',
        }
      default:
        return {
          icon: 'bg-gray-500',
          text: '未知',
          textColor: 'text-gray-600',
          animate: '',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${config.icon} ${config.animate}`} />
      <span className={`text-xs font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  )
}

export function StatusBar({
  onRefreshProblems,
  onSubmit,
  refreshingProblems = false,
  submitting = false,
}: StatusBarProps) {
  const endTime = useExamStore((state) => state.endTime)
  const wsStatus = useExamStore((state) => state.wsStatus)
  const examStatus = useExamStore((state) => state.examStatus)

  const [countdown, setCountdown] = useState(() =>
    endTime ? calculateCountdown(endTime) : '00:00:00'
  )
  const [showConfirm, setShowConfirm] = useState(false)

  const updateCountdown = useCallback(() => {
    if (endTime) {
      setCountdown(calculateCountdown(endTime))
    }
  }, [endTime])

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [updateCountdown])

  // 计算剩余秒数用于颜色判断
  const getRemainingSeconds = useCallback(() => {
    if (!endTime) return 0
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    return Math.max(0, Math.floor((end - now) / 1000))
  }, [endTime])

  const remainingSeconds = getRemainingSeconds()
  const countdownColor = getCountdownColor(remainingSeconds)

  const handleSubmitClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirm(false)
    onSubmit()
  }

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
        {/* 左侧：倒计时和状态 */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* 倒计时 */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className={`text-xl lg:text-2xl font-mono font-bold ${countdownColor}`}>
              {countdown}
            </span>
          </div>

          {/* 分隔线 */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* WebSocket 状态 */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-400">连接:</span>
            <WsStatusIcon status={wsStatus} />
          </div>

          {/* 分隔线 */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* 考试状态 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">状态:</span>
            <ExamStatusIcon status={examStatus} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefreshProblems}
            disabled={refreshingProblems || submitting || !onRefreshProblems}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
              refreshingProblems || submitting || !onRefreshProblems
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300'
            }`}
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
            onClick={handleSubmitClick}
            disabled={submitting}
            className={`px-4 lg:px-6 py-2 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
              submitting
                ? 'bg-red-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{submitting ? '交卷中...' : '交卷'}</span>
          </button>
        </div>
      </header>

      {/* 交卷确认弹窗 */}
      {showConfirm && !submitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">确认交卷</h3>
                <p className="text-sm text-gray-500">此操作不可撤销</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">警告：</span>
                交卷后将无法继续答题，请确认已完成所有题目。未保存的代码将不会提交。
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
