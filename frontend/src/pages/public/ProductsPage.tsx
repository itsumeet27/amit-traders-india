import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import type { Category, Product } from '@/types'
import clsx from 'clsx'

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const categorySlug = params.get('category') || ''
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryService
      .getPublic()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const categoryId = activeCategory?.id
    // Wait for categories when filtering by slug so we can resolve ID
    if (categorySlug && categories.length === 0) return

    productService
      .getPublic({
        size: 48,
        category: categoryId,
      })
      .then((page) => {
        if (!cancelled) setProducts(page.content)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [categorySlug, activeCategory?.id, categories.length])

  function setCategory(slug: string) {
    const next = new URLSearchParams(params)
    if (slug) next.set('category', slug)
    else next.delete('category')
    setParams(next)
  }

  return (
    <>
      <Seo
        title={activeCategory ? activeCategory.name : 'Products'}
        description="Browse premium genuine leather products from Amit Traders India. Request B2B quotes — no fixed retail pricing."
        path={categorySlug ? `/products?category=${categorySlug}` : '/products'}
      />

      <section className="border-b border-light-tan/60 bg-cream/40">
        <div className="container-wide px-5 py-14 md:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Catalog</p>
          <h1 className="mt-3 font-display text-5xl text-primary">
            {activeCategory?.name || 'Genuine leather products'}
          </h1>
          <p className="mt-4 max-w-2xl text-leather">
            {activeCategory?.description ||
              'Explore our B2B leather ranges. Pricing is quote-based for wholesale and custom programs.'}
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-wide">
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={clsx(
                'px-4 py-2 text-sm transition',
                !categorySlug
                  ? 'bg-primary text-cream'
                  : 'border border-light-tan text-leather hover:border-tan',
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.slug)}
                className={clsx(
                  'px-4 py-2 text-sm transition',
                  categorySlug === cat.slug
                    ? 'bg-primary text-cream'
                    : 'border border-light-tan text-leather hover:border-tan',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products in this category"
              description="Try another filter or request a custom manufacturing quote."
              action={
                <Button to="/quote" variant="outline">
                  Request Quote
                </Button>
              }
            />
          )}
        </div>
      </section>
    </>
  )
}
