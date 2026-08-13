import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { fetchStudentCode } from '@/api/studentCode'
import { fetchStudentExamProblems } from '@/api/studentExam'
import { InlineAlert } from '@/components/ui'
import { useExamStore } from '@/store/examStore'
import { getStudentSession } from '@/utils/studentSession'

interface ExamBootstrapProps {
  children: ReactNode
}

function getExamUiStatus(endTime: string): 'ongoing' | 'warning' | 'ending' {
  const remainingMs = new Date(endTime).getTime() - Date.now()
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  if (remainingSeconds < 300) return 'ending'
  if (remainingSeconds < 600) return 'warning'
  return 'ongoing'
}

export function ExamBootstrap({ children }: ExamBootstrapProps) {
  const navigate = useNavigate()
  const {
    setExamInfo,
    setProblems,
    syncProblems,
    setEndTime,
    setExamStatus,
    hydrateCodes,
    setWsUrl,
    reset,
  } = useExamStore()

  const [bootstrapping, setBootstrapping] = useState(true)
  const [bootstrapError, setBootstrapError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const storedSession = getStudentSession()
    if (!storedSession) {
      navigate('/login', { replace: true })
      return
    }

    setExamInfo(storedSession.examInfo)
    setProblems(storedSession.problems)
    setEndTime(storedSession.examInfo.endTime)
    setExamStatus(getExamUiStatus(storedSession.examInfo.endTime))
    setWsUrl(storedSession.wsUrl)

    const hydrate = async () => {
      // a. 拉取最新 exam detail
      try {
        const examDetail = await fetchStudentExamProblems()
        if (cancelled) return
        setExamInfo(examDetail.examInfo)
        syncProblems(examDetail.problems)
        setEndTime(examDetail.examInfo.endTime)
        setExamStatus(getExamUiStatus(examDetail.examInfo.endTime))

        // b. 拉取代码快照
        if (examDetail.problems.length > 0) {
          try {
            const snapshots = await Promise.all(
              examDetail.problems.map((p) =>
                fetchStudentCode(p.id).then((r) => ({
                  problemId: p.id,
                  code: r.code,
                  savedAt: r.savedAt,
                }))
              )
            )
            if (cancelled) return
            hydrateCodes(snapshots)
          } catch {
            // 静默降级，使用默认代码
          }
        }
      } catch {
        if (cancelled) return
        setBootstrapError('考试信息加载失败，请检查网络后重试。')
      }

      if (!cancelled) {
        setBootstrapping(false)
      }
    }

    hydrate()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleBackToLogin = () => {
    reset()
    navigate('/login', { replace: true })
  }

  if (bootstrapping) {
    return (
      <div className="page-center">
        <div className="w-full max-w-2xl card-base p-8">
          <div className="mb-6 h-6 w-48 rounded-md bg-kx-surface0" />
          <div className="mb-4 h-4 w-full rounded-md bg-kx-surface0" />
          <div className="mb-4 h-4 w-4/5 rounded-md bg-kx-surface0" />
          <div className="h-64 rounded-lg bg-kx-surface0" />
        </div>
      </div>
    )
  }

  if (bootstrapError) {
    return (
      <div className="page-center">
        <div className="w-full max-w-md card-base p-8">
          <InlineAlert variant="error" message={bootstrapError} />
          <div className="mt-6 flex gap-3">
            <button onClick={handleRetry} className="btn-primary px-4 py-2 text-sm">
              重试
            </button>
            <button onClick={handleBackToLogin} className="btn-outline px-4 py-2 text-sm">
              返回登录
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
