import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { enquiryService } from '@/services/enquiryService'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import type { Category, EnquiryRequest, Product, ProductType } from '@/types'
import { getErrorMessage, MIN_ORDER_QUANTITY } from '@/utils'
import { RFQ_PRODUCT_OPTIONS } from '@/content/siteContent'
import { CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const empty: EnquiryRequest = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  website: '',
  productType: 'EXISTING',
  productCategory: '',
  productName: '',
  quantity: MIN_ORDER_QUANTITY,
  leatherType: '',
  preferredColor: '',
  customizationRequirements: '',
  brandingRequirements: '',
  additionalRequirements: '',
  message: '',
}

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [params] = useSearchParams()
  const [form, setForm] = useState<EnquiryRequest>(empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [file, setFile] = useState<File | null>(null)
  const [productInterests, setProductInterests] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    categoryService
      .getPublic()
      .then(setCategories)
      .catch(() => setCategories([]))
    productService
      .getPublic({ size: 100 })
      .then((page) => setProducts(page.content))
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    const productSlug = params.get('product')
    const productName = params.get('name')
    if (productSlug || productName) {
      setForm((prev) => ({
        ...prev,
        productType: 'EXISTING',
        productName: productName || prev.productName,
      }))
    }
  }, [params])

  useEffect(() => {
    const productSlug = params.get('product')
    if (!productSlug || !products.length) return
    const match = products.find((p) => p.slug === productSlug)
    if (match) {
      setSelectedProductId(match.id)
      setForm((prev) => ({
        ...prev,
        productName: match.name,
        productCategory: match.categoryName || prev.productCategory,
      }))
    }
  }, [params, products])

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.name })),
    [categories],
  )

  const productOptions = useMemo(() => {
    const filtered = form.productCategory
      ? products.filter((p) => p.categoryName === form.productCategory)
      : products
    return filtered.map((p) => ({ label: p.name, value: p.id }))
  }, [products, form.productCategory])

  function update<K extends keyof EnquiryRequest>(key: K, value: EnquiryRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    if (!form.companyName?.trim()) next.companyName = 'Company name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Valid email is required'
    }
    if (!form.phone?.trim()) next.phone = 'Phone / WhatsApp is required'
    if (!form.quantity || form.quantity < MIN_ORDER_QUANTITY) {
      next.quantity = `Minimum order quantity is ${MIN_ORDER_QUANTITY} units.`
    }
    if (form.productType === 'CUSTOM' && !form.productName?.trim()) {
      next.productName = 'Please describe the custom product'
    }
    if (form.productType === 'EXISTING' && !form.productName?.trim() && productInterests.length === 0) {
      next.productName = 'Select a product interest or name a product'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload: EnquiryRequest = {
        ...form,
        website: form.website || undefined,
        companyName: form.companyName || undefined,
        productName:
          form.productName ||
          (productInterests.length ? productInterests.join('; ') : undefined),
        additionalRequirements: [
          productInterests.length ? `Product interests: ${productInterests.join(', ')}` : '',
          form.additionalRequirements || '',
        ]
          .filter(Boolean)
          .join('\n'),
      }
      await enquiryService.submit(payload, file)
      setSuccess(true)
      setForm(empty)
      setSelectedProductId('')
      setProductInterests([])
      setFile(null)
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Unable to submit enquiry. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="border border-gold/40 bg-cream/60 px-6 py-12 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
        <h3 className="mt-4 font-display text-3xl text-primary">Enquiry received</h3>
        <p className="mx-auto mt-3 max-w-md text-leather">
          Thank you. Our team will review your requirements and respond with next steps shortly.
        </p>
        <Button className="mt-6" onClick={() => setSuccess(false)}>
          Submit another enquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-8 ${compact ? '' : ''}`} noValidate>
      <fieldset className="space-y-4">
        <legend className="font-display text-2xl text-primary">Contact information</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full name"
            name="fullName"
            required
            value={form.fullName}
            error={errors.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />
          <Input
            label="Company / organization name"
            name="companyName"
            required
            value={form.companyName || ''}
            error={errors.companyName}
            onChange={(e) => update('companyName', e.target.value)}
          />
          <Input
            label="Official email address"
            name="email"
            type="email"
            required
            value={form.email}
            error={errors.email}
            onChange={(e) => update('email', e.target.value)}
          />
          <Input
            label="Phone / WhatsApp number"
            name="phone"
            required
            value={form.phone || ''}
            error={errors.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
          <Input
            label="Country"
            name="country"
            value={form.country || ''}
            hint="Optional"
            onChange={(e) => update('country', e.target.value)}
          />
          <Input
            label="City"
            name="city"
            value={form.city || ''}
            hint="Optional"
            onChange={(e) => update('city', e.target.value)}
          />
          <Input
            label="Website"
            name="website"
            value={form.website || ''}
            onChange={(e) => update('website', e.target.value)}
            hint="Optional"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl text-primary">Product interest</legend>
        <p className="text-sm text-leather">Select all product categories relevant to your enquiry.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {RFQ_PRODUCT_OPTIONS.map((option) => {
            const selected = productInterests.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setProductInterests((prev) =>
                    selected ? prev.filter((item) => item !== option) : [...prev, option],
                  )
                }
                className={clsx(
                  'border px-4 py-3 text-left text-sm transition',
                  selected
                    ? 'border-primary bg-primary text-cream'
                    : 'border-light-tan/70 bg-off-white text-leather hover:border-tan',
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl text-primary">Order details</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Product type"
            name="productType"
            required
            value={form.productType}
            options={[
              { label: 'Existing product', value: 'EXISTING' },
              { label: 'Custom manufacturing', value: 'CUSTOM' },
            ]}
            onChange={(e) => update('productType', e.target.value as ProductType)}
          />
          <Select
            label="Category"
            name="productCategory"
            value={form.productCategory || ''}
            placeholder="Select category"
            options={categoryOptions}
            onChange={(e) => update('productCategory', e.target.value)}
          />
          {form.productType === 'EXISTING' ? (
            <Select
              label="Product"
              name="productId"
              value={selectedProductId}
              placeholder="Select product"
              options={productOptions}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : ''
                setSelectedProductId(id)
                const selected = products.find((p) => p.id === id)
                if (selected) {
                  update('productName', selected.name)
                  update('productCategory', selected.categoryName || form.productCategory)
                }
              }}
            />
          ) : (
            <Input
              label="Custom product name"
              name="productName"
              required
              value={form.productName || ''}
              error={errors.productName}
              onChange={(e) => update('productName', e.target.value)}
            />
          )}
          {form.productType === 'EXISTING' && errors.productName ? (
            <p className="text-xs text-red-800 md:col-span-2">{errors.productName}</p>
          ) : null}
          <Input
            label="Estimated order quantity"
            name="quantity"
            type="number"
            min={MIN_ORDER_QUANTITY}
            required
            value={form.quantity}
            error={errors.quantity}
            hint={`Minimum order quantity is ${MIN_ORDER_QUANTITY} units.`}
            onChange={(e) => update('quantity', Number(e.target.value))}
          />
          <Input
            label="Leather type"
            name="leatherType"
            value={form.leatherType || ''}
            onChange={(e) => update('leatherType', e.target.value)}
          />
          <Input
            label="Preferred color"
            name="preferredColor"
            value={form.preferredColor || ''}
            onChange={(e) => update('preferredColor', e.target.value)}
          />
          <Input
            label="Specific customization / branding requirements"
            name="customizationRequirements"
            value={form.customizationRequirements || ''}
            onChange={(e) => update('customizationRequirements', e.target.value)}
          />
        </div>
        <Textarea
          label="Additional requirements"
          name="additionalRequirements"
          value={form.additionalRequirements || ''}
          onChange={(e) => update('additionalRequirements', e.target.value)}
        />
        <Textarea
          label="Message"
          name="message"
          value={form.message || ''}
          onChange={(e) => update('message', e.target.value)}
        />
        <label className="block space-y-1.5 text-left">
          <span className="text-sm font-medium text-deep">Reference file (optional)</span>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
            className="block w-full text-sm text-leather file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-cream"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </fieldset>

      {submitError ? (
        <p className="border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-900">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Request a Quote'}
      </Button>
    </form>
  )
}
