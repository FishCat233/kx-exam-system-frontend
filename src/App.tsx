import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router'

import { AdminPage } from './pages/admin/AdminPage'
import { DashboardPage } from './pages/admin/pages/DashboardPage'
import { ExportPage } from './pages/admin/pages/ExportPage'
import { StudentDetailPage } from './pages/admin/pages/StudentDetailPage'
import { StudentListPage } from './pages/admin/pages/StudentListPage'
import LoginPage from './pages/login/LoginPage'
import { MainPage } from './pages/main/MainPage'

// 带 token 的跳转组件
function AdminIndexRedirect() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const to = token ? `/admin/dashboard?token=${token}` : '/admin/dashboard'
  return <Navigate to={to} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminIndexRedirect />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="students" element={<StudentListPage />} />
          <Route path="students/:id" element={<StudentDetailPage />} />
          <Route path="export" element={<ExportPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
