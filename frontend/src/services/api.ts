import axios from 'axios'
import { getApiBaseUrl } from '@/config'

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
  // Render free tier cold starts can take 30–60s
  timeout: 90000,
})

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl()
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
      const adminPrefix = `${base}/admin`
      if (path.startsWith(adminPrefix) && !path.includes('/admin/login')) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        window.location.assign(`${base}/admin/login`)
      }
    }
    return Promise.reject(error)
  },
)

export default api
