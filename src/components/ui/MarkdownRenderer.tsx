import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { rehypeBlankNumbering } from './rehypeBlankNumbering'

SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)

const SUPPORTED_LANGS = ['c', 'cpp']

// 代码块一键复制：考试页全局禁选中后，考生复制题干代码骨架的唯一途径
function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    const text = code.replace(/\n$/, '')
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        ok = true
      }
    } catch {
      ok = false
    }
    if (!ok) {
      // 内网 HTTP 非安全上下文兜底：clipboard API 不可用时用 execCommand 复制
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        ok = document.execCommand('copy')
      } finally {
        document.body.removeChild(textarea)
      }
    }
    if (ok) {
      setCopied(true)
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="复制代码"
      className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-xs text-white transition-colors hover:bg-black/60"
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      {copied ? '已复制' : '复制'}
    </button>
  )
}

interface MarkdownRendererProps {
  content: string
  className?: string
  numberBlanks?: boolean
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
            <div className="relative my-4 overflow-hidden rounded-md border border-kx-surface0 bg-kx-dark p-4">
              <pre className="font-mono text-sm text-kx-text">{children}</pre>
              <CodeCopyButton code={String(children)} />
            </div>
          )
        }

        return (
          <div className="relative my-4 overflow-hidden rounded-md border border-kx-surface0">
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
            <CodeCopyButton code={String(children)} />
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

export function MarkdownRenderer({
  content,
  className,
  numberBlanks = false,
}: MarkdownRendererProps) {
  const components = useMarkdownComponents()

  // 插件工厂带编号计数状态：react-markdown 每次渲染重建 processor 并重新调用工厂，
  // 保证每次解析编号都从 1 开始
  const rehypePlugins = numberBlanks ? [rehypeKatex, rehypeBlankNumbering] : [rehypeKatex]

  return (
    <div className={`max-w-none ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
