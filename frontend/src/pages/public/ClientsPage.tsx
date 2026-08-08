import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { clientService } from '@/services/clientService'
import type { Client } from '@/types'
import { ClientShowcase } from '@/sections/ClientShowcase'
import { LoadingSpinner } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clientService
      .getPublic()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo
        title="Clients"
        description="Brands and partners who trust Amit Traders India for genuine leather manufacturing."
        path="/clients"
      />

      <section className="border-b border-light-tan/60 bg-cream/40">
        <div className="container-wide px-5 py-14 md:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Relationships</p>
          <h1 className="mt-3 font-display text-5xl text-primary">Our clients</h1>
          <p className="mt-4 max-w-2xl text-leather">
            We work with retailers, exporters, and private-label brands who expect dependable
            leather quality and clear communication.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          {loading ? <LoadingSpinner /> : <ClientShowcase clients={clients} />}
          <div className="mt-14 border border-light-tan/70 bg-cream/40 px-6 py-10 text-center">
            <h2 className="font-display text-3xl text-primary">Become a partner</h2>
            <p className="mx-auto mt-2 max-w-lg text-leather">
              Tell us about your assortment goals and we will outline sampling and production
              pathways.
            </p>
            <Button to="/quote" className="mt-6">
              Request Quote
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
