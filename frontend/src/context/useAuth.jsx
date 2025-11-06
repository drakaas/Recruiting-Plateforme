import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {}, savedJobs: [], applications: [], toggleSavedJob: () => {}, addApplication: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [savedJobs, setSavedJobs] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const readStorageJson = (key, setter) => {
      try {
        const raw = localStorage.getItem(key)
        if (raw) setter(JSON.parse(raw))
      } catch (error) {
        console.warn(`Failed to read ${key} from storage`, error)
      }
    }

    readStorageJson('sp.auth.user', setUser)
    readStorageJson('sp.auth.savedJobs', setSavedJobs)
    readStorageJson('sp.auth.applications', setApplications)
  }, [])

  const login = (u) => {
    setUser(u)
    try {
      localStorage.setItem('sp.auth.user', JSON.stringify(u))
    } catch (error) {
      console.warn('Failed to persist auth user', error)
    }
  }

  const logout = () => {
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
  }

  const toggleSavedJob = (job) => {
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
  }

  const addApplication = (application) => {
    setApplications((prev) => {
      const next = [application, ...prev.filter((app) => app.jobId !== application.jobId)]
      try {
        localStorage.setItem('sp.auth.applications', JSON.stringify(next))
      } catch (error) {
        console.warn('Failed to persist applications', error)
      }
      return next
    })
  }

  const value = useMemo(() => ({ user, login, logout, savedJobs, toggleSavedJob, applications, addApplication }), [user, savedJobs, applications])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}




