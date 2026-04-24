import { useState, useEffect, useRef, useCallback } from 'react'

import { useExamStore } from '../store/examStore'
import type { WebSocketMessage } from '../types'

interface UseWebSocketOptions {
  url: string
  token?: string
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export function useWebSocket({
  url,
  token,
  onMessage,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const optionsRef = useRef({ onMessage, onConnect, onDisconnect })
  const setWsStatus = useExamStore((state) => state.setWsStatus)

  useEffect(() => {
    optionsRef.current = { onMessage, onConnect, onDisconnect }
  })

  const disconnect = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
    if (wsRef.current) {
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

      setStatus('connecting')
      setWsStatus('connecting')

      const wsUrl = token
        ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
        : url

      try {
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          setStatus('connected')
          setWsStatus('connected')
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
          setStatus('disconnected')
          setWsStatus('disconnected')
          optionsRef.current.onDisconnect?.()

          if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current)
            heartbeatRef.current = null
          }

          // 自动重连（最多5次）
          if (reconnectCountRef.current < 5 && !event.wasClean) {
            reconnectCountRef.current += 1
            setTimeout(connect, 3000)
          }
        }

        ws.onerror = () => {
          setStatus('disconnected')
          setWsStatus('disconnected')
        }

        wsRef.current = ws
      } catch {
        setStatus('disconnected')
        setWsStatus('disconnected')
      }
    }

    connect()

    return () => {
      disconnect()
    }
  }, [url, token, disconnect, setWsStatus])

  return {
    status,
    sendMessage,
    disconnect,
  }
}
