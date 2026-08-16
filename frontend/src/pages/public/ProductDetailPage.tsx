import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { productService } from '@/services/productService'
import type { Product } from '@/types'
import { getPrimaryImage } from '@/utils'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { ProductImageGallery } from '@/components/ProductImageGallery'

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    productService
      .getBySlug(slug)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(null)
          setError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) return <LoadingSpinner className="py-32" />

  if (error || !product) {
    return (
      <div className="section-pad">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          action={
            <Button to="/products" variant="outline">
              Back to products
            </Button>
          }
        />
      </div>
    )
  }

  const primaryImage = getPrimaryImage(product.images)

  return (
    <>
      <Seo
        title={product.name}
        description={product.shortDescription || product.description || undefined}
        path={`/products/${product.slug}`}
        image={primaryImage || undefined}
      />

      <section className="section-pad">
        <div className="container-wide">
          <nav className="mb-8 text-sm text-leather">
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
            {product.categoryName ? (
              <>
                <span className="mx-2">/</span>
                <Link
                  to={`/products?category=${product.categorySlug || ''}`}
                  className="hover:text-primary"
                >
                  {product.categoryName}
                </Link>
              </>
            ) : null}
            <span className="mx-2">/</span>
            <span className="text-primary">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <ProductImageGallery images={product.images || []} productName={product.name} />

            <div>
              {product.categoryName ? (
                <p className="text-xs uppercase tracking-[0.22em] text-gold">
                  {product.categoryName}
                </p>
              ) : null}
              <h1 className="mt-2 font-display text-5xl text-primary">{product.name}</h1>
              {product.shortDescription ? (
                <p className="mt-4 text-lg leading-relaxed text-leather">
                  {product.shortDescription}
                </p>
              ) : null}

              <dl className="mt-8 space-y-4 border-y border-light-tan/70 py-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-leather">Minimum order</dt>
                  <dd className="font-medium text-primary">
                    {product.minimumOrderQuantity} units
                  </dd>
                </div>
                {product.leatherType ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-leather">Leather</dt>
                    <dd className="font-medium text-primary">{product.leatherType}</dd>
                  </div>
                ) : null}
                {product.material ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-leather">Materials</dt>
                    <dd className="max-w-[60%] text-right font-medium text-primary">
                      {product.material}
                    </dd>
                  </div>
                ) : null}
                {product.colors ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-leather">Colors</dt>
                    <dd className="max-w-[60%] text-right font-medium text-primary">
                      {product.colors}
                    </dd>
                  </div>
                ) : null}
                {product.dimensions ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-leather">Dimensions</dt>
                    <dd className="max-w-[60%] text-right font-medium text-primary">
                      {product.dimensions}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {product.customization ? (
                <div className="mt-6">
                  <h2 className="font-display text-2xl text-primary">Customization</h2>
                  <p className="mt-2 text-sm leading-relaxed text-leather">
                    {product.customization}
                  </p>
                </div>
              ) : null}

              {product.branding ? (
                <div className="mt-6">
                  <h2 className="font-display text-2xl text-primary">Branding</h2>
                  <p className="mt-2 text-sm leading-relaxed text-leather">{product.branding}</p>
                </div>
              ) : null}

              {product.description ? (
                <div className="mt-6">
                  <h2 className="font-display text-2xl text-primary">Details</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-leather">
                    {product.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  to={`/quote?product=${encodeURIComponent(product.slug)}&name=${encodeURIComponent(product.name)}`}
                  size="lg"
                >
                  Request Quote
                </Button>
                <Button to="/custom-manufacturing" variant="outline" size="lg">
                  Custom manufacturing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
