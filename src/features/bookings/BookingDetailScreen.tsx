import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Field'
import { mediaUrl } from '@/lib/media'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { fetchBookings, fetchContract, fetchPaymentRequests } from '@/lib/api'

export function BookingDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const [deliverables, setDeliverables] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [usageRights, setUsageRights] = useState('')
  const [cancellation, setCancellation] = useState('')
  const [requestAmount, setRequestAmount] = useState('')

  const { data: bookings } = useQuery({
    queryKey: ['bookings', account?.id],
    queryFn: () => fetchBookings(account!.id),
    enabled: !!account,
  })
  const booking = bookings?.find((b) => b.id === id)

  const { data: contract } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => fetchContract(id!),
    enabled: !!id,
  })
  const { data: payments } = useQuery({
    queryKey: ['payments', id],
    queryFn: () => fetchPaymentRequests(id!),
    enabled: !!id,
  })

  function invalidate() {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['contract', id] }),
      queryClient.invalidateQueries({ queryKey: ['payments', id] }),
      queryClient.invalidateQueries({ queryKey: ['bookings', account!.id] }),
    ])
  }

  async function createContract() {
    if (!id) return
    await supabase.from('contracts').insert({
      booking_id: id,
      deliverables: deliverables || null,
      payment_amount: paymentAmount ? Number(paymentAmount) : null,
      deadline: deadline || null,
      usage_rights: usageRights || null,
      cancellation_terms: cancellation || null,
    })
    await invalidate()
  }

  async function acceptContract() {
    if (!contract || !account || !booking) return
    const now = new Date().toISOString()
    const patch =
      booking.person_account_id === account.id ? { person_accepted_at: now } : { brand_accepted_at: now }
    await supabase.from('contracts').update(patch).eq('id', contract.id)
    await invalidate()
  }

  async function setBookingStatus(status: 'confirmed' | 'completed' | 'cancelled') {
    if (!id) return
    await supabase.from('bookings').update({ status }).eq('id', id)
    await invalidate()
  }

  async function requestPayment() {
    if (!id || !account || !requestAmount) return
    await supabase.from('payment_requests').insert({
      booking_id: id,
      amount: Number(requestAmount),
      requested_by: account.id,
    })
    setRequestAmount('')
    await invalidate()
  }

  async function markPaid(paymentId: string) {
    await supabase
      .from('payment_requests')
      .update({ status: 'marked_paid', marked_paid_at: new Date().toISOString() })
      .eq('id', paymentId)
    await invalidate()
  }

  if (!account || !booking) return null

  const counterpart = booking.person_account_id === account.id ? booking.brand : booking.person
  const bothAccepted = contract && contract.person_accepted_at && contract.brand_accepted_at
  const myAccepted = contract
    ? booking.person_account_id === account.id
      ? !!contract.person_accepted_at
      : !!contract.brand_accepted_at
    : false

  return (
    <AppScreen title={booking.title}>
      <div className="mb-6 flex items-center gap-3">
        <Avatar src={mediaUrl(counterpart.avatar_path)} name={counterpart.display_name} size={40} />
        <div>
          <p className="text-sm text-bone-50">{counterpart.display_name}</p>
          <Badge>{booking.status}</Badge>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        {booking.status === 'proposed' && (
          <Button size="sm" variant="secondary" onClick={() => setBookingStatus('confirmed')}>
            Mark confirmed
          </Button>
        )}
        {booking.status === 'confirmed' && (
          <Button size="sm" variant="secondary" onClick={() => setBookingStatus('completed')}>
            Mark completed
          </Button>
        )}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <Button size="sm" variant="danger" onClick={() => setBookingStatus('cancelled')}>
            Cancel
          </Button>
        )}
      </div>

      <p className="text-display mb-3 mt-8 text-lg text-bone-50">Contract</p>
      {contract ? (
        <div className="space-y-2 rounded-2xl border border-bone-50/10 p-4 text-sm">
          {contract.deliverables && (
            <p>
              <span className="text-bone-500">Deliverables: </span>
              {contract.deliverables}
            </p>
          )}
          {contract.payment_amount && (
            <p>
              <span className="text-bone-500">Payment: </span>
              {contract.payment_amount} {contract.payment_currency}
            </p>
          )}
          {contract.deadline && (
            <p>
              <span className="text-bone-500">Deadline: </span>
              {contract.deadline}
            </p>
          )}
          {contract.usage_rights && (
            <p>
              <span className="text-bone-500">Usage rights: </span>
              {contract.usage_rights}
            </p>
          )}
          {contract.cancellation_terms && (
            <p>
              <span className="text-bone-500">Cancellation: </span>
              {contract.cancellation_terms}
            </p>
          )}
          <p className="text-label mt-2 text-bone-600">
            {bothAccepted ? 'Accepted by both sides' : myAccepted ? 'Waiting on the other side' : 'Awaiting your acceptance'}
          </p>
          {!myAccepted && (
            <Button size="sm" onClick={acceptContract}>
              Accept terms
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-bone-50/10 p-4">
          <FieldGroup>
            <Label>Deliverables</Label>
            <Textarea rows={2} value={deliverables} onChange={(e) => setDeliverables(e.target.value)} />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup>
              <Label>Payment amount</Label>
              <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Deadline</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label>Usage rights</Label>
            <Input value={usageRights} onChange={(e) => setUsageRights(e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Cancellation terms</Label>
            <Input value={cancellation} onChange={(e) => setCancellation(e.target.value)} />
          </FieldGroup>
          <Button onClick={createContract} className="w-full">
            Propose contract
          </Button>
        </div>
      )}

      <p className="text-display mb-3 mt-8 text-lg text-bone-50">Payment</p>
      <p className="mb-3 text-xs text-bone-500">
        Manual tracking for now — connect a payment processor to accept cards directly.
      </p>
      <div className="mb-3 space-y-2">
        {(payments ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-bone-50/10 px-4 py-2.5">
            <span className="text-sm text-bone-200">
              {p.amount} {p.currency}
            </span>
            <div className="flex items-center gap-2">
              <Badge tone={p.status === 'marked_paid' ? 'live' : p.status === 'disputed' ? 'closed' : 'neutral'}>
                {p.status.replace('_', ' ')}
              </Badge>
              {p.status === 'pending' && p.requested_by !== account.id && (
                <Button size="sm" variant="secondary" onClick={() => markPaid(p.id)}>
                  Mark paid
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount"
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
        />
        <Button onClick={requestPayment}>Request payment</Button>
      </div>
    </AppScreen>
  )
}
