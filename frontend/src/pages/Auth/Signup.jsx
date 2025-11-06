import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../utils/config"
import { useAuth } from "../../context/useAuth"
import { Mail, Lock, Eye, EyeOff, Zap, CheckCircle, Sparkles, FileUp } from "lucide-react"
import successPoolLogo from "../../assets/success-pool-logo.svg"

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    cv: null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [processingMessage, setProcessingMessage] = useState("")

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    if (!formData.cv) {
      newErrors.cv = "Le CV est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          cv: "Veuillez télécharger un fichier PDF ou Word",
        }))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          cv: "Le fichier ne doit pas dépasser 5 MB",
        }))
        return
      }

      setFormData((prev) => ({
        ...prev,
        cv: file,
      }))
      if (errors.cv) {
        setErrors((prev) => ({
          ...prev,
          cv: "",
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setProcessingMessage("Traitement du CV en cours...")

    try {
      const fd = new FormData()
      if (formData.cv) fd.append('cv', formData.cv)

      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/cv/extract`, {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || `HTTP ${res.status}`)
      }
      const data = await res.json()
      // eslint-disable-next-line no-console
      console.log('CV extract response:', data)

      // Do NOT create user yet: let the candidate review/edit parsed data first
      setIsLoading(false)
      setProcessingMessage("")
      navigate('/candidat/creer-profil', {
        replace: true,
        state: {
          parsed: data?.parsed || null,
          email: formData.email,
          password: formData.password,
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('CV extract failed:', err)
      setIsLoading(false)
      setProcessingMessage("")
      navigate('/candidat/creer-profil', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:block space-y-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-4">
              Commencez votre carrière
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Découvrez des milliers d'opportunités adaptées à vos ambitions et talents
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <Zap size={20} className="text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recherche ultra-rapide</h3>
                <p className="text-muted-foreground text-sm">Trouvez l'emploi idéal en quelques clics</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 group-hover:from-accent/30 group-hover:to-accent/10 transition-all duration-300">
                  <CheckCircle size={20} className="text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Profil vérifié</h3>
                <p className="text-muted-foreground text-sm">Soyez mis en avant auprès des recruteurs</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <Sparkles size={20} className="text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">IA recommandations</h3>
                <p className="text-muted-foreground text-sm">Des offres personnalisées selon vos compétences</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-3">Vous avez déjà un compte ?</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
            >
              Se connecter
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-8 md:p-10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/30">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-border/50">
                <img src={successPoolLogo} alt="Success Pool logo" className="h-8 w-8 rounded-md" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Success Pool</h1>
                <p className="text-xs text-muted-foreground">Plateforme de recrutement</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Créer un compte</h2>
            <p className="text-muted-foreground mb-8">Inscription gratuite, accès immédiat aux offres</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary h-5 w-5 transition-colors" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className={`w-full pl-10 pr-4 py-3 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-200 ${
                      errors.email ? "border-red-500" : "border-border/50"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary h-5 w-5 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-200 ${
                      errors.password ? "border-red-500" : "border-border/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary h-5 w-5 transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-200 ${
                      errors.confirmPassword ? "border-red-500" : "border-border/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="cv" className="block text-sm font-medium text-foreground">
                  Votre CV
                </label>
                <div className="relative group">
                  <input type="file" id="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                  <label
                    htmlFor="cv"
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      errors.cv
                        ? "border-red-500 bg-red-50/10"
                        : "border-border/50 bg-secondary/50 hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <FileUp size={18} className={errors.cv ? "text-red-500" : "text-muted-foreground"} />
                    <span className={`text-sm font-medium ${errors.cv ? "text-red-500" : "text-muted-foreground"}`}>
                      {formData.cv ? formData.cv.name : "Cliquez pour télécharger votre CV"}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">PDF ou Word, maximum 5 MB</p>
                {errors.cv && <p className="text-red-500 text-xs mt-1">{errors.cv}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (processingMessage || "Création en cours...") : "Créer mon compte"}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground font-medium">Ou continuer avec</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center mb-6">
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-200 group"
                title="Continuer avec Gmail"
              >
                <svg
                  className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-200 group"
                title="Continuer avec LinkedIn"
              >
                <svg
                  className="h-6 w-6 text-blue-600 group-hover:text-primary transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </button>
            </div>

            <div className="text-center pt-4 border-t border-border/30">
              <p className="text-muted-foreground text-sm mb-2">Vous avez déjà un email ?</p>
              <Link to="/login" className="text-primary font-medium hover:underline transition">
                Se connecter
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
              En vous inscrivant, vous acceptez nos{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


