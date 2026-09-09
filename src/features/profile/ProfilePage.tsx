import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBrandCatalog, fetchCollaborations, fetchGallery, fetchIdentityByUsername, fetchPortfolio } from '@/lib/api'
import { ProfileHeader, Tabs } from './ProfileHeader'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'
import { CollaborationsList } from '@/features/collaborations/CollaborationsList'
import { CatalogGrid } from '@/features/brand/CatalogGrid'
import { MeasurementsPanel } from './MeasurementsPanel'
import { Skeleton } from '@/components/ui/Skeleton'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { data: result, isLoading } = useQuery({
    queryKey: ['identity', username],
    queryFn: () => fetchIdentityByUsername(username!),
    enabled: !!username,
  })

  const accountId = result?.identity.account.id
  const isBrand = result?.kind === 'brand'

  const { data: gallery } = useQuery({
    queryKey: ['gallery', accountId],
    queryFn: () => fetchGallery(accountId!),
    enabled: !!accountId,
  })
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio', accountId],
    queryFn: () => fetchPortfolio(accountId!),
    enabled: !!accountId,
  })
  const { data: collaborations } = useQuery({
    queryKey: ['collaborations', accountId],
    queryFn: () => fetchCollaborations(accountId!),
    enabled: !!accountId,
  })
  const { data: catalog } = useQuery({
    queryKey: ['catalog', accountId],
    queryFn: () => fetchBrandCatalog(accountId!),
    enabled: !!accountId && isBrand,
  })

  const [tab, setTab] = useState('portfolio')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="mb-6 h-56 w-full" />
        <Skeleton className="h-8 w-64" />
      </div>
    )
  }

  if (!result) return <Navigate to="/discover" replace />

  const { identity } = result
  const tabs = isBrand
    ? [
        { key: 'catalog', label: 'Catalog' },
        { key: 'gallery', label: 'Gallery' },
        { key: 'collaborators', label: 'Collaborators' },
      ]
    : [
        { key: 'portfolio', label: 'Portfolio' },
        { key: 'gallery', label: 'Gallery' },
        { key: 'collaborations', label: 'Collaborations' },
      ]

  const activeTab = tabs.some((t) => t.key === tab) ? tab : tabs[0].key

  return (
    <div>
      <ProfileHeader
        account={identity.account}
        roles={result.kind === 'person' ? result.identity.profile.roles : undefined}
        availability={result.kind === 'person' ? result.identity.profile.availability : undefined}
        category={result.kind === 'brand' ? result.identity.profile.category : undefined}
        socials={identity.socials}
      >
        {result.kind === 'person' && result.identity.measurements && (
          <MeasurementsPanel
            measurements={result.identity.measurements}
            profile={result.identity.profile}
          />
        )}
      </ProfileHeader>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Tabs tabs={tabs} active={activeTab} onChange={setTab} />

        <div className="py-8">
          {activeTab === 'portfolio' && (
            <GalleryGrid
              collections={[]}
              media={portfolio ?? []}
              emptyTitle="No portfolio selected yet"
              emptyDescription="Their strongest work will be curated here."
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryGrid collections={gallery?.collections ?? []} media={gallery?.media ?? []} />
          )}
          {activeTab === 'collaborations' && (
            <CollaborationsList collaborations={collaborations ?? []} perspective="person" />
          )}
          {activeTab === 'catalog' && (
            <CatalogGrid collections={catalog?.collections ?? []} products={catalog?.products ?? []} />
          )}
          {activeTab === 'collaborators' && (
            <CollaborationsList collaborations={collaborations ?? []} perspective="brand" />
          )}
        </div>
      </div>
    </div>
  )
}
