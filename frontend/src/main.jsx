import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/accueil.css'
import AppRoutes from './routes'
import { AuthProvider } from './context/useAuth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </StrictMode>,
)
