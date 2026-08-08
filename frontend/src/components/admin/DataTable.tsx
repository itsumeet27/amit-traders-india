import type { ReactNode } from 'react'
import clsx from 'clsx'

export function DataTable({
  headers,
  children,
  className,
}: {
  headers: string[]
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('overflow-x-auto border border-light-tan/70 bg-off-white', className)}>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-cream/80 text-xs uppercase tracking-[0.14em] text-leather">
          <tr>
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-light-tan/50">{children}</tbody>
      </table>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-primary md:text-4xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-leather">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
