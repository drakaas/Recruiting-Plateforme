import { Check } from "lucide-react"

export default function PricingPlans({
  plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Pour débuter votre recherche",
      features: [
        "Accès aux offres d'emploi",
        "Jusqu'à 3 candidatures par mois",
        "Profil basique",
        "Alertes emploi simples",
      ],
      cta: "Commencer",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "9,99€",
      period: "/mois",
      description: "Pour une recherche optimale",
      features: [
        "Accès illimité aux offres",
        "Candidatures illimitées",
        "Profil avancé avec CV",
        "Alertes personnalisées",
        "Support prioritaire",
        "Feedback sur vos candidatures",
      ],
      cta: "Essayer gratuitement",
      highlighted: true,
    },
    {
      name: "Entreprise",
      price: "Sur devis",
      description: "Pour recruter les meilleurs talents",
      features: [
        "Postez vos offres",
        "Accès à la base de candidats",
        "Messaging illimité",
        "Analytics avancées",
        "Manager dédié",
        "Intégrations API",
      ],
      cta: "Contacter",
      highlighted: false,
    },
  ],
}) {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-4 text-center">
          <span className="mx-auto inline-flex items-center justify-center rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Plans transparents, sans engagement caché
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Des solutions pensées pour chaque ambition</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Choisissez l'abonnement qui vous correspond. Vous pouvez changer ou annuler à tout moment depuis votre espace personnel.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-4xl border border-border/70 bg-white/95 p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl ${
                plan.highlighted ? "bg-linear-to-br from-primary/6 via-white to-accent/10 border-primary/40" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="absolute right-8 top-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground shadow-sm">
                  Populaire
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-sm font-medium text-muted-foreground">{plan.period}</span>}
              </div>

              <button
                className={`mb-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-linear-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl"
                    : "border border-primary text-primary hover:bg-primary/10"
                }`}
              >
                {plan.cta}
              </button>

              <ul className="mt-auto space-y-4 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex rounded-full bg-primary/10 p-1 text-primary">
                      <Check size={16} />
                    </span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


