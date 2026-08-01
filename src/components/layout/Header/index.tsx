import { Search, Moon, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-surfaceBorder bg-richBlack px-6 py-4">
      <div className="relative w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-laurelLeaf" />
        <input
          type="text"
          placeholder="Buscar usuário, ticket, transação..."
          className="w-full rounded-lg border border-surfaceBorder bg-surface py-2 pl-9 pr-12 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf focus:border-pear"
        />
        {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-surfaceBorder px-1.5 py-0.5 text-[10px] text-laurelLeaf">
          ⌘K
        </span> */}
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-md p-2 text-laurelLeaf transition-colors hover:bg-white/5 hover:text-ceilingWhite">
          <Moon size={16} />
        </button>
        <button className="rounded-md p-2 text-laurelLeaf transition-colors hover:bg-white/5 hover:text-ceilingWhite">
          <Settings size={16} />
        </button>
        <div className="h-8 w-8 rounded-full bg-pear" />
      </div>
    </header>
  )
}