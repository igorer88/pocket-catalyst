import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import DashboardNotFoundPage from '@/pages/dashboard/NotFoundPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import TransactionsPage from '@/pages/TransactionsPage'
import { useAuthStore } from '@/stores'

const DashboardOverviewPage = () => <HomePage />
const DashboardTransactionsPage = () => <TransactionsPage />
const DashboardAccountsPage = () => <div>Accounts Page</div>
const DashboardSettingsPage = () => <SettingsPage />

const AppRouter = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<DashboardOverviewPage />} /> {/* /dashboard */}
          <Route path="transactions" element={<DashboardTransactionsPage />} />
          {/* /dashboard/transactions */}
          <Route path="accounts" element={<DashboardAccountsPage />} />
          {/* /dashboard/settings */}
          <Route path="settings" element={<DashboardSettingsPage />} />
          {/* /dashboard/accounts */}
          <Route path="*" element={<DashboardNotFoundPage />} />
        </Route>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
