import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Filter,
  Building2,
  MapPin,
  Tag,
  Sparkles,
  FileText,
  X,
  Briefcase,
  Clock3,
  CreditCard,
  Laptop,
  Award,
  Users,
  ChevronDown,
  Lock,
} from "lucide-react"
import { useAuth } from "../../context/useAuth"
import { useApi } from "../../hooks/useApi"
import { API_BASE_URL } from "../../utils/config"

const CONTRACT_TYPES = [
  "CDI",
  "CDD",
  "Stage",
  "Alternance Apprenti",
  "Alternance Professionnelle",
  "Freelance",
  "Consultant",
  "Intérim",
]

const SKILL_IMPORTANCE_LEVELS = [
  { label: "Importante", value: "Importante" },
  { label: "Souhaitée", value: "Souhaitée" },
]

const CANDIDATE_STATUS_LABELS = {
  pending: "En suivi",
  invited: "Entretien",
  recommended: "Recommandé",
  recruited: "Recruté",
  refused: "Refusé",
}

const CANDIDATE_STATUS_STYLES = {
  pending: "border-border/60 bg-white text-muted-foreground",
  invited: "border-primary/40 bg-primary/10 text-primary",
  recommended: "border-sky-300 bg-sky-50 text-sky-600",
  recruited: "border-emerald-300 bg-emerald-50 text-emerald-600",
  refused: "border-red-200 bg-red-50 text-red-600",
}

const STATUS_FILTERS = [
  { label: "Toutes", value: "Toutes" },
  { label: "Disponible", value: "Disponible" },
  { label: "Fermée", value: "Fermée" },
]

