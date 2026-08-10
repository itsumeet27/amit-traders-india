import { Seo } from '@/components/Seo'
import { EnquiryForm } from '@/components/enquiry/EnquiryForm'
import { SEO } from '@/content/siteContent'

export function QuotePage() {
  return (
    <>
      <Seo title={SEO.contact.title} description={SEO.contact.description} path="/quote" />

      <section className="border-b border-light-tan/60 bg-cream/40">
        <div className="container-wide px-5 py-14 md:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Request a Quote</p>
          <h1 className="mt-3 font-display text-5xl text-primary">
            Let&apos;s create your custom corporate gifting solution
          </h1>
          <p className="mt-4 max-w-2xl text-leather">
            Request your product catalog, physical samples, and a personalized quotation for bulk
            orders. Minimum order quantity: 50 units.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <EnquiryForm />
        </div>
      </section>
    </>
  )
}
