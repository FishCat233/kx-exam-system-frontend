import type { ReactNode } from 'react'

import { useExamStore } from '../../store/examStore'

import { useWebSocketContext } from './WebSocketContext'

interface WsGateProps {
  children: ReactNode
}

export function WsGate({ children }: WsGateProps) {
  const wsStatus = useExamStore((state) => state.wsStatus)
  const wsHasConnected = useExamStore((state) => state.wsHasConnected)
  const { reconnect } = useWebSocketContext()

  // 曾连上过即解锁答题；后续断连只提示不锁定
  if (wsHasConnected) {
    return <>{children}</>
  }

  const isFailed = wsStatus === 'failed'

  return (
    <div className="page-center">
      <div className="w-full max-w-md card-base p-8 text-center">
        {isFailed ? (
          <>
            <h1 className="text-xl font-bold text-kx-red">监控连接失败</h1>
            <p className="mt-3 text-sm leading-6 text-kx-subtext">
              未建立监控连接，无法开始答题。请检查网络后重新连接。
            </p>
            <button
              type="button"
              onClick={reconnect}
              className="btn-primary mt-6 px-6 py-2 text-sm"
            >
              重新连接
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-kx-blue border-t-transparent" />
            <h1 className="mt-5 text-xl font-bold text-kx-text">正在建立监控连接</h1>
            <p className="mt-3 text-sm leading-6 text-kx-subtext">
              连接成功后才能开始答题，请稍候。
            </p>
          </>
        )}
      </div>
    </div>
  )
}
