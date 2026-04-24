import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import screenfull from 'screenfull'

import { buildStudentExamSession, loginStudent, reportStudentFullscreen } from '@/api'
import { fetchPublicExamList } from '@/api/studentExam'
import ExamInfoCard from '@/components/login/ExamInfoCard'
import LoginForm from '@/components/login/LoginForm'
import OrganizationLogo from '@/components/login/OrganizationLogo'
import PledgeModal from '@/components/login/PledgeModal'
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
    <div className="min-h-screen w-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 md:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/50 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden min-h-[720px] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_28%)]" />
            <div className="relative">
              <OrganizationLogo />
            </div>
            <div className="relative space-y-6">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm backdrop-blur">
                GUET SAST C 语言考试系统
              </div>
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-bold leading-tight">
                  专注、稳定、可恢复的在线考试体验
                </h1>
                <p className="max-w-lg text-base leading-7 text-blue-50/90">
                  登录后将进行全屏预检并接入实时监考状态。请提前确认浏览器权限、网络环境与输入信息无误。
                </p>
              </div>
              <div className="grid gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <div>
                  <div className="text-sm text-blue-100">登录前须知</div>
                  <div className="mt-2 text-sm leading-6 text-white/90">
                    1. 使用监考老师提供的学号、姓名与登录码。
                    <br />
                    2. 登录成功后必须允许浏览器进入全屏。
                    <br />
                    3. 切屏、退出全屏和连接中断都会被记录。
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-[720px] flex-col justify-center p-6 md:p-10">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div className="lg:hidden">
                <OrganizationLogo />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                  Student Login
                </p>
                <h2 className="text-3xl font-bold text-slate-900">进入考试</h2>
                <p className="text-sm leading-6 text-slate-500">
                  系统会自动读取当前考试信息，并在登录成功后完成全屏校验与考试初始化。
                </p>
              </div>

              {loadingExam ? (
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-52 animate-pulse rounded-xl bg-slate-200" />
                </div>
              ) : pageError && !currentExam ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <h3 className="text-base font-semibold text-red-700">考试信息不可用</h3>
                  <p className="mt-2 text-sm leading-6 text-red-600">{pageError}</p>
                  <button
                    type="button"
                    onClick={loadExams}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    重新加载
                  </button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </section>
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
