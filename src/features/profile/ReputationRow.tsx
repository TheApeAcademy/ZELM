import type { Reputation } from '@/lib/api'

export function ReputationRow({ reputation, isBrand }: { reputation: Reputation; isBrand: boolean }) {
  if (reputation.verifiedCollaborations === 0 && reputation.reviewCount === 0) return null

  return (
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-bone-500">
      {reputation.verifiedCollaborations > 0 && (
        <span>
          <span className="text-bone-100">{reputation.verifiedCollaborations}</span> verified collaboration
          {reputation.verifiedCollaborations === 1 ? '' : 's'}
        </span>
      )}
      {reputation.distinctBrandsOrTalent > 0 && (
        <span>
          <span className="text-bone-100">{reputation.distinctBrandsOrTalent}</span>{' '}
          {isBrand ? 'talent worked with' : 'brands worked with'}
        </span>
      )}
      {reputation.averageRating != null && (
        <span>
          <span className="text-bone-100">{reputation.averageRating.toFixed(1)}</span> / 5 (
          {reputation.reviewCount} review{reputation.reviewCount === 1 ? '' : 's'})
        </span>
      )}
    </div>
  )
}
