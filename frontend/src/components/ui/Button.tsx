import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'outline-light' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 focus-ring disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-cream hover:bg-deep shadow-sm hover:shadow-md',
  secondary:
    'bg-gold text-primary hover:brightness-105',
  ghost: 'bg-transparent text-primary hover:bg-cream',
  outline:
    'border border-leather/30 text-primary bg-transparent hover:border-leather hover:bg-cream/70',
  'outline-light':
    'border border-cream/50 bg-cream/15 text-cream hover:border-cream hover:bg-cream/25',
  danger: 'bg-red-800 text-white hover:bg-red-900',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm md:text-base',
  lg: 'px-7 py-3.5 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }

type ButtonAsLink = CommonProps &
  Omit<LinkProps, 'className'> & { to: LinkProps['to'] }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const { variant = 'primary', size = 'md', className, ...rest } = props
  const classes = clsx(base, variants[variant], sizes[size], className)

  if ('to' in rest && rest.to != null) {
    const { to, ...linkRest } = rest as ButtonAsLink
    return <Link to={to} className={classes} {...linkRest} />
  }

  const buttonRest = rest as ButtonAsButton
  return <button ref={ref} className={classes} {...buttonRest} />
})
