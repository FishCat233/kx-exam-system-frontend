import { useCallback, useEffect, useRef, useState } from 'react'

import type { WebSocketMessage } from '../../types'

import { useWebSocketContext } from './WebSocketContext'

interface Notice {
  id: number
  level: 'info' | 'warning' | 'error'
  title: string
  message: string
}

const LEVEL_CONFIG: Record<Notice['level'], { bg: string; icon: string; titleColor: string }> = {
  info: {
    bg: 'border-blue-200 bg-blue-50',
    icon: 'text-blue-500',
    titleColor: 'text-blue-600',
  },
  warning: {
    bg: 'border-yellow-200 bg-yellow-50',
    icon: 'text-yellow-500',
    titleColor: 'text-yellow-700',
  },
  error: {
    bg: 'border-red-200 bg-red-50',
    icon: 'text-red-500',
    titleColor: 'text-red-600',
  },
}

let nextId = 1

export function SystemNotice() {
  const { subscribe } = useWebSocketContext()
  const [notices, setNotices] = useState<Notice[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback((id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotice = useCallback((notice: Omit<Notice, 'id'>) => {
    const id = nextId++
    setNotices((prev) => {
      const filtered = prev.filter((n) => n.message !== notice.message)
      return [...filtered, { ...notice, id }]
    })

    // 自动消失（error 不自动消）
    if (notice.level !== 'error') {
      timerRef.current = setTimeout(() => {
        setNotices((prev) => prev.filter((n) => n.id !== id))
      }, 6000)
    }
  }, [])

  useEffect(() => {
    const unsub = subscribe((message: WebSocketMessage) => {
      switch (message.type) {
        case 'warning': {
          const data = message.data as { message?: string } | undefined
          addNotice({
            level: 'warning',
            title: '系统警告',
            message: data?.message || '系统检测到异常行为，请立即恢复考试状态。',
          })
          break
        }
        case 'notification': {
          const data = message.data as { message?: string } | undefined
          if (data?.message) {
            addNotice({ level: 'info', title: '系统通知', message: data.message })
          }
          break
        }
        case 'new_problem': {
          const data = message.data as { message?: string; problem_title?: string } | undefined
          addNotice({
            level: 'info',
            title: '新题目',
            message: data?.message || '有新题目添加，请刷新题目列表。',
          })
          break
        }
        default:
          break
      }
    })

    return () => {
      unsub()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [subscribe, addNotice])

  if (notices.length === 0) {
    return null
  }

  return (
    <div className="fixed right-4 top-20 z-40 flex flex-col gap-2 w-[min(420px,calc(100vw-2rem))]">
      {notices.map((notice) => {
        const config = LEVEL_CONFIG[notice.level]
        return (
          <div key={notice.id} className={`rounded-2xl border p-4 shadow-xl ${config.bg}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`text-sm font-semibold ${config.titleColor}`}>{notice.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{notice.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(notice.id)}
                className="text-slate-400 transition hover:text-slate-600"
              >
                ×
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
