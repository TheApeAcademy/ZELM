import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageCircle } from 'lucide-react'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { fetchConversations } from '@/lib/api'

export function MessagesScreen() {
  const { account } = useAuth()
  const { data: conversations } = useQuery({
    queryKey: ['conversations', account?.id],
    queryFn: () => fetchConversations(account!.id),
    enabled: !!account,
  })

  if (!account) return null

  return (
    <AppScreen title="Messages">
      {conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((c) => {
            const other = c.conversation_participants.find((p) => p.account.id !== account.id)?.account
            if (!other) return null
            return (
              <Link
                key={c.id}
                to={`/app/messages/${c.id}`}
                className="flex items-center gap-3 rounded-2xl border border-bone-50/10 p-4 transition-colors hover:border-bone-50/25"
              >
                <Avatar src={mediaUrl(other.avatar_path)} name={other.display_name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-bone-50">{other.display_name}</p>
                  <p className="truncate text-xs text-bone-500">@{other.username}</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageCircle}
          title="No conversations yet"
          description="Message a profile from their page to start a conversation."
        />
      )}
    </AppScreen>
  )
}
