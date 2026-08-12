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

interface ChoiceQuestionEditorProps extends ChoiceQuestionProps {
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  onAnswerChange: (answer: string) => void
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
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
      <div className="text-sm text-slate-500">{hint}</div>
      <button
        onClick={onSave}
        disabled={!isDirty}
        className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
          isDirty ? 'btn-primary' : 'bg-slate-300 text-slate-500 cursor-not-allowed rounded-lg'
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

function SingleChoiceEditor({
  problemId,
  options,
  onSave,
  isDirty,
  setIsDirty,
  onAnswerChange,
}: ChoiceQuestionEditorProps) {
  const getCode = useExamStore((state) => state.getCode)
  const updateCode = useExamStore((state) => state.updateCode)

  const [selectedOption, setSelectedOption] = useState<string>(() => {
    const codeState = getCode(problemId)
    return codeState.code || ''
  })

  const handleSelect = useCallback(
    (optionId: string) => {
      setSelectedOption(optionId)
      setIsDirty(true)
      onAnswerChange(optionId)
      updateCode(problemId, optionId)
    },
    [problemId, updateCode, setIsDirty, onAnswerChange]
  )

  const handleSave = useCallback(async () => {
    const ok = await onSave(problemId, selectedOption)
    if (ok) {
      setIsDirty(false)
    }
  }, [problemId, selectedOption, onSave, setIsDirty])

  useCtrlSave(handleSave, isDirty)

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name={`single-choice-${problemId}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => handleSelect(option.id)}
                className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                  selectedOption === option.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {option.id}
              </span>
              <span className="flex-1 text-slate-800">{option.content}</span>
            </label>
          ))}
        </div>
      </div>

      <ChoiceSaveBar hint="请选择一项正确答案" isDirty={isDirty} onSave={handleSave} />
    </div>
  )
}

function MultipleChoiceEditor({
  problemId,
  options,
  onSave,
  isDirty,
  setIsDirty,
  onAnswerChange,
}: ChoiceQuestionEditorProps) {
  const getCode = useExamStore((state) => state.getCode)
  const updateCode = useExamStore((state) => state.updateCode)

  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(() => {
    const codeState = getCode(problemId)
    const savedAnswer = codeState.code || ''
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
      setIsDirty(true)
      onAnswerChange(Array.from(newSelected).sort().join(','))
      updateCode(problemId, Array.from(newSelected).sort().join(','))
    },
    [problemId, selectedOptions, updateCode, setIsDirty, onAnswerChange]
  )

  const handleSave = useCallback(async () => {
    const answer = Array.from(selectedOptions).sort().join(',')
    const ok = await onSave(problemId, answer)
    if (ok) {
      setIsDirty(false)
    }
  }, [problemId, selectedOptions, onSave, setIsDirty])

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
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleToggle(option.id)}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {option.id}
                </span>
                <span className="flex-1 text-slate-800">{option.content}</span>
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
  const [isDirty, setIsDirty] = useState(false)
  const getCode = useExamStore((state) => state.getCode)
  const codeState = getCode(problemId)

  // 切题/卸载时自动保存未保存的答案
  const latestAnswerRef = useRef<string>(codeState.code || '')
  const isDirtyRef = useRef(false)
  const onSaveRef = useRef(onSave)
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    const problemIdRef = problemId
    return () => {
      if (isDirtyRef.current) {
        void onSaveRef.current(problemIdRef, latestAnswerRef.current)
      }
    }
  }, [problemId])

  const markDirty = useCallback((answer: string) => {
    latestAnswerRef.current = answer
    isDirtyRef.current = true
    setIsDirty(true)
  }, [])

  const handleSetDirty = useCallback((dirty: boolean) => {
    isDirtyRef.current = dirty
    setIsDirty(dirty)
  }, [])

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-700">
            {problemType === 'single_choice' ? '单选题' : '多选题'}
          </span>
          <span
            className={`px-2 py-0.5 text-xs rounded font-medium ${
              problemType === 'single_choice'
                ? 'bg-green-100 text-green-600'
                : 'bg-orange-100 text-orange-600'
            }`}
          >
            {problemType === 'single_choice' ? '单选' : '多选'}
          </span>
        </div>

        <SaveStatusIndicator
          status={
            codeState.isSaving ? 'saving' : isDirty ? 'unsaved' : codeState.savedAt ? 'saved' : null
          }
        />
      </div>

      {problemType === 'single_choice' ? (
        <SingleChoiceEditor
          problemId={problemId}
          problemType={problemType}
          options={options}
          onSave={onSave}
          isDirty={isDirty}
          setIsDirty={handleSetDirty}
          onAnswerChange={markDirty}
        />
      ) : (
        <MultipleChoiceEditor
          problemId={problemId}
          problemType={problemType}
          options={options}
          onSave={onSave}
          isDirty={isDirty}
          setIsDirty={handleSetDirty}
          onAnswerChange={markDirty}
        />
      )}
    </div>
  )
}
