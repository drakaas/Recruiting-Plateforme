import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, Building2, Share2, Sparkles, Trash2, Users } from "lucide-react"
import { RECOMMENDATION_SEED } from "./recommendation-seed"

const RECOMMENDATIONS_STORAGE_KEY = "success-pool-recommendations"

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
  const [entries, setEntries] = useState(() => loadRecommendations())

  useEffect(() => {
    setEntries(loadRecommendations())
  }, [])

  useEffect(() => {
    persistRecommendations(entries)
  }, [entries])

  const uniqueCompanies = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.recommendedBy))).filter(Boolean),
    [entries],
  )

  const handleRemoveEntry = (candidateId) => {
    setEntries((prev) => prev.filter((entry) => entry.candidateId !== candidateId))
  }

  const handleClearAll = () => {
    setEntries([])
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

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
              <Users size={16} /> {entries.length} candidat(s) recommandés
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
              <Building2 size={16} /> {uniqueCompanies.length} entreprise(s) contributrices
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

          <div className="mt-10 space-y-5">
            {entries.length === 0 ? (
              <div className="rounded-4xl border border-dashed border-border/60 bg-white/90 p-10 text-center text-sm text-muted-foreground">
                Aucun talent recommandé pour le moment. Partagez un profil depuis le portail recruteur pour l'ajouter ici.
              </div>
            ) : (
              entries.map((entry) => (
                <article
                  key={entry.candidateId}
                  className="space-y-4 rounded-4xl border border-border/60 bg-white/95 p-6 shadow-xl backdrop-blur"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Recommandé par {entry.recommendedBy}
                      </p>
                      <h2 className="text-xl font-semibold text-foreground">{entry.name}</h2>
                      <p className="text-sm text-muted-foreground">{entry.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-semibold uppercase tracking-[0.24em] text-primary">
                        Score {entry.score}
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
                    <p className="mt-2 text-sm text-foreground">{entry.recommendedFor}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>Partagé via Success Pool · visible par tous les recruteurs abonnés.</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(entry.candidateId)}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <Trash2 size={14} /> Retirer de la liste
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
