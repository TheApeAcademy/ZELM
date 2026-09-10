import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Textarea } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchReviewableCollaborations, fetchReviews } from '@/lib/api'

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)}>
          <Star
            className={cn('size-5', n <= value ? 'fill-signal-400 text-signal-400' : 'text-bone-600')}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewsScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({})

  const { data: reviewable } = useQuery({
    queryKey: ['reviewable', account?.id],
    queryFn: () => fetchReviewableCollaborations(account!.id),
    enabled: !!account,
  })
  const { data: received } = useQuery({
    queryKey: ['reviews-received', account?.id],
    queryFn: () => fetchReviews(account!.id),
    enabled: !!account,
  })

  async function submitReview(collaborationId: string, revieweeId: string) {
    const draft = drafts[collaborationId]
    if (!draft || !account) return
    await supabase.from('reviews').insert({
      collaboration_id: collaborationId,
      reviewer_account_id: account.id,
      reviewee_account_id: revieweeId,
      rating: draft.rating,
      comment: draft.comment || null,
    })
    await queryClient.invalidateQueries({ queryKey: ['reviewable', account.id] })
  }

  if (!account) return null

  return (
    <AppScreen title="Reviews">
      <p className="text-display mb-3 text-lg text-bone-50">Leave a review</p>
      {reviewable && reviewable.length > 0 ? (
        <div className="mb-8 space-y-4">
          {reviewable.map((c) => {
            const counterpart = c.person_account_id === account.id ? c.brand : c.person
            const draft = drafts[c.id] ?? { rating: 0, comment: '' }
            return (
              <div key={c.id} className="rounded-2xl border border-bone-50/10 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <Avatar src={mediaUrl(counterpart.avatar_path)} name={counterpart.display_name} size={36} />
                  <div>
                    <p className="text-sm text-bone-50">{counterpart.display_name}</p>
                    <p className="text-xs text-bone-500">{c.title}</p>
                  </div>
                </div>
                <StarPicker
                  value={draft.rating}
                  onChange={(rating) => setDrafts((d) => ({ ...d, [c.id]: { ...draft, rating } }))}
                />
                <Textarea
                  className="mt-2"
                  rows={2}
                  placeholder="How was the collaboration?"
                  value={draft.comment}
                  onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: { ...draft, comment: e.target.value } }))}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  disabled={!draft.rating}
                  onClick={() => submitReview(c.id, counterpart.id)}
                >
                  Submit review
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mb-8 text-sm text-bone-500">No verified collaborations awaiting review.</p>
      )}

      <p className="text-display mb-3 text-lg text-bone-50">Reviews received</p>
      {received && received.length > 0 ? (
        <div className="space-y-3">
          {received.map((r) => (
            <div key={r.id} className="rounded-2xl border border-bone-50/10 p-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('size-3.5', i < r.rating ? 'fill-signal-400 text-signal-400' : 'text-bone-700')} />
                ))}
              </div>
              {r.comment && <p className="mt-2 text-sm text-bone-300">{r.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Star} title="No reviews yet" description="Verified collaborations build trust here." />
      )}
    </AppScreen>
  )
}
