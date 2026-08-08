import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { EnquiryForm } from '@/components/enquiry/EnquiryForm'
import { companyService } from '@/services/companyService'
import type { CompanyProfile } from '@/types'
import { Mail, MapPin, Phone } from 'lucide-react'

export function ContactPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    companyService
      .getPublic()
      .then(setCompany)
      .catch(() => setCompany(null))
  }, [])

  return (
    <>
      <Seo
        title="Contact"
        description="Contact Amit Traders India in Mumbai for genuine leather product enquiries and custom manufacturing."
        path="/contact"
      />

      <section className="border-b border-light-tan/60 bg-cream/40">
        <div className="container-wide px-5 py-14 md:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Contact</p>
          <h1 className="mt-3 font-display text-5xl text-primary">Talk to our team</h1>
          <p className="mt-4 max-w-2xl text-leather">
            Reach us for catalog enquiries, sampling, or custom manufacturing discussions.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-primary">Mumbai office</h2>
            <ul className="space-y-4 text-leather">
              <li className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 text-gold" />
                <span>
                  {company?.address || 'Mumbai, Maharashtra, India'}
                  {company?.city ? (
                    <>
                      <br />
                      {company.city}
                      {company.state ? `, ${company.state}` : ''}
                    </>
                  ) : null}
                </span>
              </li>
              {company?.phone ? (
                <li className="flex gap-3">
                  <Phone className="mt-1 h-5 w-5 text-gold" />
                  <a href={`tel:${company.phone}`} className="hover:text-primary">
                    {company.phone}
                  </a>
                </li>
              ) : null}
              {company?.email ? (
                <li className="flex gap-3">
                  <Mail className="mt-1 h-5 w-5 text-gold" />
                  <a href={`mailto:${company.email}`} className="hover:text-primary">
                    {company.email}
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="text-sm text-leather/80">
              Prefer a structured brief? Use the quote form — minimum order quantity is 50 units.
            </p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  )
}
