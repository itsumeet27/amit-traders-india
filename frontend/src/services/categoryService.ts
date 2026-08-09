import api from './api'
import { demoData, withDemoFallback } from './demoData'
import type { BulkDeleteResponse, Category, CategoryPayload } from '@/types'

export const categoryService = {
  async getPublic(): Promise<Category[]> {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Category[]>('/api/categories')
        return data
      },
      () => demoData.categories(),
    )
  },

  async getBySlug(slug: string): Promise<Category> {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Category>(`/api/categories/${slug}`)
        return data
      },
      async () => {
        const categories = await demoData.categories()
        const found = categories.find((c) => c.slug === slug)
        if (!found) throw new Error('Category not found')
        return found
      },
    )
  },

  async getAdmin(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/api/admin/categories')
    return data
  },

  async getById(id: number): Promise<Category> {
    const { data } = await api.get<Category>(`/api/admin/categories/${id}`)
    return data
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await api.post<Category>('/api/admin/categories', payload)
    return data
  },

  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await api.put<Category>(`/api/admin/categories/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/categories/${id}`)
  },

  async removeBulk(ids: number[]): Promise<BulkDeleteResponse> {
    const { data } = await api.post<BulkDeleteResponse>('/api/admin/categories/bulk-delete', { ids })
    return data
  },

  async reorder(items: { id: number; displayOrder: number }[]): Promise<void> {
    await api.put('/api/admin/categories/reorder', { items })
  },
}
