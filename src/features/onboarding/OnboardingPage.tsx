import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import {
  ROLE_LABEL,
  OPEN_TO_OPTIONS,
  type AccountKind,
  type ProfessionalRole,
} from '@/lib/types'
import { User, Building2 } from 'lucide-react'

const ROLES = Object.keys(ROLE_LABEL) as ProfessionalRole[]
const STEPS = ['kind', 'roles', 'identity', 'preferences'] as const
type Step = (typeof STEPS)[number]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { session, refreshAccount } = useAuth()
  const [stepIndex, setStepIndex] = useState(0)
  const step: Step = STEPS[stepIndex]

  const [kind, setKind] = useState<AccountKind>('person')
  const [roles, setRoles] = useState<ProfessionalRole[]>([])
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')
  const [openTo, setOpenTo] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveSteps: Step[] = kind === 'brand' ? STEPS.filter((s) => s !== 'roles') : [...STEPS]
  const currentPos = effectiveSteps.indexOf(step)

  function next() {
    const idx = effectiveSteps.indexOf(step)
    if (idx < effectiveSteps.length - 1) {
      setStepIndex(STEPS.indexOf(effectiveSteps[idx + 1]))
    } else {
      handleSubmit()
    }
  }
  function back() {
    const idx = effectiveSteps.indexOf(step)
    if (idx > 0) setStepIndex(STEPS.indexOf(effectiveSteps[idx - 1]))
  }

  function toggleRole(r: ProfessionalRole) {
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))
  }
  function toggleOpenTo(o: string) {
    setOpenTo((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]))
  }

  async function handleSubmit() {
    if (!session) return
    setSubmitting(true)
    setError(null)

    const { error: accountError } = await supabase.from('accounts').insert({
      id: session.user.id,
      kind,
      username: username.toLowerCase(),
      display_name: displayName,
      bio: bio || null,
      location_city: city || null,
      location_country: country || null,
      onboarding_completed: true,
    })

    if (accountError) {
      setSubmitting(false)
      setError(
        accountError.message.includes('username')
          ? 'That username is taken — try another.'
          : accountError.message,
      )
      return
    }

    if (kind === 'person') {
      await supabase.from('person_profiles').insert({
        account_id: session.user.id,
        roles,
        open_to: openTo,
      })
    } else {
      await supabase.from('brand_profiles').insert({
        account_id: session.user.id,
        category: category || null,
      })
    }

    await supabase.from('card_settings').insert({ account_id: session.user.id })
    await supabase.from('phone_settings').insert({ account_id: session.user.id })

    await refreshAccount()
    setSubmitting(false)
    navigate('/app')
  }

  const canProceed =
    (step === 'kind' && kind) ||
    (step === 'roles' && roles.length > 0) ||
    (step === 'identity' && username.length >= 3 && displayName.length >= 1) ||
    (step === 'preferences' && true)

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-16">
      <Logo className="mb-8" />
      <div className="mb-8 flex gap-1.5">
        {effectiveSteps.map((s, i) => (
          <div
            key={s}
            className={cn(
              'h-1 flex-1 rounded-full',
              i <= currentPos ? 'bg-signal-500' : 'bg-bone-50/10',
            )}
          />
        ))}
      </div>

      {step === 'kind' && (
        <StepShell title="Who are you?" subtitle="Every ZELM identity starts here.">
          <div className="grid grid-cols-2 gap-3">
            <KindCard
              icon={User}
              label="Talent"
              description="Model, creator, photographer & more"
              active={kind === 'person'}
              onClick={() => setKind('person')}
            />
            <KindCard
              icon={Building2}
              label="Brand"
              description="Fashion label or creative studio"
              active={kind === 'brand'}
              onClick={() => setKind('brand')}
            />
          </div>
        </StepShell>
      )}

      {step === 'roles' && (
        <StepShell title="What do you do?" subtitle="Select every role that fits — no box required.">
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <Chip key={r} active={roles.includes(r)} onClick={() => toggleRole(r)}>
                {ROLE_LABEL[r]}
              </Chip>
            ))}
          </div>
        </StepShell>
      )}

      {step === 'identity' && (
        <StepShell title="Your identity" subtitle="This becomes zelm.com/username.">
          <div className="space-y-4">
            <FieldGroup>
              <Label hint="lowercase, letters, numbers, . _">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="christian.prieto"
              />
            </FieldGroup>
            <FieldGroup>
              <Label>{kind === 'brand' ? 'Brand name' : 'Full name'}</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup>
                <Label>City</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
              </FieldGroup>
              <FieldGroup>
                <Label>Country</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} />
              </FieldGroup>
            </div>
            <FieldGroup>
              <Label>Bio</Label>
              <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </FieldGroup>
          </div>
        </StepShell>
      )}

      {step === 'preferences' && (
        <StepShell
          title={kind === 'brand' ? 'Your category' : 'What are you open to?'}
          subtitle={
            kind === 'brand'
              ? 'How would you describe your brand?'
              : 'Brands see this before they reach out.'
          }
        >
          {kind === 'brand' ? (
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Streetwear, luxury, footwear…"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {OPEN_TO_OPTIONS.map((o) => (
                <Chip key={o} active={openTo.includes(o)} onClick={() => toggleOpenTo(o)}>
                  {o}
                </Chip>
              ))}
            </div>
          )}
        </StepShell>
      )}

      {error && <p className="mt-4 text-sm text-closed-500">{error}</p>}

      <div className="mt-10 flex gap-3">
        {currentPos > 0 && (
          <Button variant="secondary" onClick={back} className="flex-1">
            Back
          </Button>
        )}
        <Button onClick={next} disabled={!canProceed || submitting} className="flex-1">
          {submitting
            ? 'Setting up…'
            : currentPos === effectiveSteps.length - 1
              ? 'Enter ZELM'
              : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-display mb-1.5 text-2xl text-bone-50">{title}</h1>
      <p className="mb-6 text-sm text-bone-500">{subtitle}</p>
      {children}
    </div>
  )
}

function KindCard({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}: {
  icon: typeof User
  label: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-2xl border p-5 text-left transition-colors',
        active ? 'border-signal-500 bg-signal-500/10' : 'border-bone-50/15 hover:border-bone-50/30',
      )}
    >
      <Icon className={cn('mb-3 size-5', active ? 'text-signal-400' : 'text-bone-400')} />
      <p className="text-bone-50">{label}</p>
      <p className="mt-1 text-xs text-bone-500">{description}</p>
    </button>
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
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-2 text-sm transition-colors',
        active
          ? 'border-signal-500 bg-signal-500/15 text-signal-400'
          : 'border-bone-50/15 text-bone-300 hover:border-bone-50/30',
      )}
    >
      {children}
    </button>
  )
}
