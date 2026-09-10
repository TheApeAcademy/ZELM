import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { AppScreen } from '@/features/phone/AppScreen'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchMessages } from '@/lib/api'

export function ConversationScreen() {
  const { id } = useParams<{ id: string }>()
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [body, setBody] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: messages } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => fetchMessages(id!),
    enabled: !!id,
    refetchInterval: 4000,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.length])

  async function send() {
    if (!body.trim() || !account || !id) return
    const text = body.trim()
    setBody('')
    await supabase.from('messages').insert({ conversation_id: id, sender_account_id: account.id, body: text })
    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', id)
      .eq('account_id', account.id)
    await queryClient.invalidateQueries({ queryKey: ['messages', id] })
  }

  if (!account) return null

  return (
    <AppScreen title="Conversation">
      <div className="flex h-[60vh] flex-col">
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {(messages ?? []).map((m) => (
            <div
              key={m.id}
              className={cn(
                'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm',
                m.sender_account_id === account.id
                  ? 'ml-auto bg-signal-500 text-ink-950'
                  : 'bg-ink-900 text-bone-100',
              )}
            >
              {m.body}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Message…"
          />
          <Button onClick={send}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </AppScreen>
  )
}
