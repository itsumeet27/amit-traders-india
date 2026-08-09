import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/authService'
import { isDemoMode } from '@/services/demoData'
import { getErrorMessage } from '@/utils'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (authService.isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.login({ email, password })
      navigate('/admin')
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          isDemoMode()
            ? 'Admin CMS requires a live API. This GitHub Pages demo serves the public site only.'
            : 'Invalid credentials',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo title="Admin Login" path="/admin/login" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md border border-light-tan/70 bg-off-white p-8 shadow-[0_30px_80px_-40px_rgba(59,36,24,0.4)]">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Amit Traders India</p>
          <h1 className="mt-2 font-display text-4xl text-primary">Admin sign in</h1>
          <p className="mt-2 text-sm text-leather">Manage products, enquiries, and company content.</p>
          {isDemoMode() ? (
            <p className="mt-4 border border-tan/40 bg-cream px-3 py-2 text-sm text-deep">
              GitHub Pages hosts the public website in demo mode. Point{' '}
              <code className="text-xs">VITE_API_BASE_URL</code> at a deployed Spring Boot API to
              enable admin login.
            </p>
          ) : null}
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? (
              <p className="border border-red-800/20 bg-red-50 px-3 py-2 text-sm text-red-900">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
