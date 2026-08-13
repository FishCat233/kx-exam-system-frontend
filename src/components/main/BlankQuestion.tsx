import { useCallback, useEffect, useRef, useState } from 'react'

import { SaveStatusIndicator } from '../../components/ui'
import { useExamStore } from '../../store/examStore'

interface BlankQuestionProps {
  problemId: number
  content: string
  onSave: (problemId: number, answer: string) => Promise<boolean>
}

function countBlanks(content: string): number {
  const matches = content.match(/____/g)
  return matches ? matches.length : 0
}

function parseAnswers(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

function useCtrlSave(onSave: () => void, enabled: boolean) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (enabled) {
          onSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, onSave])
}

export function BlankQuestion({ problemId, content, onSave }: BlankQuestionProps) {
  const blankCount = countBlanks(content)
  const updateCode = useExamStore((state) => state.updateCode)
  const codeState = useExamStore((state) => state.codes.get(problemId))
  const isDirty = codeState?.isDirty ?? false

  const [answers, setAnswers] = useState<string[]>(() => parseAnswers(codeState?.code ?? ''))

  const handleChange = useCallback(
    (index: number, value: string) => {
      const next = [...answers]
      next[index] = value
      while (next.length < blankCount) {
        next.push('')
      }
      const trimmed = next.slice(0, blankCount)
      setAnswers(trimmed)
      updateCode(problemId, JSON.stringify(trimmed))
    },
    [answers, blankCount, problemId, updateCode]
  )

  const handleSave = useCallback(async () => {
    await onSave(problemId, JSON.stringify(answers.slice(0, blankCount)))
  }, [problemId, answers, blankCount, onSave])

  useCtrlSave(handleSave, isDirty)

  // 切题/卸载时自动保存未保存的答案
  const onSaveRef = useRef(onSave)
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    const problemIdRef = problemId
    return () => {
      const state = useExamStore.getState()
      const snapshot = state.codes.get(problemIdRef)
      if (snapshot?.isDirty) {
        void onSaveRef.current(problemIdRef, snapshot.code)
      }
    }
  }, [problemId])

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-kx-surface0 bg-white">
        <div className="flex items-center gap-3">
          <span className="text-sm text-kx-text">填空题</span>
          <span className="rounded border border-kx-teal px-2 py-0.5 text-xs font-medium text-kx-teal">
            填空
          </span>
        </div>

        <SaveStatusIndicator
          status={
            codeState?.isSaving
              ? 'saving'
              : isDirty
                ? 'unsaved'
                : codeState?.savedAt
                  ? 'saved'
                  : null
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {blankCount === 0 ? (
          <div className="flex h-full items-center justify-center text-kx-subtext">
            题干中未检测到空位（用连续的 4 个下划线 `____` 表示）
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: blankCount }, (_, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-16 shrink-0 text-sm font-medium text-kx-text">
                  填空 {index + 1}
                </span>
                <input
                  type="text"
                  value={answers[index] ?? ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`请输入第 ${index + 1} 空答案`}
                  className="h-12 flex-1 rounded-lg border border-solid border-kx-surface1 bg-white px-3.5 text-kx-text transition-all duration-150 placeholder:text-kx-surface1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kx-blue"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-kx-surface0 bg-white">
        <div className="text-sm text-kx-text">
          {blankCount > 0 ? `共 ${blankCount} 个空位` : '请检查题干'}
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-6 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
            isDirty
              ? 'btn-primary'
              : 'rounded-md border border-kx-surface0 bg-kx-base text-kx-subtext cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          保存答案
        </button>
      </div>
    </div>
  )
}
