import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileSignature } from 'lucide-react'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { fetchBookings } from '@/lib/api'
import type { BookingStatus } from '@/lib/types'

const STATUS_TONE: Record<BookingStatus, 'neutral' | 'live' | 'closed'> = {
  proposed: 'neutral',
  confirmed: 'live',
  completed: 'live',
  cancelled: 'closed',
}

export function BookingsScreen() {
  const { account } = useAuth()
  const { data: bookings } = useQuery({
    queryKey: ['bookings', account?.id],
    queryFn: () => fetchBookings(account!.id),
    enabled: !!account,
  })

  if (!account) return null

  return (
    <AppScreen title="Bookings">
      {bookings && bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((b) => {
            const counterpart = b.person_account_id === account.id ? b.brand : b.person
            return (
              <Link
                key={b.id}
                to={`/app/bookings/${b.id}`}
                className="flex items-center gap-3 rounded-2xl border border-bone-50/10 p-4 transition-colors hover:border-bone-50/25"
              >
                <Avatar src={mediaUrl(counterpart.avatar_path)} name={counterpart.display_name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-bone-50">{b.title}</p>
                  <p className="text-xs text-bone-500">{counterpart.display_name}</p>
                </div>
                <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileSignature}
          title="No bookings yet"
          description="Accepted applications and invitations become bookings here."
        />
      )}
    </AppScreen>
  )
}
