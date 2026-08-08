export interface ProductImage {
  id: number
  imageUrl: string
  altText?: string | null
  displayOrder: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  displayOrder: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: number
  categoryId: number
  categoryName?: string | null
  categorySlug?: string | null
  name: string
  slug: string
  shortDescription?: string | null
  description?: string | null
  material?: string | null
  leatherType?: string | null
  colors?: string | null
  dimensions?: string | null
  customization?: string | null
  branding?: string | null
  manufacturingInfo?: string | null
  minimumOrderQuantity: number
  featured: boolean
  active: boolean
  images: ProductImage[]
  createdAt?: string
  updatedAt?: string
}

export interface Client {
  id: number
  companyName: string
  logoUrl?: string | null
  description?: string | null
  displayOrder: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface WhyChooseItem {
  title: string
  description: string
  icon?: string
}

export interface TimelineStep {
  title: string
  description: string
  order?: number
}

export interface FeatureItem {
  title: string
  description?: string
}

export interface CompanyProfile {
  id: number
  companyName: string
  tagline?: string | null
  description?: string | null
  history?: string | null
  mission?: string | null
  vision?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  website?: string | null
  linkedin?: string | null
  instagram?: string | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImageUrl?: string | null
  heroCtaPrimary?: string | null
  heroCtaSecondary?: string | null
  aboutImageUrl?: string | null
  whyChooseUsJson?: string | WhyChooseItem[] | null
  manufacturingStepsJson?: string | TimelineStep[] | null
  customManufacturingTitle?: string | null
  customManufacturingDescription?: string | null
  customManufacturingFeaturesJson?: string | FeatureItem[] | null
  ctaTitle?: string | null
  ctaSubtitle?: string | null
  updatedAt?: string
}

export type EnquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'QUOTED'
  | 'CONVERTED'
  | 'CLOSED'
  | 'REJECTED'

export type ProductType = 'EXISTING' | 'CUSTOM'

export interface EnquiryRequest {
  fullName: string
  companyName?: string
  email: string
  phone?: string
  country?: string
  city?: string
  website?: string
  productType: ProductType
  productCategory?: string
  productName?: string
  quantity: number
  leatherType?: string
  preferredColor?: string
  customizationRequirements?: string
  brandingRequirements?: string
  additionalRequirements?: string
  message?: string
}

export interface Enquiry extends EnquiryRequest {
  id: number
  status: EnquiryStatus
  attachmentUrl?: string | null
  createdAt: string
  updatedAt?: string
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  featuredProducts: number
  totalCategories: number
  totalClients: number
  totalEnquiries: number
  newEnquiries: number
  inProgressEnquiries: number
  convertedEnquiries: number
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface AuthResponse {
  token: string
  type?: string
  expiresIn?: number
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface MediaAsset {
  id: number
  filename: string
  originalFilename?: string | null
  url: string
  contentType?: string | null
  sizeBytes?: number | null
  folder?: string | null
  createdAt?: string
}

export interface ProductImagePayload {
  imageUrl: string
  altText?: string
  displayOrder?: number
}

export interface ProductPayload {
  categoryId: number
  name: string
  slug?: string
  shortDescription?: string
  description?: string
  material?: string
  leatherType?: string
  colors?: string
  dimensions?: string
  customization?: string
  branding?: string
  manufacturingInfo?: string
  minimumOrderQuantity?: number
  featured?: boolean
  active?: boolean
  images?: ProductImagePayload[]
}

export interface CategoryPayload {
  name: string
  slug?: string
  description?: string
  imageUrl?: string
  displayOrder?: number
  active?: boolean
}

export interface ClientPayload {
  companyName: string
  logoUrl?: string
  description?: string
  displayOrder?: number
  active?: boolean
}

export interface EnquiryStatusUpdate {
  status: EnquiryStatus
}

export interface ApiError {
  message?: string
  errors?: Record<string, string>
  status?: number
  timestamp?: string
}
