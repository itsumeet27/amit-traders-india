import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/admin/DataTable'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { enquiryService } from '@/services/enquiryService'
import type { Enquiry, EnquiryStatus } from '@/types'
import { formatDate, getErrorMessage, resolveMediaUrl } from '@/utils'
import { useToast } from '@/context/ToastContext'

export function AdminEnquiryDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [status, setStatus] = useState<EnquiryStatus>('NEW')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    enquiryService
      .getById(Number(id))
      .then((data) => {
        setEnquiry(data)
        setStatus(data.status)
      })
      .catch((error) => {
        push(getErrorMessage(error), 'error')
        navigate('/admin/enquiries')
      })
      .finally(() => setLoading(false))
  }, [id, navigate, push])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await enquiryService.updateStatus(Number(id), { status })
      setEnquiry(updated)
      push('Enquiry updated', 'success')
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!enquiry) {
    return (
      <EmptyState title="Enquiry not found" action={<Button to="/admin/enquiries">Back</Button>} />
    )
  }

  return (
    <>
      <Seo title={`Enquiry #${enquiry.id}`} path={`/admin/enquiries/${enquiry.id}`} noIndex />
      <PageHeader
        title={`Enquiry #${enquiry.id}`}
        description={`Received ${formatDate(enquiry.createdAt)}`}
        actions={
          <Button to="/admin/enquiries" variant="outline" size="sm">
            Back to list
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 border border-light-tan/70 bg-off-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-primary">
              {enquiry.companyName || enquiry.fullName}
            </h2>
            <StatusBadge status={enquiry.status} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-leather">Contact</dt>
              <dd className="font-medium text-primary">{enquiry.fullName}</dd>
            </div>
            <div>
              <dt className="text-leather">Email</dt>
              <dd>
                <a href={`mailto:${enquiry.email}`} className="text-primary hover:underline">
                  {enquiry.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-leather">Phone</dt>
              <dd>{enquiry.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-leather">Location</dt>
              <dd>
                {[enquiry.city, enquiry.country].filter(Boolean).join(', ') || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-leather">Product type</dt>
              <dd>{enquiry.productType}</dd>
            </div>
            <div>
              <dt className="text-leather">Category</dt>
              <dd>{enquiry.productCategory || '—'}</dd>
            </div>
            <div>
              <dt className="text-leather">Product</dt>
              <dd>{enquiry.productName || '—'}</dd>
            </div>
            <div>
              <dt className="text-leather">Quantity</dt>
              <dd>{enquiry.quantity}</dd>
            </div>
            <div>
              <dt className="text-leather">Leather</dt>
              <dd>{enquiry.leatherType || '—'}</dd>
            </div>
            <div>
              <dt className="text-leather">Color</dt>
              <dd>{enquiry.preferredColor || '—'}</dd>
            </div>
            <div>
              <dt className="text-leather">Branding</dt>
              <dd>{enquiry.brandingRequirements || '—'}</dd>
            </div>
          </dl>
          {enquiry.customizationRequirements ? (
            <div>
              <h3 className="font-display text-xl text-primary">Customization</h3>
              <p className="mt-1 text-sm text-leather">{enquiry.customizationRequirements}</p>
            </div>
          ) : null}
          {enquiry.additionalRequirements ? (
            <div>
              <h3 className="font-display text-xl text-primary">Additional requirements</h3>
              <p className="mt-1 text-sm text-leather">{enquiry.additionalRequirements}</p>
            </div>
          ) : null}
          {enquiry.message ? (
            <div>
              <h3 className="font-display text-xl text-primary">Message</h3>
              <p className="mt-1 text-sm text-leather">{enquiry.message}</p>
            </div>
          ) : null}
          {enquiry.attachmentUrl ? (
            <div>
              <h3 className="font-display text-xl text-primary">Attachment</h3>
              <a
                href={resolveMediaUrl(enquiry.attachmentUrl)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-gold hover:text-primary"
              >
                Download file
              </a>
            </div>
          ) : null}
          {enquiry.website ? (
            <p className="text-sm">
              Website:{' '}
              <a
                href={enquiry.website}
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:text-primary"
              >
                {enquiry.website}
              </a>
            </p>
          ) : null}
        </div>

        <form onSubmit={onSave} className="space-y-4 border border-light-tan/70 bg-off-white p-6">
          <h2 className="font-display text-2xl text-primary">Update status</h2>
          <Select
            label="Status"
            value={status}
            options={[
              { label: 'New', value: 'NEW' },
              { label: 'Contacted', value: 'CONTACTED' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Quoted', value: 'QUOTED' },
              { label: 'Converted', value: 'CONVERTED' },
              { label: 'Closed', value: 'CLOSED' },
              { label: 'Rejected', value: 'REJECTED' },
            ]}
            onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
          />
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>
    </>
  )
}
