import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  dark?: boolean
}

export function Table({ children, dark = false }: TableProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'
      }`}
    >
      <table className={`w-full text-left text-sm ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children, dark = false }: TableProps) {
  return (
    <thead className={`text-xs uppercase text-laurelLeaf ${dark ? 'bg-black/20' : 'bg-ceilingWhite'}`}>
      {children}
    </thead>
  )
}

export function TableRow({ children, dark = false }: TableProps) {
  return <tr className={`border-t ${dark ? 'border-white/5' : 'border-celeste'}`}>{children}</tr>
}

export function TableCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}