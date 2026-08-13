import type { ReactNode } from 'react'
import { useMemo } from 'react'
import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)

const SUPPORTED_LANGS = ['c', 'cpp']

interface MarkdownRendererProps {
  content: string
  className?: string
}

const useMarkdownComponents = () =>
  useMemo(
    () => ({
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className="mt-8 mb-4 pb-2 border-b border-kx-surface0 text-2xl font-bold text-kx-text">
          {children}
        </h1>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="mt-8 mb-4 pb-2 border-b border-kx-surface0 text-lg font-bold text-kx-text">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="mt-6 mb-3 text-base font-semibold text-kx-text">{children}</h3>
      ),
      p: ({ children }: { children?: ReactNode }) => (
        <p className="text-kx-text leading-relaxed mb-4">{children}</p>
      ),
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className="mb-4 list-outside list-disc space-y-1 pl-5 text-kx-text">{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className="mb-4 list-outside list-decimal space-y-1 pl-5 text-kx-text">{children}</ol>
      ),
      li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
      code: ({ children, className }: { children?: ReactNode; className?: string }) => {
        const match = /language-(\w+)/.exec(className || '')
        const isInline = !className

        if (isInline) {
          return (
            <code className="rounded bg-kx-mantle px-1.5 py-0.5 font-mono text-sm text-kx-text">
              {children}
            </code>
          )
        }

        if (!match || !SUPPORTED_LANGS.includes(match[1])) {
          return (
            <pre className="my-4 overflow-hidden rounded-md border border-kx-surface0 bg-kx-dark p-4 font-mono text-sm text-kx-text">
              {children}
            </pre>
          )
        }

        return (
          <div className="my-4 overflow-hidden rounded-md border border-kx-surface0">
            <SyntaxHighlighter
              language={match[1]}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                background: '#181825',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        )
      },
      pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className="my-4 border-l border-kx-teal bg-kx-mantle py-2 pl-4">
          {children}
        </blockquote>
      ),
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold text-kx-text">{children}</strong>
      ),
      table: ({ children }: { children?: ReactNode }) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-kx-surface0 text-sm">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }: { children?: ReactNode }) => (
        <thead className="bg-kx-mantle">{children}</thead>
      ),
      tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
      tr: ({ children }: { children?: ReactNode }) => (
        <tr className="border-b border-kx-surface0 last:border-b-0">{children}</tr>
      ),
      th: ({ children }: { children?: ReactNode }) => (
        <th className="px-4 py-2 text-left font-semibold text-kx-text border border-kx-surface0">
          {children}
        </th>
      ),
      td: ({ children }: { children?: ReactNode }) => (
        <td className="px-4 py-2 text-kx-text border border-kx-surface0">{children}</td>
      ),
    }),
    []
  )

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const components = useMarkdownComponents()

  return (
    <div className={`max-w-none ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
