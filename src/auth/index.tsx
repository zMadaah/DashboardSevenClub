import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richBlack">
        <p className="text-sm text-laurelLeaf">Carregando...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // ...resto do componente sem mudanças

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email.trim() || !password) {
      setError('Preencha email e senha.')
      return
    }

    setError(null)
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Não foi possível entrar.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-richBlack px-4">
      <div className="w-full max-w-sm rounded-xl border border-surfaceBorder bg-surface p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pear text-lg font-bold text-richBlack">
            7C
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ceilingWhite">Seven Club</h1>
            <p className="text-sm text-laurelLeaf">Painel de suporte</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ceilingWhite">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@sevenclub.app"
              autoComplete="email"
              className="w-full rounded-lg border border-surfaceBorder bg-richBlack px-3 py-2 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf/60 focus:border-pear"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ceilingWhite">Senha</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border border-surfaceBorder bg-richBlack px-3 py-2 pr-9 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf/60 focus:border-pear"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-laurelLeaf"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-laurelLeaf">
          Acesso restrito à equipe de suporte do Seven Club.
        </p>
      </div>
    </div>
  )
}