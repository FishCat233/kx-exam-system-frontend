import { cpp } from '@codemirror/lang-cpp'
import type { Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { material } from '@uiw/codemirror-theme-material'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { SaveStatusIndicator } from '../../components/ui'
import { useExamStore } from '../../store/examStore'

import { BlankQuestion } from './BlankQuestion'
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
  onSave: (problemId: number, code: string) => Promise<boolean>
}

interface ProblemCodeEditorProps extends CodeEditorProps {
  problemId: number
}

function ProblemCodeEditor({ problemId, onSave }: ProblemCodeEditorProps) {
  const updateCode = useExamStore((state) => state.updateCode)
  const codeState = useExamStore((state) => state.codes.get(problemId))

  const [localCode, setLocalCode] = useState(() => codeState?.code ?? '')
  const [themeKey, setThemeKey] = useState<ThemeKey>(getStoredTheme)

  const currentTheme = THEME_CONFIG[themeKey]
  const isDark = currentTheme.isDark

  const isDirty = codeState?.isDirty ?? false

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
      updateCode(problemId, value)
    },
    [problemId, updateCode]
  )

  const handleSave = useCallback(async () => {
    await onSave(problemId, localCode)
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

  // 切题/卸载时自动保存未保存的代码
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
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? 'bg-kx-dark border-kx-surface0/40' : 'bg-white border-kx-surface0'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm ${isDark ? 'text-kx-crust' : 'text-kx-text'}`}>代码编辑器</span>
          <span className="rounded border border-kx-blue px-2 py-0.5 text-xs font-medium text-kx-blue">
            C
          </span>
          <span className={`text-xs ${isDark ? 'text-kx-subtext' : 'text-kx-subtext'}`}>|</span>
          <span className={`data-mono text-xs ${isDark ? 'text-kx-subtext' : 'text-kx-subtext'}`}>
            Ctrl+S 保存
          </span>
        </div>

        <div className="flex items-center gap-3">
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
            isDark={isDark}
          />

          <select
            value={themeKey}
            onChange={(e) => handleThemeChange(e.target.value as ThemeKey)}
            className={`px-2 py-1.5 text-xs rounded-md border outline-none transition-colors cursor-pointer focus:border-kx-blue ${
              isDark
                ? 'bg-kx-dark border-kx-surface0/40 text-kx-crust'
                : 'bg-white border-kx-surface1 text-kx-text'
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
            className={`px-4 py-1.5 text-sm font-medium flex items-center gap-2 ${
              isDirty
                ? 'btn-primary'
                : `rounded-md border cursor-not-allowed ${
                    isDark
                      ? 'bg-kx-dark border-kx-surface0/40 text-kx-subtext'
                      : 'bg-kx-base border-kx-surface0 text-kx-subtext'
                  }`
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
  const themeKey = getStoredTheme()
  const isDark = THEME_CONFIG[themeKey].isDark

  const currentProblem =
    currentProblemId !== null ? problems.find((p) => p.id === currentProblemId) : null

  let inner: ReactNode

  if (currentProblemId === null) {
    inner = (
      <div className="flex flex-col h-full">
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            isDark ? 'bg-kx-dark border-kx-surface0/40' : 'bg-white border-kx-surface0'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-kx-crust' : 'text-kx-text'}`}>答题区域</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-kx-subtext">
          <p>请选择题目开始答题</p>
        </div>
      </div>
    )
  } else if (currentProblem && currentProblem.type === 'fill_blank') {
    inner = (
      <BlankQuestion
        key={currentProblemId}
        problemId={currentProblemId}
        content={currentProblem.content}
        onSave={onSave}
      />
    )
  } else if (
    currentProblem &&
    (currentProblem.type === 'single_choice' || currentProblem.type === 'multiple_choice') &&
    currentProblem.options &&
    currentProblem.options.length > 0
  ) {
    inner = (
      <ChoiceQuestion
        key={currentProblemId}
        problemId={currentProblemId}
        problemType={currentProblem.type}
        options={currentProblem.options}
        onSave={onSave}
      />
    )
  } else {
    inner = (
      <ProblemCodeEditor key={currentProblemId} problemId={currentProblemId} onSave={onSave} />
    )
  }

  return (
    <div
      className={`flex flex-col h-full rounded-lg border border-kx-surface0 overflow-hidden ${
        isDark ? 'bg-kx-dark' : 'bg-white'
      }`}
    >
      {inner}
    </div>
  )
}
