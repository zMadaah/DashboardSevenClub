import { Search, Settings } from 'lucide-react'
import { useTheme } from '../../../theme/ThemeContext'

export function Header() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <header
      className={`flex items-center justify-between border-b px-6 py-4 ${
        dark ? 'border-surfaceBorder bg-richBlack' : 'border-celeste bg-white'
      }`}
    >
      <div className="relative w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-laurelLeaf" />
        <input
          type="text"
          placeholder="Buscar usuário, ticket, transação..."
          className={`w-full rounded-lg border py-2 pl-9 pr-12 text-sm outline-none placeholder:text-laurelLeaf focus:border-pear ${
            dark ? 'border-surfaceBorder bg-surface text-ceilingWhite' : 'border-celeste bg-ceilingWhite text-richBlack'
          }`}
        />
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] text-laurelLeaf ${
            dark ? 'border-surfaceBorder' : 'border-celeste'
          }`}
        >
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`rounded-md p-2 text-laurelLeaf transition-colors ${
            dark ? 'hover:bg-white/5 hover:text-ceilingWhite' : 'hover:bg-ceilingWhite hover:text-richBlack'
          }`}
        >
          <Settings size={16} />
        </button>
        <div className="h-8 w-8 rounded-full bg-pear" />
      </div>
    </header>
  )
}