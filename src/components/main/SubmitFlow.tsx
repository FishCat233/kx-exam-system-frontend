import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import screenfull from 'screenfull'

import { submitStudentExam } from '@/api'
import { useCodeSync } from '@/hooks/useCodeSync'
import { useExamStore } from '@/store/examStore'
import { clearStudentSession } from '@/utils/studentSession'

import { useWebSocketContext } from './WebSocketContext'

export function SubmitFlow() {
  const pendingSubmit = useExamStore((s) => s.pendingSubmit)
  const setPendingSubmit = useExamStore((s) => s.setPendingSubmit)
  const reset = useExamStore((s) => s.reset)
  const examInfo = useExamStore((s) => s.examInfo)
  const problems = useExamStore((s) => s.problems)
  const currentProblemId = useExamStore((s) => s.currentProblemId)

  const { subscribe, disconnect, sendMessage } = useWebSocketContext()
  const { saveAllCodes } = useCodeSync({ sendMessage })
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showConfirm = pendingSubmit && !submitting

  const exitFullscreenMode = useCallback(async () => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      await screenfull.exit()
    } else if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }, [])

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
    [reset, exitFullscreenMode, navigate, examInfo]
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

      const result = await submitStudentExam(currentProblemId ?? problems[0].id)

      disconnect()
      await leaveExam(false, undefined, result.submitTime)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '交卷失败，请重试'
      setError(message)
      setSubmitting(false)
    }
  }, [problems, currentProblemId, saveAllCodes, disconnect, leaveExam])

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

  if (!showConfirm && !error) {
    return null
  }

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.card}>
          {showConfirm && !error && (
            <>
              <h2 style={styles.title}>确认交卷</h2>
              <p style={styles.subtitle}>此操作不可撤销</p>

              <div style={styles.warning}>
                ⚠️ 交卷后将无法继续答题，请确认已完成所有题目。
                <br />
                未保存的代码将不会提交。
              </div>

              <div style={styles.actions}>
                <button style={styles.cancelBtn} onClick={handleCancel}>
                  取消
                </button>
                <button style={styles.confirmBtn} onClick={handleSubmit}>
                  确认交卷
                </button>
              </div>
            </>
          )}

          {submitting && (
            <div style={styles.centered}>
              <p style={styles.submittingText}>正在交卷中...</p>
            </div>
          )}

          {error && !submitting && (
            <div style={styles.errorCard}>
              <p style={styles.errorText}>{error}</p>
              <div style={styles.actions}>
                <button style={styles.cancelBtn} onClick={handleCancel}>
                  取消
                </button>
                <button style={styles.retryBtn} onClick={handleSubmit}>
                  重试
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '32px 40px',
    maxWidth: 420,
    width: '90%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: 14,
    color: '#999',
  },
  warning: {
    margin: '20px 0',
    padding: 12,
    backgroundColor: '#fff7e6',
    border: '1px solid #ffd666',
    borderRadius: 8,
    fontSize: 14,
    color: '#ad6800',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelBtn: {
    padding: '8px 24px',
    borderRadius: 6,
    border: '1px solid #d9d9d9',
    backgroundColor: '#fff',
    color: '#595959',
    fontSize: 14,
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '8px 24px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#1677ff',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  centered: {
    textAlign: 'center',
  },
  submittingText: {
    fontSize: 16,
    color: '#1677ff',
    margin: 0,
  },
  errorCard: {
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ff4d4f',
    marginBottom: 16,
  },
  retryBtn: {
    padding: '8px 24px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#1677ff',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
