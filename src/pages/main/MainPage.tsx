import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import screenfull from 'screenfull'

import { fetchStudentCode, saveStudentCode, submitStudentExam } from '@/api'
import { fetchPublicExamDetail } from '@/api/studentExam'

import { CodeEditor } from '../../components/main/CodeEditor'
import { ProblemContent } from '../../components/main/ProblemContent'
import { ProblemNav } from '../../components/main/ProblemNav'
import { StatusBar } from '../../components/main/StatusBar'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useExamStore } from '../../store/examStore'
import type { StudentExamSession, WebSocketMessage } from '../../types'
import {
  clearStudentSession,
  getStudentSession,
  saveStudentSession,
} from '../../utils/studentSession'

interface SystemNotice {
  level: 'info' | 'warning' | 'error'
  message: string
}

function getExamUiStatus(endTime: string): 'ongoing' | 'warning' | 'ending' {
  const remainingMs = new Date(endTime).getTime() - Date.now()
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  if (remainingSeconds < 300) {
    return 'ending'
  }
  if (remainingSeconds < 600) {
    return 'warning'
  }
  return 'ongoing'
}

async function requestFullscreenMode(): Promise<void> {
  if (screenfull.isEnabled) {
    await screenfull.request(document.documentElement)
    return
  }

  if (document.documentElement.requestFullscreen) {
    await document.documentElement.requestFullscreen()
    return
  }

  throw new Error('当前浏览器不支持全屏模式')
}

