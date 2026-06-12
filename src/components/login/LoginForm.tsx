import { useState } from 'react'

import { GradientButton, InlineAlert } from '../../components/ui'
import type { LoginFormData } from '../../types'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>
  onPledgeClick: () => void
  pledgeAgreed: boolean
  loading?: boolean
  disabled?: boolean
  submitError?: string | null
}

export default function LoginForm({
  onSubmit,
  onPledgeClick,
  pledgeAgreed,
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
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({})

  const validatePledge = (): string | undefined => {
    if (!pledgeAgreed) return '请勾选考前承诺书'
    return undefined
  }

  const validateField = (field: keyof LoginFormData, value: string | boolean): string | undefined => {
    switch (field) {
      case 'studentId':
        if (!String(value).trim()) return '请输入学号'
        if (!/^\d+$/.test(String(value))) return '学号必须为纯数字'
        break
      case 'name':
        if (!String(value).trim()) return '请输入姓名'
        if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(String(value))) return '姓名必须为中文或英文'
        break
      case 'loginCode':
        if (!String(value).trim()) return '请输入登录码'
        if (!/^[a-zA-Z0-9]+$/.test(String(value))) return '登录码必须由数字和字母组成'
        break
      case 'pledgeAgreed':
        return validatePledge()
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {}
    
    const studentIdError = validateField('studentId', formData.studentId)
    if (studentIdError) newErrors.studentId = studentIdError
    
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError
    
    const loginCodeError = validateField('loginCode', formData.loginCode)
    if (loginCodeError) newErrors.loginCode = loginCodeError
    
    const pledgeError = validatePledge()
    if (pledgeError) newErrors.pledgeAgreed = pledgeError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      studentId: true,
      name: true,
      loginCode: true,
      pledgeAgreed: true,
    })
    if (validateForm()) {
      onSubmit({ ...formData, pledgeAgreed })
    }
  }

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const isFormValid =
    formData.studentId.trim() &&
    /^\d+$/.test(formData.studentId) &&
    formData.name.trim() &&
    /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(formData.name) &&
    formData.loginCode.trim() &&
    /^[a-zA-Z0-9]+$/.test(formData.loginCode) &&
    pledgeAgreed &&
    !disabled

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">学号</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => handleChange('studentId', e.target.value)}
              onBlur={() => handleBlur('studentId')}
              placeholder="请输入学号"
              disabled={disabled || loading}
              className="input-base h-11 pl-10 pr-4"
            />
          </div>
          {errors.studentId && touched.studentId && (
            <InlineAlert variant="error" message={errors.studentId} className="mt-2" />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">姓名</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="请输入姓名"
              disabled={disabled || loading}
              className="input-base h-11 pl-10 pr-4"
            />
          </div>
          {errors.name && touched.name && (
            <InlineAlert variant="error" message={errors.name} className="mt-2" />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">登录码</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <input
              type="text"
              value={formData.loginCode}
              onChange={(e) => handleChange('loginCode', e.target.value)}
              onBlur={() => handleBlur('loginCode')}
              placeholder="请输入登录码"
              disabled={disabled || loading}
              className="input-base h-11 pl-10 pr-4"
            />
          </div>
          {errors.loginCode && touched.loginCode && (
            <InlineAlert variant="error" message={errors.loginCode} className="mt-2" />
          )}
        </div>

        <div className="flex items-start gap-3 pt-2">
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
              pledgeAgreed
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-300 bg-white'
            }`}
          >
            {pledgeAgreed && (
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <label className="cursor-pointer text-sm text-slate-700">
            我已阅读并同意
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPledgeClick()
              }}
              disabled={disabled || loading}
              className="ml-1 font-medium text-blue-600 hover:text-blue-700"
            >
              考前承诺书
            </button>
          </label>
        </div>
        {errors.pledgeAgreed && touched.pledgeAgreed && (
          <InlineAlert variant="error" message={errors.pledgeAgreed} />
        )}

        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <GradientButton
          type="submit"
          disabled={!isFormValid || loading}
          className="h-11 w-full text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              登录中...
            </span>
          ) : (
            '登录'
          )}
        </GradientButton>
      </div>
    </form>
  )
}
