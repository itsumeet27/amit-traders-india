import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { companyService } from '@/services/companyService'
import type { CompanyProfile } from '@/types'
import { parseTimeline, parseWhyChooseUs, resolveMediaUrl } from '@/utils'
import { WhyChooseUs } from '@/sections/WhyChooseUs'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { LoadingSpinner } from '@/components/ui/Feedback'
import { SafeImage, SectionReveal } from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/content/siteContent'

export function AboutPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    companyService
      .getPublic()
      .then(setCompany)
      .catch(() => setCompany(null))
      .finally(() => setLoading(false))
  }, [])

  const why = parseWhyChooseUs(company?.whyChooseUsJson)
  const timeline = parseTimeline(company?.manufacturingStepsJson)

  return (
    <>
      <Seo
        title={SEO.about.title}
        description={SEO.about.description}
        path="/about"
        image={company?.aboutImageUrl || company?.heroImageUrl || undefined}
      />

      <section className="relative overflow-hidden bg-primary text-cream">
        <div className="absolute inset-0 opacity-40">
          {(company?.aboutImageUrl || company?.heroImageUrl) && (
            <img
              src={resolveMediaUrl(company.aboutImageUrl || company.heroImageUrl)}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/60" />
        </div>
        <div className="relative container-wide px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">About</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl text-cream md:text-6xl">
            Crafting Excellence Since Day One
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-light-tan">
            {company?.tagline ||
              'Premium genuine leather manufacturing rooted in Mumbai craftsmanship and B2B reliability.'}
          </p>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : (
        <>
          <section className="section-pad">
            <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-start">
              <SectionReveal>
                <h2 className="font-display text-4xl text-primary">Our story</h2>
                <p className="mt-5 text-base leading-relaxed text-leather">
                  {company?.history ||
                    company?.description ||
                    'Amit Traders India develops and manufactures genuine leather products for retailers, exporters, and private-label brands. We combine careful material selection with disciplined production so partners can launch collections with confidence.'}
                </p>
                {company?.mission ? (
                  <div className="mt-8">
                    <h3 className="font-display text-2xl text-primary">Mission</h3>
                    <p className="mt-2 text-sm leading-relaxed text-leather">{company.mission}</p>
                  </div>
                ) : null}
                {company?.vision ? (
                  <div className="mt-6">
                    <h3 className="font-display text-2xl text-primary">Vision</h3>
                    <p className="mt-2 text-sm leading-relaxed text-leather">{company.vision}</p>
                  </div>
                ) : null}
              </SectionReveal>
              <SectionReveal delayMs={80}>
                <SafeImage
                  src={company?.aboutImageUrl || company?.heroImageUrl}
                  alt="Leather craftsmanship at Amit Traders India"
                  aspect="aspect-[4/5]"
                />
              </SectionReveal>
            </div>
          </section>

          <section className="section-pad bg-cream/50">
            <div className="container-wide">
              <h2 className="mb-10 font-display text-4xl text-primary">Why choose us</h2>
              <WhyChooseUs items={why} />
            </div>
          </section>

          <section className="section-pad">
            <div className="container-wide">
              <h2 className="mb-10 font-display text-4xl text-primary">Manufacturing timeline</h2>
              <ProcessTimeline steps={timeline} />
            </div>
          </section>

          <section className="section-pad bg-deep text-center text-cream">
            <h2 className="font-display text-4xl text-cream">Partner with our workshop</h2>
            <p className="mx-auto mt-3 max-w-xl text-light-tan">
              Whether you need catalog replenishment or a fully custom line, we are ready to brief.
            </p>
            <Button to="/quote" variant="secondary" className="mt-8" size="lg">
              Request Quote
            </Button>
          </section>
        </>
      )}
    </>
  )
}
