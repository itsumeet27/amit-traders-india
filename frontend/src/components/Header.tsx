import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BrandLogo } from '@/components/BrandLogo'
import { categoryService } from '@/services/categoryService'
import type { Category } from '@/types'
import clsx from 'clsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/custom-gifting', label: 'Custom Gifting' },
  { to: '/why-choose-us', label: 'Why Choose Us' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    categoryService
      .getPublic()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 border-b border-light-tan/60 bg-brand-bg transition-shadow duration-300',
        scrolled && 'shadow-[0_8px_30px_-18px_rgba(41,37,34,0.35)]',
      )}
    >
      <div className="container-wide flex items-center justify-between gap-4 px-5 py-2.5 md:px-8 md:py-3 lg:px-12">
        <BrandLogo variant="wordmark" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-2 text-sm tracking-wide transition',
                  isActive ? 'text-primary' : 'text-leather hover:text-primary',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button to="/quote" size="sm" className="hidden sm:inline-flex">
            Request a Quote
          </Button>
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-primary lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-light-tan/70 bg-brand-bg lg:hidden">
          <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className="border-b border-light-tan/40 py-3 text-base text-deep"
              >
                {link.label}
              </NavLink>
            ))}
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                onClick={() => setOpen(false)}
                className="border-b border-light-tan/40 py-3 pl-3 text-sm text-leather"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button to="/quote" className="w-full" onClick={() => setOpen(false)}>
                Request a Quote
              </Button>
              <a
                href="tel:+912200000000"
                className="mt-3 inline-flex items-center gap-2 text-sm text-leather"
              >
                <Phone className="h-4 w-4" /> Talk to our team
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
