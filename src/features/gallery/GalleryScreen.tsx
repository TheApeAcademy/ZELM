import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Upload } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { mediaUrl, uploadMedia } from '@/lib/media'
import { fetchGallery } from '@/lib/api'
import { Image as ImageIcon, Tag } from 'lucide-react'
import { MediaTagEditor } from './MediaTagEditor'
import type { MediaItem } from '@/lib/types'

export function GalleryScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const fileInput = useRef<HTMLInputElement>(null)
  const [activeCollection, setActiveCollection] = useState<string | 'all' | 'unsorted'>('all')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [tagging, setTagging] = useState<MediaItem | null>(null)

  const { data } = useQuery({
    queryKey: ['gallery', account?.id],
    queryFn: () => fetchGallery(account!.id),
    enabled: !!account,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ['gallery', account!.id] })
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !account) return
    setUploading(true)
    const collectionId = activeCollection === 'all' || activeCollection === 'unsorted' ? null : activeCollection
    for (const file of Array.from(files)) {
      const path = await uploadMedia(account.id, 'gallery', file)
      await supabase.from('media_items').insert({
        account_id: account.id,
        collection_id: collectionId,
        storage_path: path,
      })
    }
    await invalidate()
    setUploading(false)
  }

  async function createCollection() {
    if (!newCollectionName.trim() || !account) return
    await supabase.from('collections').insert({ account_id: account.id, name: newCollectionName.trim() })
    setNewCollectionName('')
    await invalidate()
  }

  async function deleteMedia(id: string, storagePath: string) {
    await supabase.storage.from('zelm-media').remove([storagePath])
    await supabase.from('media_items').delete().eq('id', id)
    await invalidate()
  }

  async function togglePortfolio(id: string, current: boolean) {
    await supabase.from('media_items').update({ is_portfolio: !current }).eq('id', id)
    await invalidate()
  }

  if (!account || !data) return null

  const visible =
    activeCollection === 'all'
      ? data.media
      : activeCollection === 'unsorted'
        ? data.media.filter((m) => !m.collection_id)
        : data.media.filter((m) => m.collection_id === activeCollection)

  return (
    <AppScreen
      title="Gallery"
      action={
        <Button size="sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
          <Upload className="size-4" />
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
      }
    >
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Chip active={activeCollection === 'all'} onClick={() => setActiveCollection('all')}>
          All
        </Chip>
        <Chip active={activeCollection === 'unsorted'} onClick={() => setActiveCollection('unsorted')}>
          Unsorted
        </Chip>
        {data.collections.map((c) => (
          <Chip key={c.id} active={activeCollection === c.id} onClick={() => setActiveCollection(c.id)}>
            {c.name}
          </Chip>
        ))}
        <div className="flex items-center gap-1">
          <Input
            className="h-8 w-32 text-xs"
            placeholder="New collection"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createCollection()}
          />
          <button onClick={createCollection} className="text-bone-400 hover:text-bone-100">
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Your visual archive starts here"
          description="Upload editorial, campaign, runway or behind-the-scenes work."
        />
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {visible.map((item) => (
            <div key={item.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-800">
              <img src={mediaUrl(item.storage_path)!} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-ink-950/0 p-1.5 opacity-0 transition-opacity group-hover:bg-ink-950/50 group-hover:opacity-100">
                <div className="flex justify-end gap-1 self-end">
                  <button
                    onClick={() => setTagging(item)}
                    className="rounded-full bg-ink-950/70 p-1 text-bone-100"
                    title="Tag products"
                  >
                    <Tag className="size-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMedia(item.id, item.storage_path)}
                    className="rounded-full bg-ink-950/70 p-1 text-bone-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => togglePortfolio(item.id, item.is_portfolio)}
                  className={cn(
                    'text-label rounded-full px-2 py-1 self-start',
                    item.is_portfolio ? 'bg-signal-500 text-ink-950' : 'bg-ink-950/70 text-bone-200',
                  )}
                >
                  {item.is_portfolio ? 'In portfolio' : 'Add to portfolio'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tagging && <MediaTagEditor media={tagging} onClose={() => setTagging(null)} />}
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
      onClick={onClick}
      className={cn(
        'text-label rounded-full border px-3 py-1.5 transition-colors',
        active
          ? 'border-signal-500 bg-signal-500/15 text-signal-400'
          : 'border-bone-50/12 text-bone-400 hover:border-bone-50/25',
      )}
    >
      {children}
    </button>
  )
}
