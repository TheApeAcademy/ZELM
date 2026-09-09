import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select, Label, FieldGroup } from '@/components/ui/Field'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { mediaUrl, uploadMedia } from '@/lib/media'
import {
  AVAILABILITY_LABEL,
  OPEN_TO_OPTIONS,
  ROLE_LABEL,
  type AvailabilityStatus,
  type BrandProfile,
  type PersonMeasurements,
  type PersonProfile,
  type ProfessionalRole,
} from '@/lib/types'

const ROLES = Object.keys(ROLE_LABEL) as ProfessionalRole[]
const AVAILABILITIES = Object.keys(AVAILABILITY_LABEL) as AvailabilityStatus[]

export function SettingsScreen() {
  const { account, refreshAccount, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const avatarInput = useRef<HTMLInputElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)

  const { data } = useQuery({
    queryKey: ['settings', account?.id],
    queryFn: async () => {
      if (account!.kind === 'person') {
        const [{ data: profile }, { data: measurements }] = await Promise.all([
          supabase.from('person_profiles').select('*').eq('account_id', account!.id).single(),
          supabase.from('person_measurements').select('*').eq('account_id', account!.id).maybeSingle(),
        ])
        return { profile: profile as PersonProfile, brand: null, measurements: measurements as PersonMeasurements | null }
      }
      const { data: brand } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('account_id', account!.id)
        .single()
      return { profile: null, brand: brand as BrandProfile, measurements: null }
    },
    enabled: !!account,
  })

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [roles, setRoles] = useState<ProfessionalRole[]>([])
  const [availability, setAvailability] = useState<AvailabilityStatus>('available')
  const [openTo, setOpenTo] = useState<string[]>([])
  const [languages, setLanguages] = useState('')
  const [travel, setTravel] = useState(false)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [hair, setHair] = useState('')
  const [eyes, setEyes] = useState('')
  const [clothingSize, setClothingSize] = useState('')
  const [shoeSize, setShoeSize] = useState('')
  const [measurementsPublic, setMeasurementsPublic] = useState(true)
  const [category, setCategory] = useState('')
  const [brandStory, setBrandStory] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!account) return
    setDisplayName(account.display_name)
    setBio(account.bio ?? '')
    setCity(account.location_city ?? '')
    setCountry(account.location_country ?? '')
  }, [account])

  useEffect(() => {
    if (data?.profile) {
      setRoles(data.profile.roles)
      setAvailability(data.profile.availability)
      setOpenTo(data.profile.open_to)
      setLanguages(data.profile.languages.join(', '))
      setTravel(data.profile.travel_availability)
    }
    if (data?.measurements) {
      setHeight(data.measurements.height_cm?.toString() ?? '')
      setWeight(data.measurements.weight_kg?.toString() ?? '')
      setHair(data.measurements.hair_color ?? '')
      setEyes(data.measurements.eye_color ?? '')
      setClothingSize(data.measurements.clothing_size ?? '')
      setShoeSize(data.measurements.shoe_size ?? '')
      setMeasurementsPublic(data.measurements.visibility === 'public')
    }
    if (data?.brand) {
      setCategory(data.brand.category ?? '')
      setBrandStory(data.brand.brand_story ?? '')
    }
  }, [data])

  if (!account) return null
  const acc = account

  function toggleRole(r: ProfessionalRole) {
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))
  }
  function toggleOpenTo(o: string) {
    setOpenTo((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]))
  }

  async function uploadPhoto(kind: 'avatar' | 'cover', file: File) {
    const path = await uploadMedia(acc.id, kind, file)
    const patch = kind === 'avatar' ? { avatar_path: path } : { cover_path: path }
    await supabase.from('accounts').update(patch).eq('id', acc.id)
    await refreshAccount()
  }

  async function save() {
    setSaving(true)
    await supabase
      .from('accounts')
      .update({
        display_name: displayName,
        bio: bio || null,
        location_city: city || null,
        location_country: country || null,
      })
      .eq('id', acc.id)

    if (acc.kind === 'person') {
      await supabase
        .from('person_profiles')
        .update({
          roles,
          availability,
          open_to: openTo,
          languages: languages
            .split(',')
            .map((l) => l.trim())
            .filter(Boolean),
          travel_availability: travel,
        })
        .eq('account_id', acc.id)

      await supabase.from('person_measurements').upsert(
        {
          account_id: acc.id,
          height_cm: height ? Number(height) : null,
          weight_kg: weight ? Number(weight) : null,
          hair_color: hair || null,
          eye_color: eyes || null,
          clothing_size: clothingSize || null,
          shoe_size: shoeSize || null,
          visibility: measurementsPublic ? 'public' : 'private',
        },
        { onConflict: 'account_id' },
      )
    } else {
      await supabase
        .from('brand_profiles')
        .update({ category: category || null, brand_story: brandStory || null })
        .eq('account_id', acc.id)
    }

    await refreshAccount()
    await queryClient.invalidateQueries({ queryKey: ['settings', acc.id] })
    setSaving(false)
  }

  return (
    <AppScreen title="Settings">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => avatarInput.current?.click()} className="relative">
            <Avatar src={mediaUrl(account.avatar_path)} name={account.display_name} size={72} />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink-950/0 text-[10px] text-transparent transition-colors hover:bg-ink-950/50 hover:text-bone-100">
              Change
            </span>
          </button>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && uploadPhoto('avatar', e.target.files[0])}
          />
          <div>
            <Button variant="secondary" size="sm" onClick={() => coverInput.current?.click()}>
              Change cover photo
            </Button>
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadPhoto('cover', e.target.files[0])}
            />
          </div>
        </div>

        <FieldGroup>
          <Label>{account.kind === 'brand' ? 'Brand name' : 'Full name'}</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup>
            <Label>City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Country</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
          </FieldGroup>
        </div>
        <FieldGroup>
          <Label>Bio</Label>
          <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </FieldGroup>

        {account.kind === 'person' ? (
          <>
            <div>
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Chip key={r} active={roles.includes(r)} onClick={() => toggleRole(r)}>
                    {ROLE_LABEL[r]}
                  </Chip>
                ))}
              </div>
            </div>

            <FieldGroup>
              <Label>Availability</Label>
              <Select value={availability} onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}>
                {AVAILABILITIES.map((a) => (
                  <option key={a} value={a}>
                    {AVAILABILITY_LABEL[a]}
                  </option>
                ))}
              </Select>
            </FieldGroup>

            <div>
              <Label>Open to</Label>
              <div className="flex flex-wrap gap-2">
                {OPEN_TO_OPTIONS.map((o) => (
                  <Chip key={o} active={openTo.includes(o)} onClick={() => toggleOpenTo(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldGroup>
                <Label>Height (cm)</Label>
                <Input value={height} onChange={(e) => setHeight(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Weight (kg)</Label>
                <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Hair color</Label>
                <Input value={hair} onChange={(e) => setHair(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Eye color</Label>
                <Input value={eyes} onChange={(e) => setEyes(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Clothing size</Label>
                <Input value={clothingSize} onChange={(e) => setClothingSize(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Shoe size</Label>
                <Input value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} />
              </FieldGroup>
            </div>
            <label className="flex items-center gap-2 text-sm text-bone-300">
              <input
                type="checkbox"
                checked={measurementsPublic}
                onChange={(e) => setMeasurementsPublic(e.target.checked)}
              />
              Show measurements publicly
            </label>

            <FieldGroup>
              <Label>Languages</Label>
              <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Spanish, English" />
            </FieldGroup>
            <label className="flex items-center gap-2 text-sm text-bone-300">
              <input type="checkbox" checked={travel} onChange={(e) => setTravel(e.target.checked)} />
              Available to travel
            </label>
          </>
        ) : (
          <>
            <FieldGroup>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Brand story</Label>
              <Textarea rows={4} value={brandStory} onChange={(e) => setBrandStory(e.target.value)} />
            </FieldGroup>
          </>
        )}

        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? 'Saving…' : 'Save changes'}
        </Button>

        <button
          onClick={async () => {
            await signOut()
            navigate('/')
          }}
          className="w-full text-center text-sm text-bone-500 hover:text-closed-500"
        >
          Sign out
        </button>
      </div>
    </AppScreen>
  )
}

function Chip({
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
      type="button"
      onClick={onClick}
      className={cn(
        'mb-2 mr-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-signal-500 bg-signal-500/15 text-signal-400'
          : 'border-bone-50/15 text-bone-300 hover:border-bone-50/30',
      )}
    >
      {children}
    </button>
  )
}
