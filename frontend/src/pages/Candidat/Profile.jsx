import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { API_BASE_URL } from '../../utils/config'

export default function CandidateProfileReadOnlyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function run() {
      if (!user?.id) { setError('Non connecté'); setLoading(false); return }
      try {
        const url = `${API_BASE_URL.replace(/\/$/, '')}/users/${user.id}`
        const res = await fetch(url)
        if (res.status === 404) {
          // eslint-disable-next-line no-console
          console.warn('User not found, redirecting to create profile. userId=', user.id)
          navigate('/candidat/creer-profil', { replace: true })
          return
        }
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json()
        if (!ignore) setData(json)
      } catch (_e) {
        if (!ignore) setError("Impossible de charger le profil")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [user?.id])

  const profile = data?.profile || {}
  const documents = data?.documents || []
  const serverBase = (API_BASE_URL || '').replace(/\/?api\/?$/, '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">Mon profil</h1>
            <p className="text-muted-foreground">Vos informations enregistrées</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/candidat/creer-profil', { state: { from: 'profil', profile: data?.profile, documents: data?.documents || [] } })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Modifier
          </button>
        </div>

        {loading && <div className="text-muted-foreground">Chargement...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="space-y-8">
            <section className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Informations générales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <Field label="Civilité" value={mapCivility(profile.civility)} />
                <Field label="Prénom" value={profile.firstName} />
                <Field label="Nom" value={profile.lastName} />
                <Field label="Ville" value={profile.city} />
                <Field label="Code postal" value={profile.postalCode} />
                <Field label="Téléphone" value={profile.phone} />
              </div>
            </section>

            <section className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Liens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <Field label="GitHub" value={profile?.links?.github} />
                <Field label="LinkedIn" value={profile?.links?.linkedin} />
                <div className="md:col-span-2">
                  <Field label="Autres" value={(profile?.links?.others || []).join(', ')} />
                </div>
              </div>
            </section>

            <section className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Documents</h2>
              {documents.length === 0 ? (
                <div className="text-sm text-muted-foreground">Aucun document</div>
              ) : (
                <ul className="space-y-3 text-sm">
                  {documents.map((d, i) => (
                    <li key={`${d.filename}-${i}`} className="flex items-center justify-between gap-3 border border-border/30 rounded-lg p-3">
                      <div>
                        <div className="font-medium text-foreground">{d.name || d.filename}</div>
                        <div className="text-xs text-muted-foreground">{d.mimetype} • {(d.size || 0)} octets</div>
                      </div>
                      {d.path && (
                        <a
                          className="text-primary font-semibold hover:underline"
                          href={`${serverBase}/${d.path}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ouvrir
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Projets professionnels</h2>
              <div className="space-y-4">
                {(profile?.projects || []).map((p, idx) => (
                  <div key={idx} className="border border-border/30 rounded-lg p-6 bg-secondary/20">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-muted-foreground text-sm">{p.level} • {p.organization} • {p.date}</div>
                    <div className="mt-2 text-sm">{p.description}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{Array.isArray(p.skills) ? p.skills.join(', ') : p.skills}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-muted-foreground mb-1 font-medium">{label}</div>
      <div className="px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg">{value || '-'}</div>
    </div>
  )
}

function mapCivility(c) {
  if (c === 'mr') return 'Monsieur'
  if (c === 'mrs') return 'Madame'
  return 'Non précisé'
}


