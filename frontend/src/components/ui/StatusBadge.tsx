import clsx from 'clsx'
import type { EnquiryStatus } from '@/types'

const styles: Record<EnquiryStatus, string> = {
  NEW: 'bg-gold/20 text-deep',
  CONTACTED: 'bg-tan/25 text-deep',
  IN_PROGRESS: 'bg-leather/15 text-leather',
  QUOTED: 'bg-emerald-900/10 text-emerald-900',
  CONVERTED: 'bg-emerald-900/20 text-emerald-950',
  CLOSED: 'bg-charcoal/10 text-charcoal',
  REJECTED: 'bg-red-900/10 text-red-900',
}

const labels: Record<EnquiryStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In Progress',
  QUOTED: 'Quoted',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
}

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wider',
        styles[status] ?? 'bg-cream text-leather',
      )}
    >
      {labels[status] ?? status}
    </span>
  )
}
