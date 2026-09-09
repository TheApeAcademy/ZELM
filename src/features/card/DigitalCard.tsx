import { AvailabilityPill } from '@/components/ui/AvailabilityDot'
import { mediaUrl } from '@/lib/media'
import { ROLE_LABEL, type Account, type PersonMeasurements, type PersonProfile } from '@/lib/types'

export function DigitalCard({
  account,
  photoPath,
  tagline,
  personProfile,
  measurements,
  brandCategory,
}: {
  account: Account
  photoPath: string | null
  tagline: string | null
  personProfile?: PersonProfile | null
  measurements?: PersonMeasurements | null
  brandCategory?: string | null
}) {
  const photo = mediaUrl(photoPath || account.avatar_path)
  const stats = measurements
    ? [
        measurements.height_cm && `${measurements.height_cm} cm`,
        measurements.weight_kg && `${measurements.weight_kg} kg`,
        measurements.hair_color,
        measurements.eye_color,
      ].filter(Boolean)
    : []

  return (
    <div className="aspect-[3/4.6] w-full max-w-sm overflow-hidden rounded-[2rem] border border-bone-50/12 bg-ink-900 shadow-2xl">
      <div className="relative h-3/5 w-full bg-ink-800">
        {photo ? (
          <img src={photo} alt={account.display_name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-display text-4xl text-bone-600">
            {account.display_name[0]}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-900 to-transparent" />
      </div>

      <div className="flex h-2/5 flex-col justify-between p-5">
        <div>
          <p className="text-display text-xl text-bone-50">{account.display_name}</p>
          <p className="text-label mt-0.5 text-signal-400">
            {personProfile && personProfile.roles.length > 0
              ? personProfile.roles.map((r) => ROLE_LABEL[r]).join(' · ')
              : brandCategory || 'ZELM'}
          </p>
          {(account.location_city || account.location_country) && (
            <p className="mt-0.5 text-xs text-bone-500">
              {[account.location_city, account.location_country].filter(Boolean).join(', ')}
            </p>
          )}
          {tagline && <p className="mt-2 text-sm text-bone-300">{tagline}</p>}
        </div>

        <div className="flex items-center justify-between">
          {stats.length > 0 && (
            <p className="font-mono text-[11px] text-bone-500">{stats.join(' · ')}</p>
          )}
          {personProfile && <AvailabilityPill status={personProfile.availability} />}
        </div>
      </div>
    </div>
  )
}
