import { useState } from 'react'

import { GradientButton, InlineAlert } from '../../components/ui'
import type { LoginFormData } from '../../types'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>
  onPledgeClick: () => void
  loading?: boolean
  disabled?: boolean
  submitError?: string | null
}

// 用户图标
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// 用户圆形图标
const UserCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
)

// 钥匙图标
const KeyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function LoginForm({
  onSubmit,
  onPledgeClick,
  loading = false,
  disabled = false,
  submitError = null,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    studentId: '',
    name: '',
    loginCode: '',
    pledgeAgreed: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {}

    // 学号校验：纯数字
    if (!formData.studentId.trim()) {
      newErrors.studentId = '请输入学号'
    } else if (!/^\d+$/.test(formData.studentId)) {
      newErrors.studentId = '学号必须为纯数字'
    }

    // 姓名校验：中文或英文
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    } else if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = '姓名必须为中文或英文'
    }

    // 登录码校验：数字字母组成
    if (!formData.loginCode.trim()) {
      newErrors.loginCode = '请输入登录码'
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.loginCode)) {
      newErrors.loginCode = '登录码必须由数字和字母组成'
    }

    // 承诺书校验：必须勾选
    if (!formData.pledgeAgreed) {
      newErrors.pledgeAgreed = '请勾选考前承诺书'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const isFormValid =
    formData.studentId.trim() &&
    /^\d+$/.test(formData.studentId) &&
    formData.name.trim() &&
    /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(formData.name) &&
    formData.loginCode.trim() &&
    /^[a-zA-Z0-9]+$/.test(formData.loginCode) &&
    formData.pledgeAgreed &&
    !disabled

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 学号输入框 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">学号</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <UserIcon />
          </div>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            placeholder="请输入学号"
            disabled={disabled || loading}
            className="input-base pl-10 pr-4 py-3"
          />
        </div>
        {errors.studentId && (
          <InlineAlert variant="error" message={errors.studentId} className="mt-2" />
        )}
      </div>

      {/* 姓名输入框 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">姓名</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <UserCircleIcon />
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="请输入姓名"
            disabled={disabled || loading}
            className="input-base pl-10 pr-4 py-3"
          />
        </div>
        {errors.name && <InlineAlert variant="error" message={errors.name} className="mt-2" />}
      </div>

      {/* 登录码输入框 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">登录码</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <KeyIcon />
          </div>
          <input
            type="text"
            value={formData.loginCode}
            onChange={(e) => handleChange('loginCode', e.target.value)}
            placeholder="请输入登录码"
            disabled={disabled || loading}
            className="input-base pl-10 pr-4 py-3"
          />
        </div>
        {errors.loginCode && (
          <InlineAlert variant="error" message={errors.loginCode} className="mt-2" />
        )}
      </div>

      {/* 承诺书勾选框 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange('pledgeAgreed', !formData.pledgeAgreed)}
            disabled={disabled || loading}
            className={`relative flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 ${
              formData.pledgeAgreed
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-slate-300 hover:border-blue-400'
            }`}
          >
            {formData.pledgeAgreed && (
              <span className="text-white">
                <CheckIcon />
              </span>
            )}
          </button>
          <label
            className="text-sm text-slate-700 select-none cursor-pointer"
            onClick={() => handleChange('pledgeAgreed', !formData.pledgeAgreed)}
          >
            我已阅读并同意
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPledgeClick()
              }}
              disabled={disabled || loading}
              className="text-blue-600 hover:text-blue-800 underline ml-1 font-medium transition-colors"
            >
              考前承诺书
            </button>
          </label>
        </div>
        {errors.pledgeAgreed && <InlineAlert variant="error" message={errors.pledgeAgreed} />}
      </div>

      {/* 登录按钮 */}
      {submitError && <InlineAlert variant="error" message={submitError} />}

      <GradientButton
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full py-3.5 text-base"
      >
        {loading ? '登录中...' : '登录'}
      </GradientButton>
    </form>
  )
}
