import { useEffect, useRef, useState } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { SafeImage } from '@/components/ui/SafeImage'
import { adminService } from '@/services/adminService'
import type { MediaAsset } from '@/types'
import { formatDate, getErrorMessage, resolveMediaUrl } from '@/utils'
import { useToast } from '@/context/ToastContext'
import { Upload } from 'lucide-react'

export function AdminMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { push } = useToast()

  async function load() {
    setLoading(true)
    try {
      setMedia(await adminService.getMedia())
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onUpload(file: File) {
    setUploading(true)
    try {
      await adminService.uploadMedia(file)
      push('Media uploaded', 'success')
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setUploading(false)
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return
    setDeleting(true)
    try {
      await adminService.deleteMedia(deleteId)
      push('Media deleted', 'success')
      setDeleteId(null)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Seo title="Admin Media" path="/admin/media" noIndex />
      <PageHeader
        title="Media library"
        description="Upload images for products, categories, and company pages."
        actions={
          <>
            <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void onUpload(file)
                e.target.value = ''
              }}
            />
          </>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : media.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <article key={item.id} className="border border-light-tan/70 bg-off-white">
              <SafeImage src={item.url} alt={item.filename} aspect="aspect-video" />
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-primary">{item.filename}</p>
                <p className="text-xs text-leather">{formatDate(item.createdAt)}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      void navigator.clipboard.writeText(resolveMediaUrl(item.url))
                      push('URL copied', 'info')
                    }}
                  >
                    Copy URL
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteId(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No media yet" description="Upload images to use across the CMS." />
      )}

      <ConfirmDialog
        open={deleteId != null}
        title="Delete media"
        message="This file will be removed from storage if supported by the API."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
