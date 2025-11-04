export default function StatsSection({
  stats = [
    { label: "Offres d'emploi", value: "12,500+" },
    { label: "Entreprises partenaires", value: "2,800+" },
    { label: "Candidats placés", value: "45,000+" },
    { label: "Satisfaction", value: "98%" },
  ],
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 rounded-4xl border border-border/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-secondary/40 px-6 py-8 text-center">
              <span className="text-3xl font-semibold text-primary md:text-4xl">{stat.value}</span>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


