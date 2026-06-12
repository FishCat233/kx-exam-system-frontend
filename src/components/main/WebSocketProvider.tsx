import type { ReactNode } from 'react'
import { useCallback, useRef } from 'react'

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

  const { sendMessage, disconnect } = useWebSocket({
    url: wsUrl ?? '',
    onMessage: handleMessage,
  })

  const contextValue = { sendMessage, subscribe, disconnect }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}
