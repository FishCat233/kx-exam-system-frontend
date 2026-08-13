import { useEffect, useRef, useCallback } from 'react'

import { useExamStore } from '../store/examStore'
import type { WebSocketMessage } from '../types'

interface UseWebSocketOptions {
  url: string
  token?: string
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onReconnectFailed?: () => void
}

const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY_MS = 3000

export function useWebSocket({
  url,
  token,
  onMessage,
  onConnect,
  onDisconnect,
  onReconnectFailed,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const optionsRef = useRef({ onMessage, onConnect, onDisconnect, onReconnectFailed })
  const connectRef = useRef<() => void>(() => {})
  const setWsStatus = useExamStore((state) => state.setWsStatus)
  const setWsHasConnected = useExamStore((state) => state.setWsHasConnected)

  useEffect(() => {
    optionsRef.current = { onMessage, onConnect, onDisconnect, onReconnectFailed }
  })

  const disconnect = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.onerror = null
      wsRef.current.onopen = null
      wsRef.current.onmessage = null
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message))
        return true
      } catch {
        return false
      }
    }
    return false
  }, [])

  useEffect(() => {
    if (!url) {
      return undefined
    }

    const connect = () => {
      if (
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return
      }
      setWsStatus('connecting')

      const wsUrl = token
        ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
        : url

      try {
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          setWsStatus('connected')
          setWsHasConnected(true)
          reconnectCountRef.current = 0
          optionsRef.current.onConnect?.()

          // 启动心跳
          heartbeatRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }))
            }
          }, 30000)
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage

            // 处理 pong 消息
            if (message.type === 'pong') {
              return
            }

            optionsRef.current.onMessage?.(message)
          } catch {
            // 忽略解析错误
          }
        }

        ws.onclose = (event) => {
          optionsRef.current.onDisconnect?.()

          if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current)
            heartbeatRef.current = null
          }

          if (!event.wasClean && reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS) {
            // 自动重连（最多 5 次）
            setWsStatus('disconnected')
            reconnectCountRef.current += 1
            setTimeout(connect, RECONNECT_DELAY_MS)
          } else if (!event.wasClean) {
            // 重连耗尽，通过 HTTP 兜底上报
            setWsStatus('failed')
            optionsRef.current.onReconnectFailed?.()
          } else {
            setWsStatus('disconnected')
          }
        }

        ws.onerror = () => {
          setWsStatus('disconnected')
        }

        wsRef.current = ws
      } catch {
        // 构造异常（如 URL 非法），不会触发 onclose，直接兜底上报
        setWsStatus('failed')
        optionsRef.current.onReconnectFailed?.()
      }
    }

    connectRef.current = connect
    connect()

    return () => {
      disconnect()
    }
  }, [url, token, disconnect, setWsStatus, setWsHasConnected])

  // 手动重连：重置重连计数后重新发起连接
  const reconnect = useCallback(() => {
    reconnectCountRef.current = 0
    connectRef.current()
  }, [])

  return {
    sendMessage,
    disconnect,
    reconnect,
  }
}
