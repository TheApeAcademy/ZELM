import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'signal' | 'live' | 'limited' | 'closed'
  className?: string
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-bone-50/8 text-bone-100 border-bone-50/15',
    signal: 'bg-signal-500/15 text-signal-400 border-signal-500/30',
    live: 'bg-live-500/15 text-live-500 border-live-500/30',
    limited: 'bg-limited-500/15 text-limited-500 border-limited-500/30',
    closed: 'bg-closed-500/15 text-closed-500 border-closed-500/30',
  }
  return (
    <span
      className={cn(
        'text-label inline-flex items-center gap-1 rounded-full border px-2.5 py-1',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-signal-500 px-2 py-0.5 text-xs font-semibold text-ink-950',
        className,
      )}
    >
      <Check className="size-3" strokeWidth={3} />
      Verified
    </span>
  )
}
