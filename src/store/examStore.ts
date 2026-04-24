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

  // 题目相关
  problems: Problem[]
  currentProblemId: number | null

  // 代码状态 - 每个题目独立的代码
  codes: Map<number, CodeState>

  // WebSocket 状态
  wsStatus: WebSocketStatus

  // 考试状态
  examStatus: ExamStatus

  // 防作弊监控
  tabSwitchCount: number
  lastTabSwitchTime: string | null

  // 操作方法
  setExamInfo: (examInfo: ExamInfo) => void
  setEndTime: (endTime: string) => void
  setProblems: (problems: Problem[]) => void
  setCurrentProblemId: (problemId: number) => void
  setWsStatus: (status: WebSocketStatus) => void
  setExamStatus: (status: ExamStatus) => void

  // 代码操作
  getCode: (problemId: number) => CodeState
  updateCode: (problemId: number, code: string) => void
  markSaving: (problemId: number) => void
  markSaved: (problemId: number, savedAt?: string) => void
  clearSaving: (problemId: number) => void
  hydrateCodes: (snapshots: CodeSnapshot[]) => void

  // 防作弊操作
  incrementTabSwitchCount: () => void
  resetTabSwitchCount: () => void

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
  problems: [],
  currentProblemId: null,
  codes: new Map<number, CodeState>(),
  wsStatus: 'disconnected' as WebSocketStatus,
  examStatus: 'ongoing' as ExamStatus,
  tabSwitchCount: 0,
  lastTabSwitchTime: null,
}

export const useExamStore = create<ExamState>((set, get) => ({
  ...initialState,

  setExamInfo: (examInfo) => set({ examInfo }),

  setEndTime: (endTime) => set({ endTime }),

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

  setCurrentProblemId: (problemId) => set({ currentProblemId: problemId }),

  setWsStatus: (wsStatus) => set({ wsStatus }),

  setExamStatus: (examStatus) => set({ examStatus }),

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

  incrementTabSwitchCount: () =>
    set((state) => ({
      tabSwitchCount: state.tabSwitchCount + 1,
      lastTabSwitchTime: new Date().toISOString(),
    })),

  resetTabSwitchCount: () =>
    set({
      tabSwitchCount: 0,
      lastTabSwitchTime: null,
    }),

  reset: () => set(initialState),
}))
