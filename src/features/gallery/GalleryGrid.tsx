import { useState } from 'react'
import { X } from 'lucide-react'
import { ImageIcon } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import { mediaUrl } from '@/lib/media'
import type { Collection, MediaItem } from '@/lib/types'

export function GalleryGrid({
  collections,
  media,
  emptyTitle = 'No work uploaded yet',
  emptyDescription,
}: {
  collections: Collection[]
  media: MediaItem[]
  emptyTitle?: string
  emptyDescription?: string
}) {
  const [activeCollection, setActiveCollection] = useState<string | 'all'>('all')
  const [lightbox, setLightbox] = useState<MediaItem | null>(null)

  const visible =
    activeCollection === 'all' ? media : media.filter((m) => m.collection_id === activeCollection)

  if (media.length === 0) {
    return <EmptyState icon={ImageIcon} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div>
      {collections.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <CollectionChip active={activeCollection === 'all'} onClick={() => setActiveCollection('all')}>
            All
          </CollectionChip>
          {collections.map((c) => (
            <CollectionChip
              key={c.id}
              active={activeCollection === c.id}
              onClick={() => setActiveCollection(c.id)}
            >
              {c.name}
            </CollectionChip>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {visible.map((item) => (
          <button
            key={item.id}
            onClick={() => setLightbox(item)}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-800"
          >
            <img
              src={mediaUrl(item.storage_path)!}
              alt={item.caption ?? ''}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4 animate-scale-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 text-bone-300 hover:text-bone-50"
            onClick={() => setLightbox(null)}
          >
            <X className="size-6" />
          </button>
          <img
            src={mediaUrl(lightbox.storage_path)!}
            alt={lightbox.caption ?? ''}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

function CollectionChip({
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
