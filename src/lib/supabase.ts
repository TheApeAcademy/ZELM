import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    '[zelm] Missing Supabase env vars — copy .env.local.example to .env.local and fill in your project keys.',
  )
}

export const supabase = createClient<Database>(url ?? '', anonKey ?? '')
