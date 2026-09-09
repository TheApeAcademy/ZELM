import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { mediaUrl } from '@/lib/media'
import type { BrandCollection, Product } from '@/lib/types'

export function CatalogGrid({
  collections,
  products,
}: {
  collections: BrandCollection[]
  products: Product[]
}) {
  const [active, setActive] = useState<string | 'all'>('all')
  const visible = active === 'all' ? products : products.filter((p) => p.brand_collection_id === active)

  if (products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No products in the catalog yet"
        description="This brand's collections will appear here once published."
      />
    )
  }

  return (
    <div>
      {collections.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <Chip active={active === 'all'} onClick={() => setActive('all')}>
            All
          </Chip>
          {collections.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {visible.map((product) => (
          <div key={product.id} className="group">
            <div className="relative mb-2 aspect-[4/5] overflow-hidden rounded-xl bg-ink-800">
              {product.image_paths[0] ? (
                <img
                  src={mediaUrl(product.image_paths[0])!}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-bone-600">
                  <ShoppingBag className="size-6" strokeWidth={1.5} />
                </div>
              )}
              {!product.is_available && (
                <Badge tone="closed" className="absolute left-2 top-2">
                  Sold out
                </Badge>
              )}
            </div>
            <p className="truncate text-sm text-bone-100">{product.name}</p>
            {product.price_amount != null && (
              <p className="text-sm text-bone-500">
                {formatPrice(product.price_amount, product.price_currency)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
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
