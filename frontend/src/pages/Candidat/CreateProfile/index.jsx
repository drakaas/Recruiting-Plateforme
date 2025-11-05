import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { Plus, Trash2, Building2, User, Github, Linkedin, FileText } from "lucide-react"
import { civilityOptions, initialProfileState } from "./data"

export default function CreateCandidateProfilePage() {
  const location = useLocation()
  const [profile, setProfile] = useState(initialProfileState)
  const [errors, setErrors] = useState({})

  const normalizedFromParsed = useMemo(() => {
    const parsed = location?.state?.parsed
    if (!parsed) return null
    try {
      const civilityRaw = (parsed.civilite || '').toLowerCase()
      const civility = civilityRaw.includes('monsieur') ? 'mr' : civilityRaw.includes('madame') ? 'mrs' : 'other'
      const otherLinks = Array.isArray(parsed?.liens?.autres)
        ? parsed.liens.autres.filter(Boolean).map((url) => ({ name: '', url }))
        : []
      const projects = Array.isArray(parsed?.projets_professionnels)
        ? parsed.projets_professionnels.map((p) => ({
            name: p?.nom || '',
            level: p?.niveau || '',
            organization: p?.organisme || '',
            date: p?.date || '',
            description: p?.description || '',
            skills: Array.isArray(p?.competences) ? p.competences.filter(Boolean).join(', ') : (p?.competences || ''),
          }))
        : []
      return {
        civility,
        firstName: parsed?.prenom || '',
        lastName: parsed?.nom || '',
        city: parsed?.ville || '',
        postalCode: parsed?.code_postal || '',
        phone: parsed?.telephone || '',
        github: parsed?.liens?.github || '',
        linkedin: parsed?.liens?.linkedin || '',
        otherLinks: otherLinks.length ? otherLinks : initialProfileState.otherLinks,
        projects: projects.length ? projects : initialProfileState.projects,
        documents: initialProfileState.documents,
      }
    } catch (_e) {
      return null
    }
  }, [location?.state?.parsed])

  useEffect(() => {
    if (normalizedFromParsed) {
      setProfile((prev) => ({ ...prev, ...normalizedFromParsed }))
    }
  }, [normalizedFromParsed])

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOtherLinkChange = (index, field, value) => {
    const newLinks = [...profile.otherLinks]
    newLinks[index][field] = value
    setProfile((prev) => ({
      ...prev,
      otherLinks: newLinks,
    }))
  }

  const addOtherLink = () => {
    setProfile((prev) => ({
      ...prev,
      otherLinks: [...prev.otherLinks, { name: "", url: "" }],
    }))
  }

  const removeOtherLink = (index) => {
    setProfile((prev) => ({
      ...prev,
      otherLinks: prev.otherLinks.filter((_, i) => i !== index),
    }))
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...profile.projects]
    newProjects[index][field] = value
    setProfile((prev) => ({
      ...prev,
      projects: newProjects,
    }))
  }

  const addProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", level: "", organization: "", date: "", description: "", skills: "" }],
    }))
  }

  const removeProject = (index) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const handleDocumentChange = (index, field, value) => {
    const newDocs = [...profile.documents]
    if (field === "file") {
      newDocs[index].file = value
    } else {
      newDocs[index][field] = value
    }
    setProfile((prev) => ({
      ...prev,
      documents: newDocs,
    }))
  }

  const addDocument = () => {
    setProfile((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: "", file: null }],
    }))
  }

  const removeDocument = (index) => {
    setProfile((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log("Profil complété:", profile)
    alert("Profil sauvegardé avec succès!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">
            Complétez votre profil
          </h1>
          <p className="text-muted-foreground">Remplissez vos informations pour optimiser votre profil candidat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              Informations générales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Civilité</label>
                <select
                  name="civility"
                  value={profile.civility}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  {civilityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleGeneralChange}
                  placeholder="Votre prénom"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleGeneralChange}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ville</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleGeneralChange}
                  placeholder="Votre ville"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Code postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={profile.postalCode}
                  onChange={handleGeneralChange}
                  placeholder="Votre code postal"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleGeneralChange}
                  placeholder="Votre numéro"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center">
                <Linkedin size={20} className="text-accent" />
              </div>
              Vos liens
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Github size={16} />
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={profile.github}
                  onChange={handleGeneralChange}
                  placeholder="https://github.com/votre-profil"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Linkedin size={16} />
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleGeneralChange}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="border-t border-border/30 pt-4">
                <h3 className="font-semibold text-foreground mb-4">Autres liens</h3>
                {profile.otherLinks.map((link, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nom du lien"
                      value={link.name}
                      onChange={(e) => handleOtherLinkChange(index, "name", e.target.value)}
                      className="flex-1 px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleOtherLinkChange(index, "url", e.target.value)}
                      className="flex-1 px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherLink(index)}
                      className="px-3 py-3 bg-destructive/10 border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-all text-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOtherLink}
                  className="mt-3 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Plus size={16} />
                  Ajouter un lien
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-primary" />
              </div>
              Projets professionnels
            </h2>

            <div className="space-y-6">
              {profile.projects.map((project, index) => (
                <div key={index} className="border border-border/30 rounded-lg p-6 bg-secondary/20">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-foreground">Projet {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="p-2 bg-destructive/10 border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-all text-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nom du projet"
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                      className="px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Niveau (junior, confirmé, senior)"
                      value={project.level}
                      onChange={(e) => handleProjectChange(index, "level", e.target.value)}
                      className="px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Organisme/Entreprise"
                      value={project.organization}
                      onChange={(e) => handleProjectChange(index, "organization", e.target.value)}
                      className="px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Date (ex: Jan 2023 - Juin 2023)"
                      value={project.date}
                      onChange={(e) => handleProjectChange(index, "date", e.target.value)}
                      className="px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <textarea
                    placeholder="Description du projet"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                    className="w-full mt-4 px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm resize-none h-24"
                  />
                  <input
                    type="text"
                    placeholder="Compétences utilisées (séparées par des virgules)"
                    value={project.skills}
                    onChange={(e) => handleProjectChange(index, "skills", e.target.value)}
                    className="w-full mt-4 px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addProject}
                className="px-4 py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Ajouter un projet
              </button>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-accent" />
              </div>
              Documents
            </h2>

            <div className="space-y-4">
              {profile.documents.map((doc, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">Nom du document</label>
                    <input
                      type="text"
                      placeholder="Ex: Certificat AWS"
                      value={doc.name}
                      onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">Fichier</label>
                    <input
                      type="file"
                      onChange={(e) => handleDocumentChange(index, "file", e.target.files?.[0])}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-all text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDocument}
                className="px-4 py-3 bg-accent/10 border border-accent/30 text-accent rounded-lg hover:bg-accent/20 transition-all flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Ajouter un document
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-4 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Sauvegarder mon profil
            </button>
            <button
              type="button"
              className="px-8 py-4 border border-border/50 text-foreground font-semibold rounded-lg hover:bg-secondary/50 transition-all"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


