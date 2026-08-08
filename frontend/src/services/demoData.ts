import type { Category, Client, CompanyProfile, PageResponse, Product } from '@/types'

const demoEnabled =
  import.meta.env.VITE_DEMO_MODE === 'true' || import.meta.env.VITE_DEMO_MODE === '1'

function demoUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}demo-data/${file}`
}

async function fetchDemo<T>(file: string): Promise<T> {
  const res = await fetch(demoUrl(file))
  if (!res.ok) {
    throw new Error(`Demo data unavailable: ${file}`)
  }
  return res.json() as Promise<T>
}

export function isDemoMode(): boolean {
  return demoEnabled
}

export async function withDemoFallback<T>(
  live: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  if (demoEnabled) {
    try {
      return await live()
    } catch {
      return fallback()
    }
  }
  return live()
}

export const demoData = {
  companyProfile: () => fetchDemo<CompanyProfile>('company-profile.json'),
  categories: () => fetchDemo<Category[]>('categories.json'),
  clients: () => fetchDemo<Client[]>('clients.json'),
  productsPage: async (): Promise<PageResponse<Product>> => {
    return fetchDemo<PageResponse<Product>>('products.json')
  },
  productDetails: () => fetchDemo<Product[]>('product-details.json'),
  async productBySlug(slug: string): Promise<Product> {
    const all = await this.productDetails()
    const found = all.find((p) => p.slug === slug || String(p.id) === slug)
    if (!found) throw new Error('Product not found')
    return found
  },
  async filterProducts(opts: {
    page?: number
    size?: number
    category?: number
    featured?: boolean
    search?: string
  }): Promise<PageResponse<Product>> {
    const page = await this.productsPage()
    let items = [...page.content]
    if (opts.category != null) {
      items = items.filter((p) => p.categoryId === opts.category)
    }
    if (opts.featured) {
      items = items.filter((p) => p.featured)
    }
    if (opts.search) {
      const q = opts.search.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.shortDescription || '').toLowerCase().includes(q),
      )
    }
    const size = opts.size ?? 12
    const pageIndex = opts.page ?? 0
    const start = pageIndex * size
    const slice = items.slice(start, start + size)
    return {
      content: slice,
      page: pageIndex,
      size,
      totalElements: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / size)),
      first: pageIndex === 0,
      last: start + size >= items.length,
    }
  },
}
