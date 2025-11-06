import { Children, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  MapPin,
  Clock,
  PlayCircle,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ClipboardList,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export default function EspaceCandidatPage() {
  const navigate = useNavigate()
  const { user, savedJobs, applications, updateApplicationStatus } = useAuth()
  const [activeFilter, setActiveFilter] = useState('saved')

  const sortedApplications = useMemo(() => {
    const priorityOrder = ['pending-review', 'interview-scheduled', 'interview-passed', 'accepted', 'rejected']
    return [...applications]
      .sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.status)
        const bIndex = priorityOrder.indexOf(b.status)
        return (aIndex === -1 ? priorityOrder.length : aIndex) - (bIndex === -1 ? priorityOrder.length : bIndex)
      })
      .slice(0, 5)
  }, [applications])
  const scheduledCount = useMemo(
    () => applications.filter((app) => app.status === 'interview-scheduled').length,
    [applications]
  )
  const greeting = user?.email ? user.email.split('@')[0] : 'Candidat'

  useEffect(() => {
    // Generate a compatibility score for any offer that does not have one yet.
    const awaitingCompatibility = applications.filter((app) => typeof app.compatibilityScore !== 'number')
    if (!awaitingCompatibility.length) return

    awaitingCompatibility.forEach((application) => {
      const score = Math.floor(Math.random() * 26) + 70
      updateApplicationStatus(application.jobId, application.status, { compatibilityScore: score })
    })
  }, [applications, updateApplicationStatus])

  useEffect(() => {
    // Simulate a quiz score whenever an interview is marked as passed without recorded results yet.
    const awaitingResult = applications.filter((app) => app.status === 'interview-passed' && !app.interviewResult)
    if (!awaitingResult.length) return

    awaitingResult.forEach((application) => {
      const score = Math.floor(Math.random() * 41) + 60
      updateApplicationStatus(application.jobId, 'interview-passed', {
        interviewResult: { score, date: new Date().toISOString() },
      })
    })
  }, [applications, updateApplicationStatus])

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
    <main className="min-h-screen bg-linear-to-br from-background via-background to-primary/10 py-12 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="grid gap-6">
          <section className="rounded-4xl border border-border/60 bg-white/95 p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Sparkles size={14} /> Tableau de bord
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Bonjour {greeting} 👋</h1>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  Pilotez vos candidatures, vos offres sauvegardées et lancez vos entretiens vidéo en un seul endroit.
                </p>
              </div>
              <div className="hidden shrink-0 rounded-3xl bg-linear-to-br from-primary/90 to-primary px-5 py-6 text-primary-foreground shadow-2xl sm:block">
                <p className="text-sm uppercase tracking-wide text-primary-foreground/70">Aperçu</p>
                <h2 className="mt-3 text-3xl font-semibold">{applications.length}</h2>
                <p className="text-xs text-primary-foreground/70">candidature{applications.length > 1 ? 's' : ''} envoyée{applications.length > 1 ? 's' : ''}</p>
                <div className="mt-6 space-y-2 text-sm text-primary-foreground/80">
                  <p className="inline-flex items-center gap-2"><CalendarDays size={16} /> {savedJobs.length} offre{savedJobs.length > 1 ? 's' : ''} sauvegardée{savedJobs.length > 1 ? 's' : ''}</p>
                  <p className="inline-flex items-center gap-2"><ClipboardList size={16} /> {scheduledCount} entretien{scheduledCount > 1 ? 's' : ''} à venir</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <QuickStat label="Offres sauvegardées" value={savedJobs.length} icon={Bookmark} accent="bg-primary/10 text-primary" />
              <QuickStat label="Candidatures" value={applications.length} icon={CalendarDays} accent="bg-emerald-100 text-emerald-700" />
              <QuickStat label="Entretiens" value={scheduledCount} icon={PlayCircle} accent="bg-indigo-100 text-indigo-700" />
            </div>
          </section>
        </header>
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Mes opportunités</h2>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/95 p-1 text-sm shadow-sm">
              <FilterChip label="Offres sauvegardées" active={activeFilter === 'saved'} onClick={() => setActiveFilter('saved')} />
              <FilterChip label="Candidatures" active={activeFilter === 'applications'} onClick={() => setActiveFilter('applications')} />
            </div>
          </div>

          {activeFilter === 'saved' ? (
            <Panel
              title="Offres sauvegardées"
              icon={Bookmark}
              emptyMessage="Vous n'avez pas encore sauvegardé d'offre."
              emptyActionLabel="Explorer les offres"
              onEmptyAction={() => navigate('/jobs')}
            >
              {savedJobs.map((job) => (
                <article key={job.id} className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white/95 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary/70">{job.company}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    Voir l'offre <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </Panel>
          ) : (
            <Panel
              title="Mes candidatures"
              icon={CalendarDays}
              emptyMessage="Vous n'avez pas encore postulé à une offre."
              emptyActionLabel="Postuler maintenant"
              onEmptyAction={() => navigate('/jobs')}
            >
              {sortedApplications.map((application) => (
                <article key={application.jobId} className="space-y-4 rounded-3xl border border-border/60 bg-white/95 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary/70">{application.company}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{application.jobTitle}</h3>
                        <CompatibilityBadge score={application.compatibilityScore} />
                      </div>
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

                  <StatusTimeline status={application.status} />

                  {application.interviewResult ? <InterviewScoreCard result={application.interviewResult} /> : null}

                  <ActionButton
                    application={application}
                    onLaunchInterview={() => handleLaunchInterview(application)}
                    onUpdateStatus={updateApplicationStatus}
                  />
                </article>
              ))}
            </Panel>
          )}
        </section>
      </div>
    </main>
  )
}

function Panel({ title, icon: IconComponent, emptyMessage, emptyActionLabel, onEmptyAction, children }) {
  const items = Array.isArray(children) ? children : Children.toArray(children)
  const hasItems = items.length > 0 && items.some(Boolean)
  return (
    <section className="rounded-4xl border border-border/60 bg-white/95 p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary/70">
          {IconComponent ? <IconComponent size={18} /> : null} {title}
        </div>
        {hasItems && onEmptyAction && emptyActionLabel && (
          <button
            type="button"
            onClick={onEmptyAction}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            {emptyActionLabel}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
      {hasItems ? (
        <div className="space-y-5">{items}</div>
      ) : (
        <EmptyMessage
          message={emptyMessage}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      )}
    </section>
  )
}

function EmptyMessage({ message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/70 bg-secondary/40 py-10 text-center">
      <CheckCircle2 size={36} className="text-slate-300" />
      <p className="max-w-xs text-sm text-slate-500">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          {actionLabel}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    'pending-review': {
      label: 'En attente',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    'interview-scheduled': {
      label: 'Entretien planifié',
      className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    'interview-passed': {
      label: 'Entretien passé',
      className: 'bg-sky-100 text-sky-700 border-sky-200',
    },
    accepted: {
      label: 'Candidature acceptée',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    rejected: {
      label: 'Candidature refusée',
      className: 'bg-rose-100 text-rose-700 border-rose-200',
    },
  }
  const meta = map[status] || map['pending-review']
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${meta.className}`}>
      {meta.label}
    </span>
  )
}

function StatusTimeline({ status }) {
  const baseSteps = [
    { key: 'pending-review', label: 'En attente' },
    { key: 'interview-scheduled', label: 'Entretien planifié' },
    { key: 'interview-passed', label: 'Entretien passé' },
  ]

  const decisionStep = status === 'accepted'
    ? { key: 'accepted', label: 'Accepté' }
    : status === 'rejected'
      ? { key: 'rejected', label: 'Refusé' }
      : { key: 'decision', label: 'Décision en attente' }

  const steps = [...baseSteps, decisionStep]
  let currentIndex = steps.findIndex((step) => step.key === status)
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

function CompatibilityBadge({ score }) {
  if (typeof score !== 'number') return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
      Compatibilité {score}%
    </span>
  )
}

function ActionButton({ application, onLaunchInterview, onUpdateStatus }) {
  const { status, jobId } = application

  if (status === 'accepted') {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
        Félicitations ! Votre candidature a été acceptée. Un recruteur vous contactera prochainement.
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
        Votre candidature n'a pas été retenue cette fois-ci.
      </div>
    )
  }

  if (status === 'interview-passed') {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
        <Loader2 size={14} className="animate-spin" />
        Entretien passé • décision en attente
      </div>
    )
  }

  if (status === 'pending-review') {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onUpdateStatus(jobId, 'interview-scheduled')}
          className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          <CalendarDays size={14} /> Planifier l'entretien vidéo
        </button>
        <span className="text-[11px] text-slate-400">En attente d'une invitation du recruteur. Simulez-la pour continuer.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={() => {
          onLaunchInterview()
          const score = Math.floor(Math.random() * 41) + 60
          onUpdateStatus(jobId, 'interview-passed', { interviewResult: { score, date: new Date().toISOString() } })
        }}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
      >
        <PlayCircle size={14} /> Passer l'entretien vidéo
      </button>
      <span className="text-[11px] text-slate-400">Votre session vidéo s'ouvrira dans une nouvelle page.</span>
    </div>
  )
}

function InterviewScoreCard({ result }) {
  const formattedDate = result?.date ? new Date(result.date).toLocaleString() : null
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Score entretien vidéo</p>
        {formattedDate ? <p className="text-[11px] text-slate-500">Passé le {formattedDate}</p> : null}
      </div>
      <div className="flex items-baseline gap-2 text-primary">
        <span className="text-3xl font-bold">{result?.score ?? '--'}</span>
        <span className="text-sm font-semibold">/100</span>
      </div>
    </div>
  )
}

function QuickStat({ label, value, icon: IconComponent, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border/60 bg-secondary/20 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>
        {IconComponent ? <IconComponent size={18} /> : null}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
        active ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-primary/10 hover:text-primary'
      }`}
    >
      {label}
    </button>
  )
}




