import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'
import { mediaUrl } from '@/lib/media'
import { supabase } from '@/lib/supabase'
import { fetchCampaign, fetchCampaignApplications } from '@/lib/api'
import { matchTalentForCampaign, type MatchCandidate } from '@/lib/matching'
import type { PersonProfile } from '@/lib/types'

export function CampaignApplicantsScreen() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [inviteUsername, setInviteUsername] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)

  const { data: campaign } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaign(id!),
    enabled: !!id,
  })

  const { data: applications } = useQuery({
    queryKey: ['campaign-applications', id],
    queryFn: () => fetchCampaignApplications(id!),
    enabled: !!id,
  })

  const { data: invitations } = useQuery({
    queryKey: ['campaign-invitations', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('campaign_invitations')
        .select('*, person:accounts!campaign_invitations_person_account_id_fkey(*)')
        .eq('campaign_id', id!)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    enabled: !!id,
  })

  const { data: matchInputs } = useQuery({
    queryKey: ['campaign-match-inputs', id, applications?.map((a) => a.person_account_id)],
    queryFn: async () => {
      const ids = (applications ?? []).map((a) => a.person_account_id)
      if (ids.length === 0) return { candidates: [] as MatchCandidate[] }
      const [{ data: profiles }, { data: verified }] = await Promise.all([
        supabase.from('person_profiles').select('*').in('account_id', ids),
        supabase.from('collaborations').select('person_account_id').eq('status', 'verified').in('person_account_id', ids),
      ])
      const verifiedCounts = new Map<string, number>()
      for (const row of verified ?? []) {
        verifiedCounts.set(row.person_account_id, (verifiedCounts.get(row.person_account_id) ?? 0) + 1)
      }
      const profileMap = new Map<string, PersonProfile>((profiles ?? []).map((p) => [p.account_id, p]))
      const candidates: MatchCandidate[] = (applications ?? [])
        .map((a) => {
          const profile = profileMap.get(a.person_account_id)
          if (!profile) return null
          return {
            accountId: a.person_account_id,
            displayName: a.person.display_name,
            username: a.person.username,
            locationCity: a.person.location_city,
            profile,
            verifiedCollabCount: verifiedCounts.get(a.person_account_id) ?? 0,
          }
        })
        .filter((c): c is MatchCandidate => c !== null)
      return { candidates }
    },
    enabled: !!applications,
  })

  function invalidate() {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['campaign-applications', id] }),
      queryClient.invalidateQueries({ queryKey: ['campaign-invitations', id] }),
    ])
  }

  async function setApplicationStatus(appId: string, status: 'accepted' | 'declined') {
    const app = applications?.find((a) => a.id === appId)
    await supabase.from('campaign_applications').update({ status }).eq('id', appId)
    if (status === 'accepted' && app && campaign) {
      await supabase.from('bookings').insert({
        campaign_id: campaign.id,
        person_account_id: app.person_account_id,
        brand_account_id: campaign.brand_account_id,
        title: campaign.title,
        rate_amount: app.rate_amount,
        rate_currency: app.rate_currency,
        created_by: campaign.brand_account_id,
      })
    }
    await invalidate()
  }

  async function invite() {
    if (!campaign || !inviteUsername.trim()) return
    setInviteError(null)
    const { data: person } = await supabase
      .from('accounts')
      .select('id, kind')
      .ilike('username', inviteUsername.trim())
      .maybeSingle()
    if (!person || person.kind !== 'person') {
      setInviteError('No talent found with that username.')
      return
    }
    const { error } = await supabase.from('campaign_invitations').insert({
      campaign_id: campaign.id,
      person_account_id: person.id,
    })
    if (error) {
      setInviteError(error.message)
      return
    }
    setInviteUsername('')
    await invalidate()
  }

  if (!campaign) return null

  const matches = matchInputs ? matchTalentForCampaign(campaign, matchInputs.candidates, 0) : []
  const scoreByAccount = new Map(matches.map((m) => [m.accountId, m]))

  const sortedApplications = [...(applications ?? [])].sort((a, b) => {
    const sa = scoreByAccount.get(a.person_account_id)?.score ?? 0
    const sb = scoreByAccount.get(b.person_account_id)?.score ?? 0
    return sb - sa
  })

  return (
    <AppScreen title={campaign.title}>
      <p className="mb-6 text-label text-bone-500">{campaign.status.toUpperCase()}</p>

      <p className="text-display mb-3 text-lg text-bone-50">Applicants</p>
      {sortedApplications.length > 0 ? (
        <div className="mb-8 space-y-3">
          {sortedApplications.map((app) => {
            const match = scoreByAccount.get(app.person_account_id)
            return (
              <div key={app.id} className="rounded-2xl border border-bone-50/10 p-4">
                <div className="flex items-start gap-3">
                  <Avatar src={mediaUrl(app.person.avatar_path)} name={app.person.display_name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-bone-50">{app.person.display_name}</p>
                      {match && (
                        <span className="text-label text-signal-400">{match.score}% match</span>
                      )}
                    </div>
                    {match && match.reasons.length > 0 && (
                      <p className="text-xs text-bone-500">Because: {match.reasons.join(', ')}</p>
                    )}
                    {app.message && <p className="mt-1.5 text-xs text-bone-400">"{app.message}"</p>}
                    <p className="mt-1 text-label text-bone-600">{app.status}</p>
                  </div>
                </div>
                {app.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => setApplicationStatus(app.id, 'accepted')}>
                      Accept
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setApplicationStatus(app.id, 'declined')}>
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={Users} title="No applications yet" description="Invite talent directly below." />
      )}

      <p className="text-display mb-3 text-lg text-bone-50">Invite talent</p>
      <div className="mb-3 flex gap-2">
        <Input
          placeholder="username"
          value={inviteUsername}
          onChange={(e) => setInviteUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && invite()}
        />
        <Button onClick={invite}>Invite</Button>
      </div>
      {inviteError && <p className="mb-3 text-sm text-closed-500">{inviteError}</p>}

      {invitations && invitations.length > 0 && (
        <div className="space-y-2">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-xl border border-bone-50/10 px-3.5 py-2.5">
              <span className="text-sm text-bone-200">{inv.person.display_name}</span>
              <span className="text-label text-bone-500">{inv.status}</span>
            </div>
          ))}
        </div>
      )}
    </AppScreen>
  )
}
