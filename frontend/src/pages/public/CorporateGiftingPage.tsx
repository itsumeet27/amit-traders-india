import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { SectionReveal } from '@/components/ui/SafeImage'
import { CategoryShowcase } from '@/sections/CategoryShowcase'

const AUDIENCES = [
  {
    title: 'For HR Teams',
    description: 'Employee onboarding kits, appreciation gifts, and milestone recognition programs.',
  },
  {
    title: 'For Procurement Teams',
    description: 'Bulk manufacturing, scalable sourcing, and dependable MOQ-led production.',
  },
  {
    title: 'For Marketing Teams',
    description: 'Branded corporate merchandise with logo embossing, foil stamping, and packaging.',
  },
  {
    title: 'For Event Planners',
    description: 'Customized event and festive gifting for AGMs, awards, and client celebrations.',
  },
] as const

export function CorporateGiftingPage() {
  return (
    <>
      <Seo
        title="Custom Gifting & Corporate Solutions"
        description="Corporate gifting solutions for HR, procurement, marketing, and event teams. Custom leather goods, combo sets, and bulk manufacturing from 50 units."
        path="/custom-gifting"
      />

      <section className="bg-primary text-cream">
        <div className="container-wide px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Custom Gifting</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl md:text-6xl">
            Corporate gifting & custom solutions
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-light-tan">
            Tailored leather goods and gift sets for employee onboarding, client appreciation, AGMs,
            service awards, festive celebrations, and business travel programs.
          </p>
          <div className="mt-8">
            <Button to="/quote" size="lg" variant="secondary">
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          {AUDIENCES.map((item, index) => (
            <SectionReveal key={item.title} delayMs={index * 60}>
              <article className="h-full border border-light-tan/50 bg-off-white p-8">
                <h2 className="font-display text-3xl text-primary">{item.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-leather">{item.description}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>

      <CategoryShowcase
        layout="compact"
        sectionLabel="Solutions"
        title="Gifting programs by category"
        description=""
      />

      <section className="section-pad bg-deep text-cream">
        <div className="container-narrow text-center">
          <h2 className="font-display text-4xl text-cream md:text-5xl">
            Let&apos;s create your custom corporate gifting solution
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-light-tan">
            Request your product catalog, physical samples, and a personalized quotation. Minimum order
            quantity: 50 units.
          </p>
          <div className="mt-8">
            <Button to="/quote" size="lg" variant="secondary">
              Request a Quote
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
