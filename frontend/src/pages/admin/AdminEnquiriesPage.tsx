import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { enquiryService } from '@/services/enquiryService'
import type { Enquiry, EnquiryStatus } from '@/types'
import { formatDate, getErrorMessage } from '@/utils'
import { useToast } from '@/context/ToastContext'

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { push } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await enquiryService.getAdmin({ size: 100, status: status || undefined })
      setEnquiries(page.content)
      setSelectedIds(new Set())
    } catch (error) {
      push(getErrorMessage(error), 'error')
      setEnquiries([])
    } finally {
      setLoading(false)
    }
  }, [status, push])

  useEffect(() => {
    void load()
  }, [load])

  const allSelected = useMemo(
    () => enquiries.length > 0 && selectedIds.size === enquiries.length,
    [enquiries, selectedIds],
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
    else setSelectedIds(new Set(enquiries.map((e) => e.id)))
  }

  async function confirmDelete() {
    if (!deleteIds?.length) return
    setDeleting(true)
    try {
      if (deleteIds.length === 1) {
        await enquiryService.remove(deleteIds[0])
        push('Enquiry deleted', 'success')
      } else {
        const result = await enquiryService.removeBulk(deleteIds)
        if (result.failed.length) {
          push(
            `Deleted ${result.deletedCount}. ${result.failed.length} failed: ${result.failed
              .map((f) => `#${f.id} (${f.reason})`)
              .join('; ')}`,
            result.deletedCount ? 'success' : 'error',
          )
        } else {
          push(`Deleted ${result.deletedCount} enquiries`, 'success')
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
      <Seo title="Admin Enquiries" path="/admin/enquiries" noIndex />
      <PageHeader
        title="Enquiries"
        description="Buyer quote requests from the public website."
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
            <Select
              value={status}
              className="min-w-44"
              options={[
                { label: 'All statuses', value: '' },
                { label: 'New', value: 'NEW' },
                { label: 'Contacted', value: 'CONTACTED' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'Quoted', value: 'QUOTED' },
                { label: 'Converted', value: 'CONVERTED' },
                { label: 'Closed', value: 'CLOSED' },
                { label: 'Rejected', value: 'REJECTED' },
              ]}
              onChange={(e) => setStatus(e.target.value)}
            />
          </>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : enquiries.length ? (
        <DataTable
          headers={[
            <input
              key="select-all"
              type="checkbox"
              aria-label="Select all enquiries"
              checked={allSelected}
              onChange={toggleAll}
            />,
            'Date',
            'Company',
            'Contact',
            'Product',
            'Qty',
            'Status',
            '',
          ]}
        >
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id} className="hover:bg-cream/40">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label={`Select enquiry ${enquiry.id}`}
                  checked={selectedIds.has(enquiry.id)}
                  onChange={() => toggleOne(enquiry.id)}
                />
              </td>
              <td className="px-4 py-3 text-leather">{formatDate(enquiry.createdAt)}</td>
              <td className="px-4 py-3 font-medium text-primary">
                {enquiry.companyName || '—'}
              </td>
              <td className="px-4 py-3">
                <div>{enquiry.fullName}</div>
                <div className="text-xs text-leather">{enquiry.email}</div>
              </td>
              <td className="px-4 py-3 text-leather">
                {enquiry.productName || enquiry.productType}
              </td>
              <td className="px-4 py-3">{enquiry.quantity}</td>
              <td className="px-4 py-3">
                <StatusBadge status={enquiry.status as EnquiryStatus} />
              </td>
              <td className="space-x-3 px-4 py-3 text-right text-sm">
                <Link to={`/admin/enquiries/${enquiry.id}`} className="text-gold">
                  Open
                </Link>
                <button
                  type="button"
                  className="text-red-800 hover:underline"
                  onClick={() => setDeleteIds([enquiry.id])}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState title="No enquiries" description="Submitted quote requests will list here." />
      )}

      <ConfirmDialog
        open={deleteIds != null}
        title={deleteCount > 1 ? `Delete ${deleteCount} enquiries` : 'Delete enquiry'}
        message={
          deleteCount > 1
            ? 'This will permanently remove the selected enquiry form details.'
            : 'This will permanently remove this enquiry form details.'
        }
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteIds(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
