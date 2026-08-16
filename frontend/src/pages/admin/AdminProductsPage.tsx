import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { LookupOptionManager } from '@/components/admin/LookupOptionManager'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { leatherTypeService } from '@/services/leatherTypeService'
import { materialService } from '@/services/materialService'
import type { Category, LookupOption, Product } from '@/types'
import { getErrorMessage, getPrimaryImage } from '@/utils'
import { useToast } from '@/context/ToastContext'
import { SafeImage } from '@/components/ui/SafeImage'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [leatherTypes, setLeatherTypes] = useState<LookupOption[]>([])
  const [materials, setMaterials] = useState<LookupOption[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [leatherTypeFilter, setLeatherTypeFilter] = useState('')
  const [materialFilter, setMaterialFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<number | null>(null)
  const { push } = useToast()

  const hasFilters = Boolean(categoryFilter || leatherTypeFilter || materialFilter)

  const loadLookups = useCallback(async () => {
    try {
      const [categoryList, leatherTypeList, materialList] = await Promise.all([
        categoryService.getAdmin(),
        leatherTypeService.getAdmin(),
        materialService.getAdmin(),
      ])
      setCategories(categoryList)
      setLeatherTypes(leatherTypeList)
      setMaterials(materialList)
    } catch (error) {
      push(getErrorMessage(error), 'error')
    }
  }, [push])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await productService.getAdmin({
        size: 100,
        category: categoryFilter ? Number(categoryFilter) : undefined,
        leatherType: leatherTypeFilter || undefined,
        material: materialFilter || undefined,
      })
      setProducts(page.content)
      setSelectedIds(new Set())
    } catch (error) {
      push(getErrorMessage(error), 'error')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, leatherTypeFilter, materialFilter, push])

  useEffect(() => {
    void loadLookups()
  }, [loadLookups])

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

  function clearFilters() {
    setCategoryFilter('')
    setLeatherTypeFilter('')
    setMaterialFilter('')
  }

  async function toggleFeatured(product: Product) {
    const next = !product.featured
    setTogglingFeaturedId(product.id)
    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? { ...item, featured: next } : item)),
    )
    try {
      await productService.setFeatured(product.id, next)
      push(next ? 'Product marked as featured' : 'Product removed from featured', 'success')
    } catch (error) {
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, featured: !next } : item)),
      )
      push(getErrorMessage(error), 'error')
    } finally {
      setTogglingFeaturedId(null)
    }
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
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <LookupOptionManager
              title="Leather types"
              description="Manage leather types used in product filters and the product form."
              options={leatherTypes}
              onAdd={async (name) => {
                const created = await leatherTypeService.create(name)
                setLeatherTypes((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder))
              }}
              onRemove={async (id) => {
                await leatherTypeService.remove(id)
                setLeatherTypes((prev) => prev.filter((item) => item.id !== id))
                if (leatherTypes.find((item) => item.id === id)?.name === leatherTypeFilter) {
                  setLeatherTypeFilter('')
                }
              }}
            />
            <LookupOptionManager
              title="Materials"
              description="Manage materials used in product filters and the product form."
              options={materials}
              onAdd={async (name) => {
                const created = await materialService.create(name)
                setMaterials((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder))
              }}
              onRemove={async (id) => {
                await materialService.remove(id)
                setMaterials((prev) => prev.filter((item) => item.id !== id))
                if (materials.find((item) => item.id === id)?.name === materialFilter) {
                  setMaterialFilter('')
                }
              }}
            />
          </div>

          <div className="mb-4 grid gap-4 md:grid-cols-3">
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
            <Select
              label="Filter by leather type"
              value={leatherTypeFilter}
              options={[
                { label: 'All leather types', value: '' },
                ...leatherTypes.map((option) => ({
                  label: option.name,
                  value: option.name,
                })),
              ]}
              onChange={(e) => setLeatherTypeFilter(e.target.value)}
            />
            <Select
              label="Filter by material"
              value={materialFilter}
              options={[
                { label: 'All materials', value: '' },
                ...materials.map((option) => ({
                  label: option.name,
                  value: option.name,
                })),
              ]}
              onChange={(e) => setMaterialFilter(e.target.value)}
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
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Mark ${product.name} as featured`}
                      checked={product.featured}
                      disabled={togglingFeaturedId === product.id}
                      onChange={() => void toggleFeatured(product)}
                    />
                  </td>
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
              title={hasFilters ? 'No products match these filters' : 'No products yet'}
              description={
                hasFilters
                  ? 'Try different filters or add a product that matches.'
                  : 'Create your first catalog product.'
              }
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
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
