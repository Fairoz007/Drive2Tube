import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from '@clerk/clerk-react'
import { AppShell } from './components/layout/AppShell'
import { SignInPage } from './pages/SignIn'
import { OverviewPage } from './pages/Overview'
import { ProfilesPage } from './pages/Profiles'
import { SchedulerPage } from './pages/Scheduler'
import { QueuePage } from './pages/Queue'
import { TitlesPage } from './pages/Titles'
import { ThumbnailsPage } from './pages/Thumbnails'
import { LogsPage } from './pages/Logs'
import { SettingsPage } from './pages/Settings'
import { UploadPage } from './pages/Upload'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2196F3]" />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return <AppShell>{children}</AppShell>
}

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfilesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scheduler"
        element={
          <ProtectedRoute>
            <SchedulerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/queue"
        element={
          <ProtectedRoute>
            <QueuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/titles"
        element={
          <ProtectedRoute>
            <TitlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thumbnails"
        element={
          <ProtectedRoute>
            <ThumbnailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <LogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
