import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, StopCircle, CheckCircle2, AlertTriangle } from 'lucide-react'

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    prompt: "Présentez-vous et expliquez pourquoi ce poste vous attire.",
    maxSeconds: 60,
  },
  {
    id: 2,
    prompt: "Citez un projet dont vous êtes fier et les résultats obtenus.",
    maxSeconds: 75,
  },
  {
    id: 3,
    prompt: "Comment gérez-vous les situations de stress au travail ?",
    maxSeconds: 45,
  },
]

export default function VideoInterviewQuizPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const jobTitle = state?.jobTitle || 'Entretien vidéo'
  const company = state?.company || 'Entreprise'
  const questions = useMemo(() => state?.questions ?? SAMPLE_QUESTIONS, [state?.questions])
  const interviewDuration = state?.interviewDuration ?? questions.reduce((acc, q) => acc + (q.maxSeconds || 0), 0)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionSeconds, setQuestionSeconds] = useState(questions[0]?.maxSeconds ?? 60)
  const [interviewSeconds, setInterviewSeconds] = useState(interviewDuration)
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    if (finished) return
    if (interviewSeconds <= 0) {
      handleFinish()
      return
    }
    const interviewTimer = window.setInterval(() => {
      setInterviewSeconds((prev) => prev - 1)
    }, 1000)
    return () => window.clearInterval(interviewTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewSeconds, finished])

  useEffect(() => {
    if (finished) return
    if (!currentQuestion) {
      handleFinish()
      return
    }
    if (questionSeconds <= 0) {
      handleNext()
      return
    }
    const questionTimer = window.setInterval(() => {
      setQuestionSeconds((prev) => prev - 1)
    }, 1000)
    return () => window.clearInterval(questionTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionSeconds, finished, currentQuestion?.id])

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      handleFinish()
      return
    }
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    setQuestionSeconds(questions[nextIndex]?.maxSeconds ?? 60)
  }

  const handleFinish = () => {
    setFinished(true)
    setTimeout(() => {
      navigate('/candidat/quiz/resultat', {
        replace: true,
        state: {
          jobTitle,
          company,
          answered: questions.length,
          total: questions.length,
          score: Math.floor(70 + Math.random() * 30),
        },
      })
    }, 1200)
  }

  if (finished) {
    return (
  <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-primary/10">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-white/95 px-10 py-12 text-center shadow-2xl">
          <CheckCircle2 size={56} className="text-primary" />
          <p className="text-lg font-medium text-slate-700">Merci pour votre temps, l'entretien est terminé.</p>
          <p className="text-sm text-slate-500">Nous calculons votre score…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950/95 py-12 px-4 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-10 shadow-[0_35px_120px_-40px_rgba(8,47,82,0.6)]">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary/70">Entretien vidéo</p>
            <h1 className="text-2xl font-semibold text-white">
              {jobTitle} <span className="text-primary">@ {company}</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-primary-foreground">
            <TimerBadge icon={Clock} label="Entretien" value={formatSeconds(interviewSeconds)} />
            <TimerBadge icon={StopCircle} label="Question" value={formatSeconds(questionSeconds)} />
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-wide text-primary/70">Question {currentIndex + 1} sur {questions.length}</p>
          <h2 className="mt-3 text-xl font-semibold text-white">{currentQuestion?.prompt}</h2>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-300">
              Caméra et micro doivent rester actifs. Si vous quittez cette fenêtre, l'entretien sera immédiatement interrompu et votre candidature pourra être éliminée.
            </p>
            <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100">
              <p className="flex items-center gap-2 text-sm">
                <AlertTriangle size={18} /> Ne fermez pas ou ne rechargez pas cette page.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Conseil : regardez la caméra, articulez et structurez votre réponse en introduction, développement, conclusion.
            </p>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-inner">
            <div className="absolute inset-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-950/30 text-center">
              <p className="text-lg font-semibold text-white/80">Prévisualisation caméra</p>
              <p className="mt-2 text-xs text-slate-400">(Aperçu statique – branchement à un flux réel lors de l'intégration)</p>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm sm:flex-row">
          <p className="text-slate-300">
            Vous pouvez répondre jusqu'à expiration du temps. Cliquez sur « Question suivante » si vous terminez avant.
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Question suivante
          </button>
        </footer>
      </div>
    </main>
  )
}

function TimerBadge({ icon, label, value }) {
  const Icon = icon
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white/80">
      <Icon size={16} /> {label} : <span className="font-semibold text-white">{value}</span>
    </span>
  )
}

function formatSeconds(totalSeconds) {
  const seconds = Math.max(0, totalSeconds)
  const minutesPart = Math.floor(seconds / 60)
  const secondsPart = seconds % 60
  return `${String(minutesPart).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}`
}
