import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

type BrandLogoProps = {
  /** Full wordmark for header; icon-only for compact spaces */
  variant?: 'full' | 'icon'
  className?: string
  to?: string
  onClick?: () => void
}

const ASSETS = {
  full: {
    src: '/brand/logo.png',
    alt: 'Amit Traders — Manufacturers and suppliers of leather goods',
    className:
      'h-14 max-w-[11rem] sm:h-16 sm:max-w-[13rem] md:h-[4.25rem] md:max-w-[15rem]',
  },
  icon: {
    src: '/brand/logo-icon.png',
    alt: 'Amit Traders',
    className: 'h-10 w-10',
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
    <img
      src={asset.src}
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
