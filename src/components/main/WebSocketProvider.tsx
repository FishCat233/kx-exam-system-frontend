import type { ReactNode } from 'react'
import { useCallback, useRef } from 'react'

import { reportWsFailure } from '../../api/studentWs'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useExamStore } from '../../store/examStore'
import type { WebSocketMessage } from '../../types'

import { WebSocketContext } from './WebSocketContext'

type MessageHandler = (message: WebSocketMessage) => void

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const wsUrl = useExamStore((state) => state.wsUrl)

  const handlersRef = useRef<Set<MessageHandler>>(new Set())

  const subscribe = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler)
    return () => {
      handlersRef.current.delete(handler)
    }
  }, [])

  const handleMessage = useCallback((message: WebSocketMessage) => {
    for (const handler of handlersRef.current) {
      handler(message)
    }
  }, [])

  // WS 连不上时通过 HTTP 兜底上报，让后台能看到 critical 日志
  const handleReconnectFailed = useCallback(() => {
    reportWsFailure('重连失败').catch(() => {
      // 上报失败无计可施，静默忽略
    })
  }, [])

  const { sendMessage, disconnect, reconnect } = useWebSocket({
    url: wsUrl ?? '',
    onMessage: handleMessage,
    onReconnectFailed: handleReconnectFailed,
  })

  const contextValue = { sendMessage, subscribe, disconnect, reconnect }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}
