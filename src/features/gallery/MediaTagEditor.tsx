import { useState, type MouseEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { X, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { mediaUrl } from '@/lib/media'
import { supabase } from '@/lib/supabase'
import { fetchProductTags } from '@/lib/api'
import type { MediaItem } from '@/lib/types'

export function MediaTagEditor({ media, onClose }: { media: MediaItem; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null)
  const [brandUsername, setBrandUsername] = useState('')
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)

  const { data: tags } = useQuery({
    queryKey: ['product-tags', media.id],
    queryFn: () => fetchProductTags(media.id),
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ['product-tags', media.id] })
  }

  function handleImageClick(e: MouseEvent<HTMLImageElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setPending({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height })
    setProducts([])
  }

  async function searchBrand() {
    setSearchError(null)
    const { data: brand } = await supabase
      .from('accounts')
      .select('id, kind')
      .ilike('username', brandUsername.trim())
      .maybeSingle()
    if (!brand || brand.kind !== 'brand') {
      setSearchError('No brand found with that username.')
      return
    }
    const { data } = await supabase.from('products').select('id, name').eq('brand_account_id', brand.id)
    setProducts(data ?? [])
  }

  async function addTag(productId: string) {
    if (!pending) return
    await supabase.from('media_product_tags').insert({
      media_id: media.id,
      product_id: productId,
      x_position: pending.x,
      y_position: pending.y,
    })
    setPending(null)
    setProducts([])
    setBrandUsername('')
    await invalidate()
  }

  async function removeTag(tagId: string) {
    await supabase.from('media_product_tags').delete().eq('id', tagId)
    await invalidate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-bone-50/10 bg-ink-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-display text-lg text-bone-50">Tag products</p>
          <button onClick={onClose} className="text-bone-400 hover:text-bone-100">
            <X className="size-5" />
          </button>
        </div>

        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={mediaUrl(media.storage_path)!}
            onClick={handleImageClick}
            className="w-full cursor-crosshair"
          />
          {(tags ?? []).map((t) => (
            <span
              key={t.id}
              className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal-500 text-xs font-semibold text-ink-950 shadow"
              style={{ left: `${t.x_position * 100}%`, top: `${t.y_position * 100}%` }}
              title={t.product.name}
            >
              €
            </span>
          ))}
          {pending && (
            <span
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-signal-400"
              style={{ left: `${pending.x * 100}%`, top: `${pending.y * 100}%` }}
            />
          )}
        </div>

        {pending && (
          <div className="mb-4 space-y-2 rounded-xl border border-bone-50/10 p-3">
            <div className="flex gap-2">
              <Input
                placeholder="Brand username"
                value={brandUsername}
                onChange={(e) => setBrandUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchBrand()}
              />
              <Button size="sm" onClick={searchBrand}>
                Search
              </Button>
            </div>
            {searchError && <p className="text-xs text-closed-500">{searchError}</p>}
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => addTag(p.id)}
                className="block w-full rounded-lg border border-bone-50/10 px-3 py-2 text-left text-sm text-bone-200 hover:border-bone-50/25"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="space-y-1.5">
            {tags.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-bone-300">{t.product.name}</span>
                <button onClick={() => removeTag(t.id)} className="text-bone-500 hover:text-closed-500">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
