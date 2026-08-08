import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { companyService } from '@/services/companyService'
import type { CompanyProfile } from '@/types'
import { parseFeatures, parseTimeline } from '@/utils'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { Button } from '@/components/ui/Button'
import { SectionReveal } from '@/components/ui/SafeImage'
import { LoadingSpinner } from '@/components/ui/Feedback'

export function CustomManufacturingPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    companyService
      .getPublic()
      .then(setCompany)
      .catch(() => setCompany(null))
      .finally(() => setLoading(false))
  }, [])

  const steps = parseTimeline(company?.manufacturingStepsJson)
  const features = parseFeatures(company?.customManufacturingFeaturesJson)

  return (
    <>
      <Seo
        title="Custom Manufacturing"
        description="Private label and OEM genuine leather manufacturing with sampling, material guidance, and export-ready production."
        path="/custom-manufacturing"
      />

      <section className="bg-primary text-cream">
        <div className="container-wide px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">OEM & Private Label</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl text-cream md:text-6xl">
            {company?.customManufacturingTitle || 'Custom leather manufacturing'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-light-tan">
            {company?.customManufacturingDescription ||
              'From concept sketches to packed cartons — we engineer genuine leather products around your brand standards.'}
          </p>
          <Button to="/quote" variant="secondary" size="lg" className="mt-8">
            Start a custom brief
          </Button>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : (
        <>
          <section className="section-pad">
            <div className="container-wide grid gap-8 md:grid-cols-3">
              {(features.length
                ? features.map((f) => ({
                    title: f.title,
                    body: f.description || '',
                  }))
                : [
                    {
                      title: 'Design collaboration',
                      body: 'Translate brand language into patterns, construction, and finishing details.',
                    },
                    {
                      title: 'Material stewardship',
                      body: 'Select leather grades, linings, and hardware aligned to durability and cost targets.',
                    },
                    {
                      title: 'Production discipline',
                      body: 'Controlled sampling, staged QC, and packaging built for domestic or export lanes.',
                    },
                  ]
              ).map((item, i) => (
                <SectionReveal key={item.title} delayMs={i * 80}>
                  <div>
                    <h2 className="font-display text-3xl text-primary">{item.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-leather">{item.body}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>

          <section className="section-pad bg-cream/50">
            <div className="container-wide">
              <h2 className="mb-10 font-display text-4xl text-primary">How programs run</h2>
              <ProcessTimeline steps={steps} />
            </div>
          </section>

          <section className="section-pad text-center">
            <h2 className="font-display text-4xl text-primary">Minimum order from 50 units</h2>
            <p className="mx-auto mt-3 max-w-xl text-leather">
              Share target quantities, leather preferences, and branding. We will advise on sampling
              lead times and commercial next steps.
            </p>
            <Button to="/quote" className="mt-8" size="lg">
              Request Quote
            </Button>
          </section>
        </>
      )}
    </>
  )
}
