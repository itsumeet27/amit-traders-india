import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { companyService } from '@/services/companyService'
import type { CompanyProfile } from '@/types'
import {
  parseAboutValues,
  parseStringList,
  parseTimeline,
  resolveMediaUrl,
  splitParagraphs,
} from '@/utils'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { LoadingSpinner } from '@/components/ui/Feedback'
import { SafeImage, SectionReveal } from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/Button'
import { RichText } from '@/components/ui/RichText'
import { IMAGES, SEO } from '@/content/siteContent'

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

  const timeline = parseTimeline(company?.manufacturingStepsJson)
  const values = parseAboutValues(company?.aboutValuesJson)
  const commitments = parseStringList(company?.missionCommitmentsJson)
  const storyParagraphs = splitParagraphs(company?.history)
  const visionParagraphs = splitParagraphs(company?.vision)
  const missionParagraphs = splitParagraphs(company?.mission)
  const heroImage = resolveMediaUrl(company?.aboutImageUrl || company?.heroImageUrl) || IMAGES.aboutHero
  const storyImage = resolveMediaUrl(company?.aboutImageUrl) || IMAGES.aboutStory

  return (
    <>
      <Seo
        title={SEO.about.title}
        description={SEO.about.description}
        path="/about"
        image={heroImage}
      />

      <section className="relative overflow-hidden bg-primary text-cream">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/92 to-primary/75" />
        </div>
        <div className="relative container-wide px-5 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">About Us</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl text-cream md:text-6xl">
            {company?.aboutHeroTitle || 'Crafted with Purpose. Built to Last.'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-light-tan">
            {company?.aboutHeroSubtitle ||
              'A trusted manufacturing partner for businesses seeking thoughtfully designed leather goods and corporate gifting solutions.'}
          </p>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : (
        <>
          <section className="section-pad bg-off-white">
            <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-start">
              <SectionReveal>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Our Story</p>
                <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                  {company?.storyHeadline || company?.aboutHeroTitle || 'Our Story'}
                </h2>
                <div className="mt-6 space-y-5">
                  {storyParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed text-leather">
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              </SectionReveal>
              <SectionReveal delayMs={80}>
                <SafeImage
                  src={storyImage}
                  alt="Leather craftsmanship at Amit Traders"
                  aspect="aspect-[3/2]"
                />
              </SectionReveal>
            </div>
          </section>

          <section className="section-pad bg-cream/40">
            <div className="container-wide max-w-4xl">
              <SectionReveal>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Our Mission</p>
                <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                  {company?.missionHeadline || 'Our Mission'}
                </h2>
                <div className="mt-6 space-y-5">
                  {missionParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed text-leather">
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
                {commitments.length ? (
                  <>
                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                      We are committed to:
                    </p>
                    <ul className="mt-4 space-y-3 text-base leading-relaxed text-leather">
                      {commitments.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {company?.missionClosing ? (
                  <p className="mt-8 text-base leading-relaxed text-leather">
                    <RichText text={company.missionClosing} />
                  </p>
                ) : null}
              </SectionReveal>
            </div>
          </section>

          <section className="section-pad bg-off-white">
            <div className="container-wide max-w-4xl">
              <SectionReveal>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Our Vision</p>
                <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                  {company?.visionHeadline || 'Our Vision'}
                </h2>
                <div className="mt-6 space-y-5">
                  {visionParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed text-leather">
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </section>

          {values.length ? (
            <section className="section-pad bg-cream/50">
              <div className="container-wide">
                <SectionReveal>
                  <h2 className="font-display text-4xl text-primary md:text-5xl">What We Stand For</h2>
                </SectionReveal>
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {values.map((item, index) => (
                    <SectionReveal key={item.title} delayMs={index * 60}>
                      <article className="h-full border border-light-tan/50 bg-off-white p-6">
                        <h3 className="font-display text-2xl text-primary">{item.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-leather md:text-base">
                          {item.description}
                        </p>
                      </article>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {company?.aboutPromiseHeadline || company?.aboutPromiseBody || company?.aboutPromiseClosing ? (
            <section className="section-pad bg-deep text-cream">
              <div className="container-wide max-w-3xl text-center">
                <SectionReveal>
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">Our Promise</p>
                  {company?.aboutPromiseHeadline ? (
                    <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
                      {company.aboutPromiseHeadline}
                    </h2>
                  ) : null}
                  {company?.aboutPromiseBody ? (
                    <p className="mt-6 text-base leading-relaxed text-light-tan">
                      <RichText text={company.aboutPromiseBody} />
                    </p>
                  ) : null}
                  {company?.aboutPromiseClosing ? (
                    <p className="mt-5 text-base leading-relaxed text-light-tan">
                      <RichText text={company.aboutPromiseClosing} />
                    </p>
                  ) : null}
                  <Button to="/quote" variant="secondary" className="mt-8" size="lg">
                    Request Quote
                  </Button>
                </SectionReveal>
              </div>
            </section>
          ) : null}

          <section className="section-pad bg-off-white">
            <div className="container-wide">
              <div className="mb-10 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Process</p>
                <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
                  Manufacturing timeline
                </h2>
                <p className="mt-3 text-leather">
                  From requirement through sampling, production, and delivery.
                </p>
              </div>
              <ProcessTimeline steps={timeline} />
            </div>
          </section>
        </>
      )}
    </>
  )
}
