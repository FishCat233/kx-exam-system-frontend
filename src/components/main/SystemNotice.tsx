import { useCallback, useEffect, useRef, useState } from 'react'

import type { WebSocketMessage } from '../../types'

import { useWebSocketContext } from './WebSocketContext'

interface Notice {
  id: number
  level: 'info' | 'warning' | 'error'
  title: string
  message: string
}

const LEVEL_CONFIG: Record<
  Notice['level'],
  { accent: string; text: string; iconBg: string; iconColor: string }
> = {
  info: {
    accent: 'bg-kx-blue',
    text: 'text-kx-blue',
    iconBg: 'bg-kx-blue/15',
    iconColor: 'text-kx-blue',
  },
  warning: {
    accent: 'bg-kx-yellow',
    text: 'text-kx-yellow',
    iconBg: 'bg-kx-yellow/15',
    iconColor: 'text-kx-yellow',
  },
  error: {
    accent: 'bg-kx-red',
    text: 'text-kx-red',
    iconBg: 'bg-kx-red/15',
    iconColor: 'text-kx-red',
  },
}

function LevelIcon({ level }: { level: Notice['level'] }) {
  const paths: Record<Notice['level'], string> = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[level]} />
    </svg>
  )
}

let nextId = 1

export function SystemNotice() {
  const { subscribe } = useWebSocketContext()
  const [notices, setNotices] = useState<Notice[]>([])
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setNotices((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotice = useCallback(
    (notice: Omit<Notice, 'id'>) => {
      const id = nextId++
      setNotices((prev) => {
        const duplicated = prev.find((n) => n.message === notice.message)
        if (duplicated) {
          const oldTimer = timersRef.current.get(duplicated.id)
          if (oldTimer) {
            clearTimeout(oldTimer)
            timersRef.current.delete(duplicated.id)
          }
        }
        const filtered = prev.filter((n) => n.message !== notice.message)
        return [...filtered, { ...notice, id }]
      })

      // 自动消失（error 不自动消）
      if (notice.level !== 'error') {
        const timer = setTimeout(() => dismiss(id), 6000)
        timersRef.current.set(id, timer)
      }
    },
    [dismiss]
  )

  useEffect(() => {
    const timers = timersRef.current
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
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
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
          <div
            key={notice.id}
            className="flex overflow-hidden rounded-lg border border-kx-surface1 bg-white"
          >
            <div className={`w-1.5 shrink-0 ${config.accent}`} />
            <div className="flex flex-1 items-start gap-3 p-4">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
              >
                <span className={config.iconColor}>
                  <LevelIcon level={notice.level} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-semibold ${config.text}`}>{notice.title}</div>
                <p className="mt-0.5 text-sm leading-5 text-kx-subtext">{notice.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(notice.id)}
                aria-label="关闭通知"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-kx-subtext transition-colors hover:bg-kx-mantle hover:text-kx-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kx-blue"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
