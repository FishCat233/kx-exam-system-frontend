import { memo } from 'react'

import { MarkdownRenderer, SectionLabel } from '../../components/ui'
import { useExamStore } from '../../store/examStore'

export const ProblemContent = memo(function ProblemContent() {
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const problems = useExamStore((state) => state.problems)

  const problem = problems.find((p) => p.id === currentProblemId)

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center text-kx-subtext bg-white">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-kx-subtext"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>请选择题目</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-3xl">
        <div className="mb-6 pb-4 border-b border-kx-surface0">
          <SectionLabel className="text-xs text-kx-subtext">
            题目 {String(problem.orderNum).padStart(2, '0')}
          </SectionLabel>
          <h1 className="mt-1 text-xl lg:text-2xl font-bold text-kx-text">{problem.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="rounded border border-kx-blue px-2 py-0.5 text-kx-blue text-xs font-medium">
              C语言
            </span>
            <span className="data-mono text-kx-subtext">题目 ID: {problem.id}</span>
          </div>
        </div>

        <MarkdownRenderer content={problem.content} numberBlanks={problem.type === 'fill_blank'} />
      </div>
    </div>
  )
})
