import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/context/ToastContext'
import { ToastViewport } from '@/components/ui/ToastViewport'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ProductsPage } from '@/pages/public/ProductsPage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { CorporateGiftingPage } from '@/pages/public/CorporateGiftingPage'
import { WhyChooseUsPage } from '@/pages/public/WhyChooseUsPage'
import { ClientsPage } from '@/pages/public/ClientsPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { QuotePage } from '@/pages/public/QuotePage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminClientsPage } from '@/pages/admin/AdminClientsPage'
import { AdminCompanyProfilePage } from '@/pages/admin/AdminCompanyProfilePage'
import { AdminEnquiriesPage } from '@/pages/admin/AdminEnquiriesPage'
import { AdminEnquiryDetailPage } from '@/pages/admin/AdminEnquiryDetailPage'
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

export default function App() {
  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || undefined

  return (
    <HelmetProvider>
      <ToastProvider>
        <BrowserRouter basename={basename}>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="custom-gifting" element={<CorporateGiftingPage />} />
              <Route path="custom-manufacturing" element={<CorporateGiftingPage />} />
              <Route path="why-choose-us" element={<WhyChooseUsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="quote" element={<QuotePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductFormPage />} />
              <Route path="products/:id" element={<AdminProductFormPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="clients" element={<AdminClientsPage />} />
              <Route path="company" element={<AdminCompanyProfilePage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="enquiries/:id" element={<AdminEnquiryDetailPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastViewport />
      </ToastProvider>
    </HelmetProvider>
  )
}
