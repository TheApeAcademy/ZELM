import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { searchAccounts, type DiscoveryFilters } from '@/lib/api'
import { ROLE_LABEL, AVAILABILITY_LABEL, type ProfessionalRole, type AvailabilityStatus } from '@/lib/types'
import { IdentityTile } from './IdentityTile'

const ROLES = Object.keys(ROLE_LABEL) as ProfessionalRole[]
const AVAILABILITIES = Object.keys(AVAILABILITY_LABEL) as AvailabilityStatus[]

export function DiscoverPage() {
  const [kind, setKind] = useState<'person' | 'brand' | undefined>(undefined)
  const [role, setRole] = useState<string | undefined>(undefined)
  const [availability, setAvailability] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  const filters: DiscoveryFilters = { kind, role, availability, query, location }
  const { data, isLoading, isError } = useQuery({
    queryKey: ['discover', filters],
    queryFn: () => searchAccounts(filters),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-display mb-1 text-3xl text-bone-50">Discover</h1>
      <p className="mb-8 text-sm text-bone-500">
        People, brands and the work connecting them.
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-bone-500" />
          <Input
            className="pl-10"
            placeholder="Search name or username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Input
          className="sm:w-48"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={kind === undefined} onClick={() => setKind(undefined)}>
          Everyone
        </FilterChip>
        <FilterChip active={kind === 'person'} onClick={() => setKind('person')}>
          Talent
        </FilterChip>
        <FilterChip active={kind === 'brand'} onClick={() => setKind('brand')}>
          Brands
        </FilterChip>
        <span className="mx-1 w-px self-stretch bg-bone-50/10" />
        {ROLES.map((r) => (
          <FilterChip key={r} active={role === r} onClick={() => setRole(role === r ? undefined : r)}>
            {ROLE_LABEL[r]}
          </FilterChip>
        ))}
        <span className="mx-1 w-px self-stretch bg-bone-50/10" />
        {AVAILABILITIES.map((a) => (
          <FilterChip
            key={a}
            active={availability === a}
            onClick={() => setAvailability(availability === a ? undefined : a)}
          >
            {AVAILABILITY_LABEL[a]}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((account) => (
            <IdentityTile key={account.id} account={account} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={Search}
          title="Couldn't reach ZELM"
          description="Check your connection and try again."
        />
      ) : (
        <EmptyState
          icon={Search}
          title="Nobody matches yet"
          description="Try a broader search, or check back as more of the world joins ZELM."
        />
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-label rounded-full border px-3 py-1.5 transition-colors',
        active
          ? 'border-signal-500 bg-signal-500/15 text-signal-400'
          : 'border-bone-50/12 text-bone-400 hover:border-bone-50/25',
      )}
    >
      {children}
    </button>
  )
}
