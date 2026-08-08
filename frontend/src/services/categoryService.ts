import api from './api'
import type { Category, CategoryPayload } from '@/types'

export const categoryService = {
  async getPublic(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/api/categories')
    return data
  },

  async getBySlug(slug: string): Promise<Category> {
    const { data } = await api.get<Category>(`/api/categories/${slug}`)
    return data
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

  async reorder(items: { id: number; displayOrder: number }[]): Promise<void> {
    await api.put('/api/admin/categories/reorder', { items })
  },
}
