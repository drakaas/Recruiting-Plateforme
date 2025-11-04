import { CheckCircle, Zap, Users, Trophy } from "lucide-react"

export default function WhyUsSection({
  features = [
    {
      icon: CheckCircle,
      title: "Offres vérifiées",
      description: "Toutes nos offres sont validées et à jour pour vous garantir les meilleurs opportunités",
    },
    {
      icon: Zap,
      title: "Matching intelligent",
      description: "Notre algorithme vous propose les offres qui correspondent le mieux à votre profil",
    },
    {
      icon: Users,
      title: "Accompagnement",
      description: "Des experts vous conseillent tout au long de votre recherche d'emploi",
    },
    {
      icon: Trophy,
      title: "Taux de succès",
      description: "98% de nos candidats trouvent un emploi dans les 3 mois",
    },
  ],
}) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-4 text-center">
          <span className="mx-auto inline-flex items-center justify-center rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Expérience candidat premium
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Pourquoi les talents choisissent Success Pool</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Notre méthode Success Pool combine matching intelligent, accompagnement humain et retours en continu pour sécuriser votre prochain poste.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon || CheckCircle
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-white/95 p-8 shadow-lg transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
                  <span className="h-px w-6 bg-border" />
                  Excellence confirmée
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


