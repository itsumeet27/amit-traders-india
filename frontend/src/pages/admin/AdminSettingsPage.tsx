import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/admin/DataTable'
import { authService } from '@/services/authService'

export function AdminSettingsPage() {
  const username = authService.getUsername() || 'admin'

  return (
    <>
      <Seo title="Admin Settings" path="/admin/settings" noIndex />
      <PageHeader
        title="Settings"
        description="Account and environment notes for the CMS."
      />

      <div className="max-w-2xl space-y-6 border border-light-tan/70 bg-off-white p-6">
        <div>
          <h2 className="font-display text-2xl text-primary">Signed-in profile</h2>
          <p className="mt-2 text-sm text-leather">
            You are signed in as <span className="font-medium text-primary">{username}</span>.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-primary">Password</h2>
          <p className="mt-2 text-sm leading-relaxed text-leather">
            Password changes are managed on the server. Update credentials via environment
            configuration or your deployment secrets store, then sign out and sign back in.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-primary">API</h2>
          <p className="mt-2 text-sm text-leather">
            Frontend API base URL:{' '}
            <code className="bg-cream px-1.5 py-0.5 text-primary">
              {import.meta.env.VITE_API_BASE_URL || '(same origin / proxy)'}
            </code>
          </p>
        </div>
      </div>
    </>
  )
}
