import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  CalendarDays,
  Building2,
  Share2,
  Sparkles,
  Trash2,
  Users,
  Eye,
  Target,
  MapPin,
  Briefcase,
  Clock3,
  FileText,
  X,
} from "lucide-react"
import { useAuth } from "../../context/useAuth"
import { RECOMMENDATION_SEED } from "./recommendation-seed"

const RECOMMENDATIONS_STORAGE_KEY = "success-pool-recommendations"

const VIEW_FILTERS = [
  { value: "all", label: "Toutes les recommandations" },
  { value: "mine", label: "Mes recommandations" },
]

const STATUS_BADGES = {
  recommended: {
    label: "Recommandé",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
  recruited: {
    label: "Recruté",
    className: "border-emerald-300 bg-emerald-50 text-emerald-600",
  },
}

const normalizeEntry = (entry) => ({
  ...entry,
  status: entry?.status ?? "recommended",
  scoreDetails: Array.isArray(entry?.scoreDetails) ? entry.scoreDetails : [],
})

const mergeWithSeed = (entries) => {
  const merged = new Map()
  RECOMMENDATION_SEED.forEach((item) => merged.set(item.candidateId, item))
  entries
    .filter((entry) => entry && entry.candidateId)
    .forEach((entry) => merged.set(entry.candidateId, entry))
  return Array.from(merged.values())
}

const loadRecommendations = () => {
  if (typeof window === "undefined") {
    return RECOMMENDATION_SEED
  }

  try {
    const stored = window.localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY)
    if (!stored) {
      window.localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(RECOMMENDATION_SEED))
      return RECOMMENDATION_SEED
    }
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(RECOMMENDATION_SEED))
      return RECOMMENDATION_SEED
    }
    const merged = mergeWithSeed(parsed)
    window.localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(merged))
    return merged
  } catch {
    return RECOMMENDATION_SEED
  }
}

const persistRecommendations = (entries) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const merged = mergeWithSeed(entries ?? [])
    window.localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // Stockage indisponible
  }
}

const formatDate = (isoString) => {
  if (!isoString) {
    return "Date non renseignée"
  }

  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString))
  } catch {
    return isoString
  }
}

