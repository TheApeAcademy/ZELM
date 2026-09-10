import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { mediaUrl } from '@/lib/media'
import { fetchOpenCampaigns, type OpportunityFilters } from '@/lib/api'
import { ROLE_LABEL, type ProfessionalRole } from '@/lib/types'

const ROLES = Object.keys(ROLE_LABEL) as ProfessionalRole[]

export function OpportunitiesPage() {
  const [role, setRole] = useState<string | undefined>(undefined)
  const [location, setLocation] = useState('')

  const filters: OpportunityFilters = { role, location }
  const { data, isLoading } = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => fetchOpenCampaigns(filters),
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-display mb-1 text-3xl text-bone-50">Opportunities</h1>
      <p className="mb-8 text-sm text-bone-500">Paid campaigns, editorials and collaborations, open now.</p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          className="sm:w-56"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(role === r ? undefined : r)}
              className={cn(
                'text-label rounded-full border px-3 py-1.5 transition-colors',
                role === r
                  ? 'border-signal-500 bg-signal-500/15 text-signal-400'
                  : 'border-bone-50/12 text-bone-400 hover:border-bone-50/25',
              )}
            >
              {ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((c) => (
            <Link
              key={c.id}
              to={`/opportunities/${c.id}`}
              className="flex items-start gap-4 rounded-2xl border border-bone-50/10 bg-ink-900/40 p-5 transition-colors hover:border-bone-50/25"
            >
              <Avatar src={mediaUrl(c.brand.avatar_path)} name={c.brand.display_name} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-display text-lg text-bone-50">{c.title}</p>
                <p className="text-sm text-bone-500">
                  {c.brand.display_name}
                  {c.location && ` · ${c.location}`}
                  {c.budget_amount && ` · from ${c.budget_amount} ${c.budget_currency}`}
                </p>
                {c.talent_types.length > 0 && (
                  <p className="text-label mt-2 text-signal-400">
                    {c.talent_types.map((t) => ROLE_LABEL[t]).join(' · ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No open campaigns right now"
          description="Brands post paid work here — check back soon, or tell us what you're available for."
        />
      )}
    </div>
  )
}
