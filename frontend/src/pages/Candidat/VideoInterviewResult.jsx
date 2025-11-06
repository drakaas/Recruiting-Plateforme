import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, ArrowRight, Sparkles } from 'lucide-react'
import { API_BASE_URL } from '../../utils/config'

export default function VideoInterviewResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const appId = state?.id || ''
  const jobTitle = state?.jobTitle || 'Entretien vidéo'
  const company = state?.company || 'Entreprise'
  const [score, setScore] = useState(state?.score ?? null)
  const [status, setStatus] = useState('Présélectionné')
  const total = state?.total ?? 3
  const answered = state?.answered ?? total

  const handleBackToSpace = () => {
    navigate('/candidat/espace', { replace: true })
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!appId) return
      try {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/applications/${encodeURIComponent(appId)}`)
        if (!res.ok) throw new Error('load_failed')
        const data = await res.json()
        if (!cancelled) {
          if (typeof data?.interviewScore === 'number') setScore(data.interviewScore)
          if (data?.status) {
            setStatus(data.status === 'preselectionne' ? 'Présélectionné' : data.status)
          }
        }
      } catch (_e) {
        // keep fallback state
      }
    }
    load()
    return () => { cancelled = true }
  }, [appId])

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-primary/10 py-16 px-4">
      <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-border/50 bg-white/95 p-10 text-slate-800 shadow-2xl">
        <header className="flex flex-col items-center gap-4 text-center">
          <Trophy size={64} className="text-primary drop-shadow" />
          <h1 className="text-3xl font-bold text-slate-900">Bravo ! Quiz vidéo terminé</h1>
          <p className="text-base text-slate-600">
            {company} analysera bientôt votre entretien pour le poste <strong>{jobTitle}</strong>.
          </p>
        </header>

        <section className="grid gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 text-primary">
          <p className="text-sm font-semibold uppercase tracking-wide">Résumé</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <HighlightCard label="Score" value={`${(score ?? 0)}/100`} />
            <HighlightCard label="Questions" value={`${answered} / ${total}`} />
            <HighlightCard label="Statut" value={status} />
          </div>
        </section>

        <section className="rounded-3xl border border-border/50 bg-secondary/40 p-6 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" /> Merci pour votre participation ! L'équipe recrutement reprendra contact avec vous rapidement.
          </p>
          <p className="mt-3">
            En attendant, explorez d'autres opportunités ou complétez votre profil pour maximiser vos chances.
          </p>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border/60 bg-white/70 p-6 text-sm text-muted-foreground sm:flex-row">
          <div>
            <p className="text-slate-600">Continuez sur Success Pool pour suivre l'avancement de vos candidatures.</p>
          </div>
          <button
            type="button"
            onClick={handleBackToSpace}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Retour à mon espace <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </main>
  )
}

function HighlightCard({ label, value }) {
  return (
    <div className="space-y-1 rounded-2xl border border-primary/20 bg-white/80 p-4 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-primary/70">{label}</p>
      <p className="text-xl font-semibold text-primary">{value}</p>
    </div>
  )
}