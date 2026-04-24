import React from 'react'
import ReactMarkdown from 'react-markdown'

interface PledgeModalProps {
  isOpen: boolean
  onClose: () => void
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

export const PledgeModal: React.FC<PledgeModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* 标题栏 */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
          <h3 className="text-xl font-bold text-white">考前承诺书</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-3xl leading-none transition-colors duration-200"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* 内容区域 */}
        <div className="overflow-auto px-8 py-6">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>
                ),
                li: ({ children }) => (
                  <li className="mb-2 text-gray-700 leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">{children}</strong>
                ),
              }}
            >
              {content || defaultPledgeContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-8 py-5 flex justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  )
}

export default PledgeModal
