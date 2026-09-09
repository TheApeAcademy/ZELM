import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Compass, Smartphone, Home } from 'lucide-react'
import { Logo } from './Logo'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { mediaUrl } from '@/lib/media'
import { cn } from '@/lib/cn'

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-label rounded-full px-4 py-2 transition-colors',
    isActive ? 'bg-bone-50/10 text-bone-50' : 'text-bone-500 hover:text-bone-100',
  )

export function AppShell() {
  const { session, account } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-bone-50/8 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <NavLink to="/" aria-label="ZELM home">
              <Logo />
            </NavLink>
            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink to="/discover" className={navItemClass}>
                Discover
              </NavLink>
              {account && (
                <NavLink to="/app" className={navItemClass}>
                  My ZELM
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {session && account ? (
              <button
                onClick={() => navigate(`/app`)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-bone-50/8"
              >
                <Avatar src={mediaUrl(account.avatar_path)} name={account.display_name} size={28} />
                <span className="hidden text-sm text-bone-100 sm:inline">
                  {account.display_name}
                </span>
              </button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')}>
                  Join ZELM
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 sm:pb-0">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-bone-50/8 bg-ink-950/95 py-2 backdrop-blur-md sm:hidden">
        <MobileTab to="/" icon={Home} label="Home" />
        <MobileTab to="/discover" icon={Compass} label="Discover" />
        <MobileTab to="/app" icon={Smartphone} label="My ZELM" />
      </nav>
    </div>
  )
}

function MobileTab({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: typeof Home
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center gap-1 px-4 py-1 text-[11px]',
          isActive ? 'text-signal-400' : 'text-bone-500',
        )
      }
    >
      <Icon className="size-5" strokeWidth={1.75} />
      {label}
    </NavLink>
  )
}
