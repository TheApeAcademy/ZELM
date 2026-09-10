import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from '@/components/ui/Avatar'
import { fetchMediaKitData } from '@/lib/api'
import { mediaUrl } from '@/lib/media'
import { ROLE_LABEL, SOCIAL_PLATFORM_LABEL } from '@/lib/types'

export function MediaKitPage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['media-kit', username],
    queryFn: () => fetchMediaKitData(username!),
    enabled: !!username,
  })

  if (isLoading) return null
  if (!data || data.result.kind !== 'person') return <Navigate to="/discover" replace />

  const { account, profile } = data.result.identity
  const { rates, audience, collaborations, reviews } = data
  const verifiedBrands = collaborations.filter((c) => c.status === 'verified')
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar src={mediaUrl(account.avatar_path)} name={account.display_name} size={64} />
        <div>
          <h1 className="text-display text-2xl text-bone-50">{account.display_name}</h1>
          <p className="text-sm text-bone-500">
            {profile.roles.map((r) => ROLE_LABEL[r]).join(' · ')}
            {account.location_city && ` · ${account.location_city}`}
          </p>
        </div>
      </div>

      {account.bio && <p className="mt-6 text-sm text-bone-300">{account.bio}</p>}

      {audience.length > 0 && (
        <section className="mt-8">
          <p className="text-label mb-3 text-bone-600">Audience</p>
          <div className="flex flex-wrap gap-6">
            {audience.map((a) => (
              <div key={a.platform}>
                <p className="text-display text-xl text-bone-50">
                  {a.followers ? a.followers.toLocaleString() : '—'}
                </p>
                <p className="text-xs text-bone-500">{SOCIAL_PLATFORM_LABEL[a.platform]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(verifiedBrands.length > 0 || avgRating) && (
        <section className="mt-8">
          <p className="text-label mb-3 text-bone-600">Track record</p>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-display text-xl text-bone-50">{verifiedBrands.length}</p>
              <p className="text-xs text-bone-500">Verified collaborations</p>
            </div>
            {avgRating && (
              <div>
                <p className="text-display text-xl text-bone-50">{avgRating} / 5</p>
                <p className="text-xs text-bone-500">{reviews.length} reviews</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rates.length > 0 && (
        <section className="mt-8">
          <p className="text-label mb-3 text-bone-600">Rates</p>
          <div className="space-y-1.5">
            {rates.map((r) => (
              <div key={r.id} className="flex justify-between text-sm">
                <span className="text-bone-300">{r.service}</span>
                <span className="text-bone-100">
                  {r.is_request_only ? 'Request rate' : r.amount ? `From ${r.amount} ${r.currency}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-xs text-bone-600">zelm.com/{account.username}</p>
    </div>
  )
}
