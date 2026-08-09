import type { Client } from '@/types'
import { SafeImage } from '@/components/ui/SafeImage'
import { EmptyState } from '@/components/ui/Feedback'

export function ClientShowcase({ clients }: { clients: Client[] }) {
  if (!clients.length) {
    return (
      <EmptyState
        title="Trusted partners"
        description="Client logos will appear here once added in the admin panel."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="flex flex-col items-center justify-center border border-light-tan/50 bg-off-white px-6 py-8 text-center"
        >
          {client.logoUrl ? (
            <SafeImage
              src={client.logoUrl}
              alt={client.companyName}
              aspect="aspect-[3/1]"
              className="w-full max-w-[180px] !bg-transparent"
              imgClassName="object-contain"
            />
          ) : (
            <p className="font-display text-2xl text-primary">{client.companyName}</p>
          )}
          {client.description ? (
            <p className="mt-3 line-clamp-3 text-sm text-leather">{client.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ClientMarquee({ clients }: { clients: Client[] }) {
  if (!clients.length) return null
  const loop = [...clients, ...clients]

  return (
    <div className="overflow-hidden border-y border-light-tan/60 bg-cream/40 py-6">
      <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-12 px-6">
        {loop.map((client, i) => (
          <div key={`${client.id}-${i}`} className="flex min-w-[140px] items-center justify-center">
            {client.logoUrl ? (
              <SafeImage
                src={client.logoUrl}
                alt={client.companyName}
                aspect="aspect-[3/1]"
                className="h-10 w-36 !bg-transparent"
                imgClassName="object-contain opacity-80"
              />
            ) : (
              <span className="font-display text-xl text-leather/80">{client.companyName}</span>
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
