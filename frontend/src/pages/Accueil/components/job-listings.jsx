import { Bookmark, MapPin, Clock } from "lucide-react"

export default function JobListings({
  jobs = [
    {
      id: 1,
      title: "Designer UX/UI Senior",
      company: "TechFlow",
      location: "Paris, France",
      type: "CDI",
      salary: "50-65k",
      tags: ["Design", "Figma", "User Research"],
      logo: "TF",
      featured: true,
    },
    {
      id: 2,
      title: "Développeur Full Stack",
      company: "StartupX",
      location: "Télétravail",
      type: "CDI",
      salary: "45-60k",
      tags: ["React", "Node.js", "PostgreSQL"],
      logo: "SX",
      featured: true,
    },
    {
      id: 3,
      title: "Product Manager",
      company: "DataCore",
      location: "Lyon, France",
      type: "CDI",
      salary: "48-62k",
      tags: ["Product", "Analytics", "Leadership"],
      logo: "DC",
      featured: false,
    },
    {
      id: 4,
      title: "Développeur Backend Python",
      company: "CloudSync",
      location: "Toulouse, France",
      type: "CDI",
      salary: "42-55k",
      tags: ["Python", "AWS", "Docker"],
      logo: "CS",
      featured: false,
    },
  ],
}) {
  return (
    <section id="jobs" className="bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Les opportunités du moment
          </span>
          <h2 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">Dernières offres sélectionnées pour vous</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Nos consultants analysent chaque candidature pour vous proposer les missions avec le meilleur potentiel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <article
              key={job.id}
              className={`group relative overflow-hidden rounded-3xl border border-border/70 bg-white/95 p-7 shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                job.featured ? "bg-linear-to-br from-primary/6 via-white to-accent/10 border-primary/30" : ""
              }`}
            >
              {job.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Premium
                </span>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-base font-semibold text-primary-foreground shadow-inner ${
                    job.featured ? "bg-linear-to-br from-primary to-accent" : "bg-secondary text-foreground"
                  }`}
                >
                  {job.logo}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground md:text-xl">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-transparent p-2 text-muted-foreground transition hover:border-border hover:text-primary"
                >
                  <Bookmark size={20} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border/60 bg-white/80 p-4 text-sm text-muted-foreground md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span>{job.type}</span>
                </div>
                <div className="text-sm font-semibold text-primary">{job.salary}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs font-semibold text-muted-foreground transition group-hover:border-primary group-hover:text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Retour candidats sous 48h • Coaching de préparation offert
                </p>
                <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Candidater
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center justify-center rounded-full border border-primary px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10">
            Voir toutes les offres
          </button>
        </div>
      </div>
    </section>
  )
}


