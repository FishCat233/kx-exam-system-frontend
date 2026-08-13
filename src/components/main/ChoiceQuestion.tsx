import { useCallback, useEffect, useRef, useState } from 'react'

import { SaveStatusIndicator } from '../../components/ui'
import { useExamStore } from '../../store/examStore'
import type { ProblemOption, ProblemType } from '../../types'

interface ChoiceQuestionProps {
  problemId: number
  problemType: ProblemType
  options: ProblemOption[]
  onSave: (problemId: number, answer: string) => Promise<boolean>
}

interface ChoiceQuestionEditorProps {
  problemId: number
  options: ProblemOption[]
  onSave: (problemId: number, answer: string) => Promise<boolean>
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

function ChoiceSaveBar({
  hint,
  isDirty,
  onSave,
}: {
  hint: string
  isDirty: boolean
  onSave: () => void
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-kx-surface0 bg-white">
      <div className="text-sm text-kx-text">{hint}</div>
      <button
        onClick={onSave}
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
  )
}

function useProblemCodeState(problemId: number) {
  return useExamStore((state) => state.codes.get(problemId))
}

function SingleChoiceEditor({ problemId, options, onSave }: ChoiceQuestionEditorProps) {
  const updateCode = useExamStore((state) => state.updateCode)
  const codeState = useProblemCodeState(problemId)
  const isDirty = codeState?.isDirty ?? false

  const [selectedOption, setSelectedOption] = useState<string>(() => codeState?.code || '')

  const handleSelect = useCallback(
    (optionId: string) => {
      setSelectedOption(optionId)
      updateCode(problemId, optionId)
    },
    [problemId, updateCode]
  )

  const handleSave = useCallback(async () => {
    await onSave(problemId, selectedOption)
  }, [problemId, selectedOption, onSave])

  useCtrlSave(handleSave, isDirty)

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-kx-blue ${
                selectedOption === option.id
                  ? 'border-kx-blue bg-kx-blue'
                  : 'border-kx-surface1 hover:border-kx-blue'
              }`}
            >
              <input
                type="radio"
                name={`single-choice-${problemId}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => handleSelect(option.id)}
                className="sr-only peer"
              />
              <span
                className={`w-8 h-8 data-mono flex items-center justify-center font-bold text-sm rounded-md ${
                  selectedOption === option.id ? 'bg-white text-kx-blue' : 'bg-kx-base text-kx-text'
                }`}
              >
                {option.id}
              </span>
              <span
                className={`flex-1 ${selectedOption === option.id ? 'text-white' : 'text-kx-text'}`}
              >
                {option.content}
              </span>
            </label>
          ))}
        </div>
      </div>

      <ChoiceSaveBar hint="请选择一项正确答案" isDirty={isDirty} onSave={handleSave} />
    </div>
  )
}

function MultipleChoiceEditor({ problemId, options, onSave }: ChoiceQuestionEditorProps) {
  const updateCode = useExamStore((state) => state.updateCode)
  const codeState = useProblemCodeState(problemId)
  const isDirty = codeState?.isDirty ?? false

  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(() => {
    const savedAnswer = codeState?.code || ''
    return new Set(savedAnswer ? savedAnswer.split(',') : [])
  })

  const handleToggle = useCallback(
    (optionId: string) => {
      const newSelected = new Set(selectedOptions)
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId)
      } else {
        newSelected.add(optionId)
      }
      setSelectedOptions(newSelected)
      updateCode(problemId, Array.from(newSelected).sort().join(','))
    },
    [problemId, selectedOptions, updateCode]
  )

  const handleSave = useCallback(async () => {
    const answer = Array.from(selectedOptions).sort().join(',')
    await onSave(problemId, answer)
  }, [problemId, selectedOptions, onSave])

  useCtrlSave(handleSave, isDirty)

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedOptions.has(option.id)
            return (
              <label
                key={option.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-kx-blue ${
                  isSelected
                    ? 'border-kx-blue bg-kx-blue'
                    : 'border-kx-surface1 hover:border-kx-blue'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleToggle(option.id)}
                  className="sr-only peer"
                />
                <span
                  className={`w-8 h-8 data-mono flex items-center justify-center font-bold text-sm rounded-md ${
                    isSelected ? 'bg-white text-kx-blue' : 'bg-kx-base text-kx-text'
                  }`}
                >
                  {option.id}
                </span>
                <span className={`flex-1 ${isSelected ? 'text-white' : 'text-kx-text'}`}>
                  {option.content}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <ChoiceSaveBar
        hint={`已选择 ${selectedOptions.size} 项 · 可选择多项`}
        isDirty={isDirty}
        onSave={handleSave}
      />
    </div>
  )
}

export function ChoiceQuestion({ problemId, problemType, options, onSave }: ChoiceQuestionProps) {
  const codeState = useProblemCodeState(problemId)
  const isDirty = codeState?.isDirty ?? false

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
          <span className="text-sm text-kx-text">
            {problemType === 'single_choice' ? '单选题' : '多选题'}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-xs font-medium ${
              problemType === 'single_choice'
                ? 'border-kx-green text-kx-green'
                : 'border-kx-blue text-kx-blue'
            }`}
          >
            {problemType === 'single_choice' ? '单选' : '多选'}
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

      {problemType === 'single_choice' ? (
        <SingleChoiceEditor problemId={problemId} options={options} onSave={onSave} />
      ) : (
        <MultipleChoiceEditor problemId={problemId} options={options} onSave={onSave} />
      )}
    </div>
  )
}
