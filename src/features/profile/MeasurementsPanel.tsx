import type { PersonMeasurements, PersonProfile } from '@/lib/types'

export function MeasurementsPanel({
  measurements,
  profile,
}: {
  measurements: PersonMeasurements
  profile: PersonProfile
}) {
  const stats: [string, string | number | null][] = [
    ['Height', measurements.height_cm ? `${measurements.height_cm} cm` : null],
    ['Weight', measurements.weight_kg ? `${measurements.weight_kg} kg` : null],
    ['Hair', measurements.hair_color],
    ['Eyes', measurements.eye_color],
    ['Clothing', measurements.clothing_size],
    ['Shoe', measurements.shoe_size],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <div className="mt-5 space-y-4">
      {stats.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {stats.map(([label, value]) => (
            <div key={label}>
              <p className="text-label text-bone-600">{label}</p>
              <p className="font-mono text-sm text-bone-100">{value}</p>
            </div>
          ))}
        </div>
      )}

      {profile.open_to.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.open_to.map((o) => (
            <span
              key={o}
              className="text-label rounded-full border border-bone-50/12 px-2.5 py-1 text-bone-400"
            >
              {o}
            </span>
          ))}
        </div>
      )}

      {(profile.languages.length > 0 || profile.travel_availability) && (
        <p className="text-xs text-bone-500">
          {profile.languages.length > 0 && `Speaks ${profile.languages.join(', ')}`}
          {profile.languages.length > 0 && profile.travel_availability && ' · '}
          {profile.travel_availability && 'Available to travel'}
        </p>
      )}
    </div>
  )
}
