export default function PartnerCompanies({
  companies = [
    { name: "TechFlow", initials: "TF", color: "bg-blue-500" },
    { name: "StartupX", initials: "SX", color: "bg-purple-500" },
    { name: "DataCore", initials: "DC", color: "bg-green-500" },
    { name: "CloudSync", initials: "CS", color: "bg-orange-500" },
    { name: "WebMaster", initials: "WM", color: "bg-pink-500" },
    { name: "InnovateLabs", initials: "IL", color: "bg-indigo-500" },
  ],
}) {
  return (
    <section id="companies" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-3 text-center">
          <span className="mx-auto inline-flex items-center justify-center rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            +2 800 entreprises nous font confiance
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Nos partenaires recrutent avec Success Pool</h2>
          <p className="text-base text-muted-foreground">
            Des startups aux leaders du CAC 40, tous s'appuient sur Success Pool pour attirer et fidéliser les meilleurs talents.
          </p>
        </div>

        <div className="rounded-4xl border border-border/70 bg-white/95 p-10 shadow-xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
            {companies.map((company) => (
              <div
                key={company.name}
                className="group relative flex flex-col items-center gap-3 rounded-3xl border border-border/50 bg-secondary/50 p-6 text-center transition hover:border-primary/40 hover:bg-white"
              >
                <div
                  className={`${company.color} flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-md`}
                >
                  {company.initials}
                </div>
                <p className="text-sm font-semibold text-foreground">{company.name}</p>
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground/80">Partenaire</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:shadow-xl">
            Devenir partenaire
          </button>
        </div>
      </div>
    </section>
  )
}


