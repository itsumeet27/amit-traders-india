import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import { resolveMediaUrl } from '@/utils'

interface SafeImageProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt: string
  className?: string
  imgClassName?: string
  aspect?: string
}

export function SafeImage({
  src,
  alt,
  className,
  imgClassName,
  aspect = 'aspect-[4/3]',
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const resolved = resolveMediaUrl(src)
  const showImage = Boolean(resolved) && !failed

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div className={clsx('relative overflow-hidden leather-placeholder', aspect, className)} {...rest}>
      {showImage ? (
        <img
          src={resolved}
          alt={alt}
          className={clsx(
            'h-full w-full object-cover transition-transform duration-700 ease-out',
            imgClassName,
          )}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-end p-4">
          <span className="font-display text-lg text-cream/80">{alt}</span>
        </div>
      )}
    </div>
  )
}

export function SectionReveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode
  className?: string
  delayMs?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        className,
      )}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
