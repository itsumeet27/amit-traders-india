import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SafeImage } from '@/components/ui/SafeImage'
import { adminService } from '@/services/adminService'
import { getErrorMessage } from '@/utils'
import { useToast } from '@/context/ToastContext'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  folder?: string
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  folder = 'gallery',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const { push } = useToast()

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const asset = await adminService.uploadMedia(file, folder)
      onChange(asset.url)
      push('Image uploaded', 'success')
    } catch (error) {
      push(getErrorMessage(error, 'Upload failed'), 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-deep">{label}</p>
      {value ? (
        <div className="relative max-w-sm">
          <SafeImage src={value} alt={label} aspect="aspect-video" />
          <button
            type="button"
            className="absolute right-2 top-2 bg-charcoal/70 p-1.5 text-cream"
            onClick={() => onChange('')}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full max-w-sm flex-col items-center justify-center gap-2 border border-dashed border-tan/60 bg-cream/50 px-4 py-10 text-leather hover:border-leather"
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm">{uploading ? 'Uploading…' : 'Click to upload'}</span>
        </button>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {value ? 'Replace' : 'Choose file'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
