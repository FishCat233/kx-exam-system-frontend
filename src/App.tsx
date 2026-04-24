import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import { AdminPage } from './pages/admin/AdminPage'
import { AdminManagementPage } from './pages/admin/pages/AdminManagementPage'
import { DashboardPage } from './pages/admin/pages/DashboardPage'
import { ExamManagementPage } from './pages/admin/pages/ExamManagementPage'
import { ExportPage } from './pages/admin/pages/ExportPage'
import { ProblemManagementPage } from './pages/admin/pages/ProblemManagementPage'
import { StudentDetailPage } from './pages/admin/pages/StudentDetailPage'
import { StudentListPage } from './pages/admin/pages/StudentListPage'
import LoginPage from './pages/login/LoginPage'
import { MainPage } from './pages/main/MainPage'
import { SubmittedPage } from './pages/main/SubmittedPage'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
