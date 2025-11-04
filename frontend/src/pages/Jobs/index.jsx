import { Search, MapPin, Clock, DollarSign, X } from 'lucide-react'
import { useJobs } from './useJobs'

export default function JobsPage() {
  const {
    allJobs,
    filteredJobs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    categories,
    levels,
    types,
    locations,
    resetFilters,
  } = useJobs()

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary to-accent py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">Toutes les offres d'emploi</h1>
          <p className="text-primary-foreground/90">Découvrez nos {allJobs.length} offres d'emploi disponibles</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-4 bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg text-foreground mb-6">Filtres</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">Rechercher</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Titre, compagnie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">Niveau</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les niveaux</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">Type de contrat</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">Localisation</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les localisations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <button onClick={resetFilters} className="w-full py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{filteredJobs.length} résultats</h2>
              {(searchQuery || selectedCategory || selectedLevel || selectedType || selectedLocation) && (
                <button onClick={resetFilters} className="text-primary hover:text-primary/80 transition flex items-center gap-2 text-sm">
                  <X size={16} /> Effacer les filtres
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.id} className="border border-border bg-card rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                          <p className="text-muted-foreground mb-2">{job.company}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">{job.level}</span>
                            <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full font-semibold">{job.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-border">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-muted-foreground" />
                        <span className="text-sm font-semibold text-primary">{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-border text-foreground rounded">{tag}</span>
                      ))}
                    </div>

                    <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition">
                      Candidater
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Aucune offre ne correspond à vos critères.</p>
                  <button onClick={resetFilters} className="mt-4 px-6 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


