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
  CheckCircle2,
  Send,
  Share2,
  UserX,
} from "lucide-react"
import { useAuth } from "../../context/useAuth"

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

const INITIAL_OFFERS = [
  {
    id: "offer-1",
    title: "Lead Data Scientist - Lutte Anti-Fraude",
    department: "Société Générale · Direction des Risques",
    status: "Disponible",
    publishedAt: "Publié le 02/11/2025",
    location: "Paris · Hybride",
    contractType: "CDI",
    contractDuration: "Temps plein",
    mission:
      "Piloter la stratégie anti-fraude data-driven et accompagner la montée en compétence d'une squad de 6 data scientists en lien avec la conformité.",
    candidates: [
      {
        name: "Lina Moreau",
        score: 92,
        stage: "Entretien final programmé",
        feedback: "Solide expérience IA anti-fraude, leadership confirmé.",
        status: "pending",
      },
      {
        name: "Alexandre Pereira",
        score: 86,
        stage: "Entretien technique",
        feedback: "Ex-Head of Data chez fintech, vision produit forte.",
        status: "pending",
      },
      {
        name: "Emma Rousseau",
        score: 81,
        stage: "Pré-qualification",
        feedback: "Expertise data engineering, besoin d'approfondir use cases fraude.",
        status: "pending",
      },
    ],
    keywords: ["Anti-fraude", "Leadership squad", "Data Science"],
    skills: [
      { name: "Python", importance: "Importante" },
      { name: "Spark", importance: "Importante" },
      { name: "Détection d'anomalies", importance: "Souhaitée" },
    ],
  },
  {
    id: "offer-2",
    title: "Product Manager - Banque Mobile",
    department: "Société Générale · Digital Factory",
    status: "Fermée",
    publishedAt: "Publié le 28/10/2025",
    location: "Lille · Remote partiel",
  contractType: "CDI",
  contractDuration: "Temps plein",
    mission: "Définir la roadmap mobile, coordonner design/tech et piloter les releases en lien avec les besoins métiers et clients.",
    candidates: [
      {
        name: "Yanis Belkacem",
        score: 88,
        stage: "Entretien RH",
        feedback: "Lancement app paiement instantané dans 4 marchés.",
        status: "pending",
      },
      {
        name: "Camille Duval",
        score: 80,
        stage: "Dossier en cours",
        feedback: "Ancienne PM Boursorama, forte culture mobile.",
        status: "pending",
      },
    ],
    keywords: ["Roadmap produit", "Banque mobile", "Go-to-market"],
    skills: [
      { name: "Product discovery", importance: "Importante" },
      { name: "Analytics", importance: "Importante" },
      { name: "Agilité", importance: "Souhaitée" },
    ],
  },
  {
    id: "offer-3",
    title: "Compliance Officer - KYC Corporate",
    department: "Société Générale · Conformité",
    status: "Disponible",
    publishedAt: "Publié le 19/10/2025",
    location: "Lyon · Présentiel",
    contractType: "CDD",
    contractDuration: "12 mois",
    mission:
      "Superviser la remédiation KYC grands comptes et sécuriser la conformité des processus corporate en interaction avec les métiers.",
    candidates: [
      {
        name: "Sarah Ndiaye",
        score: 85,
        stage: "Contrat signé",
        feedback: "Pilotage remédiation KYC grands comptes.",
        status: "recruited",
      },
      {
        name: "Julien Lefèvre",
        score: 77,
        stage: "Vérifications de références",
        feedback: "Conformité marché dérivés, besoin formation KYC corporate.",
        status: "pending",
      },
    ],
    keywords: ["KYC", "Grands comptes", "Conformité"],
    skills: [
      { name: "Veille réglementaire", importance: "Importante" },
      { name: "Analyse risque", importance: "Importante" },
      { name: "Pilotage dossier", importance: "Souhaitée" },
    ],
  },
]

const STATUS_FILTERS = [
  { label: "Toutes", value: "Toutes" },
  { label: "Disponible", value: "Disponible" },
  { label: "Fermée", value: "Fermée" },
]

