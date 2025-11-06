import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, ArrowLeft } from 'lucide-react'
import { useApi } from '../../hooks/useApi'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { request } = useApi()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        // Try direct by id (backend route)
        const o = await request(`/offers/${id}`)
        if (cancelled) return
        const mapped = mapOfferToJob(o)
        setJob(mapped)
      } catch (_e) {
        // Fallback: list lookup
        try {
          const list = await request('/offers')
          const raw = Array.isArray(list) ? list.find((o) => (o?.id || o?._id) === id) : null
          if (raw) {
            if (!cancelled) setJob(mapOfferToJob(raw))
          } else {
            setError('not_found')
          }
        } catch (_e2) {
          setError('not_found')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id, request])

  function mapOfferToJob(o) {
    const companyName = (o && o.company && typeof o.company === 'object' && o.company.name) ? o.company.name : 'Entreprise'
    const companyImage = (o && o.company && typeof o.company === 'object' && o.company.imageUrl) ? o.company.imageUrl : ''
    return {
      id: o.id || o._id,
      title: o.title,
      company: companyName,
      // Use first letter as logo to preserve existing style
      logo: companyName?.[0] || '•',
      location: o.location || 'À préciser',
      type: o.contractType || 'À préciser',
      salary: o.salary || 'Non précisé',
      tags: Array.isArray(o.keywords) ? o.keywords : [],
      description: '',
      missions: [],
      idealProfile: [],
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition">
            <ArrowLeft size={16} /> Retour
          </button>
          <div className="border border-border bg-card rounded-lg p-8 text-center">
            <p className="text-foreground">Chargement...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition">
            <ArrowLeft size={16} /> Retour
          </button>
          <div className="border border-border bg-card rounded-lg p-8 text-center">
            <p className="text-foreground">Offre introuvable.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary to-accent py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">{job.title}</h1>
          <p className="text-primary-foreground/90">{job.company}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition">
          <ArrowLeft size={16} /> Retour aux offres
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border border-border bg-card rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">
                  {job.logo}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{job.title}</h2>
                  <p className="text-muted-foreground">{job.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-border">
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

              {Array.isArray(job.tags) && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 bg-border text-foreground rounded">{tag}</span>
                  ))}
                </div>
              )}

              {job.description && (
                <section className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">À propos du poste</h3>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </section>
              )}

              {Array.isArray(job.missions) && job.missions.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">Vos missions</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.missions.map((m, i) => (
                      <li key={i} className="text-muted-foreground">{m}</li>
                    ))}
                  </ul>
                </section>
              )}

              {Array.isArray(job.idealProfile) && job.idealProfile.length > 0 && (
                <section className="mb-2">
                  <h3 className="text-xl font-bold text-foreground mb-3">Profil idéal</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.idealProfile.map((p, i) => (
                      <li key={i} className="text-muted-foreground">{p}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="border border-border bg-card rounded-lg p-6 sticky top-4 space-y-6">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-4">Postuler</h3>
                <a href="#" className="w-full block text-center py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition">Candidater</a>
              </div>

              {job.companyInfo && (
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-3">À propos de l'entreprise</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{job.companyInfo.name}</h4>
                      {job.companyInfo.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{job.companyInfo.description}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {job.companyInfo.sector && (
                        <div>
                          <p className="text-xs text-muted-foreground">Secteur</p>
                          <p className="font-semibold text-foreground">{job.companyInfo.sector}</p>
                        </div>
                      )}
                      {job.companyInfo.employees && (
                        <div>
                          <p className="text-xs text-muted-foreground">Employés</p>
                          <p className="font-semibold text-foreground">{job.companyInfo.employees}</p>
                        </div>
                      )}
                      {job.companyInfo.founded && (
                        <div>
                          <p className="text-xs text-muted-foreground">Fondée</p>
                          <p className="font-semibold text-foreground">{job.companyInfo.founded}</p>
                        </div>
                      )}
                    </div>
                    {job.companyInfo.culture && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Culture d'entreprise</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{job.companyInfo.culture}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      {job.companyInfo.email && (
                        <a href={`mailto:${job.companyInfo.email}`} className="text-primary hover:underline text-sm block">{job.companyInfo.email}</a>
                      )}
                      {job.companyInfo.phone && (
                        <a href={`tel:${job.companyInfo.phone}`} className="text-primary hover:underline text-sm block">{job.companyInfo.phone}</a>
                      )}
                      {job.companyInfo.website && (
                        <a href={`https://${job.companyInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm block">{job.companyInfo.website}</a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-3">Avantages</h3>
                  <ul className="space-y-2">
                    {job.benefits.map((b, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.additionalInfo && (
                <div className="bg-accent/10 border border-accent rounded-lg p-4">
                  <p className="text-sm text-accent">{job.additionalInfo}</p>
                </div>
              )}

              <div className="space-y-3">
                <a href="#" className="w-full block text-center py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-opacity-90 transition">Candidater maintenant</a>
                <button className="w-full py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">Sauvegarder l'offre</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}


