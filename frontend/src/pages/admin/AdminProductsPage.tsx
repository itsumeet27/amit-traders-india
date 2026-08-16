import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import type { Category, Product } from '@/types'
import { getErrorMessage, getPrimaryImage } from '@/utils'
import { useToast } from '@/context/ToastContext'
import { SafeImage } from '@/components/ui/SafeImage'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { push } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await productService.getAdmin({
        size: 100,
        category: categoryFilter ? Number(categoryFilter) : undefined,
      })
      setProducts(page.content)
      setSelectedIds(new Set())
    } catch (error) {
      push(getErrorMessage(error), 'error')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, push])

  useEffect(() => {
    categoryService
      .getAdmin()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const allSelected = useMemo(
    () => products.length > 0 && selectedIds.size === products.length,
    [products, selectedIds],
  )

  function toggleOne(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(products.map((p) => p.id)))
  }

  async function confirmDelete() {
    if (!deleteIds?.length) return
    setDeleting(true)
    try {
      if (deleteIds.length === 1) {
        await productService.remove(deleteIds[0])
        push('Product deleted', 'success')
      } else {
        const result = await productService.removeBulk(deleteIds)
        if (result.failed.length) {
          push(
            `Deleted ${result.deletedCount}. ${result.failed.length} failed: ${result.failed
              .map((f) => `#${f.id} (${f.reason})`)
              .join('; ')}`,
            result.deletedCount ? 'success' : 'error',
          )
        } else {
          push(`Deleted ${result.deletedCount} products`, 'success')
        }
      }
      setDeleteIds(null)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const deleteCount = deleteIds?.length ?? 0

  return (
    <>
      <Seo title="Admin Products" path="/admin/products" noIndex />
      <PageHeader
        title="Products"
        description="Manage catalog products shown on the public site."
        actions={
          <>
            {selectedIds.size > 0 ? (
              <Button
                size="sm"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-50"
                onClick={() => setDeleteIds([...selectedIds])}
              >
                Delete selected ({selectedIds.size})
              </Button>
            ) : null}
            <Button to="/admin/products/new" size="sm">
              Add product
            </Button>
          </>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-4 max-w-xs">
            <Select
              label="Filter by category"
              value={categoryFilter}
              options={[
                { label: 'All categories', value: '' },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                })),
              ]}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>

          {products.length ? (
            <DataTable
              headers={[
                <input
                  key="select-all"
                  type="checkbox"
                  aria-label="Select all products"
                  checked={allSelected}
                  onChange={toggleAll}
                />,
                '',
                'Name',
                'Category',
                'MOQ',
                'Featured',
                'Active',
                '',
              ]}
            >
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.name}`}
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <SafeImage
                      src={getPrimaryImage(product.images)}
                      alt={product.name}
                      aspect="aspect-square"
                      className="h-12 w-12"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="hover:text-gold hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-leather">{product.categoryName || '—'}</td>
                  <td className="px-4 py-3">{product.minimumOrderQuantity}</td>
                  <td className="px-4 py-3">{product.featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{product.active ? 'Yes' : 'No'}</td>
                  <td className="space-x-3 px-4 py-3 text-right text-sm">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="text-gold hover:text-primary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-red-800 hover:underline"
                      onClick={() => setDeleteIds([product.id])}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <EmptyState
              title={categoryFilter ? 'No products in this category' : 'No products yet'}
              description={
                categoryFilter
                  ? 'Try another category or add a product in this category.'
                  : 'Create your first catalog product.'
              }
              action={
                categoryFilter ? (
                  <Button variant="outline" onClick={() => setCategoryFilter('')}>
                    Clear filter
                  </Button>
                ) : (
                  <Button to="/admin/products/new" variant="outline">
                    Add product
                  </Button>
                )
              }
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteIds != null}
        title={deleteCount > 1 ? `Delete ${deleteCount} products` : 'Delete product'}
        message={
          deleteCount > 1
            ? 'This will permanently remove the selected products from the catalog.'
            : 'This will permanently remove the product from the catalog.'
        }
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteIds(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
