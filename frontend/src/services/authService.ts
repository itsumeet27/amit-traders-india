import api from './api'
import type { AuthResponse, LoginRequest } from '@/types'

const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, data.name || data.email)
    return data
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    void api.post('/api/auth/logout').catch(() => undefined)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUsername(): string | null {
    return localStorage.getItem(USER_KEY)
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY))
  },
}
