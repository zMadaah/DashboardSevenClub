import { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-celeste bg-white">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-ceilingWhite text-xs uppercase text-laurelLeaf">{children}</thead>
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-t border-celeste">{children}</tr>
}

export function TableCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}