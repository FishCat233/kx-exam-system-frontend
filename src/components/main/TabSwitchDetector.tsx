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
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-40 max-w-md">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0"
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
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800">警告：多次切屏检测</h4>
          <p className="text-sm text-yellow-700 mt-1">
            您已切屏 {tabSwitchCount} 次，请专注于考试。继续切屏可能会被强制收卷。
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-yellow-500 hover:text-yellow-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
}
