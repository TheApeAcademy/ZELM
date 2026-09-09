import { useQuery } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { LinkButton } from '@/components/ui/LinkButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'
import { LayoutGrid } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { fetchPortfolio } from '@/lib/api'

export function PortfolioScreen() {
  const { account } = useAuth()
  const { data } = useQuery({
    queryKey: ['portfolio', account?.id],
    queryFn: () => fetchPortfolio(account!.id),
    enabled: !!account,
  })

  if (!account) return null

  return (
    <AppScreen
      title="Portfolio"
      action={
        <LinkButton to="/app/gallery" variant="secondary" size="sm">
          Curate from gallery
        </LinkButton>
      }
    >
      <p className="mb-6 text-sm text-bone-500">
        Your strongest work — the curated presentation brands see first. Add images from your
        Gallery.
      </p>
      {data && data.length > 0 ? (
        <GalleryGrid collections={[]} media={data} />
      ) : (
        <EmptyState
          icon={LayoutGrid}
          title="Nothing curated yet"
          description="Head to your Gallery and mark your best shots as portfolio pieces."
        />
      )}
    </AppScreen>
  )
}