export default function RecruiterRecommendations() {
  const { user } = useAuth()
  const [entries, setEntries] = useState(() => loadRecommendations().map(normalizeEntry))
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedEntry, setSelectedEntry] = useState(null)

  const myCompany = (() => {
    const c = user?.company
    if (!c) return null
    if (typeof c === 'string') return c.toLowerCase()
    if (typeof c === 'object') return (c.name || '').toLowerCase() || null
    return null
  })()
  const canFilterMine = Boolean(myCompany)

  useEffect(() => {
    setEntries(loadRecommendations().map(normalizeEntry))
  }, [])

  useEffect(() => {
    persistRecommendations(entries)
  }, [entries])

  useEffect(() => {
    if (!selectedEntry) {
      return
    }

  const latest = entries.find((entry) => entry.candidateId === selectedEntry.candidateId)
    if (!latest) {
      setSelectedEntry(null)
      return
    }

    if (latest !== selectedEntry) {
      setSelectedEntry(latest)
    }
  }, [entries, selectedEntry])

  const filteredEntries = useMemo(() => {
    if (selectedFilter === "mine") {
      if (!myCompany) {
        return []
      }
      return entries.filter((entry) => (entry.recommendedBy ?? "").toLowerCase() === myCompany)
    }
    return entries
  }, [entries, selectedFilter, myCompany])

  const filteredCompanies = useMemo(
    () => Array.from(new Set(filteredEntries.map((entry) => entry.recommendedBy))).filter(Boolean),
    [filteredEntries],
  )

  const myEntriesCount = useMemo(() => {
    if (!myCompany) {
      return 0
    }
    return entries.filter((entry) => (entry.recommendedBy ?? "").toLowerCase() === myCompany).length
  }, [entries, myCompany])

  const handleRemoveEntry = (candidateId) => {
    setSelectedEntry((current) => (current?.candidateId === candidateId ? null : current))
    setEntries((prev) => prev.filter((entry) => entry.candidateId !== candidateId))
  }

  const handleClearAll = () => {
    setSelectedEntry(null)
    setEntries([])
  }

  const handleMarkRecruited = (candidateId) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.candidateId === candidateId
          ? normalizeEntry({ ...entry, status: "recruited" })
          : entry,
      ),
    )
  }

  return (
    <main className="bg-background">
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-24">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/10 via-background to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-accent/10 via-background to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <Share2 size={16} /> Talents recommandés
            </span>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Recommandations Success Pool</h1>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              Retrouvez les candidats que vos pairs ont recommandés. Chaque profil a été préqualifié et partage son replay IA, son score et le poste cible.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
                <Users size={16} /> {filteredEntries.length} candidat(s) affichés
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
                <Building2 size={16} /> {filteredCompanies.length} entreprise(s)
              </span>
              <Link
                to="/recruiter"
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                Retour au portail recruteur
              </Link>
              {entries.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 font-semibold text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 size={16} /> Vider la liste
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
              Filtrer par
              {VIEW_FILTERS.map((filter) => {
                const isActive = selectedFilter === filter.value
                const isMine = filter.value === "mine"
                const count = isMine ? myEntriesCount : entries.length
                const disabled = isMine && !canFilterMine
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedFilter(filter.value)}
                    disabled={disabled}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/70 bg-white text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary"
                    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    {filter.label}
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary/80">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-10 space-y-5">
            {filteredEntries.length === 0 ? (
              entries.length === 0 ? (
                <div className="rounded-4xl border border-dashed border-border/60 bg-white/90 p-10 text-center text-sm text-muted-foreground">
                  Aucun talent recommandé pour le moment. Partagez un profil depuis le portail recruteur pour l'ajouter ici.
                </div>
              ) : selectedFilter === "mine" ? (
                <div className="rounded-4xl border border-dashed border-border/60 bg-white/90 p-10 text-center text-sm text-muted-foreground">
                  Vous n'avez pas encore partagé de candidat. Depuis le portail recruteur, cliquez sur « Recommander » pour alimenter cette vue.
                </div>
              ) : (
                <div className="rounded-4xl border border-dashed border-border/60 bg-white/90 p-10 text-center text-sm text-muted-foreground">
                  Aucun talent ne correspond aux critères sélectionnés.
                </div>
              )
            ) : (
              filteredEntries.map((entry) => {
                const statusDescriptor = STATUS_BADGES[entry.status] ?? STATUS_BADGES.recommended

                return (
                <article
                  key={entry.candidateId}
                  className="space-y-4 rounded-4xl border border-border/60 bg-white/95 p-6 shadow-xl backdrop-blur"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Recommandé par {entry.recommendedBy ?? "À préciser"}
                      </p>
                      <h2 className="text-xl font-semibold text-foreground">{entry.name}</h2>
                      <p className="text-sm text-muted-foreground">{entry.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-semibold uppercase tracking-[0.24em] text-primary">
                        Score {entry.score}
                      </span>
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.24em] ${statusDescriptor.className}`}>
                        {statusDescriptor.label}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1 font-semibold text-muted-foreground">
                        <CalendarDays size={14} /> {formatDate(entry.recommendedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/60 bg-secondary/60 px-4 py-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      <Sparkles size={14} /> Poste recommandé
                    </p>
                    <p className="mt-2 text-sm text-foreground">{entry.recommendedFor ?? "À compléter"}</p>
                    {(entry.offer || entry.availability) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {entry.offer?.location && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1">
                            <MapPin size={12} className="text-primary" /> {entry.offer.location}
                          </span>
                        )}
                        {entry.offer?.contractType && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1">
                            <Briefcase size={12} className="text-primary" /> {entry.offer.contractType}
                          </span>
                        )}
                        {entry.availability && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1">
                            <Clock3 size={12} className="text-primary" /> {entry.availability}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {entry.candidateNotes && (
                    <p className="rounded-3xl border border-border/60 bg-white px-4 py-3 text-sm text-muted-foreground">
                      {entry.candidateNotes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>Partagé via Success Pool · visible par tous les recruteurs abonnés.</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye size={14} /> Voir les détails
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveEntry(entry.candidateId)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
                      >
                        <Trash2 size={14} /> Retirer
                      </button>
                    </div>
                  </div>
                </article>
              )})
            )}
          </div>
        </div>
      </section>

      {selectedEntry && (
        <RecommendationDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onRecruit={handleMarkRecruited}
        />
      )}
    </main>
  )
}

function RecommendationDetailModal({ entry, onClose, onRecruit }) {
  const offer = entry.offer ?? null
  const statusDescriptor = STATUS_BADGES[entry.status] ?? STATUS_BADGES.recommended
  const isRecruited = entry.status === "recruited"
  const contactEmail = entry.contactEmail ?? ""
  const contactPhone = entry.contactPhone ?? ""
  const scoreDetails = Array.isArray(entry.scoreDetails) ? entry.scoreDetails : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[calc(100vh-3rem)] max-w-4xl overflow-y-auto rounded-4xl border border-border/70 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer les détails de la recommandation"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="space-y-6">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Recommandé par {entry.recommendedBy ?? "À préciser"}
            </p>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{entry.name}</h2>
            <p className="text-sm text-muted-foreground">{entry.role}</p>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${statusDescriptor.className}`}>
              {statusDescriptor.label}
            </span>
          </header>

          <section className="grid gap-4 rounded-3xl border border-border/60 bg-secondary/60 p-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <Sparkles size={14} /> Détails de la recommandation
              </p>
              <p className="flex items-center gap-2">
                <Target size={16} className="text-primary" /> {entry.recommendedFor ?? "Poste à confirmer"}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays size={16} className="text-primary" /> {formatDate(entry.recommendedAt)}
              </p>
              <p className="flex items-center gap-2">
                <Building2 size={16} className="text-primary" /> {entry.recommendedBy ?? "Entreprise à préciser"}
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <Users size={14} /> Profil candidat
              </p>
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-foreground">
                  <Sparkles size={16} className="text-primary" /> Score {entry.score}
                </p>
                {scoreDetails.length > 0 && (
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {scoreDetails.map((detail, index) => (
                      <li key={`${detail.label}-${index}`} className="flex items-start gap-2">
                        <span className="font-medium text-foreground">{detail.label}</span>
                        <span>{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {entry.availability && (
                <p className="flex items-center gap-2">
                  <Clock3 size={16} className="text-primary" /> {entry.availability}
                </p>
              )}
            </div>
          </section>

          {entry.candidateNotes && (
            <section className="rounded-3xl border border-border/60 bg-white px-4 py-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <FileText size={14} /> Points forts du profil
              </p>
              <p className="mt-2 leading-relaxed text-foreground">{entry.candidateNotes}</p>
            </section>
          )}

          <section className="rounded-3xl border border-border/60 bg-secondary/60 px-4 py-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Briefcase size={14} /> Offre associée
            </p>
            {offer ? (
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="text-base font-semibold text-foreground">{offer.title}</p>
                  {offer.team && <p className="text-xs text-muted-foreground">{offer.team}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {offer.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1">
                      <MapPin size={12} className="text-primary" /> {offer.location}
                    </span>
                  )}
                  {offer.contractType && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1">
                      <Briefcase size={12} className="text-primary" /> {offer.contractType}
                    </span>
                  )}
                  {offer.contractDuration && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1">
                      <Clock3 size={12} className="text-primary" /> {offer.contractDuration}
                    </span>
                  )}
                  {offer.salaryRange && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1">
                      <Sparkles size={12} className="text-primary" /> {offer.salaryRange}
                    </span>
                  )}
                </div>
                {offer.mission && <p className="leading-relaxed text-foreground">{offer.mission}</p>}
                {offer.keyPoints && offer.keyPoints.length > 0 && (
                  <ul className="space-y-2 text-sm text-foreground">
                    {offer.keyPoints.map((point) => (
                      <li key={`${offer.id}-${point}`} className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/mes-offres"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  Proposer cette offre
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Aucun détail d'offre n'a encore été associé à cette recommandation. Depuis le portail recruteur, complétez la fiche pour améliorer le partage.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-border/60 bg-white px-4 py-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Users size={14} /> Actions rapides
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Link
                to="/mes-offres"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <Briefcase size={14} /> Proposer une offre
              </Link>
              <a
                href={contactEmail ? `mailto:${contactEmail}` : undefined}
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  contactEmail
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : "cursor-not-allowed border-border/70 text-muted-foreground"
                }`}
                aria-disabled={!contactEmail}
              >
                <Share2 size={14} /> {contactEmail ? "Contacter" : "Contact indisponible"}
              </a>
              <button
                type="button"
                onClick={() => onRecruit(entry.candidateId)}
                disabled={isRecruited}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Target size={14} /> {isRecruited ? "Déjà recruté" : "Recruter"}
              </button>
            </div>
            {contactPhone && (
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Téléphone : {contactPhone}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
