import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import screenfull from 'screenfull'

import { buildStudentExamSession, loginStudent, reportStudentFullscreen } from '@/api'
import { fetchPublicExamList } from '@/api/studentExam'
import ExamInfoCard from '@/components/login/ExamInfoCard'
import LoginForm from '@/components/login/LoginForm'
import OrganizationLogo from '@/components/login/OrganizationLogo'
import PledgeModal from '@/components/login/PledgeModal'
import { SectionLabel } from '@/components/ui'
import type { ExamInfo, LoginFormData } from '@/types'
import { getStudentSession, saveStudentSession } from '@/utils/studentSession'

function selectPreferredExam(exams: ExamInfo[]): ExamInfo | null {
  if (exams.length === 0) {
    return null
  }

  const statusPriority = (status?: string) => {
    switch (status) {
      case 'ongoing':
        return 0
      case 'not_started':
        return 1
      case 'ended':
        return 2
      default:
        return 3
    }
  }

  return [...exams].sort((left, right) => {
    const statusDiff = statusPriority(left.status) - statusPriority(right.status)
    if (statusDiff !== 0) {
      return statusDiff
    }
    return new Date(left.startTime).getTime() - new Date(right.startTime).getTime()
  })[0]
}

async function requestExamFullscreen(): Promise<void> {
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

export default function LoginPage() {
  const navigate = useNavigate()
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false)
  const [examList, setExamList] = useState<ExamInfo[]>([])
  const [loadingExam, setLoadingExam] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const currentExam = useMemo(() => selectPreferredExam(examList), [examList])

  const loadExams = useCallback(async () => {
    setLoadingExam(true)
    setPageError(null)
    try {
      const exams = await fetchPublicExamList()
      setExamList(exams)
      if (exams.length === 0) {
        setPageError('当前暂无可用考试，请联系监考老师。')
      }
    } catch (error) {
      setPageError(error instanceof Error ? error.message : '考试信息加载失败，请稍后重试。')
    } finally {
      setLoadingExam(false)
    }
  }, [])

  useEffect(() => {
    if (getStudentSession()) {
      navigate('/main', { replace: true })
      return
    }
    loadExams()
  }, [loadExams, navigate])

  const handleLoginSubmit = async (data: LoginFormData) => {
    if (!currentExam) {
      setSubmitError('当前没有可登录的考试。')
      return
    }

    setLoginLoading(true)
    setSubmitError(null)

    try {
      const loginPayload = await loginStudent(currentExam.id, data)

      try {
        await requestExamFullscreen()
      } catch (error) {
        const reason = error instanceof Error ? error.message : '全屏失败'
        try {
          await reportStudentFullscreen(loginPayload.studentToken, false, reason)
        } catch {
          // 忽略全屏失败上报的二次错误，优先反馈原始失败原因
        }
        setSubmitError(`无法进入全屏模式：${reason}`)
        return
      }

      const fullscreenPayload = await reportStudentFullscreen(loginPayload.studentToken, true)
      const session = await buildStudentExamSession(loginPayload, fullscreenPayload)
      saveStudentSession(session)
      navigate('/main')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '登录失败，请稍后重试。')
    } finally {
      setLoginLoading(false)
    }
  }

  const handlePledgeClick = () => {
    setIsPledgeModalOpen(true)
  }

  const handleClosePledgeModal = () => {
    setIsPledgeModalOpen(false)
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-md space-y-6">
          <OrganizationLogo />

          <div className="space-y-2 text-center">
            <SectionLabel>Student Login</SectionLabel>
            <h1 className="text-3xl font-bold text-slate-900">进入考试</h1>
            <p className="text-sm text-slate-500">
              请使用监考老师提供的学号、姓名与登录码登录
            </p>
          </div>

          {loadingExam ? (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              </div>
            </div>
          ) : pageError && !currentExam ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
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
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">考试信息不可用</h3>
                  <p className="mt-2 text-sm text-slate-600">{pageError}</p>
                </div>
                <button
                  type="button"
                  onClick={loadExams}
                  className="mt-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  重新加载
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentExam && <ExamInfoCard examInfo={currentExam} />}
              {pageError && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                  {pageError}
                </div>
              )}
              <LoginForm
                onSubmit={handleLoginSubmit}
                onPledgeClick={handlePledgeClick}
                loading={loginLoading}
                disabled={!currentExam}
                submitError={submitError}
              />
            </div>
          )}

          <div className="text-center text-xs text-slate-400">
            GUET SAST C 语言考试系统
          </div>
        </div>
      </div>
      {isPledgeModalOpen && (
        <PledgeModal
          isOpen={isPledgeModalOpen}
          onClose={handleClosePledgeModal}
          content={currentExam?.pledgeContent || ''}
        />
      )}
    </div>
  )
}
