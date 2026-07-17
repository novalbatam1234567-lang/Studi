import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Schedule = lazy(() => import('./pages/Schedule'))
const IPKSimulator = lazy(() => import('./pages/IPKSimulator'))
const Tasks = lazy(() => import('./pages/Tasks'))
const FocusMode = lazy(() => import('./pages/FocusMode'))
const WeeklySummary = lazy(() => import('./pages/WeeklySummary'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
        <p className="text-sm text-gray-600">Memuat halaman...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingFallback />
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="ipk-simulator" element={<IPKSimulator />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="focus-mode" element={<FocusMode />} />
                  <Route path="weekly-summary" element={<WeeklySummary />} />
                </Route>
              </Routes>
            </Suspense>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
