import api from './api'
import { demoData, withDemoFallback } from './demoData'
import type { CompanyProfile } from '@/types'

export const companyService = {
  async getPublic(): Promise<CompanyProfile> {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<CompanyProfile>('/api/company-profile')
        return data
      },
      () => demoData.companyProfile(),
    )
  },

  async getAdmin(): Promise<CompanyProfile> {
    const { data } = await api.get<CompanyProfile>('/api/admin/company-profile')
    return data
  },

  async update(payload: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const { data } = await api.put<CompanyProfile>('/api/admin/company-profile', payload)
    return data
  },
}
