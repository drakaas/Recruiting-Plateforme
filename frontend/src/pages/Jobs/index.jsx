import { Search, MapPin, Clock, DollarSign, X } from 'lucide-react'
import { Link } from 'react-router-dom'
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
      <section className="relative py-12">
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/10 via-accent/10 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Toutes les offres d'emploi</h1>
          <p className="text-muted-foreground">Découvrez nos {allJobs.length} offres d'emploi disponibles</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-4 bg-card/80 backdrop-blur border border-border rounded-2xl p-6 shadow-sm">
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
                <label className="block text-sm font-semibold text-foreground mb-2">Département</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les départements</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">Expérience</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les expériences</option>
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
                  className="w-full px-4 py-2 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-2 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les localisations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <button onClick={resetFilters} className="w-full py-2 border border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition">
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{filteredJobs.length} offres disponibles</h2>
              {(searchQuery || selectedCategory || selectedLevel || selectedType || selectedLocation) && (
                <button onClick={resetFilters} className="text-primary hover:text-primary/80 transition flex items-center gap-2 text-sm">
                  <X size={16} /> Effacer les filtres
                </button>
              )}
            </div>

            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.id} className="rounded-4xl border border-border/70 bg-white/95 p-6 shadow-xl backdrop-blur-sm transition hover:shadow-2xl">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-xl bg-secondary/70 text-foreground flex items-center justify-center font-bold text-lg overflow-hidden border border-border/60 shadow-sm">
                        {job.logoUrl ? (
                          <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
                        ) : (
                          (job.company?.[0] || '•')
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{job.company}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground truncate">{job.title}</h3>
                        {job.department && (
                          <p className="mt-1 text-sm text-muted-foreground truncate">{job.department}</p>
                        )}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-3xl border border-border/60 bg-secondary/50 p-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate">{job.contractType}{job.contractDuration ? ` · ${job.contractDuration}` : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate">{job.experience || 'Expérience à préciser'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-muted-foreground" />
                            <span className="text-sm font-semibold text-primary truncate">{job.salary}</span>
                          </div>
                        </div>
                        {Array.isArray(job.skillsNames) && job.skillsNames.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.skillsNames.map((name, idx) => (
                              <span key={idx} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm border-border/60 bg-white text-muted-foreground">
                                {name}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <Link to={`/jobs/${job.id}`} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90">
                            Consulter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Aucune offre ne correspond à vos critères.</p>
                  <button onClick={resetFilters} className="mt-4 px-6 py-2 border border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition">
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


