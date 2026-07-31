type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-celeste/70 text-richBlack/80',
  success: 'bg-pear/30 text-richBlack',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${toneStyles[tone]}`}>
      {label}
    </span>
  )
}