import { Link } from 'react-router-dom'
import {
  CreditCard,
  Image as ImageIcon,
  LayoutGrid,
  Handshake,
  Link2,
  ShoppingBag,
  Settings,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Avatar } from '@/components/ui/Avatar'
import { AvailabilityPill } from '@/components/ui/AvailabilityDot'
import { mediaUrl } from '@/lib/media'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function PhoneHome() {
  const { account } = useAuth()
  const isBrand = account?.kind === 'brand'

  const { data: availability } = useQuery({
    queryKey: ['my-availability', account?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('person_profiles')
        .select('availability')
        .eq('account_id', account!.id)
        .maybeSingle()
      return data?.availability ?? null
    },
    enabled: !!account && !isBrand,
  })

  if (!account) return null

  const apps = [
    { to: '/app/card', icon: CreditCard, label: 'My Card' },
    { to: '/app/gallery', icon: ImageIcon, label: 'Gallery' },
    ...(isBrand
      ? [{ to: '/app/catalog', icon: ShoppingBag, label: 'Catalog' }]
      : [{ to: '/app/portfolio', icon: LayoutGrid, label: 'Portfolio' }]),
    { to: '/app/collaborations', icon: Handshake, label: 'Collaborations' },
    { to: '/app/links', icon: Link2, label: 'Links' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-sm flex-col px-6 py-10">
      <div className="animate-fade-up rounded-3xl border border-bone-50/10 bg-gradient-to-b from-ink-900 to-ink-950 p-6">
        <div className="flex items-center gap-3">
          <Avatar src={mediaUrl(account.avatar_path)} name={account.display_name} size={52} />
          <div className="min-w-0">
            <p className="truncate text-display text-lg text-bone-50">{account.display_name}</p>
            <p className="truncate text-xs text-bone-500">@{account.username}</p>
          </div>
        </div>
        {availability && (
          <div className="mt-3">
            <AvailabilityPill status={availability} />
          </div>
        )}
        <Link
          to={`/${account.username}`}
          className="mt-4 block text-center text-xs text-bone-500 underline"
        >
          View public profile
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-y-6">
        {apps.map((app) => (
          <Link key={app.to} to={app.to} className="flex flex-col items-center gap-2">
            <span className="flex size-14 items-center justify-center rounded-2xl border border-bone-50/10 bg-ink-900 text-bone-100">
              <app.icon className="size-6" strokeWidth={1.5} />
            </span>
            <span className="text-label text-bone-400">{app.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
