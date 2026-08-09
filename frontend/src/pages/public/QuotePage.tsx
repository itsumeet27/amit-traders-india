import { Seo } from '@/components/Seo'
import { EnquiryForm } from '@/components/enquiry/EnquiryForm'

export function QuotePage() {
  return (
    <>
      <Seo
        title="Request a Quote"
        description="Submit a B2B enquiry for genuine leather products or custom manufacturing. Minimum order quantity is 50 units."
        path="/quote"
      />

      <section className="border-b border-light-tan/60 bg-cream/40">
        <div className="container-wide px-5 py-14 md:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">B2B Enquiry</p>
          <h1 className="mt-3 font-display text-5xl text-primary">Request a quote</h1>
          <p className="mt-4 max-w-2xl text-leather">
            Share your requirements for existing products or custom manufacturing. Our team will
            respond with sampling and commercial guidance. Minimum order quantity is 50 units.
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
