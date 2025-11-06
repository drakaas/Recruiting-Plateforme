import { Children, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, Clock, PlayCircle, Bookmark, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export default function EspaceCandidatPage() {
  const navigate = useNavigate()
  const { user, savedJobs, applications } = useAuth()

  const upcomingApplications = useMemo(() => applications.slice(0, 5), [applications])
  const greeting = user?.email ? user.email.split('@')[0] : 'Candidat'

  const handleLaunchInterview = (application) => {
    const interviewConfig = application?.interviewConfig || {
      jobId: application.jobId,
      jobTitle: application.jobTitle,
      company: application.company,
      interviewDuration: 8,
      questionCount: 3,
    }
    navigate('/candidat/instructions', { state: interviewConfig })
  }

  return (
  <main className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="rounded-3xl border border-border/60 bg-white/95 p-8 shadow-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-primary/70">Tableau de bord</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Bonjour {greeting} 👋</h1>
          <p className="mt-3 text-base text-slate-600">
            Retrouvez vos offres sauvegardées, vos candidatures et démarrez vos entretiens vidéo programmés.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-6">
            <Panel title="Offres sauvegardées" icon={Bookmark} emptyMessage="Vous n'avez pas encore sauvegardé d'offre.">
              {savedJobs.map((job) => (
                <article key={job.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/95 p-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    Voir l'offre
                  </button>
                </article>
              ))}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Mes candidatures" icon={CalendarDays} emptyMessage="Vous n'avez pas encore postulé à une offre.">
              {upcomingApplications.map((application) => (
                <article key={application.jobId} className="space-y-3 rounded-2xl border border-border/60 bg-white/95 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{application.jobTitle}</h3>
                      <p className="text-xs text-slate-500">{application.company}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Candidature envoyée le {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusPill status={application.status} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin size={14} /> {application.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={14} /> {application.type}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLaunchInterview(application)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    <PlayCircle size={14} /> Passer l'entretien vidéo
                  </button>
                </article>
              ))}
            </Panel>
          </div>
        </section>
      </div>
    </main>
  )
}

function Panel({ title, icon: Icon, emptyMessage, children }) {
  const items = Array.isArray(children) ? children : Children.toArray(children)
  const hasItems = items.length > 0 && items.some(Boolean)
  return (
    <section className="rounded-3xl border border-border/60 bg-white/95 p-6 shadow-lg">
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary/70">
        <Icon size={18} /> {title}
      </div>
      {hasItems ? <div className="space-y-4">{items}</div> : <EmptyMessage message={emptyMessage} />}
    </section>
  )
}

function EmptyMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-secondary/30 py-8 text-center text-xs text-slate-500">
      <CheckCircle2 size={32} className="text-slate-300" />
      <p>{message}</p>
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    'pending-review': {
      label: 'En attente de revue',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    scheduled: {
      label: 'Entretien planifié',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    rejected: {
      label: 'Non retenu',
      className: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    accepted: {
      label: 'Retenu',
      className: 'bg-primary/10 text-primary border-primary/30',
    },
  }
  const meta = map[status] || map['pending-review']
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${meta.className}`}>
      {meta.label}
    </span>
  )
}




