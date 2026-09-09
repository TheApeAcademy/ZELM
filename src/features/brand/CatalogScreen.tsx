import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { mediaUrl, uploadMedia } from '@/lib/media'
import { fetchBrandCatalog } from '@/lib/api'
import { cn } from '@/lib/cn'

export function CatalogScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const fileInput = useRef<HTMLInputElement>(null)
  const [activeCollection, setActiveCollection] = useState<string | 'all'>('all')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imagePaths, setImagePaths] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const { data } = useQuery({
    queryKey: ['catalog', account?.id],
    queryFn: () => fetchBrandCatalog(account!.id),
    enabled: !!account,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ['catalog', account!.id] })
  }

  async function createCollection() {
    if (!newCollectionName.trim() || !account) return
    await supabase
      .from('brand_collections')
      .insert({ brand_account_id: account.id, name: newCollectionName.trim() })
    setNewCollectionName('')
    await invalidate()
  }

  async function handleProductImages(files: FileList | null) {
    if (!files || !account) return
    setUploading(true)
    const paths: string[] = []
    for (const file of Array.from(files)) {
      paths.push(await uploadMedia(account.id, 'products', file))
    }
    setImagePaths((prev) => [...prev, ...paths])
    setUploading(false)
  }

  async function addProduct() {
    if (!name.trim() || !account) return
    await supabase.from('products').insert({
      brand_account_id: account.id,
      brand_collection_id: activeCollection === 'all' ? null : activeCollection,
      name: name.trim(),
      description: description || null,
      price_amount: price ? Number(price) : null,
      image_paths: imagePaths,
    })
    setName('')
    setPrice('')
    setDescription('')
    setImagePaths([])
    setShowForm(false)
    await invalidate()
  }

  async function deleteProduct(id: string) {
    await supabase.from('products').delete().eq('id', id)
    await invalidate()
  }

  if (!account || !data) return null

  const visible =
    activeCollection === 'all'
      ? data.products
      : data.products.filter((p) => p.brand_collection_id === activeCollection)

  return (
    <AppScreen
      title="Catalog"
      action={
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="size-4" />
          Product
        </Button>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Chip active={activeCollection === 'all'} onClick={() => setActiveCollection('all')}>
          All
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

      {showForm && (
        <div className="mb-6 space-y-3 rounded-2xl border border-bone-50/10 p-4">
          <FieldGroup>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Price (EUR)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Description</Label>
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </FieldGroup>
          <div>
            <Label>Images</Label>
            <div className="flex flex-wrap gap-2">
              {imagePaths.map((p) => (
                <img key={p} src={mediaUrl(p)!} className="size-16 rounded-lg object-cover" />
              ))}
              <button
                onClick={() => fileInput.current?.click()}
                className="flex size-16 items-center justify-center rounded-lg border border-dashed border-bone-50/20 text-bone-500"
              >
                <Plus className="size-4" />
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleProductImages(e.target.files)}
              />
            </div>
          </div>
          <Button onClick={addProduct} disabled={uploading} className="w-full">
            Add product
          </Button>
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your catalog is empty"
          description="Add your first product to start building your storefront."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visible.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative mb-2 aspect-[4/5] overflow-hidden rounded-xl bg-ink-800">
                {product.image_paths[0] && (
                  <img src={mediaUrl(product.image_paths[0])!} className="h-full w-full object-cover" />
                )}
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-ink-950/70 p-1 text-bone-100 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <p className="truncate text-sm text-bone-100">{product.name}</p>
            </div>
          ))}
        </div>
      )}
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
