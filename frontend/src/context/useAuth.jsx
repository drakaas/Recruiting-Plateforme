import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sp.auth.user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const login = (u) => {
    setUser(u)
    try { localStorage.setItem('sp.auth.user', JSON.stringify(u)) } catch {}
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem('sp.auth.user') } catch {}
  }

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}




