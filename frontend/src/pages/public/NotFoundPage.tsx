import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you requested could not be found." path="/404" noIndex />
      <section className="section-pad text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">404</p>
        <h1 className="mt-3 font-display text-5xl text-primary">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-leather">
          The page may have moved, or the link is incorrect. Return home or browse our products.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">Home</Button>
          <Button to="/products" variant="outline">
            Products
          </Button>
        </div>
      </section>
    </>
  )
}
