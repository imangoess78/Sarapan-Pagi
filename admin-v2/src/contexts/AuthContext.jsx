import { createContext, useState, useCallback } from 'react'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'lapakjajan_token'
const USER_KEY  = 'lapakjajan_user'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [user, setUser]   = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    if (userData) localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
