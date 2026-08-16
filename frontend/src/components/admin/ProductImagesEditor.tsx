import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Star, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SafeImage } from '@/components/ui/SafeImage'
import { adminService } from '@/services/adminService'
import type { ProductImagePayload } from '@/types'
import { getErrorMessage, resolveMediaUrl } from '@/utils'
import { useToast } from '@/context/ToastContext'

interface ProductImagesEditorProps {
  images: ProductImagePayload[]
  onChange: (images: ProductImagePayload[]) => void
  altTextFallback?: string
  folder?: string
}

function withDisplayOrder(images: ProductImagePayload[]): ProductImagePayload[] {
  return images.map((image, index) => ({ ...image, displayOrder: index }))
}

export function ProductImagesEditor({
  images,
  onChange,
  altTextFallback = 'Product image',
  folder = 'products',
}: ProductImagesEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const { push } = useToast()

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const asset = await adminService.uploadMedia(file, folder)
      onChange(
        withDisplayOrder([
          ...images,
          {
            imageUrl: asset.url,
            altText: altTextFallback,
            displayOrder: images.length,
          },
        ]),
      )
      push('Image uploaded', 'success')
    } catch (error) {
      push(getErrorMessage(error, 'Upload failed'), 'error')
    } finally {
      setUploading(false)
    }
  }

  function setPrimary(index: number) {
    if (index <= 0) return
    const next = [...images]
    const [selected] = next.splice(index, 1)
    if (!selected) return
    next.unshift(selected)
    onChange(withDisplayOrder(next))
  }

  function removeImage(index: number) {
    onChange(withDisplayOrder(images.filter((_, i) => i !== index)))
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    const current = next[index]
    const swap = next[target]
    if (!current || !swap) return
    next[index] = swap
    next[target] = current
    onChange(withDisplayOrder(next))
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-deep">Product images</p>
        <p className="mt-1 text-xs text-leather">
          The first image is the primary image shown in listings. Add more images for the product
          gallery on the detail page. Uploaded images are stored securely in the database so they
          persist across server restarts.
        </p>
      </div>

      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => {
            const isPrimary = index === 0
            return (
              <div
                key={`${image.imageUrl}-${index}`}
                className="border border-light-tan/70 bg-cream/30 p-3"
              >
                <div className="relative">
                  <SafeImage
                    src={resolveMediaUrl(image.imageUrl)}
                    alt={image.altText || altTextFallback}
                    aspect="aspect-square"
                  />
                  {isPrimary ? (
                    <span className="absolute left-2 top-2 bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream">
                      Primary
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!isPrimary ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPrimary(index)}
                    >
                      <Star className="mr-1 h-3.5 w-3.5" />
                      Set primary
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => moveImage(index, -1)}
                    aria-label="Move image up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, 1)}
                    aria-label="Move image down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-800" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border border-dashed border-tan/60 bg-cream/40 px-4 py-8 text-center text-sm text-leather">
          No images yet. Upload a primary product image to get started.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading…' : images.length ? 'Add another image' : 'Upload primary image'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleUpload(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
