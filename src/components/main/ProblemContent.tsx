import { memo } from 'react'

import { MarkdownRenderer } from '../../components/ui'
import { useExamStore } from '../../store/examStore'

export const ProblemContent = memo(function ProblemContent() {
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const problems = useExamStore((state) => state.problems)

  const problem = problems.find((p) => p.id === currentProblemId)

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 bg-white">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-slate-300"
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
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
            {problem.orderNum}. {problem.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
              C语言
            </span>
            <span>题目 ID: {problem.id}</span>
          </div>
        </div>

        <MarkdownRenderer content={problem.content} />
      </div>
    </div>
  )
})
