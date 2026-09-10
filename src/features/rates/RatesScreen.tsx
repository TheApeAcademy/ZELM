import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { LinkButton } from '@/components/ui/LinkButton'
import { Input, Select, Label, FieldGroup } from '@/components/ui/Field'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchAudienceStats, fetchRates } from '@/lib/api'
import { RATE_SERVICES, SOCIAL_PLATFORM_LABEL, type SocialPlatform } from '@/lib/types'

const PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'x']

export function RatesScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [service, setService] = useState<string>(RATE_SERVICES[0])
  const [amount, setAmount] = useState('')
  const [requestOnly, setRequestOnly] = useState(false)

  const { data: rates } = useQuery({
    queryKey: ['rates', account?.id],
    queryFn: () => fetchRates(account!.id),
    enabled: !!account,
  })
  const { data: audience } = useQuery({
    queryKey: ['audience', account?.id],
    queryFn: () => fetchAudienceStats(account!.id),
    enabled: !!account,
  })

  function invalidate() {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['rates', account!.id] }),
      queryClient.invalidateQueries({ queryKey: ['audience', account!.id] }),
    ])
  }

  async function addRate() {
    if (!account) return
    await supabase.from('rates').insert({
      account_id: account.id,
      service,
      amount: requestOnly ? null : amount ? Number(amount) : null,
      is_request_only: requestOnly,
    })
    setAmount('')
    await invalidate()
  }

  async function removeRate(id: string) {
    await supabase.from('rates').delete().eq('id', id)
    await invalidate()
  }

  async function saveAudience(platform: SocialPlatform, followers: string) {
    await supabase
      .from('audience_stats')
      .upsert(
        { account_id: account!.id, platform, followers: followers ? Number(followers) : null },
        { onConflict: 'account_id,platform' },
      )
    await invalidate()
  }

  if (!account) return null

  return (
    <AppScreen
      title="Rates & Media Kit"
      action={
        <LinkButton to={`/${account.username}/media-kit`} variant="secondary" size="sm">
          View media kit
        </LinkButton>
      }
    >
      <p className="text-display mb-3 text-lg text-bone-50">Rates</p>
      <div className="mb-3 space-y-2">
        {(rates ?? []).map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-xl border border-bone-50/10 px-4 py-2.5">
            <span className="text-sm text-bone-200">{r.service}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-bone-400">
                {r.is_request_only ? 'Request rate' : r.amount ? `From ${r.amount} ${r.currency}` : '—'}
              </span>
              <button onClick={() => removeRate(r.id)} className="text-bone-500 hover:text-closed-500">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap items-end gap-2">
        <FieldGroup>
          <Label>Service</Label>
          <Select className="w-40" value={service} onChange={(e) => setService(e.target.value)}>
            {RATE_SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label>Amount (EUR)</Label>
          <Input
            className="w-32"
            type="number"
            disabled={requestOnly}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FieldGroup>
        <label className="mb-2.5 flex items-center gap-2 text-sm text-bone-300">
          <input type="checkbox" checked={requestOnly} onChange={(e) => setRequestOnly(e.target.checked)} />
          Request only
        </label>
        <Button size="md" onClick={addRate}>
          <Plus className="size-4" />
        </Button>
      </div>

      <p className="text-display mb-3 text-lg text-bone-50">Audience</p>
      <div className="space-y-2">
        {PLATFORMS.map((p) => {
          const existing = audience?.find((a) => a.platform === p)
          return (
            <div key={p} className="flex items-center gap-3">
              <span className="w-24 text-sm text-bone-400">{SOCIAL_PLATFORM_LABEL[p]}</span>
              <Input
                type="number"
                placeholder="Followers"
                defaultValue={existing?.followers ?? ''}
                onBlur={(e) => saveAudience(p, e.target.value)}
              />
            </div>
          )
        })}
      </div>
    </AppScreen>
  )
}
