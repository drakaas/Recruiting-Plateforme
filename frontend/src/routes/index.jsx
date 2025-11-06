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
const RecruiterPlanPage = lazy(() => import('../pages/Recruiter/Plan'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))
const SignupPage = lazy(() => import('../pages/Auth/Signup'))
const CreateCandidateProfilePage = lazy(() => import('../pages/Candidat/CreateProfile'))
const LoginPage = lazy(() => import('../pages/Auth/Login'))
const EspaceCandidatPage = lazy(() => import('../pages/Candidat/Espace'))
const CandidateProfileReadOnlyPage = lazy(() => import('../pages/Candidat/Profile'))
const MyApplicationsPage = lazy(() => import('../pages/Candidat/Applications'))
const RecruiterSignupPage = lazy(() => import('../pages/Auth/RecruiterSignup'))
const VideoInterviewInstructionsPage = lazy(() => import('../pages/Candidat/VideoInterviewInstructions'))
const VideoInterviewQuizPage = lazy(() => import('../pages/Candidat/VideoInterviewQuiz'))
const VideoInterviewResultPage = lazy(() => import('../pages/Candidat/VideoInterviewResult'))

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
            <Route path="/login" element={<LoginPage />} />
              <Route path="/candidat/creer-profil" element={<CreateCandidateProfilePage />} />
            <Route path="/candidat/profil" element={<CandidateProfileReadOnlyPage />} />
            <Route path="/applications" element={<MyApplicationsPage />} />
            <Route path="/candidat/espace" element={<EspaceCandidatPage />} />
            <Route path="/candidat/instructions" element={<VideoInterviewInstructionsPage />} />
            <Route path="/candidat/quiz" element={<VideoInterviewQuizPage />} />
            <Route path="/candidat/quiz/resultat" element={<VideoInterviewResultPage />} />
            <Route path="/recruiter/signup" element={<RecruiterSignupPage />} />
              <Route path="/recruiter" element={<RecruiterPage />} />
              <Route path="/mes-offres" element={<MyOffersPage />} />
              <Route path="/recommandations" element={<RecommendationsPage />} />
              <Route path="/recruiter/plan" element={<RecruiterPlanPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}


