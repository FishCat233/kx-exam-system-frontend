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
        error instanceof Error ? error.message : '恢复全屏失败，请手动按 F11 进入全屏。'
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

  if (isFullscreen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
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
        <h3 className="text-xl font-bold text-slate-800 mb-2">全屏模式已退出</h3>
        <p className="text-slate-600 mb-4">您已退出全屏模式，请立即恢复全屏以继续考试。</p>

        {restoreError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {restoreError}
          </div>
        )}

        <button
          onClick={() => void restoreFullscreen()}
          disabled={restoring}
          className="btn-primary px-6 py-2"
        >
          {restoring ? '恢复中...' : '恢复全屏'}
        </button>
      </div>
    </div>
  )
}
