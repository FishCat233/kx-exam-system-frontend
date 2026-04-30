import type { ExamInfo } from '../../types'

interface ExamInfoCardProps {
  examInfo: ExamInfo
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusLabel(status?: string): { text: string; className: string } {
  switch (status) {
    case 'ongoing':
      return { text: '进行中', className: 'bg-green-100 text-green-700' }
    case 'not_started':
      return { text: '未开始', className: 'bg-blue-100 text-blue-700' }
    case 'ended':
      return { text: '已结束', className: 'bg-slate-200 text-slate-600' }
    default:
      return { text: '待确认', className: 'bg-slate-100 text-slate-600' }
  }
}

// 内联 SVG 图标组件
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const CalendarXIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="10" y1="14" x2="14" y2="18" />
    <line x1="14" y1="14" x2="10" y2="18" />
  </svg>
)

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-200">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
      {icon}
    </div>
    <div className="flex-1">
      <span className="block text-sm text-slate-500">{label}</span>
      <span className="block text-base font-medium text-slate-800">{value}</span>
    </div>
  </div>
)

function ExamInfoCard({ examInfo }: ExamInfoCardProps) {
  const status = getStatusLabel(examInfo.status)

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 shadow-lg shadow-blue-100/50">
      {/* 装饰性背景元素 */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/30 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-blue-200/20 blur-2xl" />

      {/* 标题区域 */}
      <div className="relative mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {examInfo.name}
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-300" />
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* 信息列表 */}
      <div className="relative space-y-2">
        <InfoItem icon={<BookOpenIcon />} label="考试科目" value={examInfo.subject} />
        <InfoItem icon={<ClockIcon />} label="考试时长" value={`${examInfo.duration} 分钟`} />
        <InfoItem
          icon={<CalendarIcon />}
          label="开考时间"
          value={formatDateTime(examInfo.startTime)}
        />
        <InfoItem
          icon={<CalendarXIcon />}
          label="结束时间"
          value={formatDateTime(examInfo.endTime)}
        />
      </div>
    </div>
  )
}

export default ExamInfoCard
