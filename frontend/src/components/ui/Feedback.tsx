import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function LoadingSpinner({
  label = 'Loading…',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 py-16 text-leather',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
      <span className="text-sm tracking-wide">{label}</span>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-cream via-light-tan/40 to-cream',
        className,
      )}
    />
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="border border-dashed border-light-tan bg-cream/40 px-6 py-14 text-center">
      <h3 className="font-display text-2xl text-primary">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-leather">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
