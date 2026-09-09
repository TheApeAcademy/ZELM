import { Link } from 'react-router-dom'
import { Handshake } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { VerifiedBadge } from '@/components/ui/Badge'
import { mediaUrl } from '@/lib/media'
import type { CollaborationWithParties } from '@/lib/types'

export function CollaborationsList({
  collaborations,
  perspective,
}: {
  collaborations: CollaborationWithParties[]
  perspective: 'person' | 'brand'
}) {
  if (collaborations.length === 0) {
    return (
      <EmptyState
        icon={Handshake}
        title="Your professional history starts here"
        description="Collaborations you add — and brands verify — build the trust behind your identity."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {collaborations.map((c) => {
        const counterpart = perspective === 'person' ? c.brand : c.person
        return (
          <Link
            key={c.id}
            to={`/${counterpart.username}`}
            className="flex items-start gap-3 rounded-2xl border border-bone-50/10 bg-ink-900/40 p-4 transition-colors hover:border-bone-50/25"
          >
            <Avatar
              src={mediaUrl(counterpart.avatar_path)}
              name={counterpart.display_name}
              size={44}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-bone-50">{c.title}</p>
                {c.status === 'verified' && <VerifiedBadge />}
              </div>
              <p className="mt-0.5 truncate text-xs text-bone-500">
                {counterpart.display_name}
                {c.role && ` · ${c.role}`}
                {c.location && ` · ${c.location}`}
              </p>
              {c.description && (
                <p className="mt-1.5 line-clamp-2 text-xs text-bone-400">{c.description}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
