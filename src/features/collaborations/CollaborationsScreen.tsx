import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { VerifiedBadge } from '@/components/ui/Badge'
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { Handshake } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchCollaborations } from '@/lib/api'
import { mediaUrl } from '@/lib/media'

export function CollaborationsScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [counterpartUsername, setCounterpartUsername] = useState('')
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { data } = useQuery({
    queryKey: ['collaborations', account?.id],
    queryFn: () => fetchCollaborations(account!.id),
    enabled: !!account,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ['collaborations', account!.id] })
  }

  async function addCollaboration() {
    if (!account || !title.trim() || !counterpartUsername.trim()) return
    setSubmitting(true)
    setError(null)

    const wantedKind = account.kind === 'person' ? 'brand' : 'person'
    const { data: counterpart } = await supabase
      .from('accounts')
      .select('id, kind')
      .ilike('username', counterpartUsername.trim())
      .maybeSingle()

    if (!counterpart || counterpart.kind !== wantedKind) {
      setSubmitting(false)
      setError(`No ${wantedKind} found with that username.`)
      return
    }

    const payload =
      account.kind === 'person'
        ? { person_account_id: account.id, brand_account_id: counterpart.id }
        : { person_account_id: counterpart.id, brand_account_id: account.id }

    const { error: insertError } = await supabase.from('collaborations').insert({
      ...payload,
      title: title.trim(),
      role: role || null,
      description: description || null,
      location: location || null,
      created_by: account.id,
    })

    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setShowForm(false)
    setTitle('')
    setRole('')
    setDescription('')
    setLocation('')
    setCounterpartUsername('')
    await invalidate()
  }

  async function verify(id: string) {
    await supabase.from('collaborations').update({ status: 'verified' }).eq('id', id)
    await invalidate()
  }

  if (!account) return null

  return (
    <AppScreen
      title="Collaborations"
      action={
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="size-4" />
          Add
        </Button>
      }
    >
      {showForm && (
        <div className="mb-6 space-y-3 rounded-2xl border border-bone-50/10 p-4">
          <FieldGroup>
            <Label>{account.kind === 'person' ? 'Brand username' : 'Talent username'}</Label>
            <Input
              value={counterpartUsername}
              onChange={(e) => setCounterpartUsername(e.target.value)}
              placeholder="username"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Campaign 2026" />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup>
              <Label>Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label>Description</Label>
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </FieldGroup>
          {error && <p className="text-sm text-closed-500">{error}</p>}
          <Button onClick={addCollaboration} disabled={submitting} className="w-full">
            {submitting ? 'Adding…' : 'Add collaboration'}
          </Button>
          <p className="text-xs text-bone-500">
            The other side can verify it from their Collaborations screen once it exists.
          </p>
        </div>
      )}

      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((c) => {
            const counterpart = account.kind === 'person' ? c.brand : c.person
            const canVerify = c.status === 'claimed' && c.brand_account_id === account.id
            return (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-2xl border border-bone-50/10 p-4"
              >
                <Avatar src={mediaUrl(counterpart.avatar_path)} name={counterpart.display_name} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-bone-50">{c.title}</p>
                    {c.status === 'verified' && <VerifiedBadge />}
                  </div>
                  <p className="text-xs text-bone-500">
                    {counterpart.display_name}
                    {c.role && ` · ${c.role}`}
                  </p>
                </div>
                {canVerify && (
                  <Button size="sm" variant="secondary" onClick={() => verify(c.id)}>
                    Verify
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Handshake}
          title="Your professional history starts here"
          description="Add your first collaboration — brands can verify it to build trust."
        />
      )}
    </AppScreen>
  )
}
