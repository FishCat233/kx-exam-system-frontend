import { SectionLabel, StatusDot } from '../../components/ui'
import { useExamStore } from '../../store/examStore'
import type { ProblemType } from '../../types'

interface ProblemNavProps {
  onSelectProblem: (problemId: number) => void
}

function ProblemTypeIcon({ type }: { type: ProblemType }) {
  if (type === 'coding') {
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    )
  }
  if (type === 'single_choice') {
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  )
}

const PROBLEM_TYPE_LABEL: Record<ProblemType, string> = {
  coding: '编程',
  single_choice: '单选',
  multiple_choice: '多选',
}

const PROBLEM_TYPE_TAG: Record<ProblemType, string> = {
  coding: 'border-kx-blue text-kx-blue',
  single_choice: 'border-kx-green text-kx-green',
  multiple_choice: 'border-kx-yellow text-kx-yellow',
}

export function ProblemNav({ onSelectProblem }: ProblemNavProps) {
  const problems = useExamStore((state) => state.problems)
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const codes = useExamStore((state) => state.codes)

  const isProblemDirty = (problemId: number): boolean => {
    const codeState = codes.get(problemId)
    return codeState?.isDirty ?? false
  }

  const isProblemSaved = (problemId: number): boolean => {
    const codeState = codes.get(problemId)
    return codeState?.savedAt !== null && codeState?.savedAt !== undefined
  }

  return (
    <div className="w-16 lg:w-56 bg-white border-r border-kx-surface0 flex flex-col shrink-0">
      <div className="hidden lg:block p-4 border-b border-kx-surface0">
        <SectionLabel className="text-sm text-kx-text">题目列表</SectionLabel>
        <p className="text-xs text-kx-subtext mt-1">
          共 <span className="data-mono">{problems.length}</span> 道题目
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {problems.map((problem, index) => {
          const isActive = currentProblemId === problem.id
          const isDirty = isProblemDirty(problem.id)

          return (
            <button
              key={problem.id}
              onClick={() => onSelectProblem(problem.id)}
              title={problem.title}
              className={`group mx-2 w-[calc(100%-1rem)] lg:mx-3 lg:w-[calc(100%-1.5rem)] text-left px-2 lg:px-3 py-2 rounded-md border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kx-blue ${
                isActive
                  ? 'bg-kx-blue border-kx-blue'
                  : 'border-transparent hover:bg-kx-base hover:border-kx-surface0 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 data-mono text-xs flex items-center justify-center font-medium shrink-0 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-white text-kx-blue'
                      : 'bg-kx-base text-kx-text group-hover:bg-kx-mantle'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="hidden lg:block flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm truncate block ${
                        isActive ? 'text-white font-medium' : 'text-kx-text'
                      }`}
                    >
                      {problem.title}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] ${
                        isActive ? 'border-white/60 text-white' : PROBLEM_TYPE_TAG[problem.type]
                      }`}
                      title={PROBLEM_TYPE_LABEL[problem.type]}
                    >
                      <ProblemTypeIcon type={problem.type} />
                    </span>
                  </div>
                </div>

                {isDirty &&
                  (isActive ? (
                    <span aria-hidden="true" className="w-2.5 h-2.5 status-dot text-kx-yellow" />
                  ) : (
                    <StatusDot color="yellow" />
                  ))}
              </div>
            </button>
          )
        })}
      </div>

      <div className="hidden lg:block p-4 border-t border-kx-surface0">
        <div className="flex items-center justify-between text-xs text-kx-subtext">
          <span>已保存</span>
          <span className="data-mono font-medium text-kx-text">
            {problems.filter((p) => isProblemSaved(p.id)).length}/{problems.length}
          </span>
        </div>
      </div>
    </div>
  )
}
