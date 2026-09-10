import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { AvailabilityPill } from '@/components/ui/AvailabilityDot'
import { LinkButton } from '@/components/ui/LinkButton'
import { Button } from '@/components/ui/Button'
import { mediaUrl } from '@/lib/media'
import { ROLE_LABEL, SOCIAL_PLATFORM_LABEL, type Account, type AvailabilityStatus, type ProfessionalRole, type SocialLink } from '@/lib/types'
import { useAuth } from '@/lib/auth'
import { findOrCreateConversation } from '@/lib/api'

export function ProfileHeader({
  account,
  roles,
  availability,
  category,
  socials,
  children,
}: {
  account: Account
  roles?: ProfessionalRole[]
  availability?: AvailabilityStatus
  category?: string | null
  socials: SocialLink[]
  children?: ReactNode
}) {
  const { account: viewer } = useAuth()
  const navigate = useNavigate()
  const isSelf = viewer?.id === account.id
  const cover = mediaUrl(account.cover_path)
  const [messaging, setMessaging] = useState(false)

  async function message() {
    if (!viewer) {
      navigate('/login')
      return
    }
    setMessaging(true)
    const conversationId = await findOrCreateConversation(viewer.id, account.id)
    navigate(`/app/messages/${conversationId}`)
  }

  return (
    <div>
      <div className="relative h-40 w-full overflow-hidden bg-ink-900 sm:h-56">
        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-12 flex items-end justify-between sm:-mt-14">
          <Avatar
            src={mediaUrl(account.avatar_path)}
            name={account.display_name}
            size={96}
            className="ring-4 ring-ink-950"
          />
          <div className="flex gap-2 pb-1">
            {isSelf ? (
              <LinkButton to="/app/settings" variant="secondary" size="sm">
                Edit profile
              </LinkButton>
            ) : (
              <>
                {viewer && (
                  <Button size="sm" variant="secondary" onClick={message} disabled={messaging}>
                    Message
                  </Button>
                )}
                <LinkButton to={`/${account.username}/card`} size="sm">
                  View card
                </LinkButton>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 animate-fade-up">
          <div className="flex items-center gap-2.5">
            <h1 className="text-display text-2xl text-bone-50 sm:text-3xl">{account.display_name}</h1>
          </div>
          <p className="mt-1 text-sm text-bone-400">
            {roles && roles.length > 0
              ? roles.map((r) => ROLE_LABEL[r]).join(' · ')
              : category || (account.kind === 'brand' ? 'Fashion brand' : 'ZELM identity')}
            {(account.location_city || account.location_country) && (
              <> · {[account.location_city, account.location_country].filter(Boolean).join(', ')}</>
            )}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {availability && <AvailabilityPill status={availability} />}
            {socials
              .filter((s) => s.is_public)
              .map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-label text-bone-500 hover:text-bone-100"
                >
                  {SOCIAL_PLATFORM_LABEL[s.platform]}
                </a>
              ))}
          </div>

          {account.bio && <p className="mt-4 max-w-2xl text-sm text-bone-300">{account.bio}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="mt-8 flex gap-1 border-b border-bone-50/10">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={
            'text-label -mb-px border-b-2 px-4 py-3 transition-colors ' +
            (active === t.key
              ? 'border-signal-500 text-bone-50'
              : 'border-transparent text-bone-500 hover:text-bone-200')
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
