import { useState } from 'react'

import { useExamStore } from '../../store/examStore'

import { useWebSocketContext } from './WebSocketContext'

function WarningIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}

export function WsReconnectNotice() {
  const wsStatus = useExamStore((state) => state.wsStatus)
  const wsHasConnected = useExamStore((state) => state.wsHasConnected)
  const { reconnect } = useWebSocketContext()
  const [dismissed, setDismissed] = useState(false)
  const [prevStatus, setPrevStatus] = useState(wsStatus)

  // 重连成功后允许下次断连再次提示
  if (prevStatus !== wsStatus) {
    setPrevStatus(wsStatus)
    if (wsStatus === 'connected') {
      setDismissed(false)
    }
  }

  // 从未连上的场景由 WsGate 遮罩负责，这里只提示考试中途断连
  if (!wsHasConnected || wsStatus === 'connected' || wsStatus === 'connecting' || dismissed) {
    return null
  }

  const isFailed = wsStatus === 'failed'
  const accentClass = isFailed
    ? 'border-kx-red bg-kx-red/10 text-kx-red'
    : 'border-kx-yellow bg-kx-yellow/10 text-kx-yellow'
  const title = isFailed ? '监控连接失败' : '监控连接中断，正在重连'
  const message = isFailed
    ? '切屏与全屏监控已失效，答题不受影响，交卷时系统会记录异常。'
    : '切屏与全屏监控暂时失效，答题与交卷不受影响。'

  return (
    <div className="fixed left-1/2 top-20 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2">
      <div
        className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${accentClass}`}
        role="alert"
      >
        <WarningIcon />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{title}</div>
          <p className="mt-0.5 text-sm leading-5 opacity-80">{message}</p>
          {isFailed && (
            <button
              type="button"
              onClick={reconnect}
              className="mt-2 rounded px-2 py-1 text-xs font-medium ring-1 ring-current transition-colors hover:opacity-70"
            >
              重新连接
            </button>
          )}
        </div>
        {isFailed && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="关闭提示"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors hover:opacity-70"
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
        )}
      </div>
    </div>
  )
}
