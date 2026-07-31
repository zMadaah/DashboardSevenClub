import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  CreditCard,
  Users,
  MessageSquare,
  Trophy,
  ShieldAlert,
  ChevronsUpDown,
  LogOut,
} from 'lucide-react'
import { tickets } from '../../../features/chat/mocks'
import { useAuth } from '../../../features/auth/AuthContext'

export function Sidebar() {
  const openChatsCount = tickets.filter((t) => t.status !== 'resolved').length
  const { logout, userEmail } = useAuth()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/pagamentos', label: 'Pagamentos', icon: CreditCard },
    { to: '/usuarios', label: 'Usuários', icon: Users },
    { to: '/chat', label: 'Suporte de chat', icon: MessageSquare, badge: openChatsCount },
    { to: '/eventos', label: 'Evento', icon: Trophy },
    { to: '/anti-cheat', label: 'Anti-cheat', icon: ShieldAlert },
  ]

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-richBlack px-3 py-4">
      <div className="mb-6 flex items-center gap-2 rounded-lg px-2 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-pear text-sm font-bold text-richBlack">
          7C
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-ceilingWhite">Seven Club</span>
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
                  : 'text-laurelLeaf hover:bg-white/5 hover:text-ceilingWhite'
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
                      isActive ? 'bg-richBlack text-pear' : 'bg-white/10 text-ceilingWhite'
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
          onClick={() => setProfileMenuOpen((open) => !open)}
          className="flex w-full items-center gap-2 rounded-lg border border-white/5 px-3 py-2 transition-colors hover:bg-white/5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-laurelLeaf/30 text-xs font-semibold text-ceilingWhite">
            JG
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-medium text-ceilingWhite">João Guilherme</span>
            <span className="text-[10px] text-laurelLeaf">{userEmail ?? 'suporte@sevenclub.app'}</span>
          </div>
          <ChevronsUpDown size={14} className="ml-auto text-laurelLeaf" />
        </button>

        {profileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
            <div className="absolute bottom-full left-0 z-50 mb-2 w-full rounded-lg border border-surfaceBorder bg-surface py-1 shadow-lg">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ceilingWhite transition-colors hover:bg-white/5"
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