import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Download,
  FileText,
  Image,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  User,
  UserPlus,
  ChevronDown,
  Video,
  Users,
  X,
} from "lucide-react"
import { useAuth } from "../../context/useAuth"
import { RECOMMENDATION_SEED } from "./recommendation-seed"

const recruiterHighlights = [
  {
    title: "Candidats qualifiés",
    description: "Accédez à un vivier de talents présélectionnés selon vos besoins métiers.",
  },
  {
    title: "Accompagnement dédié",
    description: "Nos experts Success Pool vous conseillent à chaque étape du processus de recrutement.",
  },
  {
    title: "Suivi transparent",
    description: "Visualisez en temps réel l'avancée de vos campagnes et les performances de vos annonces.",
  },
]

const protectedMetrics = [
  { label: "Profils en correspondance", value: "128" },
  { label: "Entretiens programmés", value: "36" },
  { label: "Taux de conversion", value: "72%" },
]

const upcomingActions = [
  { time: "09:30", title: "Préqualification candidat", detail: "Pauline, Lead Backend" },
  { time: "11:00", title: "Comité de recrutement", detail: "Roadmap Q1" },
  { time: "15:15", title: "Signature contrat", detail: "Développeur Front - ScaleUp" },
]

const recommendedCandidates = [
  {
    id: "candidate-lina",
    name: "Lina Moreau",
    role: "Data Scientist Senior",
    experience: "7 ans d'expérience · IA & Risk Analytics",
    score: 92,
    availability: "Disponible sous 1 mois",
    note: "Ex-Lead Data chez Crédit Agricole, pilotage de projets anti-fraude IA.",
    scoreDetails: [
      { label: "Matching mission", value: "96% sur les besoins Risk & Analytics" },
      { label: "Expérience", value: "7 ans en IA anti-fraude bancaire" },
      { label: "Leadership", value: "Management de 8 data scientists" },
    ],
    email: "lina.moreau@talents.ai",
    phone: "+33 6 45 67 89 12",
    resumeUrl: "https://example.com/cv-lina-moreau.pdf",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    aiInterview: {
      sessionDate: "15 octobre 2025",
      duration: "18 minutes",
      questions: [
        {
          id: "q1",
          title: "Expliquez un cas où vous avez détecté une fraude en moins de 48h",
          timeLimit: "2 min",
        },
        {
          id: "q2",
          title: "Comment sécuriser un pipeline data en production contre les biais IA ?",
          timeLimit: "3 min",
        },
        {
          id: "q3",
          title: "Priorisation des chantiers IA dans un environnement bancaire",
          timeLimit: "90 s",
        },
      ],
    },
    status: "qualified",
  },
  {
    id: "candidate-yanis",
    name: "Yanis Belkacem",
    role: "Product Manager Digital Banking",
    experience: "9 ans d'expérience · Mobile & Paiements",
    score: 88,
    availability: "Préavis de 2 mois",
    note: "Responsable lancement app paiement instantané SG Afrique.",
    scoreDetails: [
      { label: "Matching mission", value: "91% sur les parcours produits digitaux" },
      { label: "Impact produit", value: "Lancement de 3 apps paiements" },
      { label: "Stakeholders", value: "Pilotage de squads produit/tech" },
    ],
    email: "yanis.belkacem@productlead.io",
    phone: "+33 6 98 76 54 32",
    resumeUrl: "https://example.com/cv-yanis-belkacem.pdf",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    aiInterview: {
      sessionDate: "11 octobre 2025",
      duration: "16 minutes",
      questions: [
        {
          id: "q1",
          title: "Décrire une roadmap produit data-driven sur 12 mois",
          timeLimit: "2 min",
        },
        {
          id: "q2",
          title: "Comment mesurer le succès d'une fonctionnalité de paiement instantané ?",
          timeLimit: "2 min",
        },
        {
          id: "q3",
          title: "Gestion d'équipe produit/tech en situation de crise",
          timeLimit: "90 s",
        },
      ],
    },
    status: "qualified",
  },
  {
    id: "candidate-sarah",
    name: "Sarah Ndiaye",
    role: "Compliance Officer",
    experience: "6 ans d'expérience · KYC & LCB-FT",
    score: 85,
    availability: "Disponible immédiatement",
    note: "Pilote la remédiation KYC pour portefeuille grands comptes.",
    scoreDetails: [
      { label: "Matching mission", value: "92% sur la conformité corporate" },
      { label: "Programmes KYC", value: "8 dossiers de remédiation livrés" },
      { label: "Langues", value: "FR / EN / SP pour suivi international" },
    ],
    email: "sarah.ndiaye@compliance.io",
    phone: "+33 6 23 45 67 89",
    resumeUrl: "https://example.com/cv-sarah-ndiaye.pdf",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    aiInterview: {
      sessionDate: "6 octobre 2025",
      duration: "21 minutes",
      questions: [
        {
          id: "q1",
          title: "Comment sécuriser un processus KYC corporate international ?",
          timeLimit: "2 min",
        },
        {
          id: "q2",
          title: "Racontez une situation de remédiation critique",
          timeLimit: "3 min",
        },
        {
          id: "q3",
          title: "Indicateurs clefs de pilotage conformité",
          timeLimit: "90 s",
        },
      ],
    },
    status: "qualified",
  },
]

const RECOMMENDATIONS_STORAGE_KEY = "success-pool-recommendations"

const mergeWithSeed = (entries) => {
  const merged = new Map()
  RECOMMENDATION_SEED.forEach((item) => {
    merged.set(item.candidateId, item)
  })
  entries
    .filter((entry) => entry && entry.candidateId)
    .forEach((entry) => {
      merged.set(entry.candidateId, entry)
    })
  return Array.from(merged.values())
}

const loadRecommendationsFromStorage = () => {
  if (typeof window === "undefined") {
    return RECOMMENDATION_SEED
  }

  try {
    const stored = window.localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY)
    if (!stored) {
      persistRecommendationsToStorage(RECOMMENDATION_SEED)
      return RECOMMENDATION_SEED
    }
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      persistRecommendationsToStorage(RECOMMENDATION_SEED)
      return RECOMMENDATION_SEED
    }
    const merged = mergeWithSeed(parsed)
    persistRecommendationsToStorage(merged)
    return merged
  } catch (error) {
    console.warn("Impossible de charger les recommandations stockées", error)
    return RECOMMENDATION_SEED
  }
}

const persistRecommendationsToStorage = (entries) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const merged = mergeWithSeed(entries ?? [])
    window.localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(merged))
  } catch (error) {
    console.warn("Impossible d'enregistrer les recommandations", error)
  }
}

const loginFormInitialState = {
  email: "",
  password: "",
}

const signupFormInitialState = {
  companyName: "",
  recruiterLastName: "",
  recruiterFirstName: "",
  companyEmail: "",
  contactNumber: "",
  profilePhoto: null,
  password: "",
}

export default function RecruiterPortal() {
  const { user, login, logout } = useAuth()
  const [statusMessage, setStatusMessage] = useState(null)
  const [loginForm, setLoginForm] = useState(loginFormInitialState)
  const [signupForm, setSignupForm] = useState(signupFormInitialState)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showCandidatePoolModal, setShowCandidatePoolModal] = useState(false)
  const [candidateDetailId, setCandidateDetailId] = useState(null)
  const [candidateActionMessage, setCandidateActionMessage] = useState(null)
  const [recommendationRegister, setRecommendationRegister] = useState(() => loadRecommendationsFromStorage())
  const [candidateLimit, setCandidateLimit] = useState("all")
  const [candidatePool, setCandidatePool] = useState(() => {
    const registerSnapshot = loadRecommendationsFromStorage()
    return recommendedCandidates.map((candidate) =>
      registerSnapshot.some((entry) => entry.candidateId === candidate.id)
        ? { ...candidate, status: "recommended" }
        : candidate,
    )
  })
  const isRecruiterAuthenticated = user?.role === "recruiter"
  const isSubscribed = user?.isSubscribed ?? false
  const recruiterCompany = user?.company ?? "Société Générale"
  const selectedCandidate = useMemo(
    () => candidatePool.find((candidate) => candidate.id === candidateDetailId) ?? null,
    [candidatePool, candidateDetailId],
  )
  const recommendedCount = useMemo(
    () => candidatePool.filter((candidate) => candidate.status === "recommended").length,
    [candidatePool],
  )
  const invitedCount = useMemo(
    () => candidatePool.filter((candidate) => candidate.status === "invited").length,
    [candidatePool],
  )
  const totalCandidates = candidatePool.length
  const displayedCandidates = useMemo(() => {
    if (candidateLimit === "all") {
      return candidatePool
    }

    const limitValue = Number(candidateLimit)
    if (Number.isNaN(limitValue) || limitValue <= 0) {
      return candidatePool
    }

    return candidatePool.slice(0, limitValue)
  }, [candidatePool, candidateLimit])

  const statusVariants = {
    success: "border-primary/40 bg-primary/10 text-primary",
    error: "border-destructive/40 bg-destructive/10 text-destructive",
    info: "border-accent/40 bg-accent/10 text-primary",
  }

  useEffect(() => {
    persistRecommendationsToStorage(recommendationRegister)
  }, [recommendationRegister])

  useEffect(() => {
    if (!candidateActionMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setCandidateActionMessage(null)
    }, 4000)

    return () => window.clearTimeout(timeoutId)
  }, [candidateActionMessage])

  const openCandidatePool = () => {
    setShowCandidatePoolModal(true)
  }

  const closeCandidatePool = () => {
    setShowCandidatePoolModal(false)
  }

  const handleViewCandidate = (candidateId) => {
    setCandidateDetailId(candidateId)
    closeCandidatePool()
  }

  const handleCloseModals = () => {
    setShowLoginModal(false)
    setShowSignupModal(false)
  }

  const openLoginModal = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  const openSignupModal = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (event) => {
    const { name, value, files } = event.target
    if (name === "profilePhoto") {
      setSignupForm((prev) => ({ ...prev, profilePhoto: files?.[0] ?? null }))
    } else {
      setSignupForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const setCandidateStatus = (candidateId, status) => {
    setCandidatePool((prev) => prev.map((candidate) => (candidate.id === candidateId ? { ...candidate, status } : candidate)))
  }

  const handleInviteCandidate = (candidate) => {
    if (candidate.status === "recruited") {
      setCandidateActionMessage({ type: "info", text: `${candidate.name} est déjà recruté.` })
      return
    }

    if (candidate.status === "invited") {
      setCandidateActionMessage({ type: "info", text: `${candidate.name} a déjà reçu une invitation à l'entretien final.` })
      return
    }

    setCandidateStatus(candidate.id, "invited")
    setCandidateActionMessage({
      type: "success",
      text: `${candidate.name} a été invité à l'entretien final. Un email de confirmation lui a été envoyé automatiquement.`,
    })
  }

  const handleRecruitCandidate = (candidate) => {
    if (candidate.status === "recruited") {
      setCandidateActionMessage({ type: "info", text: `${candidate.name} est déjà marqué comme recruté.` })
      return
    }

    setCandidateStatus(candidate.id, "recruited")
    setCandidateActionMessage({
      type: "success",
      text: `${candidate.name} est désormais marqué comme recruté pour ${recruiterCompany}.`,
    })
  }

  const handleRecommendCandidate = (candidate) => {
    if (candidate.status === "recruited") {
      setCandidateActionMessage({
        type: "info",
        text: `${candidate.name} est déjà recruté chez ${recruiterCompany}. Partagez un autre profil.`,
      })
      return
    }

    if (recommendationRegister.some((entry) => entry.candidateId === candidate.id)) {
      setCandidateStatus(candidate.id, "recommended")
      setCandidateActionMessage({
        type: "info",
        text: `${candidate.name} est déjà partagé avec les autres recruteurs Success Pool.`,
      })
      return
    }

    const newRecord = {
      candidateId: candidate.id,
      name: candidate.name,
      role: candidate.role,
      score: candidate.score,
      scoreDetails: candidate.scoreDetails ?? [],
      recommendedFor: candidate.role,
      recommendedBy: recruiterCompany,
      recommendedAt: new Date().toISOString(),
      availability: candidate.availability ?? "",
      candidateNotes: candidate.note ?? "",
      contactEmail: candidate.email ?? "",
      contactPhone: candidate.phone ?? "",
      status: "recommended",
      offer: null,
    }

    setCandidateStatus(candidate.id, "recommended")
    setRecommendationRegister((prev) => [...prev, newRecord])
    setCandidateActionMessage({
      type: "success",
      text: `${candidate.name} a été recommandé aux autres recruteurs Success Pool.`,
    })
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    setStatusMessage(null)
    try {
      const account = login(loginForm.email, loginForm.password)
      setLoginForm(loginFormInitialState)
      handleCloseModals()

      if (account.role === "recruiter") {
        setStatusMessage({
          type: "success",
          text: "Authentification réussie. Bienvenue dans l'espace recruteur Success Pool.",
        })
      } else {
        setStatusMessage({
          type: "info",
          text: "Compte candidat connecté. Cet espace reste réservé aux recruteurs. L'espace candidat arrive très prochainement.",
        })
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error?.message ?? "Impossible de vous connecter. Merci de vérifier vos identifiants.",
      })
    }
  }

  const handleSignupSubmit = (event) => {
    event.preventDefault()
    setStatusMessage(null)
    setStatusMessage({
      type: "success",
      text: "Votre demande d'accès recruteur a été enregistrée. Notre équipe vous recontactera sous 24h.",
    })
    setSignupForm(signupFormInitialState)
    handleCloseModals()
  }

  return (
    <main className="bg-background">
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/10 via-background to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-accent/10 via-background to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {statusMessage && (
            <div
              className={`mb-8 rounded-3xl border px-6 py-4 text-sm font-medium ${
                statusVariants[statusMessage.type] ?? "border-border/70 bg-secondary/80 text-foreground"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {user && (
            <div className="mb-10 flex flex-col justify-between gap-3 rounded-3xl border border-border/70 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Connecté en tant que {user.role === "recruiter" ? "recruteur démo" : "candidat démo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.fullName} · {user.email}
                </p>
                {user.role !== "recruiter" && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Cet espace reste réservé aux recruteurs Success Pool. Conservez ce compte pour tester l'expérience candidat dès qu'elle sera disponible.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={logout}
                className="self-start rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                Se déconnecter
              </button>
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-10">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary" /> Accès exclusif recruteur
                </span>
                <h1 className="text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
                  Accédez à l'espace recruteur Success Pool
                </h1>
                <p className="max-w-xl text-base text-muted-foreground">
                  Centralisez vos recrutements, suivez vos campagnes et collaborez avec nos experts dans un environnement sécurisé.
                  Connectez-vous ou créez un compte pour déverrouiller votre tableau de bord personnalisé.
                </p>
                <div className="grid gap-4">
                  {recruiterHighlights.map((highlight) => (
                    <div key={highlight.title} className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{highlight.title}</p>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  <ShieldCheck size={16} /> Accès sécurisé
                </span>
                <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Activez votre portail Success Pool</h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Centralisez vos recrutements, obtenez des recommandations intelligentes et collaborez avec nos experts tout en gardant la maîtrise totale de vos données.
                </p>
              </div>

              {isRecruiterAuthenticated && (
                <div className="space-y-5 rounded-3xl border border-border/60 bg-white/90 p-6 shadow-sm backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Recommandés par {recruiterCompany}
                      </p>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">Candidats engagés</h3>
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">
                          {totalCandidates}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {totalCandidates} talents présélectionnés par Success Pool pour vos besoins prioritaires.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openCandidatePool}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/70 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      <Users size={16} /> Voir les candidats ({totalCandidates}) <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-medium text-primary">
                      <CalendarCheck size={14} /> Invitations entretien final : {invitedCount}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-medium text-primary">
                      <Share2 size={14} /> Recommandés vers d'autres équipes : {recommendedCount}
                    </span>
                  </div>

                  {candidateActionMessage && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-xs font-medium ${
                        candidateActionMessage.type === "success"
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-accent/40 bg-accent/10 text-primary"
                      }`}
                    >
                      {candidateActionMessage.text}
                    </div>
                  )}

                  <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/10 px-4 py-3 text-xs text-primary">
                    {isSubscribed
                      ? "Vous êtes abonné Success Pool : accédez à l'ensemble des recommandations Société Générale."
                      : "Pour débloquer davantage de profils recommandés, abonnez-vous directement depuis l'application Success Pool."}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="rounded-4xl border border-border/60 bg-white/98 p-8 shadow-2xl backdrop-blur">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Tableau de bord</p>
                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Vue d'ensemble recruteur</h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Visualisez vos indicateurs clés, vos prochaines actions et vos priorités Success Pool dans un espace sécurisé et synchronisé en temps réel.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-primary/25 bg-primary/10 px-5 py-4 text-xs text-primary shadow-inner">
                    <p className="font-semibold uppercase tracking-[0.28em]">Société Générale</p>
                    <p className="mt-1 text-[0.78rem] text-primary/80">Accès premium activé · Talent Partner Success Pool</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {protectedMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="group rounded-3xl border border-border/50 bg-secondary/60 px-5 py-6 text-center shadow-lg shadow-primary/5 transition hover:border-primary/40 hover:shadow-primary/20"
                    >
                      <p className="text-3xl font-semibold text-foreground md:text-4xl">{metric.value}</p>
                      <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] leading-5 text-muted-foreground wrap-break-word">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Actions du jour</p>
                    <span className="text-xs text-muted-foreground">Synchronisé à 08:15 · Data temps réel</span>
                  </div>
                  <div className="space-y-3">
                    {upcomingActions.map((action) => (
                      <div
                        key={action.title}
                        className="group flex items-center justify-between gap-4 rounded-3xl border border-border/60 bg-white/90 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{action.time}</p>
                          <p className="text-sm font-semibold text-foreground">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.detail}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                          À suivre
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!isRecruiterAuthenticated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-4xl border border-dashed border-primary/40 bg-background/80 text-center shadow-inner backdrop-blur-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock size={22} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">S'abonner pour voir plus de candidats recommandés</p>
                    <p className="text-xs text-muted-foreground">
                      Connectez-vous ou créez votre compte recruteur pour accéder à vos données et actions.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <button
                      type="button"
                      onClick={openLoginModal}
                      className="rounded-full border border-primary px-4 py-2 transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Se connecter
                    </button>
                    <button
                      type="button"
                      onClick={openSignupModal}
                      className="rounded-full border border-primary px-4 py-2 transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Créer un compte
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showLoginModal && (
        <Modal onClose={handleCloseModals}>
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lock size={18} className="text-primary" /> Connexion recruteur
            </div>
            <p className="text-sm text-muted-foreground">
              Accédez à vos campagnes actives en toute sécurité.
            </p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-sm">
            <label className="block">
              <span className="mb-2 block font-medium text-muted-foreground">Email professionnel</span>
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <Mail size={18} className="text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="prenom.nom@entreprise.com"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block font-medium text-muted-foreground">Mot de passe</span>
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <KeyRound size={18} className="text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:shadow-xl"
            >
              Se connecter
            </button>
          </form>
        </Modal>
      )}

      {showSignupModal && (
        <Modal onClose={handleCloseModals} className="md:max-w-3xl">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <UserPlus size={18} /> Créer un compte recruteur
            </div>
            <p className="text-sm text-muted-foreground">
              Renseignez vos informations pour recevoir vos accès personnalisés sous 24h.
            </p>
          </div>
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Nom de l'entreprise</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Building2 size={18} className="text-primary" />
                  <input
                    type="text"
                    name="companyName"
                    value={signupForm.companyName}
                    onChange={handleSignupChange}
                    placeholder="Success Pool"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block font-medium text-muted-foreground">Nom</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <User size={18} className="text-primary" />
                  <input
                    type="text"
                    name="recruiterLastName"
                    value={signupForm.recruiterLastName}
                    onChange={handleSignupChange}
                    placeholder="Dupont"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block font-medium text-muted-foreground">Prénom</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <User size={18} className="text-primary" />
                  <input
                    type="text"
                    name="recruiterFirstName"
                    value={signupForm.recruiterFirstName}
                    onChange={handleSignupChange}
                    placeholder="Claire"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Email de contact</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Mail size={18} className="text-primary" />
                  <input
                    type="email"
                    name="companyEmail"
                    value={signupForm.companyEmail}
                    onChange={handleSignupChange}
                    placeholder="talents@successpool.com"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Numéro de contact</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Phone size={18} className="text-primary" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={signupForm.contactNumber}
                    onChange={handleSignupChange}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Photo de profil</span>
                <div className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-white px-4 py-3">
                  <Image size={18} className="text-primary" />
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleSignupChange}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-primary file:transition file:hover:bg-primary/20"
                    required
                  />
                </div>
                <span className="mt-1 block text-xs text-muted-foreground/80">Formats acceptés : JPG, PNG (max 5 Mo)</span>
                {signupForm.profilePhoto && (
                  <span className="mt-1 block text-xs text-muted-foreground">{signupForm.profilePhoto.name}</span>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Mot de passe</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <KeyRound size={18} className="text-primary" />
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder="Définissez un mot de passe sécurisé"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full border border-primary bg-primary/90 px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary"
            >
              Demander un accès recruteur
            </button>
          </form>
        </Modal>
      )}

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setCandidateDetailId(null)}
          onInvite={() => handleInviteCandidate(selectedCandidate)}
          onRecruit={() => handleRecruitCandidate(selectedCandidate)}
          onRecommend={() => handleRecommendCandidate(selectedCandidate)}
        />
      )}

      {showCandidatePoolModal && (
        <CandidatePoolModal
          candidates={displayedCandidates}
          candidateActionMessage={candidateActionMessage}
          candidateLimit={candidateLimit}
          onLimitChange={setCandidateLimit}
          onClose={closeCandidatePool}
          onViewProfile={handleViewCandidate}
          onInvite={handleInviteCandidate}
          onRecruit={handleRecruitCandidate}
          onRecommend={handleRecommendCandidate}
          totalAvailable={candidatePool.length}
        />
      )}
    </main>
  )
}

