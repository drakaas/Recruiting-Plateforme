import { Check } from "lucide-react"

export default function PricingPlans({ plans = [
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
  ] }) {

  return (
    <section id="pricing" className="bg-white border-b border-border py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Nos abonnements</h2>
          <p className="text-muted-foreground">Trouvez le plan qui vous convient le mieux</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg border transition ${
                plan.highlighted
                  ? "border-accent bg-accent/5 shadow-lg scale-105 md:scale-100"
                  : "border-border bg-card"
              } p-8`}
            >
              {plan.highlighted && (
                <div className="mb-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Populaire
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-opacity-90"
                    : "border border-primary text-primary hover:bg-primary/5"
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check size={20} className="text-accent flex-shrink-0" />
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


