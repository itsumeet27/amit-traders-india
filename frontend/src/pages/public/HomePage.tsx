import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { Hero, CompanyIntro } from '@/sections/Hero'
import { CategoryGrid } from '@/sections/CategoryGrid'
import { WhyChooseUs } from '@/sections/WhyChooseUs'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { ClientShowcase, ClientMarquee } from '@/sections/ClientShowcase'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { SectionReveal } from '@/components/ui/SafeImage'
import { EnquiryForm } from '@/components/enquiry/EnquiryForm'
import { companyService } from '@/services/companyService'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { clientService } from '@/services/clientService'
import type { Category, Client, CompanyProfile, Product } from '@/types'
import { parseTimeline, parseWhyChooseUs } from '@/utils'

export function HomePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [companyRes, categoriesRes, featuredRes, clientsRes] = await Promise.allSettled([
        companyService.getPublic(),
        categoryService.getPublic(),
        productService.getFeatured(6),
        clientService.getPublic(),
      ])
      if (cancelled) return
      if (companyRes.status === 'fulfilled') setCompany(companyRes.value)
      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value)
      if (featuredRes.status === 'fulfilled') setFeatured(featuredRes.value)
      if (clientsRes.status === 'fulfilled') setClients(clientsRes.value)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const why = parseWhyChooseUs(company?.whyChooseUsJson)
  const process = parseTimeline(company?.manufacturingStepsJson)

  return (
    <>
      <Seo
        title="Premium Genuine Leather Manufacturer"
        description={
          company?.description ||
          'Amit Traders India manufactures premium genuine leather products and custom private-label goods for B2B partners worldwide.'
        }
        path="/"
        image={company?.heroImageUrl || undefined}
      />

      <Hero company={company} />

      <SectionReveal>
        <CompanyIntro company={company} />
      </SectionReveal>

      <section className="section-pad">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Collections</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                Product categories
              </h2>
              <p className="mt-3 text-leather">
                Explore our genuine leather ranges designed for retail, corporate gifting, and
                private label programs.
              </p>
            </div>
          </SectionReveal>
          {loading ? <LoadingSpinner /> : <CategoryGrid categories={categories} />}
        </div>
      </section>

      <section className="section-pad bg-cream/40">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Featured</p>
                <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                  Signature products
                </h2>
              </div>
              <Button to="/products" variant="outline">
                View all products
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
              title="Featured products coming soon"
              description="Once products are published in the CMS, they will appear here."
              action={
                <Button to="/quote" variant="outline">
                  Request a custom quote
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Why us</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                Why choose Amit Traders India
              </h2>
            </div>
          </SectionReveal>
          <WhyChooseUs items={why} />
        </div>
      </section>

      <section className="section-pad bg-primary text-cream">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionReveal>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Capability</p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {company?.customManufacturingTitle || 'Custom manufacturing, end to end'}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-light-tan">
              {company?.customManufacturingDescription ||
                'Bring your brief — materials, construction, branding, packaging — and we will develop samples through production with export-ready discipline.'}
            </p>
            <div className="mt-8">
              <Button to="/custom-manufacturing" variant="secondary">
                Explore custom programs
              </Button>
            </div>
          </SectionReveal>
          <SectionReveal delayMs={100}>
            <div className="border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="font-display text-3xl text-gold">Built for B2B</h3>
              <ul className="mt-5 space-y-3 text-sm text-light-tan">
                <li>Private label & OEM programs</li>
                <li>Material and hardware consultation</li>
                <li>Sampling with controlled iterations</li>
                <li>Scalable production with clear MOQs</li>
              </ul>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Craftsmanship</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                Our process
              </h2>
              <p className="mt-3 text-leather">
                {'A disciplined path from brief to packed carton — transparent at every stage.'}
              </p>
            </div>
          </SectionReveal>
          <ProcessTimeline steps={process} />
        </div>
      </section>

      <section className="section-pad bg-cream/50">
        <div className="container-wide">
          <SectionReveal>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Partners</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                Brands that trust our leatherwork
              </h2>
            </div>
          </SectionReveal>
          <ClientShowcase clients={clients.slice(0, 8)} />
        </div>
      </section>

      <ClientMarquee clients={clients} />

      <section className="section-pad bg-deep text-cream">
        <div className="container-narrow text-center">
          <h2 className="font-display text-4xl text-cream md:text-5xl">
            {company?.ctaTitle || 'Ready to brief your next leather program?'}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-light-tan">
            {company?.ctaSubtitle ||
              'Share quantities, materials, and branding requirements — our team will respond with sampling and commercial guidance.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/quote" size="lg" variant="secondary">
              Request Quote
            </Button>
            <Button
              to="/contact"
              size="lg"
              variant="outline"
              className="border-cream/30 text-cream hover:bg-cream/10"
            >
              Contact us
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <SectionReveal>
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Start a conversation</p>
              <h2 className="mt-3 font-display text-4xl text-primary">Send an enquiry</h2>
            </div>
          </SectionReveal>
          <EnquiryForm compact />
        </div>
      </section>
    </>
  )
}
