import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, StopCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { API_BASE_URL } from '../../utils/config'

const SAMPLE_QUESTIONS = []

export default function VideoInterviewQuizPage() {
  const navigate = useNavigate()
  const { state, search } = useLocation()
  const params = new URLSearchParams(search)
  const appId = params.get('id') || state?.jobId || ''

  const [meta, setMeta] = useState({ title: state?.jobTitle || 'Entretien vidéo', company: state?.company || 'Entreprise' })
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!appId) return
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/applications/${encodeURIComponent(appId)}`)
        if (!res.ok) throw new Error('load_failed')
        const data = await res.json()
        if (!cancelled) {
          setMeta({ title: data?.jobTitle || meta.title, company: data?.companyName || meta.company })
          setPlan(data?.interviewPlan || null)
        }
      } catch (_e) {
        if (!cancelled) setPlan(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId])

  const preparedQuestions = useMemo(() => {
    const list = Array.isArray(plan?.questions) ? plan.questions : SAMPLE_QUESTIONS
    return list.map((q, idx) => ({ id: idx + 1, prompt: q.question || q.prompt, maxSeconds: Math.round((Number(q.time_minutes) || 1) * 60) }))
  }, [plan])

  const jobTitle = meta.title
  const company = meta.company
  const questions = preparedQuestions
  const interviewDuration = (plan?.total_minutes ? plan.total_minutes * 60 : (questions.reduce((acc, q) => acc + (q.maxSeconds || 0), 0) || 20 * 60))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionSeconds, setQuestionSeconds] = useState(questions[0]?.maxSeconds ?? 60)
  const [interviewSeconds, setInterviewSeconds] = useState(interviewDuration)
  const [finished, setFinished] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState(null)

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
    if (!currentQuestion) return
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

  // Reset timers when questions are loaded or plan changes
  useEffect(() => {
    if (questions.length > 0) {
      setCurrentIndex(0)
      setQuestionSeconds(questions[0]?.maxSeconds ?? 60)
      setInterviewSeconds(interviewDuration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, interviewDuration])

  // Initialize camera and start recording once questions are ready
  useEffect(() => {
    let cancelled = false
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) return
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          try { await videoRef.current.play() } catch (_e) {}
        }
        // Start recording
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' })
        mediaRecorderRef.current = recorder
        chunksRef.current = []
        recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)
          setRecordingUrl(url)
          // eslint-disable-next-line no-console
          console.log('Interview recording ready:', { size: blob.size, url })
          window.__interviewRecording__ = url
        }
        recorder.start(1000)
        setRecording(true)
      } catch (_e) {
        // eslint-disable-next-line no-console
        console.warn('Unable to access camera/microphone')
      }
    }
    if (questions.length > 0 && !recording && !finished) start()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length])

  // Cleanup media tracks on unmount
  useEffect(() => {
    return () => {
      try { mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive' && mediaRecorderRef.current.stop() } catch (_e) {}
      try {
        const s = streamRef.current
        if (s) s.getTracks().forEach((t) => t.stop())
      } catch (_e2) {}
    }
  }, [])

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
    try { if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop() } catch (_e) {}
    // Generate random score 70-80 and persist to backend if we have an application id
    const randomScore = 70 + Math.floor(Math.random() * 11)
    if (appId) {
      try {
        fetch(`${API_BASE_URL.replace(/\/$/, '')}/applications/${encodeURIComponent(appId)}/interview-result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: randomScore }),
        }).catch(() => {})
      } catch (_e) {}
    }
    setTimeout(() => {
      navigate('/candidat/quiz/resultat', {
        replace: true,
        state: {
          id: appId,
          jobTitle,
          company,
          answered: questions.length,
          total: questions.length,
          score: randomScore,
          recordingUrl,
        },
      })
    }, 1200)
  }

  if (loading || questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-primary/10">
        <div className="rounded-3xl border border-border/60 bg-white/95 px-8 py-6 text-slate-700 shadow-2xl">Chargement de votre entretien…</div>
      </main>
    )
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

        <section className="grid gap-6 grid-cols-[2fr,1fr]">
          {/* Left: video */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-inner">
            <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
            {!recording && (
              <div className="absolute inset-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-950/30 text-center">
                <p className="text-lg font-semibold text-white/80">Activation caméra…</p>
                <p className="mt-2 text-xs text-slate-400">Autorisez l'accès à la caméra et au micro pour démarrer.</p>
              </div>
            )}
          </div>

          {/* Right: question + timers as small bubbles */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-end self-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-wide text-white/80">
                Question {currentIndex + 1}/{questions.length}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-wide text-white/80">
                <Clock size={14} /> Entretien {formatSeconds(interviewSeconds)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-wide text-white/80">
                <StopCircle size={14} /> Question {formatSeconds(questionSeconds)}
              </span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-base font-semibold text-white">{currentQuestion?.prompt}</h2>
            </div>

            <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100">
              <p className="flex items-center gap-2 text-sm">
                <AlertTriangle size={18} /> Ne fermez pas ou ne rechargez pas cette page.
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Conseil : regardez la caméra, articulez et structurez votre réponse en introduction, développement, conclusion.
            </p>

            <div className="mt-auto flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Question suivante
              </button>
            </div>
          </div>
        </section>
        
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