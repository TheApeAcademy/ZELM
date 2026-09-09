import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { DigitalCard } from './DigitalCard'
import { Button } from '@/components/ui/Button'
import { LinkButton } from '@/components/ui/LinkButton'
import { Input, Label, FieldGroup } from '@/components/ui/Field'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { mediaUrl } from '@/lib/media'
import { cn } from '@/lib/cn'
import type { CardSettings, MediaItem, PersonMeasurements, PersonProfile } from '@/lib/types'

export function CardScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [tagline, setTagline] = useState('')
  const [primaryMediaId, setPrimaryMediaId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { data } = useQuery({
    queryKey: ['card-editor', account?.id],
    queryFn: async () => {
      const [{ data: card }, { data: media }, { data: profile }, { data: measurements }] =
        await Promise.all([
          supabase.from('card_settings').select('*').eq('account_id', account!.id).maybeSingle(),
          supabase
            .from('media_items')
            .select('*')
            .eq('account_id', account!.id)
            .order('sort_order'),
          account!.kind === 'person'
            ? supabase.from('person_profiles').select('*').eq('account_id', account!.id).maybeSingle()
            : Promise.resolve({ data: null }),
          account!.kind === 'person'
            ? supabase
                .from('person_measurements')
                .select('*')
                .eq('account_id', account!.id)
                .maybeSingle()
            : Promise.resolve({ data: null }),
        ])
      return {
        card: card as CardSettings | null,
        media: (media ?? []) as MediaItem[],
        profile: profile as PersonProfile | null,
        measurements: measurements as PersonMeasurements | null,
      }
    },
    enabled: !!account,
  })

  useEffect(() => {
    if (data?.card) {
      setTagline(data.card.tagline ?? '')
      setPrimaryMediaId(data.card.primary_media_id)
    }
  }, [data?.card])

  if (!account || !data) return null

  const selectedMedia = data.media.find((m) => m.id === primaryMediaId)

  async function save() {
    setSaving(true)
    await supabase
      .from('card_settings')
      .update({ tagline: tagline || null, primary_media_id: primaryMediaId })
      .eq('account_id', account!.id)
    await queryClient.invalidateQueries({ queryKey: ['card-editor', account!.id] })
    setSaving(false)
  }

  return (
    <AppScreen
      title="My Card"
      action={
        <LinkButton to={`/${account.username}/card`} variant="secondary" size="sm">
          View &amp; share
        </LinkButton>
      }
    >
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <DigitalCard
          account={account}
          photoPath={selectedMedia?.storage_path ?? account.avatar_path}
          tagline={tagline}
          personProfile={data.profile}
          measurements={data.measurements}
        />

        <div className="w-full space-y-5">
          <FieldGroup>
            <Label hint={`${tagline.length}/80`}>Tagline</Label>
            <Input
              maxLength={80}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A one-line pitch for the card"
            />
          </FieldGroup>

          <div>
            <Label>Primary photo</Label>
            <div className="grid grid-cols-4 gap-2">
              {data.media.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPrimaryMediaId(m.id)}
                  className={cn(
                    'aspect-square overflow-hidden rounded-lg ring-2',
                    primaryMediaId === m.id ? 'ring-signal-500' : 'ring-transparent',
                  )}
                >
                  <img src={mediaUrl(m.storage_path)!} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {data.media.length === 0 && (
              <p className="text-xs text-bone-500">Upload gallery photos first to choose one here.</p>
            )}
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Save card'}
          </Button>
        </div>
      </div>
    </AppScreen>
  )
}
