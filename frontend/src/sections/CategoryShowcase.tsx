import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { categoryService } from '@/services/categoryService'
import { EmptyState, LoadingSpinner } from '@/components/ui/Feedback'
import { SafeImage, SectionReveal } from '@/components/ui/SafeImage'

type CategoryShowcaseProps = {
  layout?: 'featured' | 'compact'
  sectionLabel?: string
  title?: string
  description?: string
}

function sortCategories(categories: Category[]): Category[] {
  return [...categories]
    .filter((category) => category.active)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
}

export function CategoryShowcase({
  layout = 'featured',
  sectionLabel = 'Collections',
  title = 'Product categories',
  description = 'Executive bags, leather accessories, corporate combos, and gifting solutions for enterprises across India.',
}: CategoryShowcaseProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    categoryService
      .getPublic()
      .then((data) => {
        if (!cancelled) setCategories(sortCategories(data))
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className={layout === 'featured' ? 'section-pad bg-cream/30' : 'section-pad bg-cream/40'}>
      <div className="container-wide">
        <SectionReveal>
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{sectionLabel}</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">{title}</h2>
            {description ? <p className="mt-3 text-leather">{description}</p> : null}
          </div>
        </SectionReveal>

        {loading ? (
          <LoadingSpinner />
        ) : !categories.length ? (
          <EmptyState
            title="Categories coming soon"
            description="Product categories will appear here once published from the admin CMS."
          />
        ) : layout === 'compact' ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {categories.map((category, index) => (
              <SectionReveal key={category.id} delayMs={index * 70}>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="flex gap-5 border border-light-tan/50 bg-off-white p-5 transition hover:border-tan/40"
                >
                  <SafeImage
                    src={category.imageUrl}
                    alt={category.name}
                    aspect="aspect-square"
                    className="h-28 w-28 shrink-0"
                    imgClassName="h-28 w-28"
                  />
                  <div>
                    <h3 className="font-display text-2xl text-primary">{category.name}</h3>
                    {category.description ? (
                      <p className="mt-2 text-sm text-leather">{category.description}</p>
                    ) : null}
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {categories.map((category, index) => (
              <SectionReveal key={category.id} delayMs={index * 70}>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group grid overflow-hidden border border-light-tan/50 bg-off-white md:grid-cols-[42%_58%]"
                >
                  <div className="overflow-hidden">
                    <SafeImage
                      src={category.imageUrl}
                      alt={category.name}
                      aspect="aspect-[4/3] md:aspect-auto md:min-h-[220px]"
                      imgClassName="min-h-[220px] transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <p className="text-xs uppercase tracking-[0.28em] text-gold">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-primary md:text-3xl">{category.name}</h3>
                    {category.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-leather">{category.description}</p>
                    ) : null}
                    <div className="mt-6">
                      <span className="text-sm font-medium uppercase tracking-[0.16em] text-primary group-hover:text-gold">
                        Explore Category →
                      </span>
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
