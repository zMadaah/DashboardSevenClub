import { ReactNode, useState } from 'react'
import { Eye, EyeOff, ChevronDown, X } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { useTheme } from '../../theme/ThemeContext'
import { SupportUser } from './types'
import { UserRole } from '../../types'

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Gerente' },
  { value: 'subscriber', label: 'Assinante' },
]

interface EditUserModalProps {
  user: SupportUser
  onClose: () => void
  onSave: (updated: SupportUser) => Promise<void>
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-laurelLeaf/60 focus:border-pear ${
    dark ? 'border-surfaceBorder bg-richBlack text-ceilingWhite' : 'border-celeste bg-ceilingWhite text-richBlack'
  }`

  function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
      <label className="flex flex-col gap-1.5">
        <span className={`text-sm font-medium ${textPrimary}`}>{label}</span>
        {children}
      </label>
    )
  }

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [role, setRole] = useState<UserRole>(user.role)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.')
        return
      }
      if (password.length < 8) {
        setError('A senha precisa ter pelo menos 8 caracteres.')
        return
      }
    }

    setError(null)
    setSaving(true)
    try {
      await onSave({ ...user, firstName, lastName, username, email, phone, role })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} dark={dark}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${textPrimary}`}>Editar usuário</h2>
          <p className="mt-1 text-sm text-laurelLeaf">
            Atualize os dados do usuário. Clique em salvar quando terminar.
          </p>
        </div>
        <button
          onClick={onClose}
          className={`rounded-md p-1 text-laurelLeaf transition-colors ${
            dark ? 'hover:bg-white/5 hover:text-ceilingWhite' : 'hover:bg-ceilingWhite hover:text-richBlack'
          }`}
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
        <Field label="Nome">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Sobrenome">
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Username">
          <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Celular">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Role">
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className={`${inputClass} appearance-none pr-8`}
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-laurelLeaf"
            />
          </div>
        </Field>

        <Field label="Senha">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ex: S3cur3P@ssw0rd"
              className={`${inputClass} pr-9`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-laurelLeaf"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <Field label="Confirmar senha">
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ex: S3cur3P@ssw0rd"
              className={`${inputClass} pr-9`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-laurelLeaf"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </Modal>
  )
}