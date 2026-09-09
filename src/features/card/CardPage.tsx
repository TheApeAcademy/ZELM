import { useParams, Navigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import { Share2, Copy, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { fetchIdentityByUsername, resolveCardPhotoPath } from '@/lib/api'
import { DigitalCard } from './DigitalCard'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'

export function CardPage() {
  const { username } = useParams<{ username: string }>()
  const { data: result, isLoading } = useQuery({
    queryKey: ['identity', username],
    queryFn: () => fetchIdentityByUsername(username!),
    enabled: !!username,
  })
  const { data: cardPhoto } = useQuery({
    queryKey: ['card-photo', result?.identity.card?.primary_media_id],
    queryFn: () => resolveCardPhotoPath(result!.identity.card!.primary_media_id!),
    enabled: !!result?.identity.card?.primary_media_id,
  })
  const [copied, setCopied] = useState(false)

  if (isLoading) return null
  if (!result) return <Navigate to="/discover" replace />

  const { identity } = result
  const url = `${window.location.origin}/${identity.account.username}`

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: identity.account.display_name, url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-ink-950 px-6 py-10">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between">
        <Link to={`/${identity.account.username}`} className="flex items-center gap-1 text-sm text-bone-500">
          <ArrowLeft className="size-4" />
          Profile
        </Link>
        <Logo />
      </div>

      <DigitalCard
        account={identity.account}
        photoPath={cardPhoto ?? identity.account.avatar_path}
        tagline={identity.card?.tagline ?? null}
        personProfile={result.kind === 'person' ? result.identity.profile : null}
        measurements={result.kind === 'person' ? result.identity.measurements : null}
        brandCategory={result.kind === 'brand' ? result.identity.profile.category : null}
      />

      <div className="mt-8 rounded-2xl bg-white p-4">
        <QRCodeSVG value={url} size={140} />
      </div>
      <p className="mt-3 text-xs text-bone-500">Scan to open @{identity.account.username}</p>

      <div className="mt-8 flex w-full max-w-sm gap-3">
        <Button variant="secondary" className="flex-1" onClick={copyLink}>
          <Copy className="size-4" />
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button className="flex-1" onClick={share}>
          <Share2 className="size-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
