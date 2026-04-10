import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useState } from 'react'

import { useExamStore } from '../../store/examStore'

interface CodeEditorProps {
  onSave: (problemId: number, code: string) => void
}

export function CodeEditor({ onSave }: CodeEditorProps) {
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const getCode = useExamStore((state) => state.getCode)
  const updateCode = useExamStore((state) => state.updateCode)

  const [localCode, setLocalCode] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  // 当题目切换时，加载对应题目的代码
  useEffect(() => {
    if (currentProblemId !== null) {
      const codeState = getCode(currentProblemId)
      setLocalCode(codeState.code)
      setIsDirty(false)
    }
  }, [currentProblemId, getCode])

  const handleChange = useCallback(
    (value: string) => {
      setLocalCode(value)
      setIsDirty(true)
      if (currentProblemId !== null) {
        updateCode(currentProblemId, value)
      }
    },
    [currentProblemId, updateCode]
  )

  const handleSave = useCallback(() => {
    if (currentProblemId !== null) {
      onSave(currentProblemId, localCode)
      setIsDirty(false)
    }
  }, [currentProblemId, localCode, onSave])

  // 监听 Ctrl+S 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  const getSaveStatus = () => {
    if (currentProblemId === null) return null
    const codeState = getCode(currentProblemId)

    if (codeState.isSaving) {
      return {
        text: '保存中...',
        color: 'text-yellow-400',
        icon: (
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
        ),
      }
    }

    if (isDirty) {
      return {
        text: '未保存',
        color: 'text-orange-400',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      }
    }

    if (codeState.savedAt) {
      return {
        text: '已保存',
        color: 'text-green-400',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      }
    }

    return null
  }

  const saveStatus = getSaveStatus()

  if (currentProblemId === null) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">代码编辑器</span>
            <span className="text-xs text-gray-500">(C语言)</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>请选择题目开始编程</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">代码编辑器</span>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-medium">
            C
          </span>
          <span className="text-xs text-gray-500">|</span>
          <span className="text-xs text-gray-500">Ctrl+S 保存</span>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className={`flex items-center gap-1.5 text-sm ${saveStatus.color}`}>
              {saveStatus.icon}
              <span className="hidden sm:inline">{saveStatus.text}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isDirty
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
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
            保存
          </button>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={localCode}
          height="100%"
          theme={oneDark}
          extensions={[cpp()]}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
          }}
          className="h-full text-sm"
        />
      </div>
    </div>
  )
}
