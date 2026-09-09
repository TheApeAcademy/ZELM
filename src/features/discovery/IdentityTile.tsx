import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { AvailabilityPill } from '@/components/ui/AvailabilityDot'
import { mediaUrl } from '@/lib/media'
import { ROLE_LABEL, type DiscoveryAccount } from '@/lib/types'

export function IdentityTile({ account }: { account: DiscoveryAccount }) {
  const roles = account.person_profiles?.roles ?? []
  return (
    <Link
      to={`/${account.username}`}
      className="group block overflow-hidden rounded-2xl border border-bone-50/10 bg-ink-900/40 transition-colors hover:border-bone-50/25"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-800">
        {account.cover_path || account.avatar_path ? (
          <img
            src={mediaUrl(account.cover_path || account.avatar_path)!}
            alt={account.display_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Avatar name={account.display_name} size={56} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-3">
          <p className="truncate text-sm font-medium text-bone-50">{account.display_name}</p>
          <p className="truncate text-xs text-bone-400">
            {account.kind === 'brand'
              ? account.location_city || 'Brand'
              : roles.slice(0, 2).map((r) => ROLE_LABEL[r]).join(' · ') || 'ZELM identity'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="truncate text-xs text-bone-500">
          {[account.location_city, account.location_country].filter(Boolean).join(', ') || '—'}
        </span>
        {account.kind === 'person' && account.person_profiles && (
          <AvailabilityPill status={account.person_profiles.availability} />
        )}
      </div>
    </Link>
  )
}
