import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { API_BASE_URL } from '../../utils/config'
import { Filter, X, CheckCircle, Clock, XCircle, Star, Eye, Briefcase, Check, MapPin, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const STATUS_LABELS = {
  soumis: 'Soumis',
  cv_traite: 'CV traité',
  rejete: 'Rejeté',
  accepte: 'Accepté',
  preselectionne: 'Présélectionné',
  en_attente_interview: "En attente d'interview",
}
const STATUS_CLASSES = {
  soumis: 'bg-slate-100 text-slate-700 border-slate-200',
  cv_traite: 'bg-amber-100 text-amber-700 border-amber-200',
  rejete: 'bg-red-100 text-red-700 border-red-200',
  accepte: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  preselectionne: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  en_attente_interview: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default function MyApplicationsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const url = `${API_BASE_URL.replace(/\/$/, '')}/applications?candidateId=${encodeURIComponent(user.id)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to load applications')
        const data = await res.json()
        if (!cancelled) setApps(Array.isArray(data) ? data : [])
      } catch (_e) {
        if (!cancelled) setApps([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.id])

  const handleDelete = async (id) => {
    if (!id) return
    const confirm = window.confirm('Supprimer cette candidature ?')
    if (!confirm) return
    try {
      const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/applications/${encodeURIComponent(id)}`
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete_failed')
      setApps((prev) => prev.filter((a) => (a.id || a._id) !== id))
    } catch (_e) {
      // no-op UI error for now
    }
  }

  const filteredApps = useMemo(() => {
    const filtered = apps.filter((a) => {
      const title = (a.jobTitle || a.offerMeta?.title || '').toLowerCase()
      const comp = (a.companyName || a.offerMeta?.company?.name || '').toLowerCase()
      const matchesStatus = !selectedStatus || a.status === selectedStatus
      const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || comp.includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
    filtered.sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime()
      const db = new Date(b.createdAt || 0).getTime()
      return sortBy === 'oldest' ? da - db : db - da
    })
    return filtered
  }, [apps, selectedStatus, searchQuery, sortBy])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'soumis':
        return <Clock size={16} />
      case 'cv_traite':
        return <Eye size={16} />
      case 'preselectionne':
        return <Star size={16} />
      case 'accepte':
        return <CheckCircle size={16} />
      case 'rejete':
        return <XCircle size={16} />
      case 'en_attente_interview':
        return <Clock size={16} />
      default:
        return null
    }
  }

  const StatusTimelineLikeEspace = ({ status }) => {
    const steps = [
      { key: 'pending-review', label: 'En attente' },
      { key: 'interview-scheduled', label: 'Entretien planifié' },
      { key: 'interview-passed', label: 'Entretien passé' },
      { key: status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'decision', label: status === 'accepted' ? 'Accepté' : status === 'rejected' ? 'Refusé' : 'Décision en attente' },
    ]
    let currentIndex = steps.findIndex((s) => s.key === status)
    if (status === 'accepted' || status === 'rejected') currentIndex = steps.length - 1
    if (currentIndex < 0) currentIndex = 0
    return (
      <div className="flex flex-col gap-3 rounded-3xl bg-secondary/20 p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:gap-4">
        {steps.map((step, index) => {
          const completed = index < currentIndex
          const current = index === currentIndex
          const badgeClasses = completed
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
            : current
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border/60 text-slate-400'
          return (
            <div key={step.key || index} className="flex items-center gap-2 sm:min-w-[140px]">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold ${badgeClasses}`}>
                {completed ? <Check size={14} /> : index + 1}
              </span>
              <span className={current ? 'font-semibold text-slate-700' : 'text-slate-500'}>{step.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const mapBackendToEspaceStatus = (s) => {
    switch (s) {
      case 'rejete': return 'rejected'
      case 'accepte': return 'accepted'
      case 'cv_traite': return 'interview-scheduled'
      case 'preselectionne': return 'interview-passed'
      case 'soumis': return 'pending-review'
      case 'en_attente_interview': return 'pending-review'
      default: return 'pending-review'
    }
  }

  const ActionButtonLikeEspace = ({ id }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={() => navigate(`/candidat/instructions?id=${encodeURIComponent(id || '')}`)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
      >
        <PlayCircle size={14} /> Passer l'entretien vidéo
      </button>
      <span className="text-[11px] text-slate-400">Votre session vidéo s'ouvrira dans une nouvelle page.</span>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary via-primary/80 to-accent overflow-hidden pt-14 pb-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Briefcase size={28} className="text-primary-foreground" />
            <h1 className="text-4xl font-bold text-primary-foreground">Mes candidatures</h1>
          </div>
          <p className="text-primary-foreground/90">Suivez l'avancement de vos candidatures et vos opportunités</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Filter size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Filtrer mes candidatures</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Rechercher</label>
              <input
                type="text"
                placeholder="Titre, entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              >
                <option value="">Tous les statuts</option>
                <option value="soumis">Soumis</option>
                <option value="cv_traite">CV Traité</option>
                <option value="preselectionne">Présélectionné</option>
                <option value="accepte">Accepté</option>
                <option value="rejete">Rejeté</option>
                <option value="en_attente_interview">En attente d'interview</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              >
                <option value="recent">Plus récentes</option>
                <option value="oldest">Plus anciennes</option>
              </select>
            </div>
          </div>
          {(searchQuery || selectedStatus || sortBy !== 'recent') && (
            <button
              onClick={() => { setSelectedStatus(''); setSearchQuery(''); setSortBy('recent') }}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-semibold hover:bg-primary/5 px-3 py-1.5 rounded-lg"
            >
              <X size={16} /> Réinitialiser
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {filteredApps.length} {filteredApps.length > 1 ? 'candidatures' : 'candidature'}
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : filteredApps.length > 0 ? (
            <div className="grid gap-4">
              {filteredApps.map((a) => {
                const appId = a.id || a._id
                const title = a.jobTitle || a.offerMeta?.title || 'Offre'
                const companyName = a.companyName || a.offerMeta?.company?.name || ''
                const appliedAt = a.createdAt ? new Date(a.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
                const mapped = mapBackendToEspaceStatus(a.status)
                const statusCls = STATUS_CLASSES[a.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                const link = a.offerMeta?.id ? `/jobs/${a.offerMeta.id}` : null
                const score = typeof a.compatibilityScore === 'number' ? a.compatibilityScore : null
                const reason = a.rejectionReason || null
                const interviewScore = typeof a.interviewScore === 'number' ? a.interviewScore : null
                return (
                  <article key={appId} className="space-y-4 rounded-3xl border border-border/60 bg-white/95 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-primary/70">{companyName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {link ? (
                            <Link to={link} className="text-lg font-semibold text-slate-900">{title}</Link>
                          ) : (
                            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                          )}
                          {typeof score === 'number' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                              Compatibilité {score}%
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {appliedAt ? `Candidature envoyée le ${appliedAt}` : ''}
                        </p>
                        {a.status === 'rejete' && reason ? (
                          <p className="mt-1 text-xs text-rose-600">Raison: {reason}</p>
                        ) : null}
                        {interviewScore != null && (
                          <p className="mt-2 text-xs text-slate-500">Score entretien: <span className="font-semibold text-slate-700">{interviewScore}%</span></p>
                        )}
                      </div>
                      <div className={`px-4 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 whitespace-nowrap border ${statusCls}`}>
                        {getStatusIcon(a.status)}
                        {STATUS_LABELS[a.status] || a.status}
                      </div>
                    </div>

                    <StatusTimelineLikeEspace status={mapped} />

                    {mapped === 'interview-scheduled' ? (
                      <ActionButtonLikeEspace id={appId} />
                    ) : null}
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Briefcase size={32} className="text-primary" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Aucune candidature</p>
              <p className="text-muted-foreground mb-6">Aucune candidature ne correspond à vos critères.</p>
              <button
                onClick={() => { setSelectedStatus(''); setSearchQuery(''); setSortBy('recent') }}
                className="px-6 py-2.5 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


