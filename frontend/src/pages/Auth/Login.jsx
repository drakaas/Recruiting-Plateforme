import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../utils/config'
import { useAuth } from '../../context/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      login({ id: data.id, email: data.email })
      navigate('/candidat/espace', { replace: true })
    } catch (err) {
      setError('Email ou mot de passe invalide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground mb-6">Connexion</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-lg">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}






