import api from './api'
import type { DashboardStats, MediaAsset } from '@/types'

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/api/admin/dashboard/stats')
    return data
  },

  async getMedia(): Promise<MediaAsset[]> {
    const { data } = await api.get<MediaAsset[]>('/api/admin/media')
    return data
  },

  async uploadMedia(file: File, folder = 'gallery'): Promise<MediaAsset> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<MediaAsset>('/api/admin/media/upload', formData, {
      params: { folder },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async deleteMedia(id: number): Promise<void> {
    await api.delete(`/api/admin/media/${id}`)
  },
}
