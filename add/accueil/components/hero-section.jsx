"use client"

import { useState } from "react"
import { Search, MapPin, Zap } from "lucide-react"

export default function HeroSection() {
  const [job, setJob] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Recherche:", { job, location })
  }

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trouvez votre <span className="text-primary">prochain emploi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connectez-vous avec les meilleures entreprises et trouvez l'opportunité de carrière qui vous correspond
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Poste ou compétences</label>
              <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ex: Designer, Développeur..."
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full outline-none bg-transparent text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Localisation</label>
              <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3">
                <MapPin size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ville ou télétravail"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none bg-transparent text-foreground"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-opacity-90 text-primary-foreground font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Rechercher
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {["Télétravail", "CDI", "PME", "Startup"].map((tag) => (
              <button
                key={tag}
                type="button"
                className="text-sm px-3 py-1 bg-secondary text-foreground rounded-full hover:bg-accent/20 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Zap size={32} className="text-accent" />
            <p className="text-sm text-muted-foreground">Optimisé pour trouver rapidement</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={32} className="text-accent" />
            <p className="text-sm text-muted-foreground">Mises à jour quotidiennes des offres</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={32} className="text-accent" />
            <p className="text-sm text-muted-foreground">Accompagnement personnalisé inclus</p>
          </div>
        </div>
      </div>
    </section>
  )
}
