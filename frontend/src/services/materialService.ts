import api from './api'
import type { LookupOption } from '@/types'

export const materialService = {
  async getAdmin(): Promise<LookupOption[]> {
    const { data } = await api.get<LookupOption[]>('/api/admin/materials')
    return data
  },

  async create(name: string): Promise<LookupOption> {
    const { data } = await api.post<LookupOption>('/api/admin/materials', { name })
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/materials/${id}`)
  },
}
