import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LinkButton } from '@/components/ui/LinkButton'
import { searchAccounts } from '@/lib/api'
import { IdentityTile } from '@/features/discovery/IdentityTile'
import { Fingerprint, Layers, Compass as CompassIcon } from 'lucide-react'

export function LandingPage() {
  const { data: preview } = useQuery({
    queryKey: ['landing-preview'],
    queryFn: () => searchAccounts({}),
  })

  return (
    <div>
      <section className="relative overflow-hidden border-b border-bone-50/8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--color-signal-500) 22%, transparent), transparent 45%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
          <p className="text-label mb-6 text-signal-400">A ZEBRAISH company</p>
          <h1 className="text-display mx-auto max-w-3xl text-5xl leading-[1.05] text-bone-50 sm:text-6xl">
            The professional world of fashion.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-bone-400">
            One connected identity for models, creators, photographers, stylists and the brands
            they work with — your work, your card, your world.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <LinkButton to="/signup" size="lg">
              Join ZELM
            </LinkButton>
            <LinkButton to="/discover" size="lg" variant="secondary">
              Explore the network
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          <Pillar
            icon={Fingerprint}
            title="Identity"
            description="Who you are — one profile, every role, everywhere you're credible."
          />
          <Pillar
            icon={Layers}
            title="Work"
            description="What you've done — gallery, portfolio, and collaborations verified by the brands themselves."
          />
          <Pillar
            icon={CompassIcon}
            title="Opportunity"
            description="What you're available for — discovered by brands searching for exactly you."
          />
        </div>
      </section>

      {preview && preview.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-display text-2xl text-bone-50">Live on ZELM</h2>
            <Link to="/discover" className="text-sm text-signal-400">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {preview.slice(0, 8).map((account) => (
              <IdentityTile key={account.id} account={account} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Pillar({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Fingerprint
  title: string
  description: string
}) {
  return (
    <div>
      <Icon className="mb-4 size-5 text-signal-400" strokeWidth={1.75} />
      <h3 className="text-display mb-1.5 text-xl text-bone-50">{title}</h3>
      <p className="text-sm text-bone-500">{description}</p>
    </div>
  )
}
