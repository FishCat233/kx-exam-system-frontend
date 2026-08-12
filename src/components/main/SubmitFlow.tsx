import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { submitStudentExam } from '@/api'
import { useCodeSync } from '@/hooks/useCodeSync'
import { useExamStore } from '@/store/examStore'
import { exitFullscreenMode } from '@/utils/fullscreen'
import { clearStudentSession } from '@/utils/studentSession'

import { useWebSocketContext } from './WebSocketContext'

export function SubmitFlow() {
  const pendingSubmit = useExamStore((s) => s.pendingSubmit)
  const setPendingSubmit = useExamStore((s) => s.setPendingSubmit)
  const reset = useExamStore((s) => s.reset)
  const examInfo = useExamStore((s) => s.examInfo)
  const problems = useExamStore((s) => s.problems)

  const { subscribe, disconnect } = useWebSocketContext()
  const { saveAllCodes } = useCodeSync()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showConfirm = pendingSubmit && !submitting

  const leaveExam = useCallback(
    async (forced: boolean, reason: string | undefined, submitTime: string) => {
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
          examName: examInfo?.name ?? '考试',
        },
      })
    },
    [reset, navigate, examInfo]
  )

  const handleCancel = useCallback(() => {
    setPendingSubmit(false)
    setError(null)
  }, [setPendingSubmit])

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setError(null)

    try {
      if (problems.length === 0) {
        setError('当前考试暂无题目')
        setSubmitting(false)
        return
      }

      await saveAllCodes()

      const result = await submitStudentExam()

      disconnect()
      await leaveExam(false, undefined, result.submitTime)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '交卷失败，请重试'
      setError(message)
      setSubmitting(false)
    }
  }, [problems, saveAllCodes, disconnect, leaveExam])

  // 订阅 WS force_submit
  useEffect(() => {
    const unsubscribe = subscribe((wsMessage) => {
      const msg = wsMessage as { type: string; data?: { reason?: string } }
      if (msg.type !== 'force_submit') return

      const reason = msg.data?.reason

      setSubmitting(true)

      saveAllCodes()
        .catch(() => {
          // 忽略保存失败
        })
        .finally(() => {
          disconnect()
          leaveExam(true, reason, new Date().toISOString())
        })
    })

    return unsubscribe
  }, [subscribe, saveAllCodes, disconnect, leaveExam])

  if (!showConfirm && !error && !submitting) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 bg-kx-dark/70 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg border border-kx-surface0 p-8 max-w-[420px] w-[90%] text-center">
          {showConfirm && !error && (
            <>
              <h2 className="text-xl font-bold text-kx-text">确认交卷</h2>
              <p className="mt-2 text-sm text-kx-subtext">此操作不可撤销</p>

              <div className="mt-5 mb-5 rounded-md border border-kx-yellow bg-kx-yellow/10 px-3 py-3 text-sm text-kx-yellow leading-relaxed">
                ⚠️ 交卷后将无法继续答题，请确认已完成所有题目。
                <br />
                未保存的代码将不会提交。
              </div>

              <div className="mt-2 flex gap-3 justify-center">
                <button className="btn-outline px-6 py-2 text-sm" onClick={handleCancel}>
                  取消
                </button>
                <button className="btn-danger px-6 py-2 text-sm" onClick={handleSubmit}>
                  确认交卷
                </button>
              </div>
            </>
          )}

          {submitting && <p className="text-base text-kx-blue m-0">正在交卷中...</p>}

          {error && !submitting && (
            <>
              <p className="text-sm text-kx-red mb-4">{error}</p>
              <div className="mt-2 flex gap-3 justify-center">
                <button className="btn-outline px-6 py-2 text-sm" onClick={handleCancel}>
                  取消
                </button>
                <button className="btn-danger px-6 py-2 text-sm" onClick={handleSubmit}>
                  重试
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