export default function MyOffers() {
  const { user } = useAuth()
  const { request } = useApi()
  const isRecruiter = user?.role === "recruiter"
  const isSubscribed = user?.isSubscribed ?? false
  const recruiterCompanyName = (() => {
    const company = user?.company
    if (!company) return "Société Générale"
    if (typeof company === "string") return company
    if (typeof company === "object") return company.name || "Société Générale"
    return "Société Générale"
  })()

  const [offers, setOffers] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("Toutes")
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeOfferId, setActiveOfferId] = useState(null)
  const [newOffer, setNewOffer] = useState({
    title: "",
    department: `${recruiterCompanyName} · Département`,
    status: "Disponible",
    location: "",
    contractType: "",
    contractDuration: "",
    salary: "",
    remote: "",
    experience: "",
    education: "",
    mission: "",
    keywords: "",
    skills: [],
    skillName: "",
    skillImportance: "Importante",
  })

  const filteredOffers = useMemo(() => {
    if (selectedStatus === "Toutes") {
      return offers
    }
    return offers.filter((offer) => offer.status === selectedStatus)
  }, [offers, selectedStatus])

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === activeOfferId) ?? null,
    [offers, activeOfferId],
  )
  useEffect(() => {
    if (!isRecruiter || !user?.id) return
    ;(async () => {
      try {
        const data = await request(`/offers`, { query: { recruiterId: user.id } })
        // Normalize minimal shape to match UI expectations
        const normalized = (Array.isArray(data) ? data : []).map((o) => ({
          id: o.id || o._id || `offer-${Math.random().toString(36).slice(2)}`,
          title: o.title,
          department: o.department || `${recruiterCompanyName} · Département`,
          status: o.status || 'Disponible',
          publishedAt: o.publishedAt || 'Brouillon',
          location: o.location || 'À préciser',
          contractType: o.contractType || 'À préciser',
          contractDuration: o.contractDuration || 'À préciser',
          salary: o.salary || 'Non précisé',
          remote: o.remote || 'À définir',
          experience: o.experience || 'À préciser',
          education: o.education || 'À préciser',
          mission: o.mission || '',
          keywords: Array.isArray(o.keywords) ? o.keywords : [],
          skills: Array.isArray(o.skills) ? o.skills : [],
          candidates: Array.isArray(o.candidates)
            ? o.candidates.map((candidate) => ({
                ...candidate,
                interviewScore: typeof candidate?.interviewScore === "number" ? candidate.interviewScore : null,
              }))
            : [],
        }))
        setOffers(normalized)
      } catch (error) {
        console.error("Impossible de récupérer les offres recruteur", error)
      }
    })()
  }, [isRecruiter, user?.id, recruiterCompanyName, request])
  const resetForm = () => {
    setNewOffer({
      title: "",
      department: `${recruiterCompanyName} · Département`,
      status: "Disponible",
      location: "",
      contractType: "",
      contractDuration: "",
      salary: "",
      remote: "",
      experience: "",
      education: "",
      mission: "",
      keywords: "",
      skills: [],
      skillName: "",
      skillImportance: "Importante",
    })
  }

  const handleOpenModal = () => {
    if (!isSubscribed) return
    resetForm()
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
  }

  const handleNewOfferChange = (event) => {
    const { name, value } = event.target
    setNewOffer((prev) => ({ ...prev, [name]: value }))
  }

  const openCandidatesModal = (offerId) => {
    if (!isSubscribed) return
    setActiveOfferId(offerId)
  }

  const closeCandidatesModal = () => {
    setActiveOfferId(null)
  }

  const handleAddSkill = () => {
    setNewOffer((prev) => {
      const name = prev.skillName.trim()
      if (!name) {
        return prev
      }

      const alreadyExists = prev.skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())
      if (alreadyExists) {
        return { ...prev, skillName: "" }
      }

      return {
        ...prev,
        skills: [...prev.skills, { name, importance: prev.skillImportance }],
        skillName: "",
        skillImportance: prev.skillImportance,
      }
    })
  }

  const handleRemoveSkill = (skillToRemove) => {
    setNewOffer((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => !(skill.name === skillToRemove.name && skill.importance === skillToRemove.importance),
      ),
    }))
  }

  const handleAddOffer = async (event) => {
    event.preventDefault()
    if (!isSubscribed) {
      setShowAddModal(false)
      return
    }

    const keywords = newOffer.keywords
      .split(/[\n,]/)
      .map((tag) => tag.trim())
      .filter(Boolean)

    const mission = newOffer.mission.trim()
    const skills = newOffer.skills.filter((skill) => Boolean(skill?.name))

    try {
      const created = await request(`/offers`, {
        method: 'POST',
        body: {
          recruiterId: user?.id,
          title: newOffer.title || 'Nouvelle opportunité',
          department: newOffer.department || `${recruiterCompanyName} · Département`,
          status: newOffer.status,
          location: newOffer.location || 'À préciser',
          contractType: newOffer.contractType || 'À préciser',
          contractDuration: newOffer.contractDuration || 'À préciser',
          salary: newOffer.salary || 'Non précisé',
          remote: newOffer.remote || 'À définir',
          experience: newOffer.experience || 'À préciser',
          education: newOffer.education || 'À préciser',
          mission,
          keywords,
          skills,
        },
      })

      const normalized = {
        id: created.id || created._id || `offer-${Date.now()}`,
        title: created.title,
        department: created.department,
        status: created.status || 'Disponible',
        publishedAt: created.publishedAt || 'Brouillon',
        location: created.location,
        contractType: created.contractType,
        contractDuration: created.contractDuration,
        salary: created.salary,
        remote: created.remote,
        experience: created.experience,
        education: created.education,
        mission: created.mission,
        keywords: Array.isArray(created.keywords) ? created.keywords : [],
        skills: Array.isArray(created.skills) ? created.skills : [],
        candidates: [],
      }

      setOffers((prev) => [normalized, ...prev])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error("Échec de la création d'une offre", error)
    }
  }

  if (!isRecruiter) {
    return (
      <main className="bg-background">
        <section className="pt-16 pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-4xl border border-border/70 bg-white/95 p-10 text-center shadow-2xl backdrop-blur-sm">
              <p className="text-lg font-semibold text-foreground">Accès réservé aux recruteurs Success Pool</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Connectez-vous avec votre compte recruteur pour visualiser vos offres, vos talents engagés et piloter vos campagnes de recrutement.
              </p>
              <Link
                to="/recruiter"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
              >
                Accéder au portail recruteur
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <>
      <main className="bg-background">
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/10 via-background to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-accent/10 via-background to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Portefeuille Success Pool
            </span>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Mes offres</h1>
              <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              Pilotage des recrutements {recruiterCompanyName}. Retrouvez vos offres actives, l'avancée des candidats et ajoutez de nouvelles opportunités en un clic.
            </p>
            {!isSubscribed && (
              <div className="mt-3 flex items-start gap-3 rounded-3xl border border-primary/40 bg-primary/5 px-4 py-3 text-xs text-primary">
                <Lock size={16} className="mt-0.5" />
                <p>
                  Vous êtes en plan Discovery. Activez le plan Premium Success Pool pour publier de nouvelles offres et gérer les candidatures en direct.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-border/60 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user.fullName} · {recruiterCompanyName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isSubscribed
                    ? "Abonnement actif : accès complet aux recommandations Success Pool."
                    : "Abonnement en attente : abonnez-vous pour débloquer toutes les recommandations de talents."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  <Filter size={14} /> Statut
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    className="rounded-2xl border border-border/70 bg-white px-3 py-2 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {STATUS_FILTERS.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </label>
                {isSubscribed ? (
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus size={16} /> Ajouter une offre
                  </button>
                ) : (
                  <Link
                    to="/recruiter/plan"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/60 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    <Lock size={16} /> Activer mon plan
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {filteredOffers.map((offer) => {
              const candidateCount = offer.candidates?.length ?? 0
              const statusCounts = (offer.candidates ?? []).reduce((accumulator, candidate) => {
                const statusKey = candidate.status ?? "pending"
                return {
                  ...accumulator,
                  [statusKey]: (accumulator[statusKey] ?? 0) + 1,
                }
              }, {})
              const statusBadges = Object.entries(statusCounts).filter(([, count]) => count > 0)

              return (
                <article key={offer.id} className="rounded-4xl border border-border/70 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{offer.department}</p>
                      <h2 className="text-xl font-semibold text-foreground">{offer.title}</h2>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 font-medium text-foreground">
                          <Briefcase size={12} /> {offer.contractType}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 font-medium text-foreground">
                          <Clock3 size={12} /> {offer.contractDuration}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 font-medium text-foreground">
                          <CreditCard size={12} /> {offer.salary}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 font-medium text-foreground">
                          <Laptop size={12} /> {offer.remote}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 font-medium text-foreground">
                          <Award size={12} /> {offer.education}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{offer.location}</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                          offer.status === "Fermée"
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-primary/50 bg-primary/10 text-primary"
                        }`}
                      >
                        {offer.status}
                      </span>
                      <p>{offer.publishedAt}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-border/60 bg-secondary/50 px-4 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Candidats engagés
                            <span className="ml-2 inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {candidateCount}
                            </span>
                          </p>
                          {candidateCount > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {statusBadges.map(([status, count]) => (
                                <span
                                  key={`${offer.id}-${status}`}
                                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                                    CANDIDATE_STATUS_STYLES[status] ?? CANDIDATE_STATUS_STYLES.pending
                                  }`}
                                >
                                  {CANDIDATE_STATUS_LABELS[status] ?? status} · {count}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Aucun candidat renseigné pour le moment. Ajoutez vos premiers talents dès que l'offre est publiée.
                            </p>
                          )}
                        </div>
                        {isSubscribed ? (
                          <button
                            type="button"
                            onClick={() => openCandidatesModal(offer.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                          >
                            <Users size={16} />
                            {candidateCount > 0 ? `Voir les candidats (${candidateCount})` : "Voir les candidats"}
                            <ChevronDown size={14} />
                          </button>
                        ) : (
                          <Link
                            to="/recruiter/plan"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                          >
                            <Lock size={16} /> Débloquer les candidats
                            <ChevronDown size={14} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {offer.mission && (
                      <div className="rounded-3xl border border-border/60 bg-white px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          <FileText size={14} className="text-primary" /> Mission
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{offer.mission}</p>
                      </div>
                    )}

                    {offer.keywords && offer.keywords.length > 0 && (
                      <div className="rounded-3xl border border-border/50 bg-secondary/60 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          <Tag size={14} /> Mots-clés ciblés
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {offer.keywords.map((tag) => (
                            <span
                              key={`${offer.id}-${tag}`}
                              className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
                            >
                              <Tag size={12} className="text-primary" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {offer.skills && offer.skills.length > 0 && (
                      <div className="rounded-3xl border border-primary/40 bg-primary/5 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                          <Sparkles size={14} /> Compétences maîtres
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {offer.skills.map((skill) => {
                            const isMandatory = skill.importance === "Importante"
                            return (
                              <span
                                key={`${offer.id}-skill-${skill.name}-${skill.importance}`}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${
                                  isMandatory
                                    ? "border-primary/60 bg-primary/10 text-primary"
                                    : "border-border/60 bg-white text-muted-foreground"
                                }`}
                              >
                                <Sparkles
                                  size={12}
                                  className={isMandatory ? "text-primary" : "text-muted-foreground"}
                                />
                                {skill.name}
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    isMandatory ? "bg-primary/20 text-primary" : "bg-secondary/70 text-muted-foreground"
                                  }`}
                                >
                                  {isMandatory ? "Importante" : skill.importance}
                                </span>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}

            {filteredOffers.length === 0 && (
              <div className="rounded-4xl border border-dashed border-border/70 bg-white/80 p-10 text-center text-sm text-muted-foreground">
                Aucun résultat avec ce filtre. Affichez "Toutes" pour revoir l'ensemble des offres.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
      {isSubscribed && selectedOffer && <OfferCandidatesModal offer={selectedOffer} onClose={closeCandidatesModal} />}
      {isSubscribed && showAddModal && (
        <AddOfferModal
          onClose={handleCloseModal}
          onSubmit={handleAddOffer}
          newOffer={newOffer}
          onChange={handleNewOfferChange}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
        />
      )}
    </>
  )
}

function AddOfferModal({ onClose, onSubmit, newOffer, onChange, onAddSkill, onRemoveSkill }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
  className="relative w-full max-h-[calc(100vh-3rem)] max-w-3xl overflow-y-auto rounded-4xl border border-border/70 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la création d'offre"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Nouvelle opportunité</p>
          <h2 className="text-2xl font-semibold text-foreground">Ajouter une offre</h2>
          <p className="text-sm text-muted-foreground">
            Renseignez les informations clés de votre offre. Vous pourrez compléter les détails et les candidats après publication.
          </p>
        </div>

  <form onSubmit={onSubmit} className="mt-6 space-y-6 text-sm">
          <div className="space-y-2">
            <label className="block font-medium text-muted-foreground">Intitulé du poste</label>
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <Tag size={18} className="text-muted-foreground" />
              <input
                type="text"
                name="title"
                value={newOffer.title}
                onChange={onChange}
                placeholder="Ex: Lead Data Scientist"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-muted-foreground">Département</label>
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <Building2 size={18} className="text-muted-foreground" />
              <input
                type="text"
                name="department"
                value={newOffer.department}
                onChange={onChange}
                placeholder="Société Générale · Direction des Risques"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block font-medium text-muted-foreground">Statut</label>
              <select
                name="status"
                value={newOffer.status}
                onChange={onChange}
                className="w-full rounded-2xl border border-border/70 bg-white px-3 py-3 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {STATUS_FILTERS.filter((filter) => filter.value !== "Toutes").map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-muted-foreground">Durée / type de contrat</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 text-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Briefcase size={18} className="text-muted-foreground" />
                  <select
                    name="contractType"
                    value={newOffer.contractType}
                    onChange={onChange}
                    required
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                  >
                    <option value="" disabled hidden></option>
                    {CONTRACT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Clock3 size={18} className="text-muted-foreground" />
                  <input
                    type="text"
                    name="contractDuration"
                    value={newOffer.contractDuration}
                    onChange={onChange}
                    placeholder="6 mois, Temps plein..."
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block font-medium text-muted-foreground">Rémunération</label>
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <CreditCard size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  name="salary"
                  value={newOffer.salary}
                  onChange={onChange}
                  placeholder="Non spécifié, 45-55K€..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-muted-foreground">Télétravail</label>
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <Laptop size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  name="remote"
                  value={newOffer.remote}
                  onChange={onChange}
                  placeholder="Télétravail fréquent, Hybride, Sur site..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block font-medium text-muted-foreground">Localisation</label>
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <MapPin size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  name="location"
                  value={newOffer.location}
                  onChange={onChange}
                  placeholder="Suresnes, Paris"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-muted-foreground">Expérience requise</label>
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <Tag size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  name="experience"
                  value={newOffer.experience}
                  onChange={onChange}
                  placeholder="< 6 mois, 3-5 ans..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-muted-foreground">Niveau d'études</label>
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <Award size={18} className="text-muted-foreground" />
              <input
                type="text"
                name="education"
                value={newOffer.education}
                onChange={onChange}
                placeholder="Bac +5 / Master..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-muted-foreground">Mission principale</label>
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <FileText size={18} className="mt-1 text-muted-foreground" />
              <textarea
                name="mission"
                value={newOffer.mission}
                onChange={onChange}
                placeholder="Décrivez l'objectif et l'impact de la mission..."
                rows={4}
                className="h-28 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <p className="text-xs text-muted-foreground">Utilisez Entrée pour structurer les différentes responsabilités.</p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-muted-foreground">Résumé de l'offre (mots-clés)</label>
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <Tag size={18} className="mt-1 text-muted-foreground" />
              <textarea
                name="keywords"
                value={newOffer.keywords}
                onChange={onChange}
                placeholder="Stage (6 mois)\nSuresnes\nTélétravail fréquent..."
                rows={3}
                className="h-24 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <p className="text-xs text-muted-foreground">Ajoutez un mot-clé par ligne : ils seront transformés en badges dans la fiche.</p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-muted-foreground">Compétences & expertises</label>
            <div className="rounded-2xl border border-border/70 px-4 py-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border/70 px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
                  <Sparkles size={18} className="text-muted-foreground" />
                  <input
                    type="text"
                    name="skillName"
                    value={newOffer.skillName}
                    onChange={onChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        onAddSkill()
                      }
                    }}
                    placeholder="Ex : Ansible"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                  />
                </div>
                <select
                  name="skillImportance"
                  value={newOffer.skillImportance}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-border/70 bg-white px-3 py-2 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-48"
                >
                  {SKILL_IMPORTANCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onAddSkill}
                  className="inline-flex items-center justify-center rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  aria-label="Ajouter une compétence"
                >
                  <Plus size={16} />
                </button>
              </div>
              {newOffer.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {newOffer.skills.map((skill) => (
                    <span
                      key={`skill-${skill.name}-${skill.importance}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                        skill.importance === "Importante"
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border/60 bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {skill.name}
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {skill.importance}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveSkill(skill)}
                        className="rounded-full bg-white/90 p-1 text-muted-foreground transition hover:bg-white hover:text-primary"
                        aria-label={`Retirer ${skill.name}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Déclarez chaque compétence avec son niveau d'importance. Celles marquées « Importante » sont bloquantes pour la suite du processus.</p>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-border/70 px-6 py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
            >
              Créer l'offre
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OfferCandidatesModal({ offer, onClose }) {
  const [interviewedCandidates, setInterviewedCandidates] = useState([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        // Load applications for this offer and keep only those with preselectionne (interview passed)
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/applications?offerId=${encodeURIComponent(offer.id)}`)
        if (!res.ok) throw new Error('apps_failed')
        const apps = await res.json()
        const passed = (Array.isArray(apps) ? apps : []).filter((a) => a.status === 'preselectionne')

        // Enrich each application with candidate details
        const enriched = await Promise.all(passed.map(async (a) => {
          let name = 'Candidat'
          let stage = ''
          let feedback = ''
          try {
            if (a.candidateId) {
              const u = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/users/${encodeURIComponent(a.candidateId)}`)
              if (u.ok) {
                const user = await u.json()
                const first = user?.profile?.firstName || ''
                const last = user?.profile?.lastName || ''
                const email = user?.email || ''
                name = [first, last].filter(Boolean).join(' ').trim() || (email ? email.split('@')[0] : 'Candidat')
                stage = user?.profile?.city || ''
              }
            }
          } catch (_e) {}

          return {
            name,
            stage,
            feedback,
            interviewScore: typeof a?.interviewScore === 'number' ? a.interviewScore : null,
            score: typeof a?.compatibilityScore === 'number' ? a.compatibilityScore : null,
            status: 'invited',
          }
        }))

        const sorted = enriched
          .filter((c) => typeof c.interviewScore === 'number')
          .sort((a, b) => (b.interviewScore ?? 0) - (a.interviewScore ?? 0))

        if (!cancelled) setInterviewedCandidates(sorted)
      } catch (_e) {
        // Fallback to existing offer.candidates if backend aggregation fails
        const fallback = (offer.candidates ?? [])
          .filter((candidate) => typeof candidate.interviewScore === 'number')
          .sort((a, b) => (b.interviewScore ?? 0) - (a.interviewScore ?? 0))
        if (!cancelled) setInterviewedCandidates(fallback)
      }
    }
    load()
    return () => { cancelled = true }
  }, [offer.id, offer.candidates])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[calc(100vh-3rem)] max-w-4xl overflow-y-auto rounded-4xl border border-border/70 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la liste des candidats"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{offer.department}</p>
          <h2 className="text-2xl font-semibold text-foreground">Candidats pour {offer.title}</h2>
          <p className="text-sm text-muted-foreground">
            Retrouvez ici les profils ayant complété un entretien, avec leurs scores de compatibilité et de restitution.
          </p>
        </header>

        <div className="mt-6 space-y-4">
          {interviewedCandidates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Aucun candidat n'a encore finalisé d'entretien pour cette opportunité.
            </div>
          ) : (
            interviewedCandidates.map((candidate) => {
              const statusKey = candidate.status ?? "pending"
              const statusBadgeClass = CANDIDATE_STATUS_STYLES[statusKey] ?? CANDIDATE_STATUS_STYLES.pending
              const statusLabel = CANDIDATE_STATUS_LABELS[statusKey] ?? "En suivi"

              return (
                <article key={`${offer.id}-${candidate.name}`} className="space-y-3 rounded-3xl border border-border/70 bg-white px-4 py-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.stage}</p>
                      {candidate.feedback && <p className="text-xs text-muted-foreground">{candidate.feedback}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Entretien {candidate.interviewScore}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                        Compatibilité {candidate.score}
                      </span>
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusBadgeClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
