import { Star } from "lucide-react"

export default function TestimonialsSection({ testimonials = [
    {
      name: "Sophie Martin",
      role: "Designer UX",
      company: "TechFlow",
      text: "JobKey a complètement changé ma recherche d'emploi. J'ai trouvé mon poste de rêve en 2 semaines!",
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
  ] }) {

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Ce que nos utilisateurs disent</h2>
          <p className="text-muted-foreground">Plus de 45 000 candidats ont trouvé leur emploi grâce à JobKey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-border rounded-lg p-8 hover:shadow-lg transition">
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill(null)
                  .map((_, i) => (
                    <Star key={i} size={18} className="fill-accent text-accent" />
                  ))}
              </div>

              <p className="text-foreground mb-6">"{testimonial.text}"</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


