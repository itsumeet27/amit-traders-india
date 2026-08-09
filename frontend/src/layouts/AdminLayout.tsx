import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  Users,
  Inbox,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { authService } from '@/services/authService'
import clsx from 'clsx'
import { Button } from '@/components/ui/Button'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/company', label: 'Company Profile', icon: Building2 },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const username = authService.getUsername() || 'Admin'

  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  function logout() {
    authService.logout()
    navigate('/admin/login')
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-primary text-cream">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="font-display text-2xl">Amit Traders</p>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Admin CMS</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 text-sm transition',
                  isActive ? 'bg-white/10 text-gold' : 'text-light-tan hover:bg-white/5 hover:text-cream',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 px-2 py-2 text-sm text-light-tan hover:text-cream"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-cream/40 lg:flex">
      <div className="hidden lg:block">{sidebar}</div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/50"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-72">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-light-tan/70 bg-off-white/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-primary lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-sm text-leather">Signed in as</p>
              <p className="font-medium text-primary">{username}</p>
            </div>
          </div>
          <Button to="/" variant="outline" size="sm">
            View site
          </Button>
        </header>
        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
