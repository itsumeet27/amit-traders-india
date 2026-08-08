import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { Select } from '@/components/ui/Select'
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
  const { push } = useToast()

  useEffect(() => {
    setLoading(true)
    enquiryService
      .getAdmin({ size: 100, status: status || undefined })
      .then((page) => setEnquiries(page.content))
      .catch((error) => {
        push(getErrorMessage(error), 'error')
        setEnquiries([])
      })
      .finally(() => setLoading(false))
  }, [status, push])

  return (
    <>
      <Seo title="Admin Enquiries" path="/admin/enquiries" noIndex />
      <PageHeader
        title="Enquiries"
        description="Buyer quote requests from the public website."
        actions={
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
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : enquiries.length ? (
        <DataTable headers={['Date', 'Company', 'Contact', 'Product', 'Qty', 'Status', '']}>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id} className="hover:bg-cream/40">
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
              <td className="px-4 py-3 text-right">
                <Link to={`/admin/enquiries/${enquiry.id}`} className="text-sm text-gold">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState title="No enquiries" description="Submitted quote requests will list here." />
      )}
    </>
  )
}
