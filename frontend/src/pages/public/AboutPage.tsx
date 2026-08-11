import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { companyService } from '@/services/companyService'
import type { CompanyProfile } from '@/types'
import { parseTimeline, resolveMediaUrl } from '@/utils'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { SafeImage, SectionReveal } from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/Button'
import { ABOUT_PAGE, IMAGES, SEO, type AboutParagraph } from '@/content/siteContent'

function AboutRichText({ parts }: { parts: readonly (string | { readonly strong: string })[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          <strong key={index} className="font-semibold text-primary">
            {part.strong}
          </strong>
        ),
      )}
    </>
  )
}

function AboutParagraphBlock({ paragraph }: { paragraph: AboutParagraph }) {
  if (typeof paragraph === 'string') {
    return <p className="text-base leading-relaxed text-leather">{paragraph}</p>
  }

  return (
    <p className="text-base leading-relaxed text-leather">
      <AboutRichText parts={paragraph} />
    </p>
  )
}

export function AboutPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    companyService
      .getPublic()
      .then(setCompany)
      .catch(() => setCompany(null))
  }, [])

  const timeline = parseTimeline(company?.manufacturingStepsJson)
  const heroImage = resolveMediaUrl(company?.aboutImageUrl || company?.heroImageUrl) || IMAGES.aboutHero

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
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{ABOUT_PAGE.hero.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl text-cream md:text-6xl">
            {ABOUT_PAGE.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-light-tan">{ABOUT_PAGE.hero.subtitle}</p>
        </div>
      </section>

      <section className="section-pad bg-off-white">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionReveal>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{ABOUT_PAGE.story.title}</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              {ABOUT_PAGE.story.headline}
            </h2>
            <div className="mt-6 space-y-5">
              {ABOUT_PAGE.story.paragraphs.map((paragraph, index) => (
                <AboutParagraphBlock key={index} paragraph={paragraph} />
              ))}
            </div>
          </SectionReveal>
          <SectionReveal delayMs={80}>
            <SafeImage
              src={IMAGES.aboutStory}
              alt="Leather craftsmanship at Amit Traders"
              aspect="aspect-[3/2]"
            />
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-cream/40">
        <div className="container-wide max-w-4xl">
          <SectionReveal>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{ABOUT_PAGE.mission.title}</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              {ABOUT_PAGE.mission.headline}
            </h2>
            <div className="mt-6 space-y-5">
              <p className="text-base leading-relaxed text-leather">
                <AboutRichText parts={ABOUT_PAGE.mission.intro} />
              </p>
              <AboutParagraphBlock paragraph={ABOUT_PAGE.mission.body} />
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              We are committed to:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-leather">
              {ABOUT_PAGE.mission.commitments.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-leather">
              <AboutRichText parts={ABOUT_PAGE.mission.closing} />
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-off-white">
        <div className="container-wide max-w-4xl">
          <SectionReveal>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{ABOUT_PAGE.vision.title}</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              {ABOUT_PAGE.vision.headline}
            </h2>
            <div className="mt-6 space-y-5">
              {ABOUT_PAGE.vision.paragraphs.map((paragraph, index) => (
                <AboutParagraphBlock key={index} paragraph={paragraph} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-cream/50">
        <div className="container-wide">
          <SectionReveal>
            <h2 className="font-display text-4xl text-primary md:text-5xl">
              {ABOUT_PAGE.values.title}
            </h2>
          </SectionReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ABOUT_PAGE.values.items.map((item, index) => (
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

      <section className="section-pad bg-deep text-cream">
        <div className="container-wide max-w-3xl text-center">
          <SectionReveal>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{ABOUT_PAGE.promise.title}</p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {ABOUT_PAGE.promise.headline}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-light-tan">{ABOUT_PAGE.promise.body}</p>
            <p className="mt-5 text-base leading-relaxed text-light-tan">
              <AboutRichText parts={ABOUT_PAGE.promise.closing} />
            </p>
            <Button to="/quote" variant="secondary" className="mt-8" size="lg">
              Request Quote
            </Button>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-off-white">
        <div className="container-wide">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Process</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Manufacturing timeline</h2>
            <p className="mt-3 text-leather">
              From requirement through sampling, production, and delivery.
            </p>
          </div>
          <ProcessTimeline steps={timeline} />
        </div>
      </section>
    </>
  )
}
