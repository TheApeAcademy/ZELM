import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export function AppScreen({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-1 text-sm text-bone-500 hover:text-bone-100">
          <ChevronLeft className="size-4" />
          My ZELM
        </Link>
        {action}
      </div>
      <h1 className="text-display mb-6 text-2xl text-bone-50">{title}</h1>
      {children}
    </div>
  )
}
