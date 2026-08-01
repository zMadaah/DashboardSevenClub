import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message: string
  dark?: boolean
}

export function EmptyState({ message, dark = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-laurelLeaf ${
        dark ? 'border-white/10' : 'border-celeste'
      }`}
    >
      <Inbox size={28} />
      <p className="text-sm">{message}</p>
    </div>
  )
}