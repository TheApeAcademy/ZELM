import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Sparkles } from 'lucide-react'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchMyApplications, fetchMyInvitations, fetchOpenCampaigns } from '@/lib/api'
import { matchCampaignsForPerson, type MatchCandidate } from '@/lib/matching'

export function MyOpportunitiesScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()

  const { data: invitations } = useQuery({
    queryKey: ['my-invitations', account?.id],
    queryFn: () => fetchMyInvitations(account!.id),
    enabled: !!account,
  })
  const { data: applications } = useQuery({
    queryKey: ['my-applications', account?.id],
    queryFn: () => fetchMyApplications(account!.id),
    enabled: !!account,
  })
  const { data: openCampaigns } = useQuery({
    queryKey: ['open-campaigns-for-match'],
    queryFn: () => fetchOpenCampaigns(),
  })
  const { data: myProfile } = useQuery({
    queryKey: ['my-profile-for-match', account?.id],
    queryFn: async () => {
      const [{ data: profile }, { count: verifiedCount }] = await Promise.all([
        supabase.from('person_profiles').select('*').eq('account_id', account!.id).single(),
        supabase
          .from('collaborations')
          .select('id', { count: 'exact', head: true })
          .eq('person_account_id', account!.id)
          .eq('status', 'verified'),
      ])
      return { profile, verifiedCount: verifiedCount ?? 0 }
    },
    enabled: !!account,
  })

  async function respondInvitation(invitationId: string, status: 'accepted' | 'declined') {
    const invitation = invitations?.find((i) => i.id === invitationId)
    await supabase.from('campaign_invitations').update({ status }).eq('id', invitationId)
    if (status === 'accepted' && invitation) {
      await supabase.from('bookings').insert({
        campaign_id: invitation.campaign.id,
        person_account_id: account!.id,
        brand_account_id: invitation.campaign.brand_account_id,
        title: invitation.campaign.title,
        created_by: account!.id,
      })
    }
    await queryClient.invalidateQueries({ queryKey: ['my-invitations', account!.id] })
  }

  if (!account) return null

  const candidate: MatchCandidate | null =
    myProfile?.profile
      ? {
          accountId: account.id,
          displayName: account.display_name,
          username: account.username,
          locationCity: account.location_city,
          profile: myProfile.profile,
          verifiedCollabCount: myProfile.verifiedCount ?? 0,
        }
      : null

  const matches = candidate && openCampaigns ? matchCampaignsForPerson(openCampaigns, candidate) : []
  const pendingInvitations = (invitations ?? []).filter((i) => i.status === 'pending')

  return (
    <AppScreen title="Opportunities">
      {pendingInvitations.length > 0 && (
        <div className="mb-8">
          <p className="text-display mb-3 text-lg text-bone-50">Invitations</p>
          <div className="space-y-3">
            {pendingInvitations.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 rounded-2xl border border-bone-50/10 p-4">
                <Avatar src={mediaUrl(inv.campaign.brand.avatar_path)} name={inv.campaign.brand.display_name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-bone-50">{inv.campaign.brand.display_name} invited you</p>
                  <p className="text-xs text-bone-500">{inv.campaign.title}</p>
                </div>
                <Button size="sm" onClick={() => respondInvitation(inv.id, 'accepted')}>
                  Accept
                </Button>
                <Button size="sm" variant="secondary" onClick={() => respondInvitation(inv.id, 'declined')}>
                  Decline
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <p className="text-display mb-3 text-lg text-bone-50">Matched for you</p>
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.slice(0, 5).map((m) => (
              <Link
                key={m.campaign.id}
                to={`/opportunities/${m.campaign.id}`}
                className="block rounded-2xl border border-bone-50/10 p-4 hover:border-bone-50/25"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-bone-50">{m.campaign.title}</p>
                  <span className="text-label text-signal-400">{m.score}% match</span>
                </div>
                <p className="text-xs text-bone-500">Because: {m.reasons.join(', ')}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={Sparkles} title="No matches yet" description="Complete your profile to improve matching." />
        )}
      </div>

      <div>
        <p className="text-display mb-3 text-lg text-bone-50">Your applications</p>
        {applications && applications.length > 0 ? (
          <div className="space-y-2">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between rounded-xl border border-bone-50/10 px-4 py-3">
                <span className="text-sm text-bone-200">{app.campaign.title}</span>
                <span className="text-label text-bone-500">{app.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-bone-500">
            No applications yet — browse{' '}
            <Link to="/opportunities" className="text-signal-400">
              open opportunities
            </Link>
            .
          </p>
        )}
      </div>
    </AppScreen>
  )
}
