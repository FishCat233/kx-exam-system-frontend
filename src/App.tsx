import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import LoginPage from './pages/login/LoginPage'
import { MainPage } from './pages/main/MainPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
