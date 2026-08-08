import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/admin/DataTable'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { adminService } from '@/services/adminService'
import { enquiryService } from '@/services/enquiryService'
import type { DashboardStats, Enquiry } from '@/types'
import { formatDate, getErrorMessage } from '@/utils'
import { Package, Tags, Users, Inbox } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.allSettled([
      adminService.getDashboard(),
      enquiryService.getAdmin({ size: 8, page: 0 }),
    ])
      .then(([statsRes, enquiriesRes]) => {
        if (statsRes.status === 'fulfilled') setStats(statsRes.value)
        else setError(getErrorMessage(statsRes.reason))
        if (enquiriesRes.status === 'fulfilled') setRecent(enquiriesRes.value.content)
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Products', value: stats?.totalProducts ?? 0, icon: Package, to: '/admin/products' },
    { label: 'Categories', value: stats?.totalCategories ?? 0, icon: Tags, to: '/admin/categories' },
    { label: 'Clients', value: stats?.totalClients ?? 0, icon: Users, to: '/admin/clients' },
    { label: 'New enquiries', value: stats?.newEnquiries ?? 0, icon: Inbox, to: '/admin/enquiries' },
  ]

  return (
    <>
      <Seo title="Admin Dashboard" path="/admin" noIndex />
      <PageHeader
        title="Dashboard"
        description="Overview of catalog health and recent buyer enquiries."
      />

      {loading ? (
        <LoadingSpinner />
      ) : error && !stats ? (
        <EmptyState title="Unable to load dashboard" description={error} />
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.label}
                  to={card.to}
                  className="border border-light-tan/70 bg-off-white p-5 transition hover:border-tan"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.16em] text-leather">{card.label}</p>
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <p className="mt-3 font-display text-4xl text-primary">{card.value}</p>
                </Link>
              )
            })}
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="border border-light-tan/70 bg-off-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-leather">Active products</p>
              <p className="mt-2 font-display text-3xl text-primary">{stats?.activeProducts ?? 0}</p>
            </div>
            <div className="border border-light-tan/70 bg-off-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-leather">In progress</p>
              <p className="mt-2 font-display text-3xl text-primary">
                {stats?.inProgressEnquiries ?? 0}
              </p>
            </div>
            <div className="border border-light-tan/70 bg-off-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-leather">Converted</p>
              <p className="mt-2 font-display text-3xl text-primary">
                {stats?.convertedEnquiries ?? 0}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl text-primary">Recent enquiries</h2>
            <Button to="/admin/enquiries" variant="outline" size="sm">
              View all
            </Button>
          </div>
          {recent.length ? (
            <DataTable headers={['Date', 'Company', 'Contact', 'Qty', 'Status', '']}>
              {recent.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3 text-leather">{formatDate(enquiry.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-primary">
                    {enquiry.companyName || '—'}
                  </td>
                  <td className="px-4 py-3 text-leather">{enquiry.fullName}</td>
                  <td className="px-4 py-3">{enquiry.quantity}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={enquiry.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/enquiries/${enquiry.id}`}
                      className="text-sm text-gold hover:text-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <EmptyState
              title="No recent enquiries"
              description="New buyer requests will appear here."
            />
          )}
        </>
      )}
    </>
  )
}
