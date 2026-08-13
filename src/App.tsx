import { lazy, Suspense, type ComponentType } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

const lazyNamed = <T extends Record<string, unknown>>(loader: () => Promise<T>, name: keyof T) =>
  lazy(async () => ({ default: (await loader())[name] as ComponentType }))

const AdminPage = lazyNamed(() => import('./pages/admin/AdminPage'), 'AdminPage')
const AdminManagementPage = lazyNamed(
  () => import('./pages/admin/pages/AdminManagementPage'),
  'AdminManagementPage'
)
const DashboardPage = lazyNamed(() => import('./pages/admin/pages/DashboardPage'), 'DashboardPage')
const ExamManagementPage = lazyNamed(
  () => import('./pages/admin/pages/ExamManagementPage'),
  'ExamManagementPage'
)
const ExportPage = lazyNamed(() => import('./pages/admin/pages/ExportPage'), 'ExportPage')
const ProblemManagementPage = lazyNamed(
  () => import('./pages/admin/pages/ProblemManagementPage'),
  'ProblemManagementPage'
)
const StudentDetailPage = lazyNamed(
  () => import('./pages/admin/pages/StudentDetailPage'),
  'StudentDetailPage'
)
const StudentListPage = lazyNamed(
  () => import('./pages/admin/pages/StudentListPage'),
  'StudentListPage'
)
const LoginPage = lazy(() => import('./pages/login/LoginPage'))
const MainPage = lazyNamed(() => import('./pages/main/MainPage'), 'MainPage')
const SubmittedPage = lazyNamed(() => import('./pages/main/SubmittedPage'), 'SubmittedPage')

function PageFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-sm text-kx-subtext">加载中...</div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/submitted" element={<SubmittedPage />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="students" element={<StudentListPage />} />
            <Route path="students/:id" element={<StudentDetailPage />} />
            <Route path="export" element={<ExportPage />} />
            <Route path="admins" element={<AdminManagementPage />} />
            <Route path="exams" element={<ExamManagementPage />} />
            <Route path="problems" element={<ProblemManagementPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
