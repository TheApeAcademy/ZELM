import { supabase } from './supabase'
import type {
  BrandIdentity,
  CollaborationWithParties,
  DiscoveryAccount,
  PersonIdentity,
} from './types'

/** Resolves a public zelm.com/username page — either a person or a brand. */
export async function fetchIdentityByUsername(
  username: string,
): Promise<{ kind: 'person'; identity: PersonIdentity } | { kind: 'brand'; identity: BrandIdentity } | null> {
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .ilike('username', username)
    .maybeSingle()

  if (!account) return null

  const [{ data: socials }, { data: contact }, { data: card }, { data: phone }] =
    await Promise.all([
      supabase.from('social_links').select('*').eq('account_id', account.id).order('sort_order'),
      supabase.from('contact_info').select('*').eq('account_id', account.id).maybeSingle(),
      supabase.from('card_settings').select('*').eq('account_id', account.id).maybeSingle(),
      supabase.from('phone_settings').select('*').eq('account_id', account.id).maybeSingle(),
    ])

  if (account.kind === 'brand') {
    const { data: profile } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('account_id', account.id)
      .single()
    return {
      kind: 'brand',
      identity: {
        account,
        profile: profile!,
        socials: socials ?? [],
        contact: contact ?? null,
        card: card ?? null,
        phone: phone ?? null,
      },
    }
  }

  const [{ data: profile }, { data: measurements }] = await Promise.all([
    supabase.from('person_profiles').select('*').eq('account_id', account.id).single(),
    supabase.from('person_measurements').select('*').eq('account_id', account.id).maybeSingle(),
  ])

  return {
    kind: 'person',
    identity: {
      account,
      profile: profile!,
      measurements: measurements ?? null,
      socials: socials ?? [],
      contact: contact ?? null,
      card: card ?? null,
      phone: phone ?? null,
    },
  }
}

export async function resolveCardPhotoPath(mediaId: string): Promise<string | null> {
  const { data } = await supabase.from('media_items').select('storage_path').eq('id', mediaId).maybeSingle()
  return data?.storage_path ?? null
}

export async function fetchGallery(accountId: string) {
  const [{ data: collections }, { data: media }] = await Promise.all([
    supabase
      .from('collections')
      .select('*')
      .eq('account_id', accountId)
      .order('sort_order'),
    supabase
      .from('media_items')
      .select('*')
      .eq('account_id', accountId)
      .order('sort_order'),
  ])
  return { collections: collections ?? [], media: media ?? [] }
}

export async function fetchPortfolio(accountId: string) {
  const { data } = await supabase
    .from('media_items')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_portfolio', true)
    .order('sort_order')
  return data ?? []
}

export async function fetchBrandCatalog(brandAccountId: string) {
  const [{ data: collections }, { data: products }] = await Promise.all([
    supabase
      .from('brand_collections')
      .select('*')
      .eq('brand_account_id', brandAccountId)
      .order('sort_order'),
    supabase
      .from('products')
      .select('*')
      .eq('brand_account_id', brandAccountId)
      .order('sort_order'),
  ])
  return { collections: collections ?? [], products: products ?? [] }
}

export async function fetchCollaborations(
  accountId: string,
): Promise<CollaborationWithParties[]> {
  const { data } = await supabase
    .from('collaborations')
    .select(
      '*, person:accounts!collaborations_person_account_id_fkey(*), brand:accounts!collaborations_brand_account_id_fkey(*)',
    )
    .or(`person_account_id.eq.${accountId},brand_account_id.eq.${accountId}`)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as CollaborationWithParties[]
}

export interface DiscoveryFilters {
  kind?: 'person' | 'brand'
  role?: string
  location?: string
  availability?: string
  query?: string
}

export async function searchAccounts(filters: DiscoveryFilters): Promise<DiscoveryAccount[]> {
  let q = supabase
    .from('accounts')
    .select('*, person_profiles(roles, availability)')
    .eq('onboarding_completed', true)

  if (filters.kind) q = q.eq('kind', filters.kind)
  if (filters.location) q = q.ilike('location_city', `%${filters.location}%`)
  if (filters.query) q = q.or(`display_name.ilike.%${filters.query}%,username.ilike.%${filters.query}%`)

  const { data } = await q.order('created_at', { ascending: false }).limit(60)
  let rows = (data ?? []) as unknown as DiscoveryAccount[]

  if (filters.role) {
    rows = rows.filter((r) => r.person_profiles?.roles?.includes(filters.role as never))
  }
  if (filters.availability) {
    rows = rows.filter((r) => r.person_profiles?.availability === filters.availability)
  }
  return rows
}
