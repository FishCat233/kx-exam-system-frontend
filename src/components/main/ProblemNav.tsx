import { useExamStore } from '../../store/examStore'

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

export function ProblemNav({ onSelectProblem }: ProblemNavProps) {
  const problems = useExamStore((state) => state.problems)
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const codes = useExamStore((state) => state.codes)

  const isProblemSaved = (problemId: number): boolean => {
    const codeState = codes.get(problemId)
    return codeState?.savedAt !== null && codeState?.savedAt !== undefined
  }

  return (
    <div className="w-16 lg:w-56 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
      {/* 标题 - 在窄屏下隐藏 */}
      <div className="hidden lg:block p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm">题目列表</h3>
        <p className="text-xs text-gray-500 mt-1">{problems.length} 道题目</p>
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
                  : 'hover:bg-gray-100 border-l-3 border-l-transparent'
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
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isSaved && !isActive ? <CheckIcon className="w-4 h-4" /> : index + 1}
                </div>

                {/* 题目标题 - 在窄屏下隐藏 */}
                <div className="hidden lg:block flex-1 min-w-0">
                  <span
                    className={`text-sm truncate block ${
                      isActive ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {problem.title}
                  </span>
                  {isSaved && <span className="text-xs text-green-600">已保存</span>}
                </div>

                {/* 保存标记 - 仅图标 */}
                {isSaved && (
                  <div className="lg:hidden">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* 底部统计 - 在窄屏下隐藏 */}
      <div className="hidden lg:block p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>已保存</span>
          <span className="font-medium text-green-600">
            {problems.filter((p) => isProblemSaved(p.id)).length}/{problems.length}
          </span>
        </div>
      </div>
    </div>
  )
}
