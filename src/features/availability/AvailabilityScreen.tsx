import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppScreen } from '@/features/phone/AppScreen'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { AvailabilityDay, AvailabilityStatus } from '@/lib/types'

const CYCLE: AvailabilityStatus[] = ['available', 'limited', 'unavailable']
const DOT_CLASS: Record<AvailabilityStatus, string> = {
  available: 'bg-live-500/20 text-live-500 border-live-500/40',
  limited: 'bg-limited-500/20 text-limited-500 border-limited-500/40',
  unavailable: 'bg-closed-500/20 text-closed-500 border-closed-500/40',
}

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startWeekday = (first.getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = Array.from({ length: startWeekday }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function AvailabilityScreen() {
  const { account } = useAuth()
  const queryClient = useQueryClient()
  const today = new Date()
  const [monthOffset, setMonthOffset] = useState(0)

  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const cells = useMemo(() => monthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])

  const { data: overrides } = useQuery({
    queryKey: ['availability-days', account?.id],
    queryFn: async () => {
      const { data } = await supabase.from('availability_days').select('*').eq('account_id', account!.id)
      return (data ?? []) as AvailabilityDay[]
    },
    enabled: !!account,
  })

  const byDay = new Map((overrides ?? []).map((o) => [o.day, o.status]))

  async function cycleDay(date: Date) {
    if (!account) return
    const key = toKey(date)
    const current = byDay.get(key)
    const next = current ? CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length] : CYCLE[1]
    if (current === 'unavailable' && next === 'available') {
      await supabase.from('availability_days').delete().eq('account_id', account.id).eq('day', key)
    } else {
      await supabase
        .from('availability_days')
        .upsert({ account_id: account.id, day: key, status: next }, { onConflict: 'account_id,day' })
    }
    await queryClient.invalidateQueries({ queryKey: ['availability-days', account.id] })
  }

  if (!account) return null

  return (
    <AppScreen title="Availability">
      <p className="mb-6 text-sm text-bone-500">
        Tap a date to mark it limited or unavailable. Untouched days follow your overall status.
      </p>

      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setMonthOffset((m) => m - 1)} className="text-bone-400 hover:text-bone-100">
          ←
        </button>
        <p className="text-display text-lg text-bone-50">
          {viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
        <button onClick={() => setMonthOffset((m) => m + 1)} className="text-bone-400 hover:text-bone-100">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="text-label text-bone-600">
            {d}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const status = byDay.get(toKey(date))
          return (
            <button
              key={i}
              onClick={() => cycleDay(date)}
              className={cn(
                'aspect-square rounded-lg border text-xs',
                status ? DOT_CLASS[status] : 'border-bone-50/10 text-bone-300 hover:border-bone-50/25',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex gap-4 text-xs text-bone-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-limited-500" /> Limited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-closed-500" /> Unavailable
        </span>
      </div>
    </AppScreen>
  )
}
