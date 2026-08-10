import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { SectionReveal } from '@/components/ui/SafeImage'
import {
  ABOUT_HOME,
  CUSTOM_BRANDING,
  IMAGES,
  MANUFACTURING,
  MATERIALS,
  PRODUCT_CATEGORIES,
  TRUST_STRIP,
} from '@/content/siteContent'

export function TrustStrip() {
  return (
    <section className="border-b border-light-tan/60 bg-cream/40">
      <div className="container-wide grid gap-6 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 md:px-8 lg:px-12">
        {TRUST_STRIP.map((item, index) => (
          <SectionReveal key={item.label} delayMs={index * 60}>
            <div
              className="border border-light-tan/50 bg-off-white px-5 py-6 text-center"
              style={{ minHeight: '120px', backgroundColor: '#382319' }}
            >
              <p className="font-display text-2xl text-white md:text-3xl">{item.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gold">{item.label}</p>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}

export function AboutHomeSection() {
  return (
    <section className="section-pad" style={{backgroundColor: '#fff'}}>
      <div className="container-wide grid items-center gap-10 lg:grid-cols-[45%_55%] lg:gap-16">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">About Amit Traders</p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">{ABOUT_HOME.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-leather md:text-lg">{ABOUT_HOME.body}</p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-leather">
            <span className="border border-light-tan/70 px-4 py-2">Mumbai, India</span>
            <span className="border border-light-tan/70 px-4 py-2">MOQ from 50 units</span>
            <span className="border border-light-tan/70 px-4 py-2">Custom branding</span>
          </div>
          <div className="mt-8">
            <Button to="/about" variant="primary" size="lg">
              About Us
            </Button>
          </div>
        </SectionReveal>
        <SectionReveal delayMs={100}>
          <div className="overflow-hidden">
            <img
              src={IMAGES.aboutStory}
              alt="Leather craftsmanship — representative sample image"
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export function PremiumCategorySection() {
  return (
    <section className="section-pad bg-cream/30">
      <div className="container-wide">
        <SectionReveal>
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Collections</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Product categories</h2>
            <p className="mt-3 text-leather">
              Executive bags, leather accessories, corporate combos, and festive gifting solutions for
              enterprises across India.
            </p>
          </div>
        </SectionReveal>
        <div className="grid gap-6 lg:grid-cols-2">
          {PRODUCT_CATEGORIES.map((cat, index) => (
            <SectionReveal key={cat.slug} delayMs={index * 70}>
              <article className="group grid overflow-hidden border border-light-tan/50 bg-off-white md:grid-cols-[42%_58%]">
                <div className="overflow-hidden">
                  <img
                    src={cat.image}
                    alt={`${cat.title} — representative sample`}
                    className="h-full min-h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">{cat.number}</p>
                  <h3 className="mt-2 font-display text-2xl text-primary md:text-3xl">{cat.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-leather">{cat.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-xs text-leather/90">
                    {cat.items.map((item) => (
                      <li key={item} className="border border-light-tan/60 px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="text-sm font-medium uppercase tracking-[0.16em] text-primary hover:text-gold"
                    >
                      Explore Category →
                    </Link>
                  </div>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CustomBrandingSection() {
  return (
    <section className="section-pad bg-primary text-cream">
      <div className="container-wide">
        <SectionReveal>
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Customization</p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">{CUSTOM_BRANDING.title}</h2>
            <p className="mt-4 text-light-tan">{CUSTOM_BRANDING.intro}</p>
          </div>
        </SectionReveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOM_BRANDING.methods.map((method, index) => (
            <SectionReveal key={method.title} delayMs={index * 60}>
              <article className="border border-white/10 bg-white/5">
                <img
                  src={method.image}
                  alt={`${method.title} — representative detail`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="font-display text-2xl text-gold">{method.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-light-tan/90">
                    For: {method.for}
                  </p>
                  <p className="mt-3 text-sm text-light-tan">{method.description}</p>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MaterialsSection() {
  return (
    <section className="section-pad">
      <div className="container-wide">
        <SectionReveal>
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Materials</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              Materials that define the finish
            </h2>
          </div>
        </SectionReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIALS.map((material, index) => (
            <SectionReveal key={material.title} delayMs={index * 50}>
              <article className="group overflow-hidden border border-light-tan/50">
                <img
                  src={material.image}
                  alt={`${material.title} texture — representative sample`}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="bg-off-white px-4 py-4">
                  <h3 className="font-display text-xl text-primary">{material.title}</h3>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ManufacturingSection() {
  return (
    <section className="section-pad bg-deep text-cream">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-2">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Capability</p>
          <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">{MANUFACTURING.title}</h2>
          <p className="mt-6 font-display text-5xl text-gold md:text-6xl">{MANUFACTURING.stat}</p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-light-tan">{MANUFACTURING.body}</p>
          <div className="mt-8">
            <Button to="/quote" variant="secondary" size="lg">
              Request a Bulk Quote
            </Button>
          </div>
        </SectionReveal>
        <SectionReveal delayMs={100}>
          <img
            src={IMAGES.manufacturing}
            alt="Manufacturing and craftsmanship — representative sample"
            className="aspect-[4/3] w-full object-cover shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]"
            loading="lazy"
          />
        </SectionReveal>
      </div>
    </section>
  )
}
