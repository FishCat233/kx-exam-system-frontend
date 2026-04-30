import type { ReactNode } from 'react'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const useMarkdownComponents = () =>
  useMemo(
    () => ({
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-100">
          {children}
        </h1>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-100">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="text-base font-semibold text-slate-800 mt-6 mb-3">{children}</h3>
      ),
      p: ({ children }: { children?: ReactNode }) => (
        <p className="text-slate-700 leading-relaxed mb-4">{children}</p>
      ),
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className="list-disc list-inside text-slate-700 mb-4 space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className="list-decimal list-inside text-slate-700 mb-4 space-y-1">{children}</ol>
      ),
      li: ({ children }: { children?: ReactNode }) => <li className="ml-2">{children}</li>,
      code: ({ children, className }: { children?: ReactNode; className?: string }) => {
        const match = /language-(\w+)/.exec(className || '')
        const isInline = !className

        if (isInline) {
          return (
            <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-sm font-mono">
              {children}
            </code>
          )
        }

        return (
          <div className="my-4 rounded-lg overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 flex items-center justify-between">
              <span>{match ? match[1] : 'code'}</span>
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
        <strong className="font-semibold text-slate-900">{children}</strong>
      ),
      table: ({ children }: { children?: ReactNode }) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-slate-300 text-sm">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }: { children?: ReactNode }) => (
        <thead className="bg-slate-100">{children}</thead>
      ),
      tbody: ({ children }: { children?: ReactNode }) => (
        <tbody className="bg-white">{children}</tbody>
      ),
      tr: ({ children }: { children?: ReactNode }) => (
        <tr className="border-b border-slate-200 last:border-b-0">{children}</tr>
      ),
      th: ({ children }: { children?: ReactNode }) => (
        <th className="px-4 py-2 text-left font-semibold text-slate-700 border border-slate-300">
          {children}
        </th>
      ),
      td: ({ children }: { children?: ReactNode }) => (
        <td className="px-4 py-2 text-slate-700 border border-slate-300">{children}</td>
      ),
    }),
    []
  )

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const components = useMarkdownComponents()

  return (
    <div className={`prose prose-slate max-w-none ${className ?? ''}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
