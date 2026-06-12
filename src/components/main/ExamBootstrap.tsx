import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { fetchStudentCode } from '@/api/studentCode'
import { fetchPublicExamDetail } from '@/api/studentExam'
import { useExamStore } from '@/store/examStore'
import type { StudentExamSession } from '@/types'
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

   
  const [_session, _setSession] = useState<StudentExamSession | null>(null)

  useEffect(() => {
    let cancelled = false

    const storedSession = getStudentSession()
    if (!storedSession) {
      navigate('/login', { replace: true })
      return
    }

    _setSession(storedSession)
    setExamInfo(storedSession.examInfo)
    setProblems(storedSession.problems)
    setEndTime(storedSession.examInfo.endTime)
    setExamStatus(getExamUiStatus(storedSession.examInfo.endTime))
    setWsUrl(storedSession.wsUrl)

    async function hydrate() {
      let problemsToLoad = storedSession.problems

      // a. 拉取最新 exam detail
      try {
        const examDetail = await fetchPublicExamDetail(storedSession.examInfo.id)
        problemsToLoad =
          examDetail.problems.length > 0 ? examDetail.problems : storedSession.problems
        if (cancelled) return
        setExamInfo(examDetail.examInfo)
        syncProblems(problemsToLoad)
        setEndTime(examDetail.examInfo.endTime)
        setExamStatus(getExamUiStatus(examDetail.examInfo.endTime))
      } catch {
        setBootstrapError('考试信息加载失败，请检查网络后重试。')
        setBootstrapping(false)
        return
      }

      // b. 拉取代码快照
      if (problemsToLoad.length > 0) {
        try {
          const snapshots = await Promise.all(
            problemsToLoad.map((p) =>
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6 h-6 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-4 w-4/5 animate-pulse rounded bg-gray-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (bootstrapError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {bootstrapError}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRetry}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              重试
            </button>
            <button
              onClick={handleBackToLogin}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              返回登录
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
