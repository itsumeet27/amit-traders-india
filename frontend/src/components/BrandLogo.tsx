import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

type BrandLogoProps = {
  /** Full wordmark for header; icon-only for favicon-sized spaces */
  variant?: 'full' | 'icon'
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
      'h-12 max-w-[10.5rem] sm:h-[3.35rem] sm:max-w-[12.5rem] md:h-14 md:max-w-[14.5rem]',
  },
  icon: {
    png: '/brand/logo-icon.png',
    webp: '/brand/logo-icon.webp',
    alt: 'Amit Traders',
    className: 'h-9 w-9',
  },
} as const

function TextFallback({ compact }: { compact?: boolean }) {
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
      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.22em] text-gold">
        Genuine Leather · Mumbai
      </span>
    </>
  )
}

export function BrandLogo({
  variant = 'full',
  className,
  to = '/',
  onClick,
}: BrandLogoProps) {
  const asset = ASSETS[variant]
  const [broken, setBroken] = useState(false)

  const image = !broken ? (
    <picture>
      <source srcSet={asset.webp} type="image/webp" />
      <img
        src={asset.png}
        alt={asset.alt}
        className={clsx(
          'block w-auto object-contain object-left transition-opacity duration-300 group-hover:opacity-90',
          asset.className,
          className,
        )}
        decoding="async"
        fetchPriority="high"
        onError={() => setBroken(true)}
      />
    </picture>
  ) : (
    <TextFallback compact={variant === 'icon'} />
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="group min-w-0 text-left">
        {image}
      </button>
    )
  }

  return (
    <Link to={to} className="group min-w-0 shrink-0" aria-label="Amit Traders India — Home">
      {image}
    </Link>
  )
}
