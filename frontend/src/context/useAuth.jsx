import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  savedJobs: [],
  applications: [],
  toggleSavedJob: () => {},
  addApplication: () => {},
  updateApplicationStatus: () => {},
  updateUser: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [savedJobs, setSavedJobs] = useState([])
  const [applications, setApplications] = useState([])

  const enforceRecruiterSubscription = useCallback((profile) => {
    if (profile && profile.role === 'recruiter') {
      return { ...profile, isSubscribed: true }
    }
    return profile
  }, [])

  useEffect(() => {
    const readStorageJson = (key, setter) => {
      try {
        const raw = localStorage.getItem(key)
        if (raw) {
          const parsed = JSON.parse(raw)
          setter(key === 'sp.auth.user' ? enforceRecruiterSubscription(parsed) : parsed)
        }
      } catch (error) {
        console.warn(`Failed to read ${key} from storage`, error)
      }
    }

    readStorageJson('sp.auth.user', setUser)
    readStorageJson('sp.auth.savedJobs', setSavedJobs)
    readStorageJson('sp.auth.applications', setApplications)
  }, [enforceRecruiterSubscription])

  const login = useCallback((u) => {
    const nextUser = enforceRecruiterSubscription(u)
    setUser(nextUser)
    try {
      localStorage.setItem('sp.auth.user', JSON.stringify(nextUser))
    } catch (error) {
      console.warn('Failed to persist auth user', error)
    }
  }, [enforceRecruiterSubscription])

  const logout = useCallback(() => {
    setUser(null)
    setSavedJobs([])
    setApplications([])
    try {
      localStorage.removeItem('sp.auth.user')
      localStorage.removeItem('sp.auth.savedJobs')
      localStorage.removeItem('sp.auth.applications')
    } catch (error) {
      console.warn('Failed to clear auth storage', error)
    }
  }, [])

  const toggleSavedJob = useCallback((job) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id)
      const next = exists ? prev.filter((j) => j.id !== job.id) : [...prev, job]
      try {
        localStorage.setItem('sp.auth.savedJobs', JSON.stringify(next))
      } catch (error) {
        console.warn('Failed to persist saved jobs', error)
      }
      return next
    })
  }, [])

  const addApplication = useCallback((application) => {
    setApplications((prev) => {
      const compatibilityScore =
        typeof application.compatibilityScore === 'number'
          ? application.compatibilityScore
          : Math.floor(Math.random() * 26) + 70
      const withMeta = { ...application, compatibilityScore }
      const next = [withMeta, ...prev.filter((app) => app.jobId !== application.jobId)]
      try {
        localStorage.setItem('sp.auth.applications', JSON.stringify(next))
      } catch (error) {
        console.warn('Failed to persist applications', error)
      }
      return next
    })
  }, [])

  const updateApplicationStatus = useCallback((jobId, status, extra = {}) => {
    setApplications((prev) => {
      const next = prev.map((app) => (app.jobId === jobId ? { ...app, status, ...extra } : app))
      try {
        localStorage.setItem('sp.auth.applications', JSON.stringify(next))
      } catch (error) {
        console.warn('Failed to persist applications', error)
      }
      return next
    })
  }, [])

  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) {
        return prev
      }
      const merged = { ...prev, ...partial }
      const next = enforceRecruiterSubscription(merged)
      try {
        localStorage.setItem('sp.auth.user', JSON.stringify(next))
      } catch (error) {
        console.warn('Failed to persist auth user update', error)
      }
      return next
    })
  }, [enforceRecruiterSubscription])

  const value = useMemo(
    () => ({ user, login, logout, savedJobs, toggleSavedJob, applications, addApplication, updateApplicationStatus, updateUser }),
    [user, login, logout, savedJobs, toggleSavedJob, applications, addApplication, updateApplicationStatus, updateUser]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}






