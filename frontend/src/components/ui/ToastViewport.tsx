import { useToast } from '@/context/ToastContext'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import clsx from 'clsx'

export function ToastViewport() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(100%,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'pointer-events-auto flex items-start gap-3 border px-4 py-3 shadow-lg animate-[fade-up_0.3s_ease-out]',
            toast.tone === 'success' && 'border-emerald-800/20 bg-off-white text-emerald-900',
            toast.tone === 'error' && 'border-red-800/20 bg-off-white text-red-900',
            toast.tone === 'info' && 'border-tan/40 bg-off-white text-deep',
          )}
          role="status"
        >
          {toast.tone === 'success' ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : null}
          {toast.tone === 'error' ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : null}
          {toast.tone === 'info' ? <Info className="mt-0.5 h-5 w-5 shrink-0" /> : null}
          <p className="flex-1 text-sm leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="text-leather/70 hover:text-primary"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
