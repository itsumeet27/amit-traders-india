import { useEffect, useState, type FormEvent } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { categoryService } from '@/services/categoryService'
import type { Category, CategoryPayload } from '@/types'
import { getErrorMessage, slugify } from '@/utils'
import { useToast } from '@/context/ToastContext'

const blank: CategoryPayload = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  displayOrder: 0,
  active: true,
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<CategoryPayload>(blank)
  const [editId, setEditId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  async function load() {
    setLoading(true)
    try {
      setCategories(await categoryService.getAdmin())
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function openCreate() {
    setEditId(null)
    setForm(blank)
    setOpen(true)
  }

  function openEdit(category: Category) {
    setEditId(category.id)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      displayOrder: category.displayOrder ?? 0,
      active: category.active !== false,
    })
    setOpen(true)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    try {
      if (editId != null) await categoryService.update(editId, payload)
      else await categoryService.create(payload)
      push(editId != null ? 'Category updated' : 'Category created', 'success')
      setOpen(false)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return
    setSaving(true)
    try {
      await categoryService.remove(deleteId)
      push('Category deleted', 'success')
      setDeleteId(null)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Seo title="Admin Categories" path="/admin/categories" noIndex />
      <PageHeader
        title="Categories"
        description="Organize the public product catalog."
        actions={
          <Button size="sm" onClick={openCreate}>
            Add category
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : categories.length ? (
        <DataTable headers={['Name', 'Slug', 'Order', 'Active', '']}>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-cream/40">
              <td className="px-4 py-3 font-medium text-primary">{category.name}</td>
              <td className="px-4 py-3 text-leather">{category.slug}</td>
              <td className="px-4 py-3">{category.displayOrder}</td>
              <td className="px-4 py-3">{category.active === false ? 'No' : 'Yes'}</td>
              <td className="space-x-3 px-4 py-3 text-right text-sm">
                <button type="button" className="text-gold" onClick={() => openEdit(category)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-800"
                  onClick={() => setDeleteId(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState title="No categories" description="Create categories for the product filters." />
      )}

      <Modal
        open={open}
        title={editId != null ? 'Edit category' : 'New category'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button form="category-form" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="category-form" className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: editId ? prev.slug : slugify(e.target.value),
              }))
            }
          />
          <Input
            label="Slug"
            value={form.slug || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          />
          <Textarea
            label="Description"
            value={form.description || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <Input
            label="Display order"
            type="number"
            value={form.displayOrder ?? 0}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))
            }
          />
          <ImageUpload
            value={form.imageUrl || ''}
            onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            folder="gallery"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            />
            Active
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId != null}
        title="Delete category"
        message="Products linked to this category may need reassignment."
        confirmLabel="Delete"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
