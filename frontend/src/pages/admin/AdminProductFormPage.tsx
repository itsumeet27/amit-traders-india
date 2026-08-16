import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/admin/DataTable'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ProductImagesEditor } from '@/components/admin/ProductImagesEditor'
import { LoadingSpinner } from '@/components/ui/Feedback'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { leatherTypeService } from '@/services/leatherTypeService'
import { materialService } from '@/services/materialService'
import type { Category, LookupOption, ProductPayload } from '@/types'
import { getErrorMessage, MIN_ORDER_QUANTITY, slugify } from '@/utils'
import { useToast } from '@/context/ToastContext'

const blank: ProductPayload = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  categoryId: 0,
  material: '',
  leatherType: '',
  colors: '',
  dimensions: '',
  customization: '',
  branding: '',
  manufacturingInfo: '',
  minimumOrderQuantity: MIN_ORDER_QUANTITY,
  featured: false,
  active: true,
  images: [],
}

export function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { push } = useToast()
  const [form, setForm] = useState<ProductPayload>(blank)
  const [categories, setCategories] = useState<Category[]>([])
  const [leatherTypes, setLeatherTypes] = useState<LookupOption[]>([])
  const [materials, setMaterials] = useState<LookupOption[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      categoryService.getAdmin(),
      leatherTypeService.getAdmin(),
      materialService.getAdmin(),
    ])
      .then(([categoryList, leatherTypeList, materialList]) => {
        setCategories(categoryList)
        setLeatherTypes(leatherTypeList)
        setMaterials(materialList)
      })
      .catch(() => {
        setCategories([])
        setLeatherTypes([])
        setMaterials([])
      })
  }, [])

  useEffect(() => {
    if (!id) return
    productService
      .getById(Number(id))
      .then((product) => {
        const sortedImages = [...(product.images || [])].sort(
          (a, b) => a.displayOrder - b.displayOrder,
        )
        setForm({
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          categoryId: product.categoryId,
          material: product.material || '',
          leatherType: product.leatherType || '',
          colors: product.colors || '',
          dimensions: product.dimensions || '',
          customization: product.customization || '',
          branding: product.branding || '',
          manufacturingInfo: product.manufacturingInfo || '',
          minimumOrderQuantity: product.minimumOrderQuantity,
          featured: product.featured,
          active: product.active,
          images: sortedImages.map((img, index) => ({
            imageUrl: img.imageUrl,
            altText: img.altText || product.name,
            displayOrder: index,
          })),
        })
      })
      .catch((error) => {
        push(getErrorMessage(error), 'error')
        navigate('/admin/products')
      })
      .finally(() => setLoading(false))
  }, [id, navigate, push])

  function update<K extends keyof ProductPayload>(key: K, value: ProductPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      push('Name is required', 'error')
      return
    }
    if (!form.categoryId) {
      push('Category is required', 'error')
      return
    }
    setSaving(true)
    const images = (form.images || []).map((image, index) => ({
      ...image,
      altText: image.altText || form.name,
      displayOrder: index,
    }))
    const payload: ProductPayload = {
      ...form,
      slug: form.slug || slugify(form.name),
      images,
    }
    try {
      if (isEdit && id) {
        await productService.update(Number(id), payload)
        push('Product updated', 'success')
      } else {
        await productService.create(payload)
        push('Product created', 'success')
      }
      navigate('/admin/products')
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  function buildSelectOptions(options: LookupOption[], currentValue?: string | null) {
    const names = options.map((option) => option.name)
    const merged = currentValue && !names.includes(currentValue) ? [currentValue, ...names] : names
    return [
      { label: 'Select…', value: '' },
      ...merged.map((name) => ({ label: name, value: name })),
    ]
  }

  if (loading) return <LoadingSpinner />

  return (
    <>
      <Seo title={isEdit ? 'Edit Product' : 'New Product'} path="/admin/products/form" noIndex />
      <PageHeader
        title={isEdit ? 'Edit product' : 'New product'}
        description="Catalog products appear on the public storefront without fixed prices."
      />

      <form
        onSubmit={onSubmit}
        className="max-w-3xl space-y-5 border border-light-tan/70 bg-off-white p-6"
      >
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => {
            update('name', e.target.value)
            if (!isEdit) update('slug', slugify(e.target.value))
          }}
        />
        <Input label="Slug" value={form.slug || ''} onChange={(e) => update('slug', e.target.value)} />
        <Select
          label="Category"
          required
          value={form.categoryId || ''}
          placeholder="Select category"
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          onChange={(e) => update('categoryId', Number(e.target.value))}
        />
        <Textarea
          label="Short description"
          value={form.shortDescription || ''}
          onChange={(e) => update('shortDescription', e.target.value)}
        />
        <Textarea
          label="Full description"
          value={form.description || ''}
          onChange={(e) => update('description', e.target.value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Leather type"
            value={form.leatherType || ''}
            options={buildSelectOptions(leatherTypes, form.leatherType)}
            onChange={(e) => update('leatherType', e.target.value)}
          />
          <Select
            label="Material"
            value={form.material || ''}
            options={buildSelectOptions(materials, form.material)}
            onChange={(e) => update('material', e.target.value)}
          />
          <Input
            label="Colors"
            value={form.colors || ''}
            onChange={(e) => update('colors', e.target.value)}
          />
          <Input
            label="Dimensions"
            value={form.dimensions || ''}
            onChange={(e) => update('dimensions', e.target.value)}
          />
          <Input
            label="MOQ"
            type="number"
            min={MIN_ORDER_QUANTITY}
            value={form.minimumOrderQuantity ?? MIN_ORDER_QUANTITY}
            onChange={(e) => update('minimumOrderQuantity', Number(e.target.value))}
          />
        </div>
        <Textarea
          label="Customization"
          value={form.customization || ''}
          onChange={(e) => update('customization', e.target.value)}
        />
        <Textarea
          label="Branding"
          value={form.branding || ''}
          onChange={(e) => update('branding', e.target.value)}
        />
        <Textarea
          label="Manufacturing info"
          value={form.manufacturingInfo || ''}
          onChange={(e) => update('manufacturingInfo', e.target.value)}
        />
        <ProductImagesEditor
          images={form.images || []}
          onChange={(images) => update('images', images)}
          altTextFallback={form.name || 'Product image'}
          folder="products"
        />
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-deep">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => update('featured', e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-deep">
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => update('active', e.target.checked)}
            />
            Active
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  )
}
