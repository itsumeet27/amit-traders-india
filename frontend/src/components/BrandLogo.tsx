import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

type BrandLogoProps = {
  /** Full stacked logo; wordmark for header text; icon for favicon-sized spaces */
  variant?: 'full' | 'wordmark' | 'icon'
  /** Horizontal alignment of the logo image */
  align?: 'left' | 'center'
  className?: string
  to?: string
  onClick?: () => void
}

const ASSETS = {
  full: {
    png: '/brand/logo.png',
    webp: '/brand/logo.webp',
    alt: 'Amit Traders — Manufacturers and suppliers of leather goods',
    className:
      'h-14 max-w-[11rem] sm:h-16 sm:max-w-[13rem] md:h-[4.25rem] md:max-w-[15rem]',
  },
  wordmark: {
    png: '/brand/logo-wordmark.png',
    webp: '/brand/logo-wordmark.webp',
    alt: 'Amit Traders — Genuine leather manufacturers and suppliers',
    className:
      'h-12 max-w-[11.5rem] sm:h-[3.35rem] sm:max-w-[13rem] md:h-14 md:max-w-[15rem]',
  },
  icon: {
    png: '/brand/logo-icon.png',
    alt: 'Amit Traders',
    className: 'h-10 w-10',
  },
} as const

function TextFallback({ compact, showTagline = true }: { compact?: boolean; showTagline?: boolean }) {
  if (compact) {
    return (
      <span className="font-display text-xl font-semibold tracking-tight text-primary">AT</span>
    )
  }
  return (
    <>
      <span className="font-display text-2xl font-semibold tracking-tight text-primary md:text-[1.7rem]">
        Amit Traders India
      </span>
      {showTagline ? (
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.22em] text-gold md:text-[11px]">
          Genuine Leather · Mumbai
        </span>
      ) : null}
    </>
  )
}

export function BrandLogo({
  variant = 'full',
  align = 'left',
  className,
  to = '/',
  onClick,
}: BrandLogoProps) {
  const asset = ASSETS[variant]
  const [broken, setBroken] = useState(false)

  const imgClassName = clsx(
    'block w-auto object-contain transition-opacity duration-300 group-hover:opacity-90',
    align === 'center' ? 'mx-auto object-center' : 'object-left',
    asset.className,
    className,
  )

  const image = !broken ? (
    'webp' in asset ? (
      <picture>
        <source srcSet={asset.webp} type="image/webp" />
        <img
          src={asset.png}
          alt={asset.alt}
          className={imgClassName}
          decoding="async"
          fetchPriority="high"
          onError={() => setBroken(true)}
        />
      </picture>
    ) : (
      <img
        src={asset.png}
        alt={asset.alt}
        className={imgClassName}
        decoding="async"
        fetchPriority="high"
        onError={() => setBroken(true)}
      />
    )
  ) : (
    <TextFallback compact={variant === 'icon'} showTagline={variant !== 'icon'} />
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx('group min-w-0', align === 'center' ? 'text-center' : 'text-left')}
      >
        {image}
      </button>
    )
  }

  return (
    <Link
      to={to}
      className={clsx(
        'group min-w-0 shrink-0',
        align === 'center' ? 'mx-auto text-center' : '',
      )}
      aria-label="Amit Traders India — Home"
    >
      {image}
    </Link>
  )
}
