import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../utils/config'
import { useAuth } from '../../context/useAuth'

export default function RecruiterSignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companies, setCompanies] = useState([])
  const [mode, setMode] = useState('select') // 'select' | 'create'
  const [companyId, setCompanyId] = useState('')
  const [company, setCompany] = useState({ name: '', email: '', address: '', imageUrl: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/companies`)
        const data = await res.json()
        if (!ignore) setCompanies(data)
      } catch {}
    }
    load()
    return () => { ignore = true }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let finalCompanyId = companyId
      if (mode === 'create') {
        const cr = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/companies`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(company),
        })
        if (!cr.ok) throw new Error(await cr.text())
        const cj = await cr.json()
        finalCompanyId = cj.id
      }
      const ur = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/users`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'recruiter', companyId: finalCompanyId }),
      })
      if (!ur.ok) throw new Error(await ur.text())
      const uj = await ur.json()
      login({ id: uj.id, email })
      navigate('/recruiter', { replace: true })
    } catch (err) {
      setError('Inscription recruteur échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl p-8 shadow-sm space-y-6">
        <h1 className="text-2xl font-bold">Inscription Recruteur</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className={`px-4 py-2 rounded-lg border ${mode==='select'?'border-primary text-primary':'border-border/50'}`} onClick={() => setMode('select')}>Sélectionner entreprise</button>
          <button type="button" className={`px-4 py-2 rounded-lg border ${mode==='create'?'border-primary text-primary':'border-border/50'}`} onClick={() => setMode('create')}>Créer entreprise</button>
        </div>

        {mode === 'select' ? (
          <div>
            <label className="block text-sm font-medium mb-1">Entreprise existante</label>
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg">
              <option value="">Choisir...</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input type="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input type="text" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Image (URL)</label>
              <input type="url" value={company.imageUrl} onChange={(e) => setCompany({ ...company, imageUrl: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg h-28" />
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-lg">
          {loading ? 'Création...' : 'Créer mon compte recruteur'}
        </button>
      </form>
    </div>
  )
}






