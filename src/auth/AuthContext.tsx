import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface StaffUser {
  id: string
  name: string
  email: string
}

interface LoginResult {
  success: boolean
  error?: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  user: StaffUser | null
  token: string | null
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'sevenclub_support_token'
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

// O localStorage pode não estar disponível (modo privado, iframe sandboxed,
// storage bloqueado pelo navegador) — sem esse cuidado, um erro aqui derruba
// a árvore inteira do React na inicialização e vira tela branca sem aviso.
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Sem persistência disponível — segue normalmente, só não sobrevive a um reload.
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // idem
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => safeGetItem(TOKEN_KEY))
  const [user, setUser] = useState<StaffUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Ao carregar a página com um token salvo, confirma com a API que ele
  // ainda é válido (em vez de confiar cegamente no que está no localStorage).
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    fetch(`${API_URL}/auth/staff/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('token inválido')
        return res.json() as Promise<StaffUser>
      })
      .then((data) => setUser(data))
      .catch(() => {
        setToken(null)
        safeRemoveItem(TOKEN_KEY)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  async function login(email: string, password: string): Promise<LoginResult> {
    try {
      const res = await fetch(`${API_URL}/auth/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error ?? 'Não foi possível entrar.' }
      }

      setToken(data.token)
      setUser(data.user)
      safeSetItem(TOKEN_KEY, data.token)
      return { success: true }
    } catch {
      return {
        success: false,
        error: 'Não foi possível conectar à API. Confirma se o servidor (npm run dev do backend) está rodando.',
      }
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    safeRemoveItem(TOKEN_KEY)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token && !!user, isLoading, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  return ctx
}