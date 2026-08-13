import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { ContentCard, PageContainer, SectionLabel } from '@/components/ui'

interface SubmittedPageState {
  forced?: boolean
  reason?: string
  submitTime?: string
  examName?: string
}

function formatTime(value?: string): string {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('zh-CN')
}

export function SubmittedPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as SubmittedPageState | null) ?? null

  const pageTitle = useMemo(() => (state?.forced ? '考试已结束' : '交卷成功'), [state?.forced])

  return (
    <PageContainer>
      <ContentCard className="max-w-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-kx-green">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="mt-6 text-center">
          <SectionLabel className="text-sm">Exam Finished</SectionLabel>
          <h1 className="mt-2 text-3xl font-bold text-kx-text">{pageTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-kx-text">
            {state?.forced
              ? '本场考试已被系统或监考端结束，当前答题状态已经停止。'
              : '您的答卷已提交，系统已记录本次考试结果。'}
          </p>
        </div>

        <div className="mt-8 space-y-4 border-t border-kx-surface0 pt-6">
          <div>
            <div className="text-sm text-kx-subtext">考试名称</div>
            <div className="mt-1 text-base font-medium text-kx-text">
              {state?.examName || 'C 语言考试'}
            </div>
          </div>
          <div>
            <div className="text-sm text-kx-subtext">完成时间</div>
            <div className="mt-1 data-mono text-base font-medium text-kx-text">
              {formatTime(state?.submitTime)}
            </div>
          </div>
          {state?.forced && (
            <div>
              <div className="text-sm text-kx-red">结束原因</div>
              <div className="mt-1 text-base font-medium text-kx-red">
                {state.reason || '系统强制收卷'}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="btn-primary px-6 py-3 text-sm"
          >
            返回登录页
          </button>
        </div>
      </ContentCard>
    </PageContainer>
  )
}
