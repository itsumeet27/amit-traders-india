import { Button } from '@/components/ui/Button'
import { SafeImage } from '@/components/ui/SafeImage'
import type { CompanyProfile } from '@/types'
import { HERO } from '@/content/siteContent'
import { resolveMediaUrl } from '@/utils'

export function Hero({ company }: { company: CompanyProfile | null }) {
  const title = company?.heroTitle || HERO.title
  const subtitle = company?.heroSubtitle || company?.tagline || HERO.subtitle
  const heroSrc = resolveMediaUrl(company?.heroImageUrl)
  const primaryCta = company?.heroCtaPrimary || HERO.primaryCta
  const secondaryCta = company?.heroCtaSecondary || HERO.secondaryCta

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-primary text-cream">
      <div className="absolute inset-0">
        {heroSrc ? (
          <img
            src={heroSrc}
            alt=""
            className="h-full w-full object-cover animate-[image-reveal_1.1s_ease-out]"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="leather-placeholder h-full w-full animate-[image-reveal_1.1s_ease-out]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/72 to-primary/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/20" />
      </div>

      <div className="relative container-wide flex min-h-[88vh] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20 lg:px-12 lg:pb-24">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold animate-[fade-up_0.7s_ease-out]">
          Mumbai · India
        </p>
        <h1 className="max-w-4xl font-display text-4xl leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl animate-[fade-up_0.8s_ease-out]">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-light-tan md:text-lg animate-[fade-up_0.9s_ease-out]">
          {subtitle}
        </p>
        <div className="mt-9 flex flex-wrap gap-3 animate-[fade-up_1s_ease-out]">
          <Button to="/quote" size="lg" variant="secondary">
            {primaryCta}
          </Button>
          <Button to="/products" size="lg" variant="outline-light">
            {secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  )
}

export function CompanyIntro({ company }: { company: CompanyProfile | null }) {
  return (
    <section className="section-pad bg-cream/50">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Our House</p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            Crafted leather for brands that demand substance
          </h2>
          <p className="mt-5 text-base leading-relaxed text-leather md:text-lg">
            {company?.description ||
              'From material selection to finishing, Amit Traders India partners with retailers, exporters, and private-label brands to deliver genuine leather goods with disciplined quality and reliable lead times.'}
          </p>
          <div className="mt-8">
            <Button to="/about" variant="outline">
              Learn about us
            </Button>
          </div>
        </div>
        <SafeImage
          src={company?.aboutImageUrl || company?.heroImageUrl}
          alt={company?.companyName || 'Amit Traders India workshop'}
          aspect="aspect-[5/4]"
          className="shadow-[0_30px_80px_-40px_rgba(59,36,24,0.55)]"
          imgClassName="animate-[image-reveal_1s_ease-out]"
        />
      </div>
    </section>
  )
}
