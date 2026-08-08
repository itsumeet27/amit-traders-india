import api from './api'
import type { Client, ClientPayload } from '@/types'

export const clientService = {
  async getPublic(): Promise<Client[]> {
    const { data } = await api.get<Client[]>('/api/clients')
    return data
  },

  async getAdmin(): Promise<Client[]> {
    const { data } = await api.get<Client[]>('/api/admin/clients')
    return data
  },

  async create(payload: ClientPayload): Promise<Client> {
    const { data } = await api.post<Client>('/api/admin/clients', payload)
    return data
  },

  async update(id: number, payload: ClientPayload): Promise<Client> {
    const { data } = await api.put<Client>(`/api/admin/clients/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/clients/${id}`)
  },
}
