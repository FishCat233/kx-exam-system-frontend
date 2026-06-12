import { createContext, useContext } from 'react'

import type { WebSocketMessage } from '../../types'

export interface WebSocketContextValue {
  sendMessage: (message: WebSocketMessage) => boolean
  subscribe: (handler: (message: WebSocketMessage) => void) => () => void
  disconnect: () => void
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(null)

export function useWebSocketContext(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext)
  if (!ctx) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider')
  }
  return ctx
}
