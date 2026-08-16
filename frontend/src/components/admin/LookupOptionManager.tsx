import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/components/ui/Button'
import type { LookupOption } from '@/types'
import { getErrorMessage } from '@/utils'
import { useToast } from '@/context/ToastContext'

interface LookupOptionManagerProps {
  title: string
  description: string
  options: LookupOption[]
  onAdd: (name: string) => Promise<void>
  onRemove: (id: number) => Promise<void>
}

const fieldClassName =
  'w-full border border-light-tan/80 bg-off-white px-3.5 py-2.5 text-charcoal placeholder:text-leather/50 transition focus-ring focus:border-tan'

export function LookupOptionManager({
  title,
  description,
  options,
  onAdd,
  onRemove,
}: LookupOptionManagerProps) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const { push } = useToast()

  async function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) {
      push('Enter a name first', 'error')
      return
    }
    setSaving(true)
    try {
      await onAdd(trimmed)
      setName('')
      push(`${title} added`, 'success')
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(id: number) {
    setRemovingId(id)
    try {
      await onRemove(id)
      push(`${title} removed`, 'success')
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="border border-light-tan/70 bg-off-white p-4">
      <p className="text-sm font-medium text-deep">{title}</p>
      <p className="mt-1 text-xs text-leather">{description}</p>

      <div className="mt-4 border-t border-light-tan/60 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leather">
          Currently added ({options.length})
        </p>
        <div className="mt-2 flex min-h-[2.5rem] flex-wrap gap-2">
          {options.length ? (
            options.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center gap-1.5 border border-light-tan/80 bg-cream/50 px-2.5 py-1.5 text-sm text-primary"
              >
                {option.name}
                <button
                  type="button"
                  className="text-leather hover:text-red-800 disabled:opacity-50"
                  aria-label={`Remove ${option.name}`}
                  title={`Remove ${option.name}`}
                  disabled={removingId === option.id}
                  onClick={() => void handleRemove(option.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-leather">No {title.toLowerCase()} added yet.</span>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-light-tan/60 pt-4">
        <label className="block text-sm font-medium text-deep" htmlFor={`add-${title}`}>
          Add {title.toLowerCase()}
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id={`add-${title}`}
            type="text"
            value={name}
            placeholder={`New ${title.toLowerCase()}`}
            className={clsx(fieldClassName, 'min-w-0 flex-1')}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void handleAdd()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            className="h-[42px] shrink-0 px-4"
            onClick={() => void handleAdd()}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
