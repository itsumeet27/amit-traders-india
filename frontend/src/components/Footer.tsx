import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SocialLinks } from '@/components/SocialLinks'
import { companyService } from '@/services/companyService'
import { categoryService } from '@/services/categoryService'
import type { Category, CompanyProfile } from '@/types'

const FOOTER_CATEGORIES = [
  { label: 'Executive Bags', slug: 'executive-bags-travel' },
  { label: 'Leather Accessories', slug: 'leather-accessories' },
  { label: 'Corporate Combos', slug: 'corporate-combos' },
  { label: 'Festive & Event Solutions', slug: 'festive-corporate-events' },
]

export function Footer() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    companyService
      .getPublic()
      .then(setCompany)
      .catch(() => setCompany(null))
    categoryService
      .getPublic()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const year = new Date().getFullYear()
  const categoryLinks = categories.length
    ? categories.slice(0, 4).map((c) => ({ label: c.name, slug: c.slug }))
    : FOOTER_CATEGORIES

  return (
    <footer className="border-t border-light-tan/70 bg-primary text-cream">
      <div className="container-wide grid gap-10 px-5 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="font-display text-3xl text-cream">Amit Traders</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-light-tan">
            {company?.description ||
              'Mumbai-based manufacturer of genuine leather goods, executive accessories, and customized bulk corporate gift solutions for enterprises across India.'}
          </p>
          <SocialLinks className="mt-5" variant="light" />
        </div>

        <div>
          <h3 className="font-display text-xl text-gold">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-light-tan">
            <li>
              <Link to="/" className="hover:text-cream">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-cream">
                About
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-cream">
                Products
              </Link>
            </li>
            <li>
              <Link to="/custom-gifting" className="hover:text-cream">
                Custom Gifting
              </Link>
            </li>
            <li>
              <Link to="/why-choose-us" className="hover:text-cream">
                Why Choose Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl text-gold">Product Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-light-tan">
            {categoryLinks.map((cat) => (
              <li key={cat.slug}>
                <Link to={`/products?category=${cat.slug}`} className="hover:text-cream">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl text-gold">Need a Bulk Quote?</h3>
          <p className="mt-4 text-sm text-light-tan">
            Request a catalog, physical samples, and personalized quotation for orders from 50 units.
          </p>
          <div className="mt-5">
            <Button to="/quote" variant="secondary" size="sm">
              Request a Quote
            </Button>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-light-tan">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {company?.address || 'Mumbai, Maharashtra'}
                {company?.city ? `, ${company.city}` : ', India'}
              </span>
            </li>
            {company?.phone ? (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${company.phone}`} className="hover:text-cream">
                  {company.phone}
                </a>
              </li>
            ) : null}
            {company?.email ? (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${company.email}`} className="hover:text-cream">
                  {company.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-light-tan/80 md:px-8">
        <p>© {year} Amit Traders India. All rights reserved.</p>
        <p className="mt-2">
          <Link to="/contact" className="hover:text-cream">
            Privacy Policy
          </Link>
          <span className="mx-2">·</span>
          <Link to="/contact" className="hover:text-cream">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </footer>
  )
}
