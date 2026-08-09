import { Link } from 'react-router-dom'
import clsx from 'clsx'

type BrandLogoProps = {
  /** Full wordmark for header/footer; icon-only for compact spaces */
  variant?: 'full' | 'icon'
  className?: string
  to?: string
  onClick?: () => void
}

export function BrandLogo({
  variant = 'full',
  className,
  to = '/',
  onClick,
}: BrandLogoProps) {
  const src = variant === 'icon' ? '/brand/logo-icon.svg' : '/brand/logo.svg'
  const alt =
    variant === 'icon'
      ? 'Amit Traders'
      : 'Amit Traders — Manufacturers and suppliers of leather goods'

  const image = (
    <img
      src={src}
      alt={alt}
      className={clsx(
        'block w-auto object-contain object-left transition-opacity duration-300 group-hover:opacity-90',
        variant === 'icon' ? 'h-9 w-9' : 'h-[3.25rem] max-w-[11.5rem] sm:h-14 sm:max-w-[13.5rem] md:max-w-[15rem]',
        className,
      )}
      decoding="async"
      fetchPriority="high"
    />
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
