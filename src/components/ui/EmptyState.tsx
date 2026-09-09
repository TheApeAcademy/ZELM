import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone-50/15 px-6 py-14 text-center">
      <Icon className="size-6 text-bone-500" strokeWidth={1.5} />
      <p className="text-display text-lg text-bone-100">{title}</p>
      {description && <p className="max-w-xs text-sm text-bone-500">{description}</p>}
      {action}
    </div>
  )
}
