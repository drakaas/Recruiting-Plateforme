import { Bookmark, MapPin, Clock } from "lucide-react"

export default function JobListings({ jobs = [
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
  ] }) {

  return (
    <section id="jobs" className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dernières offres d'emploi</h2>
          <p className="text-muted-foreground">Découvrez les meilleures opportunités sélectionnées pour vous</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`border rounded-lg p-6 hover:shadow-lg transition ${
                job.featured ? "border-accent bg-accent/5" : "border-border bg-card"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm ${
                      job.featured ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    }`}
                  >
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-lg transition">
                  <Bookmark size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  {job.location}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={16} />
                  {job.type}
                </div>
                <div className="text-sm font-semibold text-primary">{job.salary}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-border text-foreground rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition">
                Candidater
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">
            Voir toutes les offres
          </button>
        </div>
      </div>
    </section>
  )
}


