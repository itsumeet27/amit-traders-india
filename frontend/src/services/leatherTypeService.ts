import api from './api'
import type { LookupOption } from '@/types'

export const leatherTypeService = {
  async getAdmin(): Promise<LookupOption[]> {
    const { data } = await api.get<LookupOption[]>('/api/admin/leather-types')
    return data
  },

  async create(name: string): Promise<LookupOption> {
    const { data } = await api.post<LookupOption>('/api/admin/leather-types', { name })
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/leather-types/${id}`)
  },
}
