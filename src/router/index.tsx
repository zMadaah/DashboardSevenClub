import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { LoginPage } from '../auth'
import { HomePage } from '../features/home'
import { PaymentsPage } from '../features/payments'
import { UsersPage } from '../features/users'
import { ChatPage } from '../features/chat'
import { EventsPage } from '../features/events'
import { AntiCheatPage } from '../features/anticheat'
import { AnalyticsPage } from '../features/analytics'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pagamentos" element={<PaymentsPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/anti-cheat" element={<AntiCheatPage />} />
          <Route path="/analises" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}