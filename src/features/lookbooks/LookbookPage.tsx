import { useParams, Navigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from '@/components/ui/Avatar'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'
import { mediaUrl } from '@/lib/media'
import { fetchLookbookBySlug } from '@/lib/api'

export function LookbookPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['lookbook', slug],
    queryFn: () => fetchLookbookBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return null
  if (!data) return <Navigate to="/discover" replace />

  const { lookbook, account, media } = data

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to={`/${account.username}`} className="mb-6 flex items-center gap-3">
        <Avatar src={mediaUrl(account.avatar_path)} name={account.display_name} size={40} />
        <div>
          <p className="text-sm text-bone-200">{account.display_name}</p>
          <p className="text-xs text-bone-500">@{account.username}</p>
        </div>
      </Link>
      <h1 className="text-display mb-1 text-3xl text-bone-50">{lookbook.title}</h1>
      {lookbook.description && <p className="mb-8 text-sm text-bone-500">{lookbook.description}</p>}
      <GalleryGrid collections={[]} media={media} />
    </div>
  )
}
