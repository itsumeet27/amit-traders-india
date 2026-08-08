import api from './api'
import { isDemoMode } from './demoData'
import type { Enquiry, EnquiryRequest, EnquiryStatusUpdate, PageResponse } from '@/types'

export interface EnquiryQuery {
  page?: number
  size?: number
  status?: string
  search?: string
}

export const enquiryService = {
  async submit(payload: EnquiryRequest, file?: File | null): Promise<Enquiry> {
    if (isDemoMode()) {
      try {
        if (file) {
          const formData = new FormData()
          formData.append(
            'enquiry',
            new Blob([JSON.stringify(payload)], { type: 'application/json' }),
          )
          formData.append('attachment', file)
          const { data } = await api.post<Enquiry>('/api/enquiries', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          return data
        }
        const { data } = await api.post<Enquiry>('/api/enquiries', payload)
        return data
      } catch {
        const now = new Date().toISOString()
        const demoEnquiry: Enquiry = {
          ...payload,
          id: Date.now(),
          status: 'NEW',
          attachmentUrl: file ? file.name : null,
          createdAt: now,
          updatedAt: now,
        }
        const key = 'demo_enquiries'
        const existing = JSON.parse(localStorage.getItem(key) || '[]') as Enquiry[]
        existing.unshift(demoEnquiry)
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)))
        return demoEnquiry
      }
    }

    if (file) {
      const formData = new FormData()
      formData.append(
        'enquiry',
        new Blob([JSON.stringify(payload)], { type: 'application/json' }),
      )
      formData.append('attachment', file)
      const { data } = await api.post<Enquiry>('/api/enquiries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    }
    const { data } = await api.post<Enquiry>('/api/enquiries', payload)
    return data
  },

  async getAdmin(query: EnquiryQuery = {}): Promise<PageResponse<Enquiry>> {
    const { data } = await api.get<PageResponse<Enquiry>>('/api/admin/enquiries', {
      params: query,
    })
    return data
  },

  async getById(id: number): Promise<Enquiry> {
    const { data } = await api.get<Enquiry>(`/api/admin/enquiries/${id}`)
    return data
  },

  async updateStatus(id: number, payload: EnquiryStatusUpdate): Promise<Enquiry> {
    const { data } = await api.patch<Enquiry>(`/api/admin/enquiries/${id}/status`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/enquiries/${id}`)
  },
}
