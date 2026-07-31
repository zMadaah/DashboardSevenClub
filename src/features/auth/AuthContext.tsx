import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface LoginResult {
  success: boolean
  error?: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'sevenclub_support_auth'

// Credencial mockada para a v1 — ainda não existe backend de autenticação.
// Quando a API real existir, troque o corpo de `login` por um POST /auth/login
// e guarde o token retornado em vez do email.
const DEMO_EMAIL = 'suporte@sevenclub.app'
const DEMO_PASSWORD = 'sevenclub123'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(STORAGE_KEY, userEmail)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [userEmail])

  async function login(email: string, password: string): Promise<LoginResult> {
    // Simula latência de rede até existir uma API de verdade.
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUserEmail(email.trim().toLowerCase())
      return { success: true }
    }
    return { success: false, error: 'Email ou senha inválidos.' }
  }

  function logout() {
    setUserEmail(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!userEmail, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  return ctx
}