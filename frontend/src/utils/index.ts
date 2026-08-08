import type { FeatureItem, TimelineStep, WhyChooseItem } from '@/types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  if (url.startsWith('/')) {
    return `${API_BASE}${url}`
  }
  return `${API_BASE}/uploads/${url}`
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseJsonField<T>(value: string | T | null | undefined, fallback: T): T {
  if (value == null) return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function parseWhyChooseUs(
  value: string | WhyChooseItem[] | null | undefined,
): WhyChooseItem[] {
  return parseJsonField<WhyChooseItem[]>(value, [])
}

export function parseTimeline(
  value: string | TimelineStep[] | null | undefined,
): TimelineStep[] {
  return parseJsonField<TimelineStep[]>(value, [])
}

export function parseFeatures(
  value: string | FeatureItem[] | string[] | null | undefined,
): FeatureItem[] {
  const parsed = parseJsonField<FeatureItem[] | string[]>(value, [])
  if (!Array.isArray(parsed)) return []
  return parsed.map((item) =>
    typeof item === 'string' ? { title: item, description: '' } : item,
  )
}

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function getPrimaryImage(
  images?: { imageUrl: string; displayOrder?: number }[] | null,
): string {
  if (!images?.length) return ''
  const sorted = [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  return resolveMediaUrl(sorted[0]?.imageUrl)
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export const MIN_ORDER_QUANTITY = 50

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error || typeof error !== 'object') return fallback
  const err = error as {
    response?: { data?: { message?: string; error?: string } }
    message?: string
  }
  return err.response?.data?.message || err.response?.data?.error || err.message || fallback
}
