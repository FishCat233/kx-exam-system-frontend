import { useCallback, useEffect, useState } from 'react'

import { useExamStore } from '../../store/examStore'
import type { ProblemOption, ProblemType } from '../../types'

interface ChoiceQuestionProps {
  problemId: number
  problemType: ProblemType
  options: ProblemOption[]
  onSave: (problemId: number, answer: string) => void
}

interface ChoiceQuestionEditorProps extends ChoiceQuestionProps {
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
}

function getSaveStatusText(savedAt: string | null, isDirty: boolean, isSaving: boolean) {
  if (isSaving) {
    return { text: '保存中...', color: 'text-yellow-600' }
  }
  if (isDirty) {
    return { text: '未保存', color: 'text-orange-600' }
  }
  if (savedAt) {
    return { text: '已保存', color: 'text-green-600' }
  }
  return null
}

function SingleChoiceEditor({
  problemId,
  options,
  onSave,
  isDirty,
  setIsDirty,
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
      updateCode(problemId, optionId)
    },
    [problemId, updateCode, setIsDirty]
  )

  const handleSave = useCallback(() => {
    onSave(problemId, selectedOption)
    setIsDirty(false)
  }, [problemId, selectedOption, onSave, setIsDirty])

  // 监听 Ctrl+S 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty) {
          handleSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDirty, handleSave])

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
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`single-choice-${problemId}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => handleSelect(option.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                  selectedOption === option.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {option.id}
              </span>
              <span className="flex-1 text-gray-800">{option.content}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">请选择一项正确答案</div>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            isDirty
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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

function MultipleChoiceEditor({
  problemId,
  options,
  onSave,
  isDirty,
  setIsDirty,
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
      updateCode(problemId, Array.from(newSelected).sort().join(','))
    },
    [problemId, selectedOptions, updateCode, setIsDirty]
  )

  const handleSave = useCallback(() => {
    const answer = Array.from(selectedOptions).sort().join(',')
    onSave(problemId, answer)
    setIsDirty(false)
  }, [problemId, selectedOptions, onSave, setIsDirty])

  // 监听 Ctrl+S 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty) {
          handleSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDirty, handleSave])

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
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleToggle(option.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {option.id}
                </span>
                <span className="flex-1 text-gray-800">{option.content}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">已选择 {selectedOptions.size} 项 · 可选择多项</div>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            isDirty
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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

export function ChoiceQuestion({ problemId, problemType, options, onSave }: ChoiceQuestionProps) {
  const [isDirty, setIsDirty] = useState(false)
  const getCode = useExamStore((state) => state.getCode)
  const codeState = getCode(problemId)

  const saveStatus = getSaveStatusText(codeState.savedAt, isDirty, codeState.isSaving)

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">
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

        {saveStatus && (
          <div className={`flex items-center gap-1.5 text-sm ${saveStatus.color}`}>
            {codeState.isSaving ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : isDirty ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <span className="hidden sm:inline">{saveStatus.text}</span>
          </div>
        )}
      </div>

      {problemType === 'single_choice' ? (
        <SingleChoiceEditor
          problemId={problemId}
          problemType={problemType}
          options={options}
          onSave={onSave}
          isDirty={isDirty}
          setIsDirty={setIsDirty}
        />
      ) : (
        <MultipleChoiceEditor
          problemId={problemId}
          problemType={problemType}
          options={options}
          onSave={onSave}
          isDirty={isDirty}
          setIsDirty={setIsDirty}
        />
      )}
    </div>
  )
}
