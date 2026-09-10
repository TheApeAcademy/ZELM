import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchCampaign } from '@/lib/api'
import { ROLE_LABEL } from '@/lib/types'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const [rate, setRate] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaign(id!),
    enabled: !!id,
  })

  const { data: myApplication } = useQuery({
    queryKey: ['my-application', id, account?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('campaign_applications')
        .select('*')
        .eq('campaign_id', id!)
        .eq('person_account_id', account!.id)
        .maybeSingle()
      return data
    },
    enabled: !!id && !!account && account.kind === 'person',
  })

  if (isLoading) return null
  if (!campaign) return <Navigate to="/opportunities" replace />

  const isOwner = account?.id === campaign.brand_account_id

  async function apply() {
    setError(null)
    const { error: insertError } = await supabase.from('campaign_applications').insert({
      campaign_id: campaign!.id,
      person_account_id: account!.id,
      message: message || null,
      rate_amount: rate ? Number(rate) : null,
    })
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSubmitted(true)
    await queryClient.invalidateQueries({ queryKey: ['my-application', id, account!.id] })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link to="/opportunities" className="mb-6 inline-block text-sm text-bone-500">
        ← Opportunities
      </Link>

      <div className="flex items-center gap-3">
        <Avatar src={mediaUrl(campaign.brand.avatar_path)} name={campaign.brand.display_name} size={48} />
        <div>
          <Link to={`/${campaign.brand.username}`} className="text-sm text-bone-300 hover:text-bone-50">
            {campaign.brand.display_name}
          </Link>
          {campaign.location && <p className="text-xs text-bone-500">{campaign.location}</p>}
        </div>
      </div>

      <h1 className="text-display mt-4 text-3xl text-bone-50">{campaign.title}</h1>

      <div className="mt-3 flex flex-wrap gap-2">
        {campaign.talent_types.map((t) => (
          <Badge key={t} tone="signal">
            {ROLE_LABEL[t]}
          </Badge>
        ))}
        {campaign.budget_amount && (
          <Badge>
            From {campaign.budget_amount} {campaign.budget_currency}
          </Badge>
        )}
        {campaign.application_deadline && <Badge>Apply by {campaign.application_deadline}</Badge>}
      </div>

      {campaign.description && <p className="mt-6 text-sm text-bone-300">{campaign.description}</p>}

      <dl className="mt-6 space-y-3 text-sm">
        {campaign.requirements && (
          <div>
            <dt className="text-label text-bone-600">Requirements</dt>
            <dd className="text-bone-300">{campaign.requirements}</dd>
          </div>
        )}
        {campaign.deliverables && (
          <div>
            <dt className="text-label text-bone-600">Deliverables</dt>
            <dd className="text-bone-300">{campaign.deliverables}</dd>
          </div>
        )}
        {campaign.usage_rights && (
          <div>
            <dt className="text-label text-bone-600">Usage rights</dt>
            <dd className="text-bone-300">{campaign.usage_rights}</dd>
          </div>
        )}
        {campaign.travel_required && <p className="text-bone-300">Travel required.</p>}
      </dl>

      <div className="mt-10 border-t border-bone-50/10 pt-8">
        {isOwner ? (
          <Link to={`/app/campaigns/${campaign.id}`}>
            <Button variant="secondary">Manage applicants</Button>
          </Link>
        ) : account?.kind === 'person' ? (
          myApplication || submitted ? (
            <p className="text-sm text-bone-400">
              Application sent — status: <span className="text-bone-100">{myApplication?.status ?? 'pending'}</span>
            </p>
          ) : (
            <div className="space-y-3">
              <FieldGroup>
                <Label>Message</Label>
                <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Your rate (optional)</Label>
                <Input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 500" />
              </FieldGroup>
              {error && <p className="text-sm text-closed-500">{error}</p>}
              <Button onClick={apply}>Apply</Button>
            </div>
          )
        ) : (
          <p className="text-sm text-bone-500">Sign in as talent to apply.</p>
        )}
      </div>
    </div>
  )
}
