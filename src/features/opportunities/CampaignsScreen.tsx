import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { Briefcase } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchBrandCampaigns } from '@/lib/api'
import { CAMPAIGN_STATUS_LABEL, ROLE_LABEL, type ProfessionalRole } from '@/lib/types'

const ROLES = Object.keys(ROLE_LABEL) as ProfessionalRole[]

export function CampaignsScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [style, setStyle] = useState('')
  const [budget, setBudget] = useState('')
  const [talentTypes, setTalentTypes] = useState<ProfessionalRole[]>([])
  const [deadline, setDeadline] = useState('')

  const { data: campaigns } = useQuery({
    queryKey: ['brand-campaigns', account?.id],
    queryFn: () => fetchBrandCampaigns(account!.id),
    enabled: !!account,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ['brand-campaigns', account!.id] })
  }

  function toggleType(r: ProfessionalRole) {
    setTalentTypes((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))
  }

  async function createCampaign() {
    if (!title.trim() || !account) return
    await supabase.from('campaigns').insert({
      brand_account_id: account.id,
      title: title.trim(),
      description: description || null,
      location: location || null,
      style: style || null,
      talent_types: talentTypes,
      budget_amount: budget ? Number(budget) : null,
      application_deadline: deadline || null,
      status: 'draft',
    })
    setTitle('')
    setDescription('')
    setLocation('')
    setStyle('')
    setBudget('')
    setDeadline('')
    setTalentTypes([])
    setShowForm(false)
    await invalidate()
  }

  async function setStatus(id: string, status: 'open' | 'closed' | 'draft') {
    await supabase.from('campaigns').update({ status }).eq('id', id)
    await invalidate()
  }

  if (!account) return null

  return (
    <AppScreen
      title="Campaigns"
      action={
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="size-4" />
          New
        </Button>
      }
    >
      {showForm && (
        <div className="mb-6 space-y-3 rounded-2xl border border-bone-50/10 p-4">
          <FieldGroup>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Campaign 2027" />
          </FieldGroup>
          <FieldGroup>
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Style</Label>
              <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Streetwear" />
            </FieldGroup>
            <FieldGroup>
              <Label>Budget (from)</Label>
              <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Application deadline</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </FieldGroup>
          </div>
          <div>
            <Label>Looking for</Label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleType(r)}
                  className={cn(
                    'text-label rounded-full border px-3 py-1.5 transition-colors',
                    talentTypes.includes(r)
                      ? 'border-signal-500 bg-signal-500/15 text-signal-400'
                      : 'border-bone-50/12 text-bone-400',
                  )}
                >
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={createCampaign} className="w-full">
            Create as draft
          </Button>
        </div>
      )}

      {campaigns && campaigns.length > 0 ? (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-2xl border border-bone-50/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/app/campaigns/${c.id}`} className="text-bone-50 hover:underline">
                    {c.title}
                  </Link>
                  <p className="text-xs text-bone-500">{c.location}</p>
                </div>
                <Badge tone={c.status === 'open' ? 'live' : c.status === 'closed' ? 'closed' : 'neutral'}>
                  {CAMPAIGN_STATUS_LABEL[c.status]}
                </Badge>
              </div>
              <div className="mt-3 flex gap-2">
                {c.status !== 'open' && (
                  <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, 'open')}>
                    Publish
                  </Button>
                )}
                {c.status === 'open' && (
                  <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, 'closed')}>
                    Close
                  </Button>
                )}
                <Link to={`/app/campaigns/${c.id}`}>
                  <Button size="sm" variant="ghost">
                    Manage applicants
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No campaigns yet"
          description="Post your first opportunity — talent can apply, or you can invite them directly."
        />
      )}
    </AppScreen>
  )
}
