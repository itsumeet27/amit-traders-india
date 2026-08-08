import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { productService } from '@/services/productService'
import type { Product } from '@/types'
import { getErrorMessage, getPrimaryImage } from '@/utils'
import { useToast } from '@/context/ToastContext'
import { SafeImage } from '@/components/ui/SafeImage'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { push } = useToast()

  async function load() {
    setLoading(true)
    try {
      const page = await productService.getAdmin({ size: 100 })
      setProducts(page.content)
    } catch (error) {
      push(getErrorMessage(error), 'error')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function confirmDelete() {
    if (deleteId == null) return
    setDeleting(true)
    try {
      await productService.remove(deleteId)
      push('Product deleted', 'success')
      setDeleteId(null)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Seo title="Admin Products" path="/admin/products" noIndex />
      <PageHeader
        title="Products"
        description="Manage catalog products shown on the public site."
        actions={
          <Button to="/admin/products/new" size="sm">
            Add product
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : products.length ? (
        <DataTable headers={['', 'Name', 'Category', 'MOQ', 'Featured', 'Active', '']}>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-cream/40">
              <td className="px-4 py-3">
                <SafeImage
                  src={getPrimaryImage(product.images)}
                  alt={product.name}
                  aspect="aspect-square"
                  className="h-12 w-12"
                />
              </td>
              <td className="px-4 py-3 font-medium text-primary">{product.name}</td>
              <td className="px-4 py-3 text-leather">{product.categoryName || '—'}</td>
              <td className="px-4 py-3">{product.minimumOrderQuantity}</td>
              <td className="px-4 py-3">{product.featured ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3">{product.active ? 'Yes' : 'No'}</td>
              <td className="space-x-3 px-4 py-3 text-right text-sm">
                <Link to={`/admin/products/${product.id}`} className="text-gold hover:text-primary">
                  Edit
                </Link>
                <button
                  type="button"
                  className="text-red-800 hover:underline"
                  onClick={() => setDeleteId(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No products yet"
          description="Create your first catalog product."
          action={
            <Button to="/admin/products/new" variant="outline">
              Add product
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={deleteId != null}
        title="Delete product"
        message="This will permanently remove the product from the catalog."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
