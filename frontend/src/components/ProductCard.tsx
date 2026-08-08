import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { getPrimaryImage } from '@/utils'
import { SafeImage } from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/Button'

export function ProductCard({ product }: { product: Product }) {
  const image = getPrimaryImage(product.images)

  return (
    <article className="group flex h-full flex-col border border-light-tan/70 bg-off-white transition duration-300 hover:border-tan/70 hover:shadow-[0_12px_40px_-20px_rgba(59,36,24,0.35)]">
      <Link to={`/products/${product.slug}`} className="block overflow-hidden">
        <SafeImage
          src={image}
          alt={product.name}
          aspect="aspect-[5/4]"
          imgClassName="group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {product.categoryName ? (
          <p className="text-xs uppercase tracking-[0.18em] text-gold">{product.categoryName}</p>
        ) : null}
        <h3 className="font-display text-2xl leading-tight text-primary">
          <Link to={`/products/${product.slug}`} className="hover:text-leather">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-leather">
            {product.shortDescription}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button to={`/products/${product.slug}`} variant="outline" size="sm">
            View Details
          </Button>
          <Button
            to={`/quote?product=${encodeURIComponent(product.slug)}&name=${encodeURIComponent(product.name)}`}
            size="sm"
          >
            Request Quote
          </Button>
        </div>
      </div>
    </article>
  )
}