async function exitFullscreenMode(): Promise<void> {
  if (screenfull.isEnabled && screenfull.isFullscreen) {
    await screenfull.exit()
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}

export function MainPage() {
  const navigate = useNavigate()

  // 从 store 获取状态和方法
  const examInfo = useExamStore((state) => state.examInfo)
  const problems = useExamStore((state) => state.problems)
  const codes = useExamStore((state) => state.codes)
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const setExamInfo = useExamStore((state) => state.setExamInfo)
  const setProblems = useExamStore((state) => state.setProblems)
  const syncProblems = useExamStore((state) => state.syncProblems)
  const setEndTime = useExamStore((state) => state.setEndTime)
  const setCurrentProblemId = useExamStore((state) => state.setCurrentProblemId)
  const markSaving = useExamStore((state) => state.markSaving)
  const markSaved = useExamStore((state) => state.markSaved)
  const clearSaving = useExamStore((state) => state.clearSaving)
  const hydrateCodes = useExamStore((state) => state.hydrateCodes)
  const setExamStatus = useExamStore((state) => state.setExamStatus)
  const incrementTabSwitchCount = useExamStore((state) => state.incrementTabSwitchCount)
  const tabSwitchCount = useExamStore((state) => state.tabSwitchCount)
  const reset = useExamStore((state) => state.reset)

  // 本地状态
  const [session, setSession] = useState<StudentExamSession | null>(null)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [refreshingProblems, setRefreshingProblems] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [systemNotice, setSystemNotice] = useState<SystemNotice | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false)
  const [restoringFullscreen, setRestoringFullscreen] = useState(false)
  const sendMessageRef = useRef<((message: WebSocketMessage) => boolean) | undefined>(undefined)
  const disconnectRef = useRef<(() => void) | undefined>(undefined)
  const handlingForceSubmitRef = useRef(false)

  const restoreFullscreen = useCallback(async () => {
    setRestoringFullscreen(true)
    try {
      await requestFullscreenMode()
      setSystemNotice(null)
    } catch (error) {
      setSystemNotice({
        level: 'error',
        message: error instanceof Error ? error.message : '恢复全屏失败',
      })
    } finally {
      setRestoringFullscreen(false)
    }
  }, [])

  const leaveExam = useCallback(
    async ({
      forced,
      reason,
      submitTime,
    }: {
      forced: boolean
      reason?: string
      submitTime: string
    }) => {
      clearStudentSession()
      reset()
      try {
        await exitFullscreenMode()
      } catch {
        // 忽略退出全屏失败
      }

      navigate('/submitted', {
        replace: true,
        state: {
          forced,
          reason,
          submitTime,
          examName: examInfo?.name ?? session?.examInfo.name ?? '考试',
        },
      })
    },
    [examInfo?.name, navigate, reset, session?.examInfo.name]
  )

  const saveAllCodes = useCallback(async () => {
    const tasks = Array.from(codes.entries()).map(async ([problemId, codeState]) => {
      markSaving(problemId)
      try {
        const result = await saveStudentCode(problemId, codeState.code)
        markSaved(problemId, result.savedAt)
        sendMessageRef.current?.({
          type: 'code_save',
          data: { problem_id: problemId, saved_at: result.savedAt },
        })
      } catch (error) {
        clearSaving(problemId)
        throw error
      }
    })

    await Promise.all(tasks)
  }, [clearSaving, codes, markSaved, markSaving])

  const refreshProblemList = useCallback(async () => {
    if (!session) {
      return
    }

    setRefreshingProblems(true)
    setPageError(null)

    try {
      const examDetail = await fetchPublicExamDetail(session.examInfo.id)
      const nextProblems = examDetail.problems.length > 0 ? examDetail.problems : session.problems
      const existingProblemIds = new Set(problems.map((problem) => problem.id))
      const newProblemIds = nextProblems
        .filter((problem) => !existingProblemIds.has(problem.id))
        .map((problem) => problem.id)

      setExamInfo(examDetail.examInfo)
      syncProblems(nextProblems)
      setEndTime(examDetail.examInfo.endTime)
      setExamStatus(getExamUiStatus(examDetail.examInfo.endTime))

      if (newProblemIds.length > 0) {
        const snapshots = await Promise.all(
          newProblemIds.map(async (problemId) => {
            const result = await fetchStudentCode(problemId)
            return {
              problemId,
              code: result.code,
              savedAt: result.savedAt,
            }
          })
        )
        hydrateCodes(snapshots)
      }

      const nextSession: StudentExamSession = {
        ...session,
        examInfo: examDetail.examInfo,
        problems: nextProblems,
      }
      setSession(nextSession)
      saveStudentSession(nextSession)

      setSystemNotice({
        level: 'info',
        message:
          newProblemIds.length > 0
            ? `题目列表已刷新，新增 ${newProblemIds.length} 道题目。`
            : '题目列表已刷新。',
      })
    } catch (error) {
      setSystemNotice({
        level: 'error',
        message: error instanceof Error ? error.message : '刷新题目列表失败，请稍后重试。',
      })
    } finally {
      setRefreshingProblems(false)
    }
  }, [hydrateCodes, problems, session, setEndTime, setExamInfo, setExamStatus, syncProblems])

  useEffect(() => {
    const storedSession = getStudentSession()
    if (!storedSession) {
      navigate('/login', { replace: true })
      return
    }

    let cancelled = false
    setSession(storedSession)
    setExamInfo(storedSession.examInfo)
    setProblems(storedSession.problems)
    setEndTime(storedSession.examInfo.endTime)
    setExamStatus(getExamUiStatus(storedSession.examInfo.endTime))
    setPageError(null)

    const hydrateExamWorkspace = async () => {
      let problemsToLoad = storedSession.problems

      try {
        const examDetail = await fetchPublicExamDetail(storedSession.examInfo.id)
        problemsToLoad =
          examDetail.problems.length > 0 ? examDetail.problems : storedSession.problems
        if (!cancelled) {
          setExamInfo(examDetail.examInfo)
          setProblems(problemsToLoad)
          setEndTime(examDetail.examInfo.endTime)
        }
      } catch (error) {
        if (!cancelled) {
          setSystemNotice({
            level: 'warning',
            message: error instanceof Error ? error.message : '题面加载失败，已使用缓存信息。',
          })
        }
      }

      try {
        const snapshots = await Promise.all(
          problemsToLoad.map(async (problem) => {
            const result = await fetchStudentCode(problem.id)
            return {
              problemId: problem.id,
              code: result.code,
              savedAt: result.savedAt,
            }
          })
        )
        if (!cancelled) {
          hydrateCodes(snapshots)
        }
      } catch (error) {
        if (!cancelled) {
          setSystemNotice({
            level: 'warning',
            message:
              error instanceof Error ? error.message : '历史代码加载失败，已使用本地默认模板。',
          })
        }
      } finally {
        if (!cancelled) {
          setBootstrapping(false)
        }
      }
    }

    void hydrateExamWorkspace()

    return () => {
      cancelled = true
    }
  }, [hydrateCodes, navigate, setEndTime, setExamInfo, setExamStatus, setProblems])

  useEffect(() => {
    if (!examInfo?.endTime) {
      return
    }

    setExamStatus(getExamUiStatus(examInfo.endTime))
    const timer = window.setInterval(() => {
      setExamStatus(getExamUiStatus(examInfo.endTime))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [examInfo?.endTime, setExamStatus])

  useEffect(() => {
    if (!bootstrapping && !document.fullscreenElement) {
      void restoreFullscreen()
    }
  }, [bootstrapping, restoreFullscreen])

  // 处理 WebSocket 消息
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case 'exam_status': {
          if (message.data && typeof message.data === 'object') {
            const data = message.data as { status?: string; remaining_time?: number }
            if (data.remaining_time !== undefined) {
              if (data.remaining_time < 300) {
                setExamStatus('ending')
              } else if (data.remaining_time < 600) {
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
            setSystemNotice({
              level: 'warning',
              message: data.message || '系统检测到异常行为，请立即恢复考试状态。',
            })
          }
          break
        }
        case 'force_submit': {
          if (message.data && typeof message.data === 'object' && !handlingForceSubmitRef.current) {
            const data = message.data as { reason?: string }
            handlingForceSubmitRef.current = true
            setSystemNotice({
              level: 'error',
              message: data.reason || '您已被系统强制收卷。',
            })

            void (async () => {
              setSubmitting(true)
              try {
                await saveAllCodes()
              } catch {
                // 强制收卷场景下优先离场，不阻塞
              }
              disconnectRef.current?.()
              await leaveExam({
                forced: true,
                reason: data.reason || '管理员强制收卷',
                submitTime: new Date().toISOString(),
              })
            })()
          }
          break
        }
        case 'notification': {
          if (message.data && typeof message.data === 'object') {
            const data = message.data as { message?: string }
            if (data.message) {
              setSystemNotice({ level: 'info', message: data.message })
            }
          }
          break
        }
        default:
          break
      }
    },
    [leaveExam, saveAllCodes, setExamStatus]
  )

  // WebSocket 连接
  const { sendMessage, disconnect } = useWebSocket({
    url: session?.wsUrl ?? '',
    onMessage: handleWebSocketMessage,
  })

  // 保存 sendMessage 到 ref
  useEffect(() => {
    sendMessageRef.current = sendMessage
  }, [sendMessage])

  useEffect(() => {
    disconnectRef.current = disconnect
  }, [disconnect])

  // 处理题目切换
  const handleSelectProblem = useCallback(
    (problemId: number) => {
      setCurrentProblemId(problemId)
    },
    [setCurrentProblemId]
  )

  // 处理代码保存
  const handleSaveCode = useCallback(
    async (problemId: number, code: string) => {
      markSaving(problemId)
      try {
        const result = await saveStudentCode(problemId, code)
        markSaved(problemId, result.savedAt)
        sendMessageRef.current?.({
          type: 'code_save',
          data: { problem_id: problemId, saved_at: result.savedAt },
        })
      } catch (error) {
        clearSaving(problemId)
        setSystemNotice({
          level: 'error',
          message: error instanceof Error ? error.message : '代码保存失败，请稍后重试。',
        })
      }
    },
    [clearSaving, markSaved, markSaving]
  )

  const handleSubmit = useCallback(async () => {
    if (submitting || problems.length === 0) {
      return
    }

    setSubmitting(true)
    setPageError(null)

    try {
      await saveAllCodes()
      const targetProblemId = currentProblemId ?? problems[0].id
      const result = await submitStudentExam(targetProblemId)
      disconnect()
      await leaveExam({
        forced: false,
        submitTime: result.submitTime,
      })
    } catch (error) {
      setSubmitting(false)
      setPageError(error instanceof Error ? error.message : '交卷失败，请稍后重试。')
    }
  }, [currentProblemId, disconnect, leaveExam, problems, saveAllCodes, submitting])

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
        if (tabSwitchCount + 1 >= 2) {
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

  const savedProblemCount = useMemo(
    () => problems.filter((problem) => codes.get(problem.id)?.savedAt).length,
    [codes, problems]
  )

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    )
  }

  if (!session || !examInfo) {
    return null
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-100">
      {/* 状态栏 */}
      <StatusBar
        onRefreshProblems={() => void refreshProblemList()}
        onSubmit={() => void handleSubmit()}
        refreshingProblems={refreshingProblems}
        submitting={submitting}
      />

      {/* 主内容区 */}
      <div className="flex-1 min-h-0 p-3 lg:p-4">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 backdrop-blur lg:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-blue-600">
                  Online Exam Workspace
                </div>
                <h1 className="mt-1 truncate text-xl font-bold text-slate-900 lg:text-2xl">
                  {examInfo.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {examInfo.subject} · 共 {problems.length} 题 · 已保存 {savedProblemCount}/
                  {problems.length}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                  当前考生考试中
                </div>
                {!isFullscreen && (
                  <button
                    type="button"
                    onClick={() => void restoreFullscreen()}
                    disabled={restoringFullscreen}
                    className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {restoringFullscreen ? '恢复中...' : '恢复全屏'}
                  </button>
                )}
              </div>
            </div>
            {pageError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {pageError}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
            {/* 左侧：题目区 */}
            <div className="flex min-h-0 border-b border-slate-200 xl:w-[52%] xl:border-b-0 xl:border-r">
              <ProblemNav onSelectProblem={handleSelectProblem} />
              <ProblemContent />
            </div>

            {/* 右侧：代码编辑区 */}
            <div className="min-h-0 xl:w-[48%]">
              <CodeEditor onSave={(problemId, code) => void handleSaveCode(problemId, code)} />
            </div>
          </div>
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
              onClick={() => void restoreFullscreen()}
              disabled={restoringFullscreen}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {restoringFullscreen ? '恢复中...' : '恢复全屏'}
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

      {/* 系统消息 */}
      {systemNotice && (
        <div className="fixed right-4 top-20 z-40 w-[min(420px,calc(100vw-2rem))] rounded-2xl border bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className={`text-sm font-semibold ${
                  systemNotice.level === 'error'
                    ? 'text-red-600'
                    : systemNotice.level === 'warning'
                      ? 'text-yellow-700'
                      : 'text-blue-600'
                }`}
              >
                {systemNotice.level === 'error'
                  ? '系统错误'
                  : systemNotice.level === 'warning'
                    ? '系统警告'
                    : '系统通知'}
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{systemNotice.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setSystemNotice(null)}
              className="text-slate-400 transition hover:text-slate-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
