import { useCallback, useEffect, useRef, useState } from 'react'

import { useWebSocketContext } from './WebSocketContext'

export function TabSwitchDetector() {
  const { sendMessage } = useWebSocketContext()
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  const lastTriggerRef = useRef(0)
  const countRef = useRef(0)

  const increment = useCallback(
    (isVisible: boolean, reason: string) => {
      const now = Date.now()
      if (now - lastTriggerRef.current < 500) {
        return
      }
      lastTriggerRef.current = now

      countRef.current += 1
      setTabSwitchCount(countRef.current)

      sendMessage({
        type: 'visibility_change',
        data: {
          is_visible: isVisible,
          reason,
        },
      })

      if (countRef.current >= 2) {
        setShowWarning(true)
      }
    },
    [sendMessage]
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        increment(false, 'visibility_change')
      }
    }

    const handleWindowBlur = () => {
      // 页面已不可见时 blur 只是切屏的伴生事件，交给 visibilitychange 处理，避免重复计数
      if (document.hidden) {
        return
      }
      increment(false, 'window_blur')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [increment])

  if (!showWarning) {
    return null
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] max-w-md">
      <div className="flex overflow-hidden rounded-lg border border-solid border-kx-subtext bg-white">
        <div className="flex min-w-0 flex-1 items-start gap-3 p-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 shrink-0 text-kx-yellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h4 className="m-0 text-sm font-semibold text-kx-text">多次切屏警告</h4>
            </div>
            <p className="mt-1 text-sm leading-5 text-kx-subtext">
              您已切屏 {tabSwitchCount} 次，请专注于考试。继续切屏可能会被强制收卷。
            </p>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            aria-label="关闭警告"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-solid border-kx-subtext text-kx-subtext transition-colors hover:bg-kx-mantle hover:text-kx-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kx-blue"
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
    </div>
  )
}
