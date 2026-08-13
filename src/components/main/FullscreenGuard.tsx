import { useCallback, useEffect, useState } from 'react'

import { requestFullscreenMode } from '@/utils/fullscreen'

import { useWebSocketContext } from './WebSocketContext'

export function FullscreenGuard() {
  const { sendMessage } = useWebSocketContext()
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))
  const [restoring, setRestoring] = useState(false)
  const [restoreError, setRestoreError] = useState<string | null>(null)

  const restoreFullscreen = useCallback(async () => {
    setRestoring(true)
    setRestoreError(null)
    try {
      await requestFullscreenMode()
    } catch (error) {
      setRestoreError(
        error instanceof Error ? error.message : '恢复全屏失败，请重试或联系监考老师。'
      )
    } finally {
      setRestoring(false)
    }
  }, [])

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement
      setIsFullscreen(isFS)
      if (isFS) {
        setRestoreError(null)
      }

      sendMessage({
        type: 'fullscreen_change',
        data: { is_fullscreen: isFS, timestamp: new Date().toISOString() },
      })
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [sendMessage])

  // F11 拦截：浏览器窗口全屏对 Fullscreen API 不可见，统一重定向为 API 全屏
  useEffect(() => {
    const handleF11Keydown = (event: KeyboardEvent) => {
      if (event.code !== 'F11') {
        return
      }
      event.preventDefault()
      if (!document.fullscreenElement && !restoring) {
        void restoreFullscreen()
      }
    }

    window.addEventListener('keydown', handleF11Keydown)
    return () => {
      window.removeEventListener('keydown', handleF11Keydown)
    }
  }, [restoreFullscreen, restoring])

  if (isFullscreen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-kx-red px-6">
      <svg
        className="h-28 w-28 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="m-0 text-center text-6xl font-black tracking-wider text-white">
        全屏模式已退出
      </h3>
      <p className="text-center text-xl font-medium text-white/90">
        您已退出全屏模式，请立即恢复全屏以继续考试。
      </p>

      {restoreError && (
        <div className="rounded-md bg-kx-dark/70 px-4 py-2 text-base font-bold text-white">
          {restoreError}
        </div>
      )}

      <button
        onClick={() => void restoreFullscreen()}
        disabled={restoring}
        className="mt-2 rounded-md bg-white px-10 py-4 text-xl font-black text-kx-red transition-colors hover:bg-kx-mantle disabled:bg-kx-mantle disabled:text-kx-subtext"
      >
        {restoring ? '恢复中...' : '恢复全屏'}
      </button>
    </div>
  )
}
