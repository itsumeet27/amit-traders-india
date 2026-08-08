import api from './api'
import { demoData, withDemoFallback } from './demoData'
import type { PageResponse, Product, ProductImagePayload, ProductPayload } from '@/types'

export interface ProductQuery {
  page?: number
  size?: number
  category?: number
  featured?: boolean
  search?: string
  active?: boolean
}

function toParams(query: ProductQuery = {}) {
  const params: Record<string, string | number | boolean> = {}
  if (query.page != null) params.page = query.page
  if (query.size != null) params.size = query.size
  if (query.category != null) params.category = query.category
  if (query.featured != null) params.featured = query.featured
  if (query.search) params.search = query.search
  if (query.active != null) params.active = query.active
  return params
}

export const productService = {
  async getPublic(query: ProductQuery = {}): Promise<PageResponse<Product>> {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<PageResponse<Product>>('/api/products', {
          params: toParams(query),
        })
        return data
      },
      () => demoData.filterProducts(query),
    )
  },

  async getFeatured(size = 8): Promise<Product[]> {
    const page = await this.getPublic({ featured: true, size })
    return page.content
  },

  async getBySlug(slug: string): Promise<Product> {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Product>(`/api/products/${slug}`)
        return data
      },
      () => demoData.productBySlug(slug),
    )
  },

  async getAdmin(query: ProductQuery = {}): Promise<PageResponse<Product>> {
    const { data } = await api.get<PageResponse<Product>>('/api/admin/products', {
      params: toParams(query),
    })
    return data
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/api/admin/products/${id}`)
    return data
  },

  async create(payload: ProductPayload): Promise<Product> {
    const { data } = await api.post<Product>('/api/admin/products', payload)
    return data
  },

  async update(id: number, payload: ProductPayload): Promise<Product> {
    const { data } = await api.put<Product>(`/api/admin/products/${id}`, payload)
    return data
  },

  async replaceImages(id: number, images: ProductImagePayload[]): Promise<Product> {
    const { data } = await api.put<Product>(`/api/admin/products/${id}/images`, images)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/products/${id}`)
  },
}
