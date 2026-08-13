import { useCallback, useState } from 'react'

import { fetchStudentCode, saveStudentCode } from '@/api'
import { fetchStudentExamProblems } from '@/api/studentExam'

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
import { WebSocketProvider } from '../../components/main/WebSocketProvider'
import { WsGate } from '../../components/main/WsGate'
import { WsReconnectNotice } from '../../components/main/WsReconnectNotice'
import { useExamStore } from '../../store/examStore'
import { getStudentSession, saveStudentSession } from '../../utils/studentSession'

function getExamUiStatus(endTime: string): 'ongoing' | 'warning' | 'ending' {
  const remainingMs = new Date(endTime).getTime() - Date.now()
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  if (remainingSeconds < 300) return 'ending'
  if (remainingSeconds < 600) return 'warning'
  return 'ongoing'
}

function MainPageInner() {
  const problems = useExamStore((state) => state.problems)
  const examInfo = useExamStore((state) => state.examInfo)
  const setCurrentProblemId = useExamStore((state) => state.setCurrentProblemId)
  const markSaving = useExamStore((state) => state.markSaving)
  const markSaved = useExamStore((state) => state.markSaved)
  const clearSaving = useExamStore((state) => state.clearSaving)
  const setExamInfo = useExamStore((state) => state.setExamInfo)
  const syncProblems = useExamStore((state) => state.syncProblems)
  const setEndTime = useExamStore((state) => state.setEndTime)
  const setExamStatus = useExamStore((state) => state.setExamStatus)
  const hydrateCodes = useExamStore((state) => state.hydrateCodes)

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
    async (problemId: number, code: string): Promise<boolean> => {
      markSaving(problemId)
      try {
        const result = await saveStudentCode(problemId, code)
        markSaved(problemId, result.savedAt)
        return true
      } catch {
        clearSaving(problemId)
        return false
      }
    },
    [markSaving, markSaved, clearSaving]
  )

  const handleRefreshProblems = useCallback(async () => {
    const state = useExamStore.getState()
    if (!state.examInfo) return

    setRefreshingProblems(true)
    try {
      const examDetail = await fetchStudentExamProblems()
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

      // 更新 sessionStorage（保留原有 token）
      const current = useExamStore.getState()
      const existing = getStudentSession()
      if (current.examInfo) {
        saveStudentSession({
          studentToken: existing?.studentToken ?? '',
          websocketToken: existing?.websocketToken ?? '',
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
      <WsGate>
        <ExamShell
          statusBar={
            <StatusBar
              onRefreshProblems={handleRefreshProblems}
              refreshingProblems={refreshingProblems}
            />
          }
        >
          <div className="flex-1 min-h-0 p-3 lg:p-4">
            <div className="flex h-full min-h-0 flex-col overflow-hidden card-base">
              <div className="flex items-center justify-between gap-4 border-b border-kx-surface0 bg-white px-4 py-2 lg:px-6">
                <h1 className="min-w-0 truncate text-sm font-medium text-kx-text">
                  {examInfo?.name}
                </h1>
                <p className="shrink-0 text-xs text-kx-subtext">
                  共 <span className="data-mono">{problems.length}</span> 题 · 已保存{' '}
                  <span className="data-mono text-kx-green">
                    {savedProblemCount}/{problems.length}
                  </span>
                </p>
              </div>

              <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
                <div className="flex min-h-0 border-b border-kx-surface0 xl:w-[52%] xl:border-b-0 xl:border-r">
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
      </WsGate>
      <WsReconnectNotice />
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
