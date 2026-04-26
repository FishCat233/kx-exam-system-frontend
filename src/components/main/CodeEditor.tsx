import { cpp } from '@codemirror/lang-cpp'
import type { Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { material } from '@uiw/codemirror-theme-material'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useState } from 'react'

import { useExamStore } from '../../store/examStore'

import { ChoiceQuestion } from './ChoiceQuestion'

type ThemeKey = 'githubLight' | 'githubDark' | 'oneDark' | 'vscodeDark' | 'dracula' | 'material'

const THEME_CONFIG: Record<ThemeKey, { label: string; theme: Extension; isDark: boolean }> = {
  githubLight: { label: 'GitHub Light', theme: githubLight, isDark: false },
  githubDark: { label: 'GitHub Dark', theme: githubDark, isDark: true },
  oneDark: { label: 'One Dark', theme: oneDark, isDark: true },
  vscodeDark: { label: 'VS Code', theme: vscodeDark, isDark: true },
  dracula: { label: 'Dracula', theme: dracula, isDark: true },
  material: { label: 'Material', theme: material, isDark: true },
}

const STORAGE_KEY = 'editor-theme'

function getStoredTheme(): ThemeKey {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored in THEME_CONFIG) {
      return stored as ThemeKey
    }
  } catch {
    void 0
  }
  return 'githubLight'
}

interface CodeEditorProps {
  onSave: (problemId: number, code: string) => void
}

interface ProblemCodeEditorProps extends CodeEditorProps {
  problemId: number
}

function ProblemCodeEditor({ problemId, onSave }: ProblemCodeEditorProps) {
  const getCode = useExamStore((state) => state.getCode)
  const updateCode = useExamStore((state) => state.updateCode)

  const [localCode, setLocalCode] = useState(() => getCode(problemId).code)
  const [isDirty, setIsDirty] = useState(false)
  const [themeKey, setThemeKey] = useState<ThemeKey>(getStoredTheme)

  const currentTheme = THEME_CONFIG[themeKey]
  const isDark = currentTheme.isDark

  const handleThemeChange = useCallback((key: ThemeKey) => {
    setThemeKey(key)
    try {
      localStorage.setItem(STORAGE_KEY, key)
    } catch {
      void 0
    }
  }, [])

  const handleChange = useCallback(
    (value: string) => {
      setLocalCode(value)
      setIsDirty(true)
      updateCode(problemId, value)
    },
    [problemId, updateCode]
  )

  const handleSave = useCallback(() => {
    onSave(problemId, localCode)
    setIsDirty(false)
  }, [problemId, localCode, onSave])

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
    const codeState = getCode(problemId)

    if (codeState.isSaving) {
      return {
        text: '保存中...',
        color: isDark ? 'text-yellow-400' : 'text-yellow-600',
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
        color: isDark ? 'text-orange-400' : 'text-orange-600',
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
        color: isDark ? 'text-green-400' : 'text-green-600',
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

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            代码编辑器
          </span>
          <span
            className={`px-2 py-0.5 text-xs rounded font-medium ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}
          >
            C
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Ctrl+S 保存
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className={`flex items-center gap-1.5 text-sm ${saveStatus.color}`}>
              {saveStatus.icon}
              <span className="hidden sm:inline">{saveStatus.text}</span>
            </div>
          )}

          <select
            value={themeKey}
            onChange={(e) => handleThemeChange(e.target.value as ThemeKey)}
            className={`px-2 py-1.5 text-xs rounded-lg border outline-none transition-colors cursor-pointer ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {Object.entries(THEME_CONFIG).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isDirty
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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

      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={localCode}
          height="100%"
          theme={currentTheme.theme}
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

export function CodeEditor({ onSave }: CodeEditorProps) {
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const problems = useExamStore((state) => state.problems)
  const [themeKey] = useState<ThemeKey>(getStoredTheme)
  const isDark = THEME_CONFIG[themeKey].isDark

  // 获取当前题目信息
  const currentProblem =
    currentProblemId !== null ? problems.find((p) => p.id === currentProblemId) : null

  if (currentProblemId === null) {
    return (
      <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              答题区域
            </span>
          </div>
        </div>
        <div
          className={`flex-1 flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <p>请选择题目开始答题</p>
        </div>
      </div>
    )
  }

  // 根据题目类型渲染不同的编辑器
  if (currentProblem) {
    if (currentProblem.type === 'single_choice' || currentProblem.type === 'multiple_choice') {
      // 选择题
      if (currentProblem.options && currentProblem.options.length > 0) {
        return (
          <ChoiceQuestion
            key={currentProblemId}
            problemId={currentProblemId}
            problemType={currentProblem.type}
            options={currentProblem.options}
            onSave={onSave}
          />
        )
      }
    }
  }

  // 默认渲染代码编辑器（编程题或选择题没有选项时）
  return <ProblemCodeEditor key={currentProblemId} problemId={currentProblemId} onSave={onSave} />
}
