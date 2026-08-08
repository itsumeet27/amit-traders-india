import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ApiStatusBanner, ApiStatusProvider } from '@/components/ApiStatusBanner'

export function PublicLayout() {
  return (
    <ApiStatusProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <ApiStatusBanner />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ApiStatusProvider>
  )
}
