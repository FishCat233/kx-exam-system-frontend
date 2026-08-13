import { create } from 'zustand'

import type { ExamInfo, ExamStatus, Problem, WebSocketStatus } from '../types'

interface CodeState {
  code: string
  savedAt: string | null
  isSaving: boolean
}

interface CodeSnapshot {
  problemId: number
  code: string
  savedAt: string | null
}

interface ExamState {
  // 考试信息
  examInfo: ExamInfo | null
  endTime: string | null

  // WebSocket 地址
  wsUrl: string | null

  // 题目相关
  problems: Problem[]
  currentProblemId: number | null

  // 代码状态 - 每个题目独立的代码
  codes: Map<number, CodeState>

  // WebSocket 状态
  wsStatus: WebSocketStatus

  // 是否曾经成功建立过 WebSocket 连接（决定是否解锁答题）
  wsHasConnected: boolean

  // 考试状态
  examStatus: ExamStatus

  // 交卷信号
  pendingSubmit: boolean

  // 操作方法
  setExamInfo: (examInfo: ExamInfo) => void
  setEndTime: (endTime: string) => void
  setWsUrl: (wsUrl: string) => void
  setProblems: (problems: Problem[]) => void
  syncProblems: (problems: Problem[]) => void
  setCurrentProblemId: (problemId: number) => void
  setWsStatus: (status: WebSocketStatus) => void
  setWsHasConnected: (connected: boolean) => void
  setExamStatus: (status: ExamStatus) => void
  setPendingSubmit: (pending: boolean) => void

  // 代码操作
  getCode: (problemId: number) => CodeState
  updateCode: (problemId: number, code: string) => void
  markSaving: (problemId: number) => void
  markSaved: (problemId: number, savedAt?: string) => void
  clearSaving: (problemId: number) => void
  hydrateCodes: (snapshots: CodeSnapshot[]) => void

  // 重置状态
  reset: () => void
}

const DEFAULT_CODE = `#include <stdio.h>

int main() {
    // 请在此编写代码
    
    return 0;
}
`

const initialState = {
  examInfo: null,
  endTime: null,
  wsUrl: null,
  problems: [],
  currentProblemId: null,
  codes: new Map<number, CodeState>(),
  wsStatus: 'disconnected' as WebSocketStatus,
  wsHasConnected: false,
  examStatus: 'ongoing' as ExamStatus,
  pendingSubmit: false,
}

export const useExamStore = create<ExamState>((set, get) => ({
  ...initialState,

  setExamInfo: (examInfo) => set({ examInfo }),

  setEndTime: (endTime) => set({ endTime }),

  setWsUrl: (wsUrl) => set({ wsUrl }),

  setProblems: (problems) => {
    set({ problems })
    // 初始化代码状态
    const codes = new Map<number, CodeState>()
    for (const problem of problems) {
      codes.set(problem.id, {
        code: DEFAULT_CODE,
        savedAt: null,
        isSaving: false,
      })
    }
    set({ codes })
    // 默认选中第一题
    if (problems.length > 0 && get().currentProblemId === null) {
      set({ currentProblemId: problems[0].id })
    }
  },

  syncProblems: (problems) => {
    const state = get()
    const nextCodes = new Map<number, CodeState>()

    for (const problem of problems) {
      const existing = state.codes.get(problem.id)
      nextCodes.set(problem.id, existing ?? { code: DEFAULT_CODE, savedAt: null, isSaving: false })
    }

    const currentProblemStillExists = problems.some(
      (problem) => problem.id === state.currentProblemId
    )

    set({
      problems,
      codes: nextCodes,
      currentProblemId:
        problems.length === 0
          ? null
          : currentProblemStillExists
            ? state.currentProblemId
            : problems[0].id,
    })
  },

  setCurrentProblemId: (problemId) => set({ currentProblemId: problemId }),

  setWsStatus: (wsStatus) => set({ wsStatus }),

  setWsHasConnected: (connected) => set({ wsHasConnected: connected }),

  setExamStatus: (examStatus) => set({ examStatus }),

  setPendingSubmit: (pending) => set({ pendingSubmit: pending }),

  getCode: (problemId) => {
    const state = get()
    return (
      state.codes.get(problemId) || {
        code: DEFAULT_CODE,
        savedAt: null,
        isSaving: false,
      }
    )
  },

  updateCode: (problemId, code) => {
    const state = get()
    const existing = state.codes.get(problemId)
    const newCodes = new Map(state.codes)
    newCodes.set(problemId, {
      code,
      savedAt: existing?.savedAt || null,
      isSaving: existing?.isSaving || false,
    })
    set({ codes: newCodes })
  },

  markSaving: (problemId) => {
    const state = get()
    const existing = state.codes.get(problemId)
    if (existing) {
      const newCodes = new Map(state.codes)
      newCodes.set(problemId, { ...existing, isSaving: true })
      set({ codes: newCodes })
    }
  },

  markSaved: (problemId, savedAt) => {
    const state = get()
    const existing = state.codes.get(problemId)
    if (existing) {
      const newCodes = new Map(state.codes)
      newCodes.set(problemId, {
        ...existing,
        isSaving: false,
        savedAt: savedAt ?? new Date().toISOString(),
      })
      set({ codes: newCodes })
    }
  },

  clearSaving: (problemId) => {
    const state = get()
    const existing = state.codes.get(problemId)
    if (existing) {
      const newCodes = new Map(state.codes)
      newCodes.set(problemId, { ...existing, isSaving: false })
      set({ codes: newCodes })
    }
  },

  hydrateCodes: (snapshots) => {
    const state = get()
    const newCodes = new Map(state.codes)

    for (const snapshot of snapshots) {
      const existing = newCodes.get(snapshot.problemId)
      newCodes.set(snapshot.problemId, {
        code: snapshot.code,
        savedAt: snapshot.savedAt,
        isSaving: existing?.isSaving ?? false,
      })
    }

    set({ codes: newCodes })
  },

  reset: () => set(initialState),
}))
