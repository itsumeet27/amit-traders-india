import { forwardRef, type TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, className, id, ...props }, ref) {
    const inputId = id || props.name
    return (
      <label className="block space-y-1.5 text-left">
        {label ? (
          <span className="text-sm font-medium text-deep">
            {label}
            {props.required ? <span className="text-leather"> *</span> : null}
          </span>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full min-h-28 border bg-off-white px-3.5 py-2.5 text-charcoal placeholder:text-leather/50 transition focus-ring resize-y',
            error ? 'border-red-700/50' : 'border-light-tan/80 focus:border-tan',
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs text-red-800">{error}</span> : null}
        {!error && hint ? <span className="text-xs text-leather/80">{hint}</span> : null}
      </label>
    )
  },
)
