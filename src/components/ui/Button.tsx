import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-signal-500 text-ink-950 hover:bg-signal-400 active:bg-signal-600',
  secondary:
    'bg-transparent text-bone-50 border border-bone-50/25 hover:border-bone-50/50 hover:bg-bone-50/5',
  ghost: 'bg-transparent text-bone-100 hover:bg-bone-50/8',
  danger: 'bg-closed-500 text-bone-50 hover:opacity-90',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight',
    'transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
  },
)
Button.displayName = 'Button'
