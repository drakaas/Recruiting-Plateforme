import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Crown, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

const premiumFeatures = [
  'Accès illimité au vivier Success Pool',
  'Fiches complètes avec replay vidéo et CV',
  "Publication d'offres sans limite",
  'Suivi prioritaire par un Talent Partner',
]

const discoveryFeatures = [
  '3 profils recommandés visibles',
  'Aperçu des entreprises qui recrutent',
  'Statistiques agrégées du marché',
]

export default function RecruiterPlanPage() {
  const { user, updateUser } = useAuth()
  const isRecruiter = user?.role === 'recruiter'
  const isSubscribed = user?.isSubscribed ?? false
  const companyName = useMemo(() => {
    if (!user?.company) return 'Votre entreprise'
    if (typeof user.company === 'string') return user.company
    if (typeof user.company === 'object') return user.company.name || 'Votre entreprise'
    return 'Votre entreprise'
  }, [user])

  const handleActivate = () => {
    updateUser({ isSubscribed: true })
  }

  const handleDeactivate = () => {
    updateUser({ isSubscribed: false })
  }

  if (!isRecruiter) {
    return (
      <main className="bg-background">
        <section className="pt-16 pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-4xl border border-border/70 bg-white/95 p-10 text-center shadow-2xl backdrop-blur-sm">
              <p className="text-lg font-semibold text-foreground">Espace réservé aux recruteurs Success Pool</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Connectez-vous avec votre compte recruteur pour consulter et mettre à jour votre plan d'abonnement.
              </p>
              <Link
                to="/recruiter"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
              >
                <ShieldCheck size={16} /> Accéder au portail recruteur
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-background">
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/10 via-background to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-accent/10 via-background to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <Crown size={16} /> Mon plan Success Pool
            </span>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
              {isSubscribed ? 'Merci pour votre confiance !' : 'Activez le pass Premium recruteur'}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Gérez votre abonnement Success Pool et débloquez le vivier complet de candidats recommandés. Le plan Premium garantit un accès illimité aux profils, aux offres et à l'accompagnement Talent Partner.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <article className="space-y-6 rounded-4xl border border-border/70 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Statut actuel</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{isSubscribed ? 'Abonnement Premium actif' : 'Offre Découverte'}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {companyName} · Espace recruteur Success Pool
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isSubscribed ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-muted-foreground'}`}>
                  {isSubscribed ? <Sparkles size={22} /> : <Lock size={22} />}
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-secondary/60 px-5 py-4 text-sm text-muted-foreground">
                {isSubscribed
                  ? 'Vous bénéficiez d’un accès illimité aux talents recommandés, aux fiches complètes et aux statistiques détaillées.'
                  : 'Votre accès actuel vous permet de découvrir 3 profils recommandés. Passez sur la formule Premium pour débloquer toutes les données.'}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Ce qui est inclus</p>
                <ul className="space-y-2 text-sm text-foreground">
                  {(isSubscribed ? premiumFeatures : discoveryFeatures).map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                {isSubscribed ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDeactivate}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      Mettre en pause mon plan
                    </button>
                    <Link
                      to="/recommandations"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-primary-foreground shadow-lg transition hover:bg-primary/90"
                    >
                      Explorer le vivier complet
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleActivate}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-primary-foreground shadow-lg transition hover:bg-primary/90"
                    >
                      Activer le plan Premium
                    </button>
                    <Link
                      to="/recommandations"
                      className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Voir les profils inclus
                    </Link>
                  </>
                )}
              </div>
            </article>

            <article className="space-y-6 rounded-4xl border border-dashed border-primary/50 bg-primary/5 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Comparatif</p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">Pourquoi choisir Premium ?</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Notre équipe Talent Partner analyse vos besoins et vous ouvre l'accès illimité aux profils recommandés par vos pairs.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Crown size={22} />
                </div>
              </div>

              <div className="grid gap-4 text-sm">
                <div className="rounded-3xl border border-primary/30 bg-white px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Découverte</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    3 profils détaillés, informations sensibles masquées, publication d'offres limitée.
                  </p>
                </div>
                <div className="rounded-3xl border border-primary/50 bg-primary/10 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Premium</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Accès illimité aux candidats recommandés, fiches complètes, offres illimitées et support prioritaire.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-primary/30 bg-white px-5 py-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Besoin d'un accompagnement ?</p>
                <p className="mt-1">
                  Contactez votre Talent Partner Success Pool pour adapter votre plan et suivre l'onboarding des candidats.
                </p>
                <Link
                  to="/recruiter"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  <Sparkles size={14} /> Contacter mon Partner
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
