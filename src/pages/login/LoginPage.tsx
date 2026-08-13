import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { buildStudentExamSession, loginStudent, reportStudentFullscreen } from '@/api'
import { fetchPublicExamList } from '@/api/studentExam'
import ExamInfoCard from '@/components/login/ExamInfoCard'
import LoginForm from '@/components/login/LoginForm'
import OrganizationLogo from '@/components/login/OrganizationLogo'
import type { ExamInfo, LoginFormData } from '@/types'
import { requestFullscreenMode } from '@/utils/fullscreen'
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

export default function LoginPage() {
  const navigate = useNavigate()
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
        await requestFullscreenMode()
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

  return (
    <div
      className="flex min-h-screen flex-col px-4 py-8"
      style={{
        background:
          'radial-gradient(900px 500px at 15% 10%, rgba(82, 218, 224, 0.35), transparent 60%), radial-gradient(800px 500px at 90% 90%, rgba(32, 159, 181, 0.5), transparent 60%), linear-gradient(135deg, #52DAD9 0%, #179299 45%, #209FB5 100%)',
      }}
    >
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-4xl">
          <main className="card-base overflow-hidden">
            <div className="grid md:grid-cols-[5fr_7fr]">
              <div className="flex min-w-0 flex-col gap-6 border-b border-kx-surface0 p-6 sm:p-8 md:border-b-0 md:border-r">
                <div>
                  <OrganizationLogo />

                  <header className="mt-5 text-left">
                    <h1 className="text-2xl font-bold text-kx-text">考生登录</h1>
                    <p className="mt-2 text-sm text-kx-subtext">请使用学号、姓名与登录码登录</p>
                  </header>
                </div>

                {loadingExam ? (
                  <div className="flex items-center justify-center py-10">
                    <span
                      className="inline-block h-8 w-8 animate-spin border-2 border-current border-t-transparent text-kx-blue"
                      aria-hidden="true"
                    />
                  </div>
                ) : pageError && !currentExam ? (
                  <div className="rounded-md border border-kx-red bg-kx-red/10 p-5">
                    <h3 className="text-lg font-bold text-kx-red">考试信息不可用</h3>
                    <p className="mt-2 text-sm text-kx-red">{pageError}</p>
                    <button
                      type="button"
                      onClick={loadExams}
                      className="btn-primary mt-5 px-6 py-2.5 text-sm"
                    >
                      重新加载
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentExam && <ExamInfoCard examInfo={currentExam} />}
                    {pageError && (
                      <div className="alert-warning">
                        <span className="text-sm text-kx-yellow">{pageError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8">
                <LoginForm
                  onSubmit={handleLoginSubmit}
                  loading={loginLoading}
                  disabled={!currentExam}
                  submitError={submitError}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="mt-6 space-y-1 text-center text-xs text-white/70">
        <div>GUET SAST 考试系统 (v{__APP_VERSION__})</div>
        <div>桂电三院科协 © 2026 :: Site Powered by ❤️.</div>
      </footer>
    </div>
  )
}
