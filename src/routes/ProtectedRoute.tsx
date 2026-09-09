import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export function ProtectedRoute() {
  const { session, account, loading } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />
  if (!account) return <Navigate to="/onboarding" replace />

  return <Outlet />
}

export function OnboardingRoute() {
  const { session, account, loading } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/signup" replace />
  if (account) return <Navigate to="/app" replace />

  return <Outlet />
}
