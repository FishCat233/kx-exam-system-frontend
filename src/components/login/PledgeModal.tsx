import React from 'react'

import { GradientButton, MarkdownRenderer } from '../../components/ui'

interface PledgeModalProps {
  isOpen: boolean
  onClose: () => void
  onAgree: () => void
  content: string
}

const defaultPledgeContent = `# 考前诚信承诺书

## 一、承诺事项

本人郑重承诺，在本次考试过程中严格遵守以下规定：

1. **诚信考试**：本人保证在考试过程中不抄袭、不作弊，独立完成所有题目。

2. **遵守纪律**：本人保证严格遵守考场纪律，服从监考人员的管理。

3. **禁止交流**：本人保证在考试期间不与其他考生进行任何形式的交流。

4. **禁止查阅资料**：本人保证在考试期间不查阅任何与考试相关的资料、书籍或网络资源。

## 二、违规处理

如本人在考试过程中违反上述承诺，愿意接受以下处理：

- 考试成绩作废
- 取消考试资格
- 通报所在学院
- 其他相应的纪律处分

## 三、其他说明

本人已充分了解考试规则和违规后果，自愿签署本承诺书。

**签署即表示同意以上所有条款**
`

export const PledgeModal: React.FC<PledgeModalProps> = ({ isOpen, onClose, onAgree, content }) => {
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">考前承诺书</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
            aria-label="关闭"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-auto px-6 py-5">
          <MarkdownRenderer content={content || defaultPledgeContent} />
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <GradientButton onClick={onAgree} className="px-6 py-2.5 text-sm">
            我已阅读并同意
          </GradientButton>
        </div>
      </div>
    </div>
  )
}

export default PledgeModal
