import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'

const HomePage = lazy(() => import('../pages/Accueil'))
const AboutPage = lazy(() => import('../pages/About'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  )
}


