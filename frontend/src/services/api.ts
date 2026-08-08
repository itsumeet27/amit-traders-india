import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
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
      if (path.startsWith('/admin') && !path.includes('/admin/login')) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        window.location.assign('/admin/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
