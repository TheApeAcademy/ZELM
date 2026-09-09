import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldGroup } from '@/components/ui/Field'
import { supabase } from '@/lib/supabase'

export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      navigate('/onboarding')
    } else {
      setCheckEmail(true)
    }
  }

  if (checkEmail) {
    return (
      <AuthLayout title="Check your email" subtitle="We sent a confirmation link.">
        <p className="text-sm text-bone-300">
          Confirm <span className="text-bone-50">{email}</span> to activate your ZELM identity,
          then come back and sign in.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm text-signal-400">
          Back to sign in
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Join ZELM" subtitle="Build your professional identity in fashion.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup>
          <Label>Email</Label>
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label hint="min. 8 characters">Password</Label>
          <Input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldGroup>
        {error && <p className="text-sm text-closed-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating your identity…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-bone-500">
        Already on ZELM?{' '}
        <Link to="/login" className="text-bone-50 underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
