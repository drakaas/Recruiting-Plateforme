import { Star, Quote } from "lucide-react"

export default function TestimonialsSection({
  testimonials = [
    {
      name: "Sophie Martin",
      role: "Designer UX",
      company: "TechFlow",
      text: "Success Pool a complètement changé ma recherche d'emploi. J'ai trouvé mon poste de rêve en 2 semaines!",
      rating: 5,
      avatar: "SM",
    },
    {
      name: "Pierre Dupont",
      role: "Développeur Full Stack",
      company: "StartupX",
      text: "La plateforme est très intuitive et l'accompagnement était excellent. Je recommande vivement!",
      rating: 5,
      avatar: "PD",
    },
    {
      name: "Marie Lefevre",
      role: "Product Manager",
      company: "DataCore",
      text: "Les offres proposées correspondaient vraiment à mon profil. Un gain de temps énorme!",
      rating: 5,
      avatar: "ML",
    },
  ],
}) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-4 text-center">
          <span className="mx-auto inline-flex items-center justify-center rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Ils ont trouvé leur poste avec Success Pool
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Des témoignages qui parlent d'eux-mêmes</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Notre équipe accompagne chaque candidat jusqu'à l'embauche. Découvrez leurs retours sur l'expérience Success Pool.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative flex h-full flex-col justify-between rounded-4xl border border-border/70 bg-white/95 p-8 shadow-lg transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
            >
              <Quote size={32} className="text-primary/30" />

              <p className="mt-6 flex-1 text-base leading-relaxed text-foreground">“{testimonial.text}”</p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-primary to-accent text-sm font-semibold text-primary-foreground shadow-md">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, idx) => (
                      <Star key={idx} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


