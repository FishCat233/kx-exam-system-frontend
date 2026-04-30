import { StatusDot } from '../../components/ui'
import { useExamStore } from '../../store/examStore'
import type { ProblemType } from '../../types'

interface ProblemNavProps {
  onSelectProblem: (problemId: number) => void
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
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

export function ProblemNav({ onSelectProblem }: ProblemNavProps) {
  const problems = useExamStore((state) => state.problems)
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const codes = useExamStore((state) => state.codes)

  const isProblemSaved = (problemId: number): boolean => {
    const codeState = codes.get(problemId)
    return codeState?.savedAt !== null && codeState?.savedAt !== undefined
  }

  return (
    <div className="w-16 lg:w-56 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
      {/* 标题 - 在窄屏下隐藏 */}
      <div className="hidden lg:block p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 text-sm">题目列表</h3>
        <p className="text-xs text-slate-500 mt-1">{problems.length} 道题目</p>
      </div>

      {/* 题目列表 */}
      <div className="flex-1 overflow-y-auto py-2">
        {problems.map((problem, index) => {
          const isActive = currentProblemId === problem.id
          const isSaved = isProblemSaved(problem.id)

          return (
            <button
              key={problem.id}
              onClick={() => onSelectProblem(problem.id)}
              className={`w-full text-left px-2 lg:px-4 py-2 transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 border-l-3 border-l-blue-500'
                  : 'hover:bg-slate-100 border-l-3 border-l-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* 题号 */}
                <div
                  className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-medium shrink-0 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : isSaved
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isSaved && !isActive ? <CheckIcon className="w-4 h-4" /> : index + 1}
                </div>

                {/* 题目标题 - 在窄屏下隐藏 */}
                <div className="hidden lg:block flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm truncate block ${
                        isActive ? 'text-blue-700 font-medium' : 'text-slate-700'
                      }`}
                    >
                      {problem.title}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded ${
                        problem.type === 'coding'
                          ? 'bg-blue-100 text-blue-600'
                          : problem.type === 'single_choice'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600'
                      }`}
                      title={PROBLEM_TYPE_LABEL[problem.type]}
                    >
                      <ProblemTypeIcon type={problem.type} />
                    </span>
                  </div>
                  {isSaved && <span className="text-xs text-green-600">已保存</span>}
                </div>

                {/* 保存标记 - 仅图标 */}
                {isSaved && (
                  <div className="lg:hidden">
                    <StatusDot color="green" className="w-2 h-2" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* 底部统计 - 在窄屏下隐藏 */}
      <div className="hidden lg:block p-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>已保存</span>
          <span className="font-medium text-green-600">
            {problems.filter((p) => isProblemSaved(p.id)).length}/{problems.length}
          </span>
        </div>
      </div>
    </div>
  )
}
