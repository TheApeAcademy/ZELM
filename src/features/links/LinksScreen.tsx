import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, Plus } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Input, Select, Label, FieldGroup } from '@/components/ui/Field'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { SOCIAL_PLATFORM_LABEL, type ContactInfo, type SocialLink, type SocialPlatform } from '@/lib/types'

const PLATFORMS = Object.keys(SOCIAL_PLATFORM_LABEL) as SocialPlatform[]

export function LinksScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [platform, setPlatform] = useState<SocialPlatform>('instagram')
  const [url, setUrl] = useState('')

  const { data } = useQuery({
    queryKey: ['links', account?.id],
    queryFn: async () => {
      const [{ data: socials }, { data: contact }] = await Promise.all([
        supabase.from('social_links').select('*').eq('account_id', account!.id).order('sort_order'),
        supabase.from('contact_info').select('*').eq('account_id', account!.id).maybeSingle(),
      ])
      return { socials: (socials ?? []) as SocialLink[], contact: contact as ContactInfo | null }
    },
    enabled: !!account,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ['links', account!.id] })
  }

  async function addLink() {
    if (!url.trim() || !account) return
    await supabase.from('social_links').insert({ account_id: account.id, platform, url: url.trim() })
    setUrl('')
    await invalidate()
  }

  async function removeLink(id: string) {
    await supabase.from('social_links').delete().eq('id', id)
    await invalidate()
  }

  async function toggleLinkPublic(id: string, current: boolean) {
    await supabase.from('social_links').update({ is_public: !current }).eq('id', id)
    await invalidate()
  }

  async function saveContact(field: 'email' | 'phone' | 'whatsapp', value: string) {
    const patch: Partial<ContactInfo> & { account_id: string } = {
      account_id: account!.id,
      email: field === 'email' ? value || null : data?.contact?.email ?? null,
      phone: field === 'phone' ? value || null : data?.contact?.phone ?? null,
      whatsapp: field === 'whatsapp' ? value || null : data?.contact?.whatsapp ?? null,
    }
    await supabase.from('contact_info').upsert(patch, { onConflict: 'account_id' })
    await invalidate()
  }

  async function toggleContactPublic(current: boolean) {
    await supabase
      .from('contact_info')
      .upsert({ account_id: account!.id, is_public: !current }, { onConflict: 'account_id' })
    await invalidate()
  }

  if (!account || !data) return null

  return (
    <AppScreen title="Links">
      <div className="space-y-3">
        {data.socials.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 rounded-xl border border-bone-50/10 px-3.5 py-2.5"
          >
            <span className="text-label w-20 shrink-0 text-bone-500">
              {SOCIAL_PLATFORM_LABEL[link.platform]}
            </span>
            <span className="flex-1 truncate text-sm text-bone-200">{link.url}</span>
            <button
              onClick={() => toggleLinkPublic(link.id, link.is_public)}
              className={`text-label rounded-full px-2 py-1 ${link.is_public ? 'bg-signal-500/15 text-signal-400' : 'bg-bone-50/8 text-bone-500'}`}
            >
              {link.is_public ? 'Public' : 'Hidden'}
            </button>
            <button onClick={() => removeLink(link.id)} className="text-bone-500 hover:text-closed-500">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        <div className="flex items-end gap-2">
          <Select
            className="w-32"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {SOCIAL_PLATFORM_LABEL[p]}
              </option>
            ))}
          </Select>
          <Input
            className="flex-1"
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <Button size="md" onClick={addLink}>
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-display text-lg text-bone-50">Contact</p>
          <button
            onClick={() => toggleContactPublic(data.contact?.is_public ?? false)}
            className={`text-label rounded-full px-2.5 py-1 ${data.contact?.is_public ? 'bg-signal-500/15 text-signal-400' : 'bg-bone-50/8 text-bone-500'}`}
          >
            {data.contact?.is_public ? 'Public' : 'Private'}
          </button>
        </div>
        <FieldGroup>
          <Label>Email</Label>
          <Input
            type="email"
            defaultValue={data.contact?.email ?? ''}
            onBlur={(e) => saveContact('email', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Phone</Label>
          <Input defaultValue={data.contact?.phone ?? ''} onBlur={(e) => saveContact('phone', e.target.value)} />
        </FieldGroup>
        <FieldGroup>
          <Label>WhatsApp</Label>
          <Input
            defaultValue={data.contact?.whatsapp ?? ''}
            onBlur={(e) => saveContact('whatsapp', e.target.value)}
          />
        </FieldGroup>
      </div>
    </AppScreen>
  )
}
