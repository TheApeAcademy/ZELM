import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-bone-50/10 bg-ink-900/60 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}
