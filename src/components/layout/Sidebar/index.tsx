import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  CreditCard,
  Users,
  MessageSquare,
  Trophy,
  ShieldAlert,
  ChevronsUpDown,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'
import { useTickets } from '../../../features/chat/useTickets'
import { useAuth } from '../../../auth/AuthContext'
import { useTheme } from '../../../theme/ThemeContext'
import { getInitials } from '../../../lib/format'

export function Sidebar() {
  const { tickets } = useTickets()
  const openChatsCount = tickets.filter((t) => t.status !== 'resolved').length
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const dark = theme === 'dark'
  const [logoError, setLogoError] = useState(false)

  function handleLogout() {
    logout()
    setProfileMenuOpen(false)
    navigate('/login', { replace: true })
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/pagamentos', label: 'Pagamentos', icon: CreditCard },
    { to: '/usuarios', label: 'Usuários', icon: Users },
    { to: '/chat', label: 'Suporte de chat', icon: MessageSquare, badge: openChatsCount },
    { to: '/eventos', label: 'Evento', icon: Trophy },
    { to: '/anti-cheat', label: 'Anti-cheat', icon: ShieldAlert },
  ]

  return (
    <aside className={`flex w-60 shrink-0 flex-col px-3 py-4 ${dark ? 'bg-richBlack' : 'bg-white border-r border-celeste'}`}>
      <div className="mb-6 flex items-center gap-2 rounded-lg px-2 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-pear text-sm font-bold text-richBlack">
          {logoError ? (
            '7C'
          ) : (
            <img
              src="/logo.jpg"
              alt="Seven Club"
              className="h-6 w-6 object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div className="flex flex-col leading-tight">
          <span className={`text-sm font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
            Seven Club
          </span>
          <span className="text-xs text-laurelLeaf">Suporte</span>
        </div>
        <ChevronsUpDown size={14} className="ml-auto text-laurelLeaf" />
      </div>

      <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-laurelLeaf/70">
        Geral
      </p>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-pear font-medium text-richBlack'
                  : dark
                    ? 'text-laurelLeaf hover:bg-white/5 hover:text-ceilingWhite'
                    : 'text-laurelLeaf hover:bg-ceilingWhite hover:text-richBlack'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {badge ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? 'bg-richBlack text-pear'
                        : dark
                          ? 'bg-white/10 text-ceilingWhite'
                          : 'bg-celeste text-richBlack'
                    }`}
                  >
                    {badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-4">
        <button
          type="button"
          onClick={() => setProfileMenuOpen((open) => !open)}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
            dark ? 'border-white/5 hover:bg-white/5' : 'border-celeste hover:bg-ceilingWhite'
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-laurelLeaf/30 text-xs font-semibold ${
              dark ? 'text-ceilingWhite' : 'text-richBlack'
            }`}
          >
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className={`text-xs font-medium ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
              {user?.name ?? 'Equipe de suporte'}
            </span>
            <span className="text-[10px] text-laurelLeaf">{user?.email ?? ''}</span>
          </div>
          <ChevronsUpDown size={14} className="ml-auto text-laurelLeaf" />
        </button>

        {profileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
            <div
              className={`absolute bottom-full left-0 z-50 mb-2 w-full rounded-lg border py-1 shadow-lg ${
                dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'
              }`}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  dark ? 'text-ceilingWhite hover:bg-white/5' : 'text-richBlack hover:bg-ceilingWhite'
                }`}
              >
                {dark ? <Moon size={14} /> : <Sun size={14} />}
                {dark ? 'Modo claro' : 'Modo escuro'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  dark ? 'text-ceilingWhite hover:bg-white/5' : 'text-richBlack hover:bg-ceilingWhite'
                }`}
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}