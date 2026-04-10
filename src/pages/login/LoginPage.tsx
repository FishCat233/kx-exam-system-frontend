import { useState } from 'react'

import ExamInfoCard from '@/components/login/ExamInfoCard'
import LoginForm from '@/components/login/LoginForm'
import OrganizationLogo from '@/components/login/OrganizationLogo'
import PledgeModal from '@/components/login/PledgeModal'
import type { ExamInfo, LoginFormData } from '@/types'

// 假数据：考试信息
const mockExamInfo: ExamInfo = {
  id: 1,
  name: '2024年春季C语言程序设计考试',
  subject: 'C语言程序设计',
  duration: 120,
  startTime: '2024-06-15 09:00',
  endTime: '2024-06-15 11:00',
}

export default function LoginPage() {
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false)

  const handleLoginSubmit = (data: LoginFormData) => {
    // TODO: 调用后端登录接口
    // eslint-disable-next-line no-console
    console.log('登录表单提交:', data)
  }

  const handlePledgeClick = () => {
    setIsPledgeModalOpen(true)
  }

  const handleClosePledgeModal = () => {
    setIsPledgeModalOpen(false)
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-10 my-4 md:my-8">
        <div className="space-y-6 md:space-y-8">
          <OrganizationLogo />
          <ExamInfoCard examInfo={mockExamInfo} />
          <LoginForm onSubmit={handleLoginSubmit} onPledgeClick={handlePledgeClick} />
        </div>
      </div>
      {isPledgeModalOpen && (
        <PledgeModal isOpen={isPledgeModalOpen} onClose={handleClosePledgeModal} content="" />
      )}
    </div>
  )
}
