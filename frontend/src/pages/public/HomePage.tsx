import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { Hero } from '@/sections/Hero'
import { WhyChooseUs } from '@/sections/WhyChooseUs'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { SectionReveal } from '@/components/ui/SafeImage'
import { EnquiryForm } from '@/components/enquiry/EnquiryForm'
import {
  AboutHomeSection,
  CustomBrandingSection,
  ManufacturingSection,
  MaterialsSection,
  PremiumCategorySection,
  TrustStrip,
} from '@/sections/HomeSections'
import { SEO, WHY_CHOOSE_US } from '@/content/siteContent'
import { companyService } from '@/services/companyService'
import { productService } from '@/services/productService'
import type { CompanyProfile, Product } from '@/types'
import { parseTimeline, parseWhyChooseUs } from '@/utils'

export function HomePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [companyRes, featuredRes] = await Promise.allSettled([
        companyService.getPublic(),
        productService.getFeatured(9),
      ])
      if (cancelled) return
      if (companyRes.status === 'fulfilled') setCompany(companyRes.value)
      if (featuredRes.status === 'fulfilled') setFeatured(featuredRes.value)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const process = parseTimeline(company?.manufacturingStepsJson)
  const whyFromApi = parseWhyChooseUs(company?.whyChooseUsJson)
  const whyItems = whyFromApi.length
    ? whyFromApi
    : WHY_CHOOSE_US.map((w) => ({
        title: w.title,
        description: w.description,
        icon: 'shield',
      }))

  return (
    <>
      <Seo
        title={SEO.home.title}
        description={company?.description || SEO.home.description}
        path="/"
        image={company?.heroImageUrl || undefined}
      />

      <Hero company={company} />
      <TrustStrip />
      <AboutHomeSection />
      <PremiumCategorySection />

      <section className="section-pad">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Catalog</p>
                <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                  Product showcase
                </h2>
                <p className="mt-3 text-leather">
                  Executive bags, leather accessories, and corporate combo sets — request a bulk
                  quotation for any product below. Minimum order: 50 units.
                </p>
              </div>
              <Button to="/products" variant="outline">
                View full catalog
              </Button>
            </div>
          </SectionReveal>
          {loading ? (
            <LoadingSpinner />
          ) : featured.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Products coming soon"
              description="Product catalog will appear here once published."
              action={
                <Button to="/quote" variant="outline">
                  Request a custom quote
                </Button>
              }
            />
          )}
        </div>
      </section>

      <CustomBrandingSection />
      <MaterialsSection />
      <ManufacturingSection />

      <section className="section-pad bg-cream/40">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Why us</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                Why procurement & HR leaders trust Amit Traders
              </h2>
            </div>
          </SectionReveal>
          <WhyChooseUs items={whyItems} />
          <div className="mt-8">
            <Button to="/why-choose-us" variant="primary" size='lg'>
              Learn more
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Process</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                Corporate gifting process
              </h2>
              <p className="mt-3 text-leather">
                A structured path from enquiry to sample approval, production, and delivery.
              </p>
            </div>
          </SectionReveal>
          <ProcessTimeline steps={process} />
        </div>
      </section>

      <section className="section-pad bg-deep text-cream">
        <div className="container-narrow text-center">
          <h2 className="font-display text-4xl text-cream md:text-5xl">
            {company?.ctaTitle || "Let's create your custom corporate gifting solution"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-light-tan">
            {company?.ctaSubtitle ||
              'Request your product catalog, physical samples, and a personalized quotation for bulk orders from 50 units.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/quote" size="lg" variant="secondary">
              Request a Quote
            </Button>
            <Button to="/contact" size="lg" variant="outline-light">
              Contact us
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <SectionReveal>
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">RFQ</p>
              <h2 className="mt-3 font-display text-4xl text-primary">Request a quotation</h2>
              <p className="mx-auto mt-3 max-w-xl text-leather">
                Share your product interests, estimated quantity, and customization requirements for a
                personalized bulk quote.
              </p>
            </div>
          </SectionReveal>
          <EnquiryForm compact />
        </div>
      </section>
    </>
  )
}
