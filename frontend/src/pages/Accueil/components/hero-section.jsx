"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  Zap,
  ShieldCheck,
  BriefcaseBusiness,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react"

const highlightCards = [
  {
    icon: ShieldCheck,
    title: "Sélection validée",
    description: "Chaque offre est vérifiée par nos experts métier avant sa mise en ligne.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Contrats premium",
    description: "Accédez aux rôles stratégiques des scale-ups et grands groupes partenaires.",
  },
  {
    icon: TrendingUp,
    title: "Coaching carrière",
    description: "Préparez vos entretiens grâce à l'accompagnement personnalisé Success Pool.",
  },
]

export default function HeroSection({ tags = [] }) {
  const [job, setJob] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Recherche:", { job, location })
  }

  return (
  <section className="relative overflow-hidden bg-linear-to-br from-primary/8 via-background to-accent/10 py-20 md:py-28">
      <div className="pointer-events-none absolute -left-40 top-4 h-72 w-72 rounded-full bg-primary/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 right-[-120px] h-96 w-96 rounded-full bg-accent/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
            <Sparkles size={14} className="text-primary" /> L'avenir du recrutement
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Accélérez votre carrière avec une <span className="text-transparent bg-linear-to-r from-primary via-primary to-accent bg-clip-text">plateforme pensée pour les talents</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Success Pool conjugue intelligence artificielle et expertise humaine pour révéler les missions qui correspondent réellement à votre trajectoire professionnelle.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative mt-10 rounded-3xl border border-border/70 bg-white/90 p-6 shadow-xl backdrop-blur-lg"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto]">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Poste ou compétences</span>
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Search size={20} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Ex: Product Manager, Data Analyst..."
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Localisation</span>
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <MapPin size={20} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Paris, Lyon ou télétravail"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
                  />
                </div>
              </label>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary to-accent px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:shadow-xl"
                >
                  <Search size={20} />
                  Rechercher
                </button>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded-full border border-border/60 bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-white px-3 py-1.5 font-medium text-foreground shadow-sm">
                <Zap size={16} className="text-primary" /> 24 nouvelles offres ce matin
              </div>
              <span>Approche discrète • Matching en temps réel • Feedback garanti</span>
            </div>
          </form>
        </div>

        <div className="relative z-10">
          <div className="rounded-4xl border border-border/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
            <div className="rounded-3xl bg-linear-to-br from-primary/10 via-white to-accent/10 p-6 text-sm text-muted-foreground">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Talents accompagnés</p>
                  <p className="mt-2 text-4xl font-semibold text-foreground">45 000+</p>
                </div>
                <ArrowRight size={28} className="text-primary" />
              </div>
              <p className="leading-relaxed">
                "Grâce à Success Pool, nous recrutons les profils les plus convoités avec une expérience candidat irréprochable."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {["AB", "CD", "EF"].map((initials) => (
                    <span
                      key={initials}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">1300+ recruteurs certifiés</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {highlightCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.title}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-white/90 p-4 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{card.title}</p>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


