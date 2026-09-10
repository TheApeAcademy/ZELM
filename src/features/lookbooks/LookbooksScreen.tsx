import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldGroup } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookImage } from 'lucide-react'
import { cn } from '@/lib/cn'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchGallery, fetchLookbooks } from '@/lib/api'

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function LookbooksScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: lookbooks } = useQuery({
    queryKey: ['lookbooks', account?.id],
    queryFn: () => fetchLookbooks(account!.id),
    enabled: !!account,
  })
  const { data: gallery } = useQuery({
    queryKey: ['gallery', account?.id],
    queryFn: () => fetchGallery(account!.id),
    enabled: !!account,
  })
  const { data: itemsByLookbook } = useQuery({
    queryKey: ['lookbook-items', lookbooks?.map((l) => l.id)],
    queryFn: async () => {
      if (!lookbooks || lookbooks.length === 0) return {} as Record<string, string[]>
      const { data } = await supabase
        .from('lookbook_items')
        .select('lookbook_id, media_id')
        .in('lookbook_id', lookbooks.map((l) => l.id))
      const map: Record<string, string[]> = {}
      for (const row of data ?? []) {
        map[row.lookbook_id] = [...(map[row.lookbook_id] ?? []), row.media_id]
      }
      return map
    },
    enabled: !!lookbooks,
  })

  function invalidate() {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['lookbooks', account!.id] }),
      queryClient.invalidateQueries({ queryKey: ['lookbook-items'] }),
    ])
  }

  async function createLookbook() {
    if (!title.trim() || !account) return
    setError(null)
    const { error: insertError } = await supabase.from('lookbooks').insert({
      account_id: account.id,
      title: title.trim(),
      share_slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    })
    if (insertError) {
      setError(insertError.message)
      return
    }
    setTitle('')
    setShowForm(false)
    await invalidate()
  }

  async function deleteLookbook(id: string) {
    await supabase.from('lookbooks').delete().eq('id', id)
    await invalidate()
  }

  async function toggleMedia(lookbookId: string, mediaId: string, included: boolean) {
    if (included) {
      await supabase.from('lookbook_items').delete().eq('lookbook_id', lookbookId).eq('media_id', mediaId)
    } else {
      await supabase.from('lookbook_items').insert({ lookbook_id: lookbookId, media_id: mediaId })
    }
    await invalidate()
  }

  if (!account) return null

  return (
    <AppScreen
      title="Lookbooks"
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
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Streetwear 2026" />
          </FieldGroup>
          {error && <p className="text-sm text-closed-500">{error}</p>}
          <Button onClick={createLookbook} className="w-full">
            Create
          </Button>
        </div>
      )}

      {lookbooks && lookbooks.length > 0 ? (
        <div className="space-y-3">
          {lookbooks.map((lb) => {
            const included = new Set(itemsByLookbook?.[lb.id] ?? [])
            return (
              <div key={lb.id} className="rounded-2xl border border-bone-50/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-bone-50">{lb.title}</p>
                    <Link to={`/lookbook/${lb.share_slug}`} className="text-xs text-signal-400">
                      zelm.com/lookbook/{lb.share_slug}
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing(editing === lb.id ? null : lb.id)}>
                      {editing === lb.id ? 'Done' : 'Edit photos'}
                    </Button>
                    <button onClick={() => deleteLookbook(lb.id)} className="text-bone-500 hover:text-closed-500">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {editing === lb.id && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {(gallery?.media ?? []).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleMedia(lb.id, m.id, included.has(m.id))}
                        className={cn(
                          'aspect-square overflow-hidden rounded-lg ring-2',
                          included.has(m.id) ? 'ring-signal-500' : 'ring-transparent opacity-60',
                        )}
                      >
                        <img src={mediaUrl(m.storage_path)!} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookImage}
          title="No lookbooks yet"
          description="Curate a focused set of photos brands can view without opening your whole profile."
        />
      )}
    </AppScreen>
  )
}
