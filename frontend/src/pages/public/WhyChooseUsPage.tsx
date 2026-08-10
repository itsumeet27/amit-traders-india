import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { SectionReveal } from '@/components/ui/SafeImage'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { BUYING_PROCESS, IMAGES, SEO, WHY_CHOOSE_US } from '@/content/siteContent'

export function WhyChooseUsPage() {
  return (
    <>
      <Seo title={SEO.whyChooseUs.title} description={SEO.whyChooseUs.description} path="/why-choose-us" />

      <section className="relative overflow-hidden bg-primary text-cream">
        <div className="absolute inset-0">
          <img
            src={IMAGES.whyChooseHero}
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/92 to-primary/75" />
        </div>
        <div className="relative container-wide px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Why Choose Us</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl text-cream md:text-6xl">
            Why Procurement & HR Leaders Trust Amit Traders
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-light-tan">
            A corporate buying guide for teams sourcing premium leather goods, executive accessories, and
            customized bulk corporate gifting across India.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          {WHY_CHOOSE_US.map((item, index) => (
            <SectionReveal key={item.title} delayMs={index * 60}>
              <article className="h-full border border-light-tan/50 bg-off-white p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-gold">{item.number}</p>
                <h2 className="mt-3 font-display text-3xl text-primary">{item.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-leather">{item.description}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-cream/40">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Process</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                From requirement to delivery
              </h2>
              <p className="mt-3 text-leather">
                A clear path from enquiry to bulk production and nationwide delivery.
              </p>
            </div>
          </SectionReveal>
          <ProcessTimeline
            steps={BUYING_PROCESS.map((s) => ({
              step: s.step,
              title: s.title,
              description: s.description,
            }))}
          />
        </div>
      </section>

      <section className="section-pad bg-deep text-cream">
        <div className="container-narrow text-center">
          <h2 className="font-display text-4xl text-cream md:text-5xl">
            Ready to brief your corporate gifting program?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-light-tan">
            Request a catalog, physical samples, and a personalized quotation for bulk orders from 50 units.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/quote" size="lg" variant="secondary">
              Request a Quote
            </Button>
            <Button to="/products" size="lg" variant="outline-light">
              Explore Products
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
