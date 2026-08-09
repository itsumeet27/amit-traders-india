import { Helmet } from 'react-helmet-async'
import { getSiteUrl } from '@/config'

interface SeoProps {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

const SITE = 'Amit Traders India'
const DEFAULT_DESC =
  'Premium genuine leather products and custom B2B manufacturing from Mumbai, India.'

export function Seo({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image,
  noIndex = false,
}: SeoProps) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | Premium Genuine Leather`
  const origin = getSiteUrl() || (typeof window !== 'undefined' ? window.location.origin : '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${origin}${base}${normalizedPath === '/' ? '/' : normalizedPath}`
  const ogImage = image?.startsWith('http')
    ? image
    : image
      ? `${origin}${image.startsWith('/') ? image : `/${image}`}`
      : `${origin}${base}/og-default.svg`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
