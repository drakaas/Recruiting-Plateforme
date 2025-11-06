import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, Mic, Video, Monitor, AlertTriangle } from 'lucide-react'

export default function VideoInterviewInstructionsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const jobTitle = state?.jobTitle || 'Entretien vidéo'
  const company = state?.company || 'Entreprise'
  const interviewDuration = state?.interviewDuration ?? 8
  const questionCount = state?.questionCount ?? 3

  const handleProceed = () => {
    navigate('/candidat/quiz', {
      replace: true,
      state: {
        jobId: state?.jobId,
        jobTitle,
        company,
      },
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-10 rounded-3xl border border-border/60 bg-white/95 p-10 text-slate-800 shadow-2xl">
        <header className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary/80">Entretien différé</p>
          <h1 className="text-3xl font-bold text-slate-900">Préparez-vous pour le quiz vidéo</h1>
          <p className="text-base text-slate-600">
            Candidature pour <span className="font-semibold text-primary">{jobTitle}</span> chez{' '}
            <span className="font-semibold text-primary">{company}</span>
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <InstructionCard icon={Mic} title="Micro" description="Vérifiez que votre micro fonctionne et que vous êtes audible." />
          <InstructionCard icon={Video} title="Caméra" description="Assurez-vous que la caméra est activée, centrée et offre un bon éclairage." />
          <InstructionCard icon={Monitor} title="Connexion" description="Fermez les applications inutiles et stabilisez votre connexion internet." />
          <InstructionCard icon={ShieldCheck} title="Concentration" description="Restez sur cette fenêtre pendant toute la durée du quiz. Toute sortie entraînera l'élimination." />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <div className="mb-3 flex items-center gap-2 text-amber-700">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-semibold">Règles à respecter</h2>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>• L'entretien dure <strong>{interviewDuration} minutes</strong>. Lancez-le uniquement quand vous êtes prêt.</li>
            <li>• {questionCount} questions avec un temps limité pour chacune. Le passage à la suivante est automatique.</li>
            <li>• Si vous quittez la fenêtre ou fermez l'onglet avant la fin, votre candidature sera éliminée automatiquement.</li>
            <li>• Préparez un environnement calme, un fond neutre et gardez votre regard face caméra.</li>
          </ul>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-6 text-sm text-muted-foreground sm:flex-row">
          <div>
            <p>Avant de commencer, respirez profondément et relisez chaque question attentivement.</p>
            <p>En cliquant sur « Commencer le quiz », le compte à rebours sera déclenché.</p>
          </div>
          <button
            type="button"
            onClick={handleProceed}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Commencer le quiz
          </button>
        </footer>
      </div>
    </main>
  )
}

function InstructionCard({ icon: Icon, title, description }) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-border/60 bg-white/90 p-5 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={22} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </article>
  )
}
