import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { CodeEditor } from '../../components/main/CodeEditor'
import { ProblemContent } from '../../components/main/ProblemContent'
import { ProblemNav } from '../../components/main/ProblemNav'
import { StatusBar } from '../../components/main/StatusBar'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useExamStore } from '../../store/examStore'
import type { Problem, WebSocketMessage } from '../../types'

// 模拟题目数据
const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1,
    examId: 1,
    title: 'Hello World',
    content: `## 题目描述
编写一个程序，输出 "Hello, World!"。

## 输入格式
无输入

## 输出格式
输出一行，内容为 "Hello, World!"

## 示例
**输入**
\`\`\`
\`\`\`

**输出**
\`\`\`
Hello, World!
\`\`\``,
    orderNum: 1,
  },
  {
    id: 2,
    examId: 1,
    title: '两数之和',
    content: `## 题目描述
给定两个整数 a 和 b，输出它们的和。

## 输入格式
一行，包含两个整数 a 和 b。

## 输出格式
一个整数，表示 a + b 的结果。

## 示例
**输入**
\`\`\`
3 5
\`\`\`

**输出**
\`\`\`
8
\`\`\``,
    orderNum: 2,
  },
  {
    id: 3,
    examId: 1,
    title: '判断奇偶',
    content: `## 题目描述
给定一个整数 n，判断它是奇数还是偶数。

## 输入格式
一个整数 n。

## 输出格式
如果 n 是偶数，输出 "even"；如果是奇数，输出 "odd"。

## 示例
**输入**
\`\`\`
4
\`\`\`

**输出**
\`\`\`
even
\`\`\``,
    orderNum: 3,
  },
]

// 模拟考试结束时间（2小时后）
const MOCK_END_TIME = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

export function MainPage() {
  const navigate = useNavigate()

  // 从 store 获取状态和方法
  const setProblems = useExamStore((state) => state.setProblems)
  const setEndTime = useExamStore((state) => state.setEndTime)
  const setCurrentProblemId = useExamStore((state) => state.setCurrentProblemId)
  const markSaving = useExamStore((state) => state.markSaving)
  const markSaved = useExamStore((state) => state.markSaved)
  const setExamStatus = useExamStore((state) => state.setExamStatus)
  const incrementTabSwitchCount = useExamStore((state) => state.incrementTabSwitchCount)
  const tabSwitchCount = useExamStore((state) => state.tabSwitchCount)

  // 本地状态
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false)
  const sendMessageRef = useRef<((message: WebSocketMessage) => boolean) | undefined>(undefined)

  // 初始化数据
  useEffect(() => {
    setProblems(MOCK_PROBLEMS)
    setEndTime(MOCK_END_TIME)
  }, [setProblems, setEndTime])

  // 处理交卷
  const handleSubmit = useCallback(() => {
    sendMessageRef.current?.({
      type: 'submit_exam',
      data: { submit_time: new Date().toISOString() },
    })

    // 退出全屏
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }

    navigate('/submitted')
  }, [navigate])

  // 处理 WebSocket 消息
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case 'exam_status': {
          if (message.data && typeof message.data === 'object') {
            const data = message.data as { status?: string; remainingTime?: number }
            if (data.remainingTime !== undefined) {
              if (data.remainingTime < 300) {
                setExamStatus('ending')
              } else if (data.remainingTime < 600) {
                setExamStatus('warning')
              } else {
                setExamStatus('ongoing')
              }
            }
          }
          break
        }
        case 'warning': {
          if (message.data && typeof message.data === 'object') {
            const data = message.data as { message?: string }
            alert(`警告: ${data.message || '您有违规行为'}`)
          }
          break
        }
        case 'force_submit': {
          if (message.data && typeof message.data === 'object') {
            const data = message.data as { reason?: string }
            alert(`强制收卷: ${data.reason || '因违规被强制收卷'}`)
            handleSubmit()
          }
          break
        }
        default:
          break
      }
    },
    [handleSubmit, setExamStatus]
  )

  // WebSocket 连接
  const { sendMessage } = useWebSocket({
    url: 'ws://localhost:8000/ws',
    token: 'mock_token',
    onMessage: handleWebSocketMessage,
  })

  // 保存 sendMessage 到 ref
  useEffect(() => {
    sendMessageRef.current = sendMessage
  }, [sendMessage])

  // 处理题目切换
  const handleSelectProblem = useCallback(
    (problemId: number) => {
      setCurrentProblemId(problemId)
    },
    [setCurrentProblemId]
  )

  // 处理代码保存
  const handleSaveCode = useCallback(
    (problemId: number, _code: string) => {
      markSaving(problemId)

      // 模拟保存到后端
      setTimeout(() => {
        markSaved(problemId)

        // 发送保存通知到 WebSocket
        sendMessageRef.current?.({
          type: 'code_save',
          data: { problem_id: problemId, saved_at: new Date().toISOString() },
        })
      }, 500)
    },
    [markSaving, markSaved]
  )

  // 切屏检测
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden

      if (!isVisible) {
        // 切屏次数+1
        incrementTabSwitchCount()

        // 发送切屏事件到 WebSocket
        sendMessageRef.current?.({
          type: 'visibility_change',
          data: { is_visible: false, timestamp: new Date().toISOString() },
        })

        // 多次切屏显示警告
        if (tabSwitchCount >= 2) {
          setShowTabSwitchWarning(true)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [incrementTabSwitchCount, tabSwitchCount])

  // 全屏检测
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement
      setIsFullscreen(isFS)

      sendMessageRef.current?.({
        type: 'fullscreen_change',
        data: { is_fullscreen: isFS, timestamp: new Date().toISOString() },
      })
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 页面加载时进入全屏
  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* 状态栏 */}
      <StatusBar onSubmit={handleSubmit} />

      {/* 主内容区 */}
      <div className="flex-1 flex min-h-0">
        {/* 左侧：题目区 */}
        <div className="flex w-1/2 min-w-0 border-r border-gray-200">
          <ProblemNav onSelectProblem={handleSelectProblem} />
          <ProblemContent />
        </div>

        {/* 右侧：代码编辑区 */}
        <div className="w-1/2 min-w-0">
          <CodeEditor onSave={handleSaveCode} />
        </div>
      </div>

      {/* 全屏退出提示层 */}
      {!isFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
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
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">全屏模式已退出</h3>
            <p className="text-gray-600 mb-6">您已退出全屏模式，请立即恢复全屏以继续考试。</p>
            <button
              onClick={() => document.documentElement.requestFullscreen().catch(() => {})}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              恢复全屏
            </button>
          </div>
        </div>
      )}

      {/* 切屏警告提示 */}
      {showTabSwitchWarning && (
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
              onClick={() => setShowTabSwitchWarning(false)}
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
      )}
    </div>
  )
}
