import { forwardRef, type SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, className, id, ...props },
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
      <select
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full border bg-off-white px-3.5 py-2.5 text-charcoal transition focus-ring',
          error ? 'border-red-700/50' : 'border-light-tan/80 focus:border-tan',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-800">{error}</span> : null}
    </label>
  )
})