export default function MyOffers() {
  const { user } = useAuth()
  const isRecruiter = user?.role === "recruiter"
  const isSubscribed = user?.isSubscribed ?? false
  const recruiterCompany = user?.company ?? "Société Générale"

  const [offers, setOffers] = useState(INITIAL_OFFERS)
  const [selectedStatus, setSelectedStatus] = useState("Toutes")
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeOfferId, setActiveOfferId] = useState(null)
  const [candidateActionMessage, setCandidateActionMessage] = useState(null)
  const [newOffer, setNewOffer] = useState({
    title: "",
    department: `${recruiterCompany} · Département`,
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
    if (!candidateActionMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setCandidateActionMessage(null)
    }, 3500)

    return () => window.clearTimeout(timeoutId)
  }, [candidateActionMessage])

  const resetForm = () => {
    setNewOffer({
      title: "",
      department: `${recruiterCompany} · Département`,
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
    setActiveOfferId(offerId)
  }

  const closeCandidatesModal = () => {
    setActiveOfferId(null)
  }

  const updateCandidate = (offerId, candidateName, updater) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) => {
        if (offer.id !== offerId) {
          return offer
        }

        const updatedCandidates = offer.candidates.map((candidate) =>
          candidate.name === candidateName ? updater(candidate) : candidate,
        )

        return { ...offer, candidates: updatedCandidates }
      }),
    )
  }

  const handleInviteCandidate = (offerId, candidateName) => {
    updateCandidate(offerId, candidateName, (candidate) => {
      if (candidate.status === "recruited" || candidate.status === "refused") {
        return candidate
      }
      return {
        ...candidate,
        status: "invited",
        stage: "Entretien à planifier",
      }
    })
    setCandidateActionMessage({ type: "success", text: "Invitation à l'entretien final envoyée." })
  }

  const handleRecruitCandidate = (offerId, candidateName) => {
    updateCandidate(offerId, candidateName, (candidate) => ({
      ...candidate,
      status: "recruited",
      stage: "Contrat signé",
    }))
    setCandidateActionMessage({ type: "success", text: "Le candidat est maintenant marqué comme recruté." })
  }

  const handleRecommendCandidate = (offerId, candidateName) => {
    updateCandidate(offerId, candidateName, (candidate) => {
      if (candidate.status === "recruited" || candidate.status === "refused") {
        return candidate
      }
      return {
        ...candidate,
        status: "recommended",
        stage: "Recommandé aux autres équipes",
      }
    })
    setCandidateActionMessage({ type: "success", text: "Profil partagé avec les autres recruteurs Success Pool." })
  }

  const handleRefuseCandidate = (offerId, candidateName) => {
    updateCandidate(offerId, candidateName, (candidate) => ({
      ...candidate,
      status: "refused",
      stage: "Candidature refusée",
    }))
    setCandidateActionMessage({ type: "info", text: "Candidat marqué comme non retenu." })
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

  const handleAddOffer = (event) => {
    event.preventDefault()

    const keywords = newOffer.keywords
      .split(/[\n,]/)
      .map((tag) => tag.trim())
      .filter(Boolean)

    const mission = newOffer.mission.trim()

  const skills = newOffer.skills.filter((skill) => Boolean(skill?.name))

    const offerToAdd = {
      id: `offer-${Date.now()}`,
      title: newOffer.title || "Nouvelle opportunité",
      department: newOffer.department || `${recruiterCompany} · Département`,
      status: newOffer.status,
      publishedAt: "Brouillon",
      location: newOffer.location || "À préciser",
      contractType: newOffer.contractType || "À préciser",
      contractDuration: newOffer.contractDuration || "À préciser",
      salary: newOffer.salary || "Non précisé",
      remote: newOffer.remote || "À définir",
      experience: newOffer.experience || "À préciser",
      education: newOffer.education || "À préciser",
      mission,
      keywords,
      skills,
      candidates: [],
    }

    setOffers((prev) => [offerToAdd, ...prev])
    setShowAddModal(false)
    resetForm()
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
              Pilotage des recrutements {recruiterCompany}. Retrouvez vos offres actives, l'avancée des candidats et ajoutez de nouvelles opportunités en un clic.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-border/60 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user.fullName} · {recruiterCompany}
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
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus size={16} /> Ajouter une offre
                </button>
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
                        <button
                          type="button"
                          onClick={() => {
                            setCandidateActionMessage(null)
                            openCandidatesModal(offer.id)
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                        >
                          <Users size={16} />
                          {candidateCount > 0 ? `Voir les candidats (${candidateCount})` : "Ajouter des candidats"}
                          <ChevronDown size={14} />
                        </button>
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
      {selectedOffer && (
        <OfferCandidatesModal
          offer={selectedOffer}
          onClose={closeCandidatesModal}
          onInvite={handleInviteCandidate}
          onRecruit={handleRecruitCandidate}
          onRecommend={handleRecommendCandidate}
          onRefuse={handleRefuseCandidate}
          candidateActionMessage={candidateActionMessage}
        />
      )}
      {showAddModal && (
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

function OfferCandidatesModal({ offer, onClose, onInvite, onRecruit, onRecommend, onRefuse, candidateActionMessage }) {
  const sortedCandidates = (offer.candidates ?? []).slice().sort((candidateA, candidateB) => candidateB.score - candidateA.score)

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
            Consultez les talents engagés, attribuez-leur des actions de suivi et partagez les profils pertinents avec les autres équipes Success Pool.
          </p>
        </header>

        {candidateActionMessage && (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 text-xs font-medium ${
              candidateActionMessage.type === "success"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-accent/40 bg-accent/10 text-primary"
            }`}
          >
            {candidateActionMessage.text}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {sortedCandidates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Aucun candidat n'a encore été rattaché à cette offre. Ajoutez vos premiers talents pour lancer le suivi.
            </div>
          ) : (
            sortedCandidates.map((candidate) => {
              const statusKey = candidate.status ?? "pending"
              const statusBadgeClass = CANDIDATE_STATUS_STYLES[statusKey] ?? CANDIDATE_STATUS_STYLES.pending
              const statusLabel = CANDIDATE_STATUS_LABELS[statusKey] ?? "En suivi"

              const isInvited = candidate.status === "invited"
              const isRecommended = candidate.status === "recommended"
              const isRecruited = candidate.status === "recruited"
              const isRefused = candidate.status === "refused"

              return (
                <article key={`${offer.id}-${candidate.name}`} className="space-y-3 rounded-3xl border border-border/70 bg-white px-4 py-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.stage}</p>
                      {candidate.feedback && <p className="text-xs text-muted-foreground">{candidate.feedback}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Score {candidate.score}
                      </span>
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusBadgeClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => onInvite(offer.id, candidate.name)}
                      disabled={isInvited || isRecruited || isRefused}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={14} /> Entretien
                    </button>
                    <button
                      type="button"
                      onClick={() => onRecruit(offer.id, candidate.name)}
                      disabled={isRecruited}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 size={14} /> Recruter
                    </button>
                    <button
                      type="button"
                      onClick={() => onRecommend(offer.id, candidate.name)}
                      disabled={isRecommended || isRecruited || isRefused}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Share2 size={14} /> Recommander
                    </button>
                    <button
                      type="button"
                      onClick={() => onRefuse(offer.id, candidate.name)}
                      disabled={isRefused || isRecruited}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <UserX size={14} /> Refuser
                    </button>
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
