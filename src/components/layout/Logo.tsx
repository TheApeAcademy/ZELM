import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('text-display text-xl font-medium tracking-tight text-bone-50', className)}>
      ZELM
    </span>
  )
}
