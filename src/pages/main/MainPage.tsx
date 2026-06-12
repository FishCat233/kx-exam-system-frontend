import { useCallback, useState } from 'react'

import { fetchStudentCode, saveStudentCode } from '@/api'
import { fetchPublicExamDetail } from '@/api/studentExam'

import { CodeEditor } from '../../components/main/CodeEditor'
import { ExamBootstrap } from '../../components/main/ExamBootstrap'
import { ExamShell } from '../../components/main/ExamShell'
import { FullscreenGuard } from '../../components/main/FullscreenGuard'
import { ProblemContent } from '../../components/main/ProblemContent'
import { ProblemNav } from '../../components/main/ProblemNav'
import { StatusBar } from '../../components/main/StatusBar'
import { SubmitFlow } from '../../components/main/SubmitFlow'
import { SystemNotice } from '../../components/main/SystemNotice'
import { TabSwitchDetector } from '../../components/main/TabSwitchDetector'
import { useWebSocketContext } from '../../components/main/WebSocketContext'
import { WebSocketProvider } from '../../components/main/WebSocketProvider'
import { useExamStore } from '../../store/examStore'
import { saveStudentSession } from '../../utils/studentSession'

function getExamUiStatus(endTime: string): 'ongoing' | 'warning' | 'ending' {
  const remainingMs = new Date(endTime).getTime() - Date.now()
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  if (remainingSeconds < 300) return 'ending'
  if (remainingSeconds < 600) return 'warning'
  return 'ongoing'
}

function MainPageInner() {
  const problems = useExamStore((state) => state.problems)
  const setCurrentProblemId = useExamStore((state) => state.setCurrentProblemId)
  const markSaving = useExamStore((state) => state.markSaving)
  const markSaved = useExamStore((state) => state.markSaved)
  const clearSaving = useExamStore((state) => state.clearSaving)
  const setExamInfo = useExamStore((state) => state.setExamInfo)
  const syncProblems = useExamStore((state) => state.syncProblems)
  const setEndTime = useExamStore((state) => state.setEndTime)
  const setExamStatus = useExamStore((state) => state.setExamStatus)
  const hydrateCodes = useExamStore((state) => state.hydrateCodes)

  const { sendMessage } = useWebSocketContext()

  const [refreshingProblems, setRefreshingProblems] = useState(false)

  const savedProblemCount = useExamStore(
    (state) => problems.filter((p) => state.codes.get(p.id)?.savedAt).length
  )

  const handleSelectProblem = useCallback(
    (problemId: number) => {
      setCurrentProblemId(problemId)
    },
    [setCurrentProblemId]
  )

  const handleSaveCode = useCallback(
    async (problemId: number, code: string) => {
      markSaving(problemId)
      try {
        const result = await saveStudentCode(problemId, code)
        markSaved(problemId, result.savedAt)
        sendMessage({
          type: 'code_save',
          data: { problem_id: problemId, saved_at: result.savedAt },
        })
      } catch {
        clearSaving(problemId)
      }
    },
    [markSaving, markSaved, clearSaving, sendMessage]
  )

  const handleRefreshProblems = useCallback(async () => {
    const state = useExamStore.getState()
    if (!state.examInfo) return

    setRefreshingProblems(true)
    try {
      const examDetail = await fetchPublicExamDetail(state.examInfo.id)
      const nextProblems = examDetail.problems.length > 0 ? examDetail.problems : state.problems
      const existingIds = new Set(state.problems.map((p) => p.id))
      const newIds = nextProblems.filter((p) => !existingIds.has(p.id)).map((p) => p.id)

      setExamInfo(examDetail.examInfo)
      syncProblems(nextProblems)
      setEndTime(examDetail.examInfo.endTime)
      setExamStatus(getExamUiStatus(examDetail.examInfo.endTime))

      if (newIds.length > 0) {
        const snapshots = await Promise.all(
          newIds.map(async (id) => {
            const result = await fetchStudentCode(id)
            return { problemId: id, code: result.code, savedAt: result.savedAt }
          })
        )
        hydrateCodes(snapshots)
      }

      // 更新 sessionStorage
      const current = useExamStore.getState()
      if (current.examInfo) {
        saveStudentSession({
          studentToken: '',
          websocketToken: '',
          wsUrl: current.wsUrl ?? '',
          examInfo: current.examInfo,
          problems: current.problems,
        })
      }
    } finally {
      setRefreshingProblems(false)
    }
  }, [setExamInfo, syncProblems, setEndTime, setExamStatus, hydrateCodes])

  return (
    <>
      <ExamShell
        statusBar={
          <StatusBar
            onRefreshProblems={handleRefreshProblems}
            refreshingProblems={refreshingProblems}
          />
        }
      >
        <div className="flex-1 min-h-0 p-3 lg:p-4">
          <div className="flex h-full min-h-0 flex-col overflow-hidden card-base rounded-3xl">
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 backdrop-blur lg:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="section-label text-xs">Kexie Online Exam</div>
                  <h1 className="mt-1 truncate text-xl font-bold text-slate-900 lg:text-2xl">
                    考试中
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    共 {problems.length} 题 · 已保存 {savedProblemCount}/{problems.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
              <div className="flex min-h-0 border-b border-slate-200 xl:w-[52%] xl:border-b-0 xl:border-r">
                <ProblemNav onSelectProblem={handleSelectProblem} />
                <ProblemContent />
              </div>
              <div className="min-h-0 xl:w-[48%]">
                <CodeEditor onSave={handleSaveCode} />
              </div>
            </div>
          </div>
        </div>
      </ExamShell>
      <SystemNotice />
      <FullscreenGuard />
      <TabSwitchDetector />
      <SubmitFlow />
    </>
  )
}

export function MainPage() {
  return (
    <ExamBootstrap>
      <WebSocketProvider>
        <MainPageInner />
      </WebSocketProvider>
    </ExamBootstrap>
  )
}
