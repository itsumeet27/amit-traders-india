import { forwardRef, type InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <label className="block space-y-1.5 text-left">
      {label ? (
        <span className="text-sm font-medium text-deep">
          {label}
          {props.required ? <span className="text-leather"> *</span> : null}
        </span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full border bg-off-white px-3.5 py-2.5 text-charcoal placeholder:text-leather/50 transition focus-ring',
          error ? 'border-red-700/50' : 'border-light-tan/80 focus:border-tan',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-800">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-leather/80">{hint}</span> : null}
    </label>
  )
})
