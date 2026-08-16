import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, X, ZoomIn } from 'lucide-react'
import clsx from 'clsx'
import { SafeImage } from '@/components/ui/SafeImage'
import type { ProductImage } from '@/types'
import { resolveMediaUrl } from '@/utils'

const MAX_VISIBLE_THUMBNAILS = 5

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const sorted = useMemo(
    () => [...images].sort((a, b) => a.displayOrder - b.displayOrder),
    [images],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [thumbWindowStart, setThumbWindowStart] = useState(0)
  const thumbListRef = useRef<HTMLDivElement>(null)

  const activeImage = sorted[activeIndex]
  const activeUrl = resolveMediaUrl(activeImage?.imageUrl)
  const hasMultiple = sorted.length > 1
  const hiddenBefore = thumbWindowStart
  const hiddenAfter = Math.max(0, sorted.length - (thumbWindowStart + MAX_VISIBLE_THUMBNAILS))

  useEffect(() => {
    setActiveIndex(0)
    setThumbWindowStart(0)
  }, [images])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setActiveIndex((prev) => Math.min(prev + 1, sorted.length - 1))
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, sorted.length])

  useEffect(() => {
    if (activeIndex < thumbWindowStart) {
      setThumbWindowStart(activeIndex)
      return
    }
    if (activeIndex >= thumbWindowStart + MAX_VISIBLE_THUMBNAILS) {
      setThumbWindowStart(activeIndex - MAX_VISIBLE_THUMBNAILS + 1)
    }
  }, [activeIndex, thumbWindowStart])

  const visibleThumbnails = sorted.slice(
    thumbWindowStart,
    thumbWindowStart + MAX_VISIBLE_THUMBNAILS,
  )

  function selectImage(index: number) {
    setActiveIndex(index)
  }

  function shiftThumbnails(direction: -1 | 1) {
    setThumbWindowStart((prev) => {
      const next = prev + direction
      return Math.max(0, Math.min(next, Math.max(0, sorted.length - MAX_VISIBLE_THUMBNAILS)))
    })
  }

  if (!sorted.length) {
    return (
      <SafeImage
        src=""
        alt={productName}
        aspect="aspect-square"
        className="shadow-[0_24px_60px_-30px_rgba(59,36,24,0.45)]"
      />
    )
  }

  return (
    <>
      <div className="flex gap-3 sm:gap-4">
        {hasMultiple ? (
          <div className="flex w-16 shrink-0 flex-col sm:w-20">
            {hiddenBefore > 0 ? (
              <button
                type="button"
                onClick={() => shiftThumbnails(-1)}
                className="mb-2 flex h-8 items-center justify-center border border-light-tan/70 bg-off-white text-leather hover:border-gold"
                aria-label="Show earlier images"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            ) : null}

            <div ref={thumbListRef} className="flex flex-col gap-2">
              {visibleThumbnails.map((image) => {
                const index = sorted.findIndex((item) => item.id === image.id)
                const url = resolveMediaUrl(image.imageUrl)
                const isActive = index === activeIndex
                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => selectImage(index)}
                    className={clsx(
                      'overflow-hidden rounded-sm border-2 bg-off-white transition-colors',
                      isActive ? 'border-gold' : 'border-light-tan/70 hover:border-tan',
                    )}
                    aria-label={`View image ${index + 1} of ${sorted.length}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <SafeImage
                      src={url}
                      alt={image.altText || `${productName} image ${index + 1}`}
                      aspect="aspect-square"
                      imgClassName="object-contain bg-off-white p-1"
                    />
                  </button>
                )
              })}
            </div>

            {hiddenAfter > 0 ? (
              <button
                type="button"
                onClick={() => shiftThumbnails(1)}
                className="mt-2 flex h-10 items-center justify-center border border-light-tan/70 bg-off-white text-sm font-medium text-leather hover:border-gold"
                aria-label={`Show ${hiddenAfter} more images`}
              >
                +{hiddenAfter}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative block w-full text-left"
            aria-label="Open full-size image"
          >
            <SafeImage
              src={activeUrl}
              alt={activeImage?.altText || productName}
              aspect="aspect-square"
              className="shadow-[0_24px_60px_-30px_rgba(59,36,24,0.45)]"
              imgClassName="object-contain bg-off-white"
            />
            <span className="absolute right-3 top-3 rounded-full bg-charcoal/55 p-2 text-cream opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
            </span>
          </button>
          <p className="mt-3 text-center text-xs text-leather">Click to see full view</p>
        </div>
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/85 p-4">
          <button
            type="button"
            aria-label="Close full view"
            className="absolute inset-0"
            onClick={() => setLightboxOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 text-cream hover:text-gold"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={activeUrl}
              alt={activeImage?.altText || productName}
              className="mx-auto max-h-[80vh] w-full object-contain"
            />
            {hasMultiple ? (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                  className="rounded border border-cream/30 px-3 py-1 text-sm text-cream disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-cream/80">
                  {activeIndex + 1} / {sorted.length}
                </span>
                <button
                  type="button"
                  disabled={activeIndex === sorted.length - 1}
                  onClick={() => setActiveIndex((prev) => Math.min(prev + 1, sorted.length - 1))}
                  className="rounded border border-cream/30 px-3 py-1 text-sm text-cream disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
