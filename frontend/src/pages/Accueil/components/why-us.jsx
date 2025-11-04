import { CheckCircle, Zap, Users, Trophy } from "lucide-react"

export default function WhyUsSection({ features = [
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
  ] }) {

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Pourquoi nous choisir</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            JobKey est la plateforme la plus fiable pour trouver votre prochain emploi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20">
                    <Icon size={24} className="text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


