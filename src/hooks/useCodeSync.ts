import { useCallback, useState } from 'react'

import { saveStudentCode } from '../api'
import { useExamStore } from '../store/examStore'
import type { WebSocketMessage } from '../types'

interface UseCodeSyncOptions {
  sendMessage?: (message: WebSocketMessage) => boolean
}

interface UseCodeSyncReturn {
  saveAllCodes: () => Promise<void>
  isSaving: boolean
}

export function useCodeSync({ sendMessage }: UseCodeSyncOptions = {}): UseCodeSyncReturn {
  const markSaving = useExamStore((state) => state.markSaving)
  const markSaved = useExamStore((state) => state.markSaved)
  const clearSaving = useExamStore((state) => state.clearSaving)

  const [isSaving, setIsSaving] = useState(false)

  const saveAllCodes = useCallback(async () => {
    const codes = useExamStore.getState().codes
    if (codes.size === 0) {
      return
    }

    setIsSaving(true)

    const tasks = Array.from(codes.entries()).map(async ([problemId, codeState]) => {
      markSaving(problemId)
      try {
        const result = await saveStudentCode(problemId, codeState.code)
        markSaved(problemId, result.savedAt)
        sendMessage?.({
          type: 'code_save',
          data: { problem_id: problemId, saved_at: result.savedAt },
        })
      } catch (error) {
        clearSaving(problemId)
        throw error
      }
    })

    try {
      await Promise.all(tasks)
    } finally {
      setIsSaving(false)
    }
  }, [clearSaving, markSaved, markSaving, sendMessage])

  return { saveAllCodes, isSaving }
}
