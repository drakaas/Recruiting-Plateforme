import { useMemo, useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, ArrowLeft, Upload, FileText, X, Paperclip, Trash2, Loader2 } from 'lucide-react'
import { JOBS } from './data'
import { useAuth } from '../../context/useAuth'
import { API_BASE_URL } from '../../utils/config'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(() => {
    const numericId = Number(id)
    if (Number.isFinite(numericId)) return JOBS.find((j) => j.id === numericId) || JOBS[0]
    return JOBS[0]
  })
  const [loading, setLoading] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const { user } = useAuth()

  // Always have a job from static data for testing

  useEffect(() => {
    let cancelled = false

    const mapOfferToJob = (offer) => {
      const companyName = offer?.company?.name || offer?.companyName || job.company || 'Entreprise'
      const skills = Array.isArray(offer?.skills) ? offer.skills : []
      const keywords = Array.isArray(offer?.keywords) ? offer.keywords : []

      const idealProfile = skills.map((s) =>
        s?.name ? `${s.name}${s.importance && s.importance !== 'Importante' ? ` (${s.importance})` : ''}` : null
      ).filter(Boolean)

      const missions = offer?.mission
        ? offer.mission.split(/\n|\r|\.\s+/).map((m) => m.trim()).filter((m) => m.length > 0)
        : []

      const descriptionBase = offer?.mission || job.description || ''
      const descriptionWithKeywords = keywords.length
        ? `${descriptionBase}\n\nMots-clés: ${keywords.join(', ')}`
        : descriptionBase

      const companyInfo = {
        name: companyName,
        description: offer?.company?.description || job.companyInfo?.description || undefined,
        imageUrl: offer?.company?.imageUrl || job.companyInfo?.imageUrl || undefined,
        sector: job.companyInfo?.sector || undefined,
        employees: job.companyInfo?.employees || undefined,
        founded: job.companyInfo?.founded || undefined,
        culture: job.companyInfo?.culture || undefined,
        email: offer?.company?.email || job.companyInfo?.email || undefined,
        phone: job.companyInfo?.phone || undefined,
        website: job.companyInfo?.website || undefined,
      }

      return {
        // preserve original fields when missing from backend
        ...job,
        id: offer?.id || offer?._id || id,
        title: offer?.title || job.title,
        company: companyName,
        location: offer?.location || job.location,
        type: offer?.contractType || job.type,
        salary: offer?.salary || job.salary,
        tags: [],
        description: descriptionWithKeywords,
        missions: missions.length ? missions : job.missions,
        idealProfile: idealProfile.length ? idealProfile : job.idealProfile,
        companyInfo,
        companyLogoUrl: offer?.company?.imageUrl || job.companyLogoUrl || undefined,
        benefits: Array.isArray(job.benefits) ? job.benefits : [],
        additionalInfo: job.additionalInfo || undefined,
      }
    }

    const fetchOffer = async () => {
      // If id looks like a Mongo id, fetch; otherwise keep static
      const looksLikeMongoId = typeof id === 'string' && /^[a-f\d]{24}$/i.test(id)
      if (!looksLikeMongoId) return
      setLoading(true)
      try {
        const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/offers/${id}`
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error('Failed to load offer')
        const offer = await res.json()
        if (!cancelled && offer) {
          setJob(mapOfferToJob(offer))
        }
      } catch (_e) {
        // Silent fallback to static
        if (!cancelled) {
          const numericId = Number(id)
          const fallback = Number.isFinite(numericId) ? (JOBS.find((j) => j.id === numericId) || JOBS[0]) : JOBS[0]
          setJob(fallback)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchOffer()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <main className="min-h-screen bg-background">
  <section className="bg-linear-to-r from-primary to-accent py-12">
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
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg overflow-hidden">
                  {job.companyLogoUrl ? (
                    <img src={job.companyLogoUrl} alt={job.company || 'Entreprise'} className="w-full h-full object-cover" />
                  ) : (
                    job.logo
                  )}
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

              {/* Keywords moved into description; chips removed */}

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
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="w-full block text-center py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition"
                >
                  Candidater
                </button>
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
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="w-full block text-center py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-opacity-90 transition"
                >
                  Candidater maintenant
                </button>
                <button className="w-full py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">Sauvegarder l'offre</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showApplyModal && job && (
        <ApplyModal job={job} user={user} onClose={() => setShowApplyModal(false)} />
      )}
    </main>
  )
}


function ApplyModal({ job, user, onClose }) {
  const [cvFile, setCvFile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvDragActive, setCvDragActive] = useState(false)
  const [docsDragActive, setDocsDragActive] = useState(false)
  const cvInputRef = useRef(null)
  const docsInputRef = useRef(null)
  const [form, setForm] = useState(() => ({
    fullName: user?.fullName || '',
    email: user?.email || '',
    message: '',
  }))

  useEffect(() => {
    if (user?.email) {
      setForm((prev) => (prev.email ? prev : { ...prev, email: user.email }))
    }
  }, [user?.email])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const formatFileSize = (bytes) => {
    if (!Number.isFinite(bytes)) return ''
    const units = ['octets', 'Ko', 'Mo', 'Go']
    let value = bytes
    let unitIndex = 0
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024
      unitIndex += 1
    }
    const digits = value < 10 && unitIndex > 0 ? 1 : 0
    return `${value.toFixed(digits)} ${units[unitIndex]}`
  }

  const handleCvSelection = (fileList) => {
    const file = fileList?.[0]
    if (file) {
      setCvFile(file)
      setStatus(null)
    }
  }

  const handleDocsSelection = (fileList) => {
    if (!fileList) return
    const existingKeys = new Set(documents.map((file) => `${file.name}-${file.size}`))
    const additions = []
    Array.from(fileList).forEach((file) => {
      const key = `${file.name}-${file.size}`
      if (!existingKeys.has(key)) additions.push(file)
    })
    if (additions.length > 0) {
      setDocuments((prev) => [...prev, ...additions])
      setStatus(null)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!cvFile) {
      setStatus({ type: 'error', text: 'Veuillez ajouter votre CV avant de postuler.' })
      return
    }

    if (!form.email) {
      setStatus({ type: 'error', text: 'Veuillez renseigner votre email.' })
      return
    }
    setIsSubmitting(true)
    setStatus(null)
    try {
      const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/applications`
      const payload = new FormData()
      payload.append('jobId', String(job.id))
      if (job.title) payload.append('jobTitle', job.title)
      if (job.company) payload.append('company', job.company)
      if (user?.id) payload.append('candidateId', user.id)
      if (form.fullName) payload.append('candidateName', form.fullName)
      payload.append('candidateEmail', form.email)
      if (form.message) payload.append('message', form.message)
      payload.append('cv', cvFile, cvFile.name)
      documents.forEach((file) => payload.append('documents', file, file.name))

      const res = await fetch(endpoint, {
        method: 'POST',
        body: payload,
      })

      if (!res.ok) {
        const detail = await res.text()
        throw new Error(detail || 'Échec de la candidature')
      }

      await res.json()
      setStatus({ type: 'success', text: 'Candidature envoyée avec succès !' })
      setCvFile(null)
      setDocuments([])
      setForm((prev) => ({ ...prev, message: '' }))
    } catch (error) {
      console.error('Failed to submit application', error)
      setStatus({ type: 'error', text: error?.message || "Une erreur est survenue lors de l'envoi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-6 sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[calc(100vh-3rem)] max-w-3xl overflow-y-auto rounded-4xl border border-border/70 bg-white/98 p-6 shadow-2xl backdrop-blur-md md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la fenêtre de candidature"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="space-y-4 pr-10 md:pr-12">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary">Candidature</p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{job.title}</h2>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Nom complet</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                type="text"
                placeholder="Votre nom"
                className="rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="vous@example.com"
                className="rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          {status && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-500/10 text-emerald-700'
                  : 'border-red-200 bg-red-500/10 text-red-600'
              }`}
            >
              {status.text}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Votre CV</h3>
              <div
                onDragOver={(event) => {
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'copy'
                  setCvDragActive(true)
                }}
                onDragLeave={() => setCvDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setCvDragActive(false)
                  handleCvSelection(event.dataTransfer.files)
                }}
                className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-8 text-center transition ${
                  cvDragActive ? 'border-primary bg-primary/5' : 'border-border/60 bg-secondary/40'
                }`}
              >
                {cvFile ? (
                  <div className="flex w-full max-w-lg items-center justify-between rounded-2xl border border-border/60 bg-white px-4 py-3 text-left">
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary" size={22} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{cvFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(cvFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="text-muted-foreground transition hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="text-primary" size={28} />
                    <p className="text-sm text-muted-foreground">
                      Glissez-déposez votre CV ici ou
                    </p>
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      Choisir un fichier
                    </button>
                    <p className="text-xs text-muted-foreground">Formats acceptés : PDF, DOC, DOCX (5 Mo max)</p>
                  </>
                )}
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(event) => handleCvSelection(event.target.files)}
                />
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Documents supplémentaires</h3>
                {documents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDocuments([])}
                    className="text-xs font-medium text-primary transition hover:underline"
                  >
                    Tout retirer
                  </button>
                )}
              </div>
              <div
                onDragOver={(event) => {
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'copy'
                  setDocsDragActive(true)
                }}
                onDragLeave={() => setDocsDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setDocsDragActive(false)
                  handleDocsSelection(event.dataTransfer.files)
                }}
                className={`rounded-3xl border-2 border-dashed p-6 transition ${
                  docsDragActive ? 'border-primary bg-primary/5' : 'border-border/60 bg-secondary/30'
                }`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <Paperclip className="text-primary" size={24} />
                  <p className="text-sm text-muted-foreground">
                    Ajoutez portfolios, lettres de motivation ou autres pièces jointes.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => docsInputRef.current?.click()}
                      className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      Sélectionner des fichiers
                    </button>
                    <span className="text-xs text-muted-foreground">ou glissez-déposez ici</span>
                  </div>
                  <input
                    ref={docsInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => handleDocsSelection(event.target.files)}
                  />
                </div>

                {documents.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {documents.map((file, index) => (
                      <li
                        key={`${file.name}-${file.size}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-white px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="text-primary" size={18} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments((prev) => prev.filter((_, idx) => idx !== index))}
                          className="text-muted-foreground transition hover:text-red-500"
                          aria-label={`Retirer ${file.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Message</h3>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Présentez brièvement votre motivation (optionnel)."
                className="w-full rounded-3xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                En postulant, vous acceptez que vos informations soient partagées avec {job.company} pour cette opportunité.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Envoyer ma candidature
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


