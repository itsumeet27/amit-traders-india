import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { SafeImage } from '@/components/ui/SafeImage'
import { SectionReveal } from '@/components/ui/SafeImage'
import { EmptyState } from '@/components/ui/Feedback'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) {
    return (
      <EmptyState
        title="Categories coming soon"
        description="Product categories will appear here once published from the admin CMS."
      />
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <SectionReveal key={category.id} delayMs={index * 60}>
          <Link
            to={`/products?category=${category.slug}`}
            className="group block overflow-hidden border border-transparent hover:border-tan/40"
          >
            <SafeImage
              src={category.imageUrl}
              alt={category.name}
              aspect="aspect-[16/10]"
              imgClassName="group-hover:scale-105"
            />
            <div className="bg-off-white px-1 pt-4">
              <h3 className="font-display text-2xl text-primary group-hover:text-leather">
                {category.name}
              </h3>
              {category.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-leather">{category.description}</p>
              ) : null}
            </div>
          </Link>
        </SectionReveal>
      ))}
    </div>
  )
}
