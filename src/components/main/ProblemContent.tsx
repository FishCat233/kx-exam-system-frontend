import type { ReactNode } from 'react'
import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { useExamStore } from '../../store/examStore'

// 使用 useMemo 缓存 components 配置，避免每次渲染都创建新对象
const useMarkdownComponents = () =>
  useMemo(
    () => ({
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-100">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
      ),
      p: ({ children }: { children?: ReactNode }) => (
        <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
      ),
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">{children}</ol>
      ),
      li: ({ children }: { children?: ReactNode }) => <li className="ml-2">{children}</li>,
      code: ({ children, className }: { children?: ReactNode; className?: string }) => {
        const match = /language-(\w+)/.exec(className || '')
        const isInline = !className

        if (isInline) {
          return (
            <code className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono">
              {children}
            </code>
          )
        }

        return (
          <div className="my-4 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
              <span>{match ? match[1] : 'code'}</span>
              <span className="text-gray-500">示例</span>
            </div>
            <SyntaxHighlighter
              language={match ? match[1] : 'text'}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        )
      },
      pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className="border-l-4 border-blue-200 pl-4 py-2 my-4 bg-blue-50 rounded-r">
          {children}
        </blockquote>
      ),
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
    }),
    []
  )

// 使用 memo 包裹，避免父组件重新渲染时重复渲染 Markdown
export const ProblemContent = memo(function ProblemContent() {
  const currentProblemId = useExamStore((state) => state.currentProblemId)
  const problems = useExamStore((state) => state.problems)
  const markdownComponents = useMarkdownComponents()

  const problem = problems.find((p) => p.id === currentProblemId)

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-white">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
        {/* 题目标题 */}
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            {problem.orderNum}. {problem.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
              C语言
            </span>
            <span>题目 ID: {problem.id}</span>
          </div>
        </div>

        {/* 题目内容 */}
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown components={markdownComponents}>{problem.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
})
