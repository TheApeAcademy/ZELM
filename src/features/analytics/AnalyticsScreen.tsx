import { useQuery } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { useAuth } from '@/lib/auth'
import { computeReputation, fetchViewCounts } from '@/lib/api'

const SUBJECT_LABEL: Record<string, string> = {
  profile: 'Profile views',
  card: 'Card views',
  catalog: 'Catalog views',
  product: 'Product views',
  campaign: 'Campaign views',
}

export function AnalyticsScreen() {
  const { account } = useAuth()
  const { data: counts } = useQuery({
    queryKey: ['view-counts', account?.id],
    queryFn: () => fetchViewCounts(account!.id),
    enabled: !!account,
  })
  const { data: reputation } = useQuery({
    queryKey: ['reputation', account?.id],
    queryFn: () => computeReputation(account!.id),
    enabled: !!account,
  })

  if (!account) return null

  const entries = Object.entries(counts ?? {})

  return (
    <AppScreen title="Analytics">
      <p className="text-display mb-3 text-lg text-bone-50">Views</p>
      {entries.length > 0 ? (
        <div className="mb-8 grid grid-cols-2 gap-4">
          {entries.map(([subject, count]) => (
            <div key={subject} className="rounded-2xl border border-bone-50/10 p-4">
              <p className="text-display text-2xl text-bone-50">{count}</p>
              <p className="text-xs text-bone-500">{SUBJECT_LABEL[subject] ?? subject}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-bone-500">No views yet — share your card or profile link.</p>
      )}

      <p className="text-display mb-3 text-lg text-bone-50">Reputation</p>
      {reputation && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-bone-50/10 p-4">
            <p className="text-display text-2xl text-bone-50">{reputation.verifiedCollaborations}</p>
            <p className="text-xs text-bone-500">Verified collaborations</p>
          </div>
          <div className="rounded-2xl border border-bone-50/10 p-4">
            <p className="text-display text-2xl text-bone-50">{reputation.distinctBrandsOrTalent}</p>
            <p className="text-xs text-bone-500">
              {account.kind === 'brand' ? 'Talent worked with' : 'Brands worked with'}
            </p>
          </div>
          <div className="rounded-2xl border border-bone-50/10 p-4">
            <p className="text-display text-2xl text-bone-50">
              {reputation.averageRating != null ? reputation.averageRating.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-bone-500">{reputation.reviewCount} reviews</p>
          </div>
        </div>
      )}
    </AppScreen>
  )
}
