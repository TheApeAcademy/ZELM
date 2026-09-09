import { cn } from '@/lib/cn'
import { AVAILABILITY_LABEL, type AvailabilityStatus } from '@/lib/types'

const dotColor: Record<AvailabilityStatus, string> = {
  available: 'bg-live-500',
  limited: 'bg-limited-500',
  unavailable: 'bg-closed-500',
}

export function AvailabilityPill({ status }: { status: AvailabilityStatus }) {
  return (
    <span className="text-label inline-flex items-center gap-1.5 text-bone-300">
      <span className={cn('size-1.5 rounded-full', dotColor[status])} />
      {AVAILABILITY_LABEL[status]}
    </span>
  )
}