function Modal({ onClose, className = "", children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-6 sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
  className={`relative w-full max-h-[calc(100vh-3rem)] max-w-[min(100%,36rem)] overflow-y-auto rounded-4xl border border-border/70 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:max-w-[min(100%,40rem)] md:max-w-2xl md:p-8 ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la fenêtre modale"
        >
          <X size={18} strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  )
}

function CandidateDetailModal({ candidate, onClose, onInvite, onRecruit, onRecommend }) {
  const isInvited = candidate.status === "invited"
  const isRecruited = candidate.status === "recruited"
  const isRecommended = candidate.status === "recommended"
  const scoreDetails = Array.isArray(candidate.scoreDetails) ? candidate.scoreDetails : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[calc(100vh-3rem)] max-w-4xl overflow-y-auto rounded-4xl border border-border/60 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la fiche candidat"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="flex flex-col gap-6">
          <header className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Profil IA préqualifié</p>
                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{candidate.name}</h2>
                <p className="text-sm text-muted-foreground">{candidate.role}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Score {candidate.score}
                </span>
                {scoreDetails.length > 0 && (
                  <ul className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                    {scoreDetails.map((detail, index) => (
                      <li key={`${detail.label}-${index}`} className="flex items-center gap-2 text-right">
                        <span className="font-medium text-foreground">{detail.label}</span>
                        <span>{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {candidate.experience && <span className="text-xs text-muted-foreground">{candidate.experience}</span>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{candidate.note}</p>
          </header>

          <section className="grid gap-4 rounded-3xl border border-border/60 bg-secondary/60 p-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Coordonnées</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href={`mailto:${candidate.email}`} className="text-foreground hover:text-primary">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <a href={`tel:${candidate.phone}`} className="text-foreground hover:text-primary">
                  {candidate.phone}
                </a>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Documents</p>
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <Download size={16} /> Télécharger le CV
              </a>
              <p className="text-xs text-muted-foreground/80">CV validé par Success Pool · format PDF</p>
            </div>
          </section>

          <section className="space-y-3 rounded-3xl border border-border/60 bg-white px-4 py-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
              <Video size={16} /> Replay entretien IA
            </p>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-black/80">
              <video controls preload="metadata" className="h-52 w-full sm:h-72">
                <source src={candidate.videoUrl} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
            <div className="rounded-2xl border border-border/40 bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
              <p>{candidate.aiInterview.sessionDate} · Durée {candidate.aiInterview.duration}</p>
              <p className="mt-1 font-medium text-foreground">
                Questions générées par l'IA · chaque réponse est limitée dans le temps
              </p>
              <div className="mt-2 space-y-2">
                {candidate.aiInterview.questions.map((question) => (
                  <div key={question.id} className="rounded-2xl border border-border/40 bg-white px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{question.title}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Temps limite : {question.timeLimit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-3xl border border-border/60 bg-secondary/60 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Actions recruteur</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {isInvited && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-primary">
                  <Send size={13} /> Invitation envoyée
                </span>
              )}
              {isRecruited && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-600">
                  <CheckCircle2 size={13} /> Recruté
                </span>
              )}
              {isRecommended && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-primary">
                  <Share2 size={13} /> Partagé
                </span>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onInvite}
                disabled={isInvited || isRecruited}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} /> Inviter à l'entretien final
              </button>
              <button
                type="button"
                onClick={onRecruit}
                disabled={isRecruited}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} /> Marquer comme recruté
              </button>
              <button
                type="button"
                onClick={onRecommend}
                disabled={isRecommended || isRecruited}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Share2 size={16} /> Recommander à un autre recruteur
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <X size={16} /> Fermer la fiche
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function CandidatePoolModal({
  candidates,
  candidateActionMessage,
  candidateLimit,
  onLimitChange,
  onClose,
  onViewProfile,
  onInvite,
  onRecruit,
  onRecommend,
  totalAvailable,
}) {
  const isAllSelected = candidateLimit === "all"
  const numericLimitValue = isAllSelected ? "" : String(candidateLimit)

  const handleLimitInput = (event) => {
    const rawValue = event.target.value.trim()

    if (rawValue === "") {
      onLimitChange("all")
      return
    }

    const parsedValue = Number(rawValue)
    if (Number.isNaN(parsedValue) || parsedValue <= 0) {
      onLimitChange("all")
      return
    }

    const clampedValue = Math.min(parsedValue, totalAvailable)
    onLimitChange(String(clampedValue))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-6 sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[calc(100vh-3rem)] max-w-5xl overflow-y-auto rounded-4xl border border-border/60 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la liste des candidats"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <header className="mb-6 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Vivier Success Pool</p>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Candidats recommandés</h2>
              <p className="text-sm text-muted-foreground">{totalAvailable} profils présélectionnés pour vos missions prioritaires.</p>
            </div>
            <label className="flex items-center gap-3 rounded-full border border-border/60 bg-secondary/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Filtrer par nombre
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLimitChange("all")}
                  className={`rounded-full border px-3 py-1 text-[11px] transition ${
                    isAllSelected
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border/70 bg-white text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  Tous
                </button>
                <input
                  type="number"
                  min={1}
                  max={totalAvailable}
                  step={1}
                  value={numericLimitValue}
                  onChange={handleLimitInput}
                  placeholder={`Top ${Math.min(3, totalAvailable)}`}
                  className="w-24 rounded-full border border-border/40 bg-white px-3 py-1 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </label>
          </div>

          {candidateActionMessage && (
            <div
              className={`rounded-2xl border px-4 py-3 text-xs font-medium ${
                candidateActionMessage.type === "success"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-accent/40 bg-accent/10 text-primary"
              }`}
            >
              {candidateActionMessage.text}
            </div>
          )}
        </header>

        <div className="space-y-4">
          {candidates.map((candidate) => {
            const isInvited = candidate.status === "invited"
            const isRecommended = candidate.status === "recommended"
            const isRecruited = candidate.status === "recruited"

            return (
              <article key={candidate.id} className="space-y-3 rounded-3xl border border-border/60 bg-secondary/60 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{candidate.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Score {candidate.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                <p className="text-xs text-muted-foreground">{candidate.note}</p>
                <p className="text-xs font-medium text-primary">{candidate.availability}</p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {isInvited && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2 py-1 text-primary">
                      <Send size={12} /> Invité au final
                    </span>
                  )}
                  {isRecommended && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2 py-1 text-primary">
                      <Share2 size={12} /> Partagé aux équipes
                    </span>
                  )}
                  {isRecruited && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-emerald-600">
                      <CheckCircle2 size={12} /> Recruté
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile(candidate.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border/80 bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary sm:flex-none sm:px-4"
                  >
                    <FileText size={14} /> Consulter
                  </button>
                  <button
                    type="button"
                    onClick={() => onInvite(candidate)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:flex-none sm:px-4"
                    disabled={isInvited || isRecruited}
                  >
                    <Send size={14} /> Inviter
                  </button>
                  <button
                    type="button"
                    onClick={() => onRecruit(candidate)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white sm:flex-none sm:px-4"
                    disabled={isRecruited}
                  >
                    <CheckCircle2 size={14} /> Recruter
                  </button>
                  <button
                    type="button"
                    onClick={() => onRecommend(candidate)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:flex-none sm:px-4"
                    disabled={isRecruited || isRecommended}
                  >
                    <Share2 size={14} /> Recommander
                  </button>
                </div>
              </article>
            )
          })}

          {candidates.length === 0 && (
            <p className="rounded-3xl border border-dashed border-border/60 bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Aucun candidat à afficher pour ce filtre. Ajustez la sélection pour explorer le vivier complet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
