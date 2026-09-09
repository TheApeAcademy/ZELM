import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldGroup } from '@/components/ui/Field'
import { supabase } from '@/lib/supabase'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }
    const { data: account } = await supabase
      .from('accounts')
      .select('onboarding_completed')
      .eq('id', data.user.id)
      .maybeSingle()
    setLoading(false)
    navigate(account?.onboarding_completed ? '/app' : '/onboarding')
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your ZELM identity.">
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
          <Label>Password</Label>
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldGroup>
        {error && <p className="text-sm text-closed-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-bone-500">
        New to ZELM?{' '}
        <Link to="/signup" className="text-bone-50 underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
