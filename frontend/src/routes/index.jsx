import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { AuthProvider } from '../context/AuthProvider'

const HomePage = lazy(() => import('../pages/Accueil'))
const JobsPage = lazy(() => import('../pages/Jobs'))
const JobDetailsPage = lazy(() => import('../pages/Jobs/Details'))
const AboutPage = lazy(() => import('../pages/About'))
const RecruiterPage = lazy(() => import('../pages/Recruiter'))
const MyOffersPage = lazy(() => import('../pages/Recruiter/MyOffers'))
const RecommendationsPage = lazy(() => import('../pages/Recruiter/Recommendations'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))
const SignupPage = lazy(() => import('../pages/Auth/Signup'))
const CreateCandidateProfilePage = lazy(() => import('../pages/Candidat/CreateProfile'))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/candidat/creer-profil" element={<CreateCandidateProfilePage />} />
              <Route path="/recruiter" element={<RecruiterPage />} />
              <Route path="/mes-offres" element={<MyOffersPage />} />
              <Route path="/recommandations" element={<RecommendationsPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}


