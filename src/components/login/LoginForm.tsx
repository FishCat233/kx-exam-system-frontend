import { useState } from 'react'

import { InlineAlert } from '../../components/ui'
import type { LoginFormData } from '../../types'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>
  loading?: boolean
  disabled?: boolean
  submitError?: string | null
}

type FieldKey = keyof LoginFormData

function inputClass(error?: string): string {
  return error ? 'input-login border-kx-red' : 'input-login border-kx-surface1'
}

function FieldError({ message }: { message?: string }) {
  return (
    <p
      className={`mt-1.5 flex h-4 items-center gap-1 text-xs font-medium text-kx-red ${
        message ? '' : 'invisible'
      }`}
      aria-live="polite"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  )
}

export default function LoginForm({
  onSubmit,
  loading = false,
  disabled = false,
  submitError = null,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    studentId: '',
    name: '',
    loginCode: '',
  })

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})

  const validateField = (field: FieldKey, value: string | boolean): string | undefined => {
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
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<FieldKey, string>> = {}

    const studentIdError = validateField('studentId', formData.studentId)
    if (studentIdError) newErrors.studentId = studentIdError

    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError

    const loginCodeError = validateField('loginCode', formData.loginCode)
    if (loginCodeError) newErrors.loginCode = loginCodeError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      studentId: true,
      name: true,
      loginCode: true,
    })
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: FieldKey, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: FieldKey) => {
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
    !disabled

  const fieldError = (field: FieldKey): string | undefined =>
    touched[field] ? errors[field] : undefined

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label htmlFor="student-id" className="mb-1.5 block text-sm font-medium text-kx-text">
            学号
          </label>
          <input
            id="student-id"
            type="text"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            onBlur={() => handleBlur('studentId')}
            placeholder="请输入学号"
            disabled={disabled || loading}
            aria-invalid={Boolean(fieldError('studentId'))}
            className={`${inputClass(fieldError('studentId'))} data-mono`}
          />
          <FieldError message={fieldError('studentId')} />
        </div>

        <div>
          <label htmlFor="student-name" className="mb-1.5 block text-sm font-medium text-kx-text">
            姓名
          </label>
          <input
            id="student-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="请输入姓名"
            disabled={disabled || loading}
            aria-invalid={Boolean(fieldError('name'))}
            className={inputClass(fieldError('name'))}
          />
          <FieldError message={fieldError('name')} />
        </div>

        <div>
          <label htmlFor="login-code" className="mb-1.5 block text-sm font-medium text-kx-text">
            登录码
          </label>
          <input
            id="login-code"
            type="text"
            value={formData.loginCode}
            onChange={(e) => handleChange('loginCode', e.target.value)}
            onBlur={() => handleBlur('loginCode')}
            placeholder="请输入登录码"
            disabled={disabled || loading}
            aria-invalid={Boolean(fieldError('loginCode'))}
            className={`${inputClass(fieldError('loginCode'))} data-mono`}
          />
          <FieldError message={fieldError('loginCode')} />
        </div>

        {submitError && <InlineAlert variant="error" message={submitError} />}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-kx-blue text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-kx-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-kx-blue/25 disabled:cursor-not-allowed disabled:bg-kx-mantle disabled:text-kx-subtext disabled:hover:bg-kx-mantle"
        >
          {loading ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </button>
      </div>
    </form>
  )
}
