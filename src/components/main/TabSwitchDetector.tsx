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
    if (!showWarning) return
    const timer = setTimeout(() => setShowWarning(false), 10000)
    return () => clearTimeout(timer)
  }, [showWarning, tabSwitchCount])

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
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-kx-red">
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
      <h4 className="m-0 text-center text-6xl font-black tracking-wider text-white">切屏警告</h4>
      <p className="mt-1 text-center text-xl font-medium text-white/90">
        您已切屏 {tabSwitchCount} 次，请专注于考试。继续切屏可能会被强制收卷。
      </p>
    </div>
  )
}
