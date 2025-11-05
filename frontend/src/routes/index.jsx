import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'

const HomePage = lazy(() => import('../pages/Accueil'))
const JobsPage = lazy(() => import('../pages/Jobs'))
const JobDetailsPage = lazy(() => import('../pages/Jobs/Details'))
const AboutPage = lazy(() => import('../pages/About'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))
const SignupPage = lazy(() => import('../pages/Auth/Signup'))
const CreateCandidateProfilePage = lazy(() => import('../pages/Candidat/CreateProfile'))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/candidat/creer-profil" element={<CreateCandidateProfilePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  )
}


