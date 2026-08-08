import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { companyService } from '@/services/companyService'
import { categoryService } from '@/services/categoryService'
import type { Category, CompanyProfile } from '@/types'

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

  return (
    <footer className="border-t border-light-tan/70 bg-primary text-cream">
      <div className="container-wide grid gap-10 px-5 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="font-display text-3xl text-cream">Amit Traders India</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-light-tan">
            {company?.tagline ||
              'Premium genuine leather products and custom manufacturing for global B2B partners.'}
          </p>
        </div>

        <div>
          <h3 className="font-display text-xl text-gold">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-light-tan">
            <li>
              <Link to="/about" className="hover:text-cream">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/custom-manufacturing" className="hover:text-cream">
                Custom Manufacturing
              </Link>
            </li>
            <li>
              <Link to="/clients" className="hover:text-cream">
                Clients
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/quote" className="hover:text-cream">
                Request Quote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl text-gold">Products</h3>
          <ul className="mt-4 space-y-2 text-sm text-light-tan">
            {categories.length ? (
              categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="hover:text-cream">
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link to="/products" className="hover:text-cream">
                  View all products
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl text-gold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-light-tan">
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
          <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-gold">
            {company?.linkedin ? (
              <a href={company.linkedin} target="_blank" rel="noreferrer" className="hover:text-cream">
                LinkedIn
              </a>
            ) : null}
            {company?.instagram ? (
              <a
                href={company.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cream"
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-light-tan/80 md:px-8">
        © {year} Amit Traders India. All rights reserved. Genuine leather manufacturing · Mumbai.
      </div>
    </footer>
  )
}
