import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/accueil.css'
import AppRoutes from './routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
