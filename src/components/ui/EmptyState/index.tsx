import { Inbox } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-celeste py-16 text-laurelLeaf">
      <Inbox size={28} />
      <p className="text-sm">{message}</p>
    </div>
  )
}
