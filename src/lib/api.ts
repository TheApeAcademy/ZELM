import { supabase } from './supabase'
import type {
  Account,
  ApplicationWithPerson,
  AudienceStat,
  AvailabilityDay,
  BookingWithParties,
  BrandIdentity,
  Campaign,
  CampaignWithBrand,
  CollaborationWithParties,
  Contract,
  ConversationWithParticipants,
  DiscoveryAccount,
  InvitationWithCampaign,
  Lookbook,
  MediaItem,
  MediaProductTag,
  Message,
  PaymentRequest,
  PersonIdentity,
  Rate,
  Review,
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

// ============================================================
// OPPORTUNITIES: campaigns, applications, invitations
// ============================================================

export interface OpportunityFilters {
  role?: string
  location?: string
}

export async function fetchOpenCampaigns(filters: OpportunityFilters = {}): Promise<CampaignWithBrand[]> {
  let q = supabase
    .from('campaigns')
    .select('*, brand:accounts!campaigns_brand_account_id_fkey(*)')
    .eq('status', 'open')
  if (filters.location) q = q.ilike('location', `%${filters.location}%`)
  const { data } = await q.order('created_at', { ascending: false })
  let rows = (data ?? []) as unknown as CampaignWithBrand[]
  if (filters.role) rows = rows.filter((c) => c.talent_types.includes(filters.role as never))
  return rows
}

export async function fetchBrandCampaigns(brandAccountId: string): Promise<Campaign[]> {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('brand_account_id', brandAccountId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function fetchCampaign(id: string): Promise<CampaignWithBrand | null> {
  const { data } = await supabase
    .from('campaigns')
    .select('*, brand:accounts!campaigns_brand_account_id_fkey(*)')
    .eq('id', id)
    .maybeSingle()
  return (data as unknown as CampaignWithBrand) ?? null
}

export async function fetchCampaignApplications(campaignId: string): Promise<ApplicationWithPerson[]> {
  const { data } = await supabase
    .from('campaign_applications')
    .select('*, person:accounts!campaign_applications_person_account_id_fkey(*)')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as ApplicationWithPerson[]
}

export async function fetchMyApplications(personAccountId: string) {
  const { data } = await supabase
    .from('campaign_applications')
    .select('*, campaign:campaigns(*, brand:accounts!campaigns_brand_account_id_fkey(*))')
    .eq('person_account_id', personAccountId)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as (ApplicationWithPerson & { campaign: CampaignWithBrand })[]
}

export async function fetchMyInvitations(personAccountId: string): Promise<InvitationWithCampaign[]> {
  const { data } = await supabase
    .from('campaign_invitations')
    .select('*, campaign:campaigns(*, brand:accounts!campaigns_brand_account_id_fkey(*))')
    .eq('person_account_id', personAccountId)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as InvitationWithCampaign[]
}

// ============================================================
// MESSAGING
// ============================================================

export async function fetchConversations(accountId: string): Promise<ConversationWithParticipants[]> {
  const { data: participantRows } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('account_id', accountId)
  const ids = (participantRows ?? []).map((r) => r.conversation_id)
  if (ids.length === 0) return []

  const { data } = await supabase
    .from('conversations')
    .select('*, conversation_participants(account:accounts(*))')
    .in('id', ids)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as ConversationWithParticipants[]
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at')
  return data ?? []
}

export async function findOrCreateConversation(selfId: string, otherId: string): Promise<string> {
  const { data: mine } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('account_id', selfId)
  const { data: theirs } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('account_id', otherId)

  const mineIds = new Set((mine ?? []).map((r) => r.conversation_id))
  const shared = (theirs ?? []).find((r) => mineIds.has(r.conversation_id))
  if (shared) return shared.conversation_id

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({})
    .select('id')
    .single()
  if (error || !conversation) throw error ?? new Error('Could not start conversation')

  await supabase.from('conversation_participants').insert([
    { conversation_id: conversation.id, account_id: selfId },
    { conversation_id: conversation.id, account_id: otherId },
  ])
  return conversation.id
}

// ============================================================
// AVAILABILITY CALENDAR
// ============================================================

export async function fetchAvailabilityDays(accountId: string): Promise<AvailabilityDay[]> {
  const { data } = await supabase
    .from('availability_days')
    .select('*')
    .eq('account_id', accountId)
    .gte('day', new Date().toISOString().slice(0, 10))
    .order('day')
  return data ?? []
}

// ============================================================
// LOOKBOOKS
// ============================================================

export async function fetchLookbooks(accountId: string): Promise<Lookbook[]> {
  const { data } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function fetchLookbookBySlug(
  slug: string,
): Promise<{ lookbook: Lookbook; account: Account; media: MediaItem[] } | null> {
  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .ilike('share_slug', slug)
    .maybeSingle()
  if (!lookbook) return null

  const [{ data: account }, { data: items }] = await Promise.all([
    supabase.from('accounts').select('*').eq('id', lookbook.account_id).single(),
    supabase
      .from('lookbook_items')
      .select('sort_order, media:media_items(*)')
      .eq('lookbook_id', lookbook.id)
      .order('sort_order'),
  ])

  const media = ((items ?? []) as unknown as { media: MediaItem }[]).map((i) => i.media)
  return { lookbook, account: account!, media }
}

// ============================================================
// REVIEWS
// ============================================================

export async function fetchReviews(accountId: string): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewee_account_id', accountId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function fetchReviewableCollaborations(
  accountId: string,
): Promise<CollaborationWithParties[]> {
  const all = await fetchCollaborations(accountId)
  const { data: existing } = await supabase
    .from('reviews')
    .select('collaboration_id')
    .eq('reviewer_account_id', accountId)
  const reviewed = new Set((existing ?? []).map((r) => r.collaboration_id))
  return all.filter((c) => c.status === 'verified' && !reviewed.has(c.id))
}

// ============================================================
// RATES + MEDIA KIT
// ============================================================

export async function fetchRates(accountId: string): Promise<Rate[]> {
  const { data } = await supabase.from('rates').select('*').eq('account_id', accountId).order('sort_order')
  return data ?? []
}

export async function fetchAudienceStats(accountId: string): Promise<AudienceStat[]> {
  const { data } = await supabase.from('audience_stats').select('*').eq('account_id', accountId)
  return data ?? []
}

export async function fetchMediaKitData(username: string) {
  const result = await fetchIdentityByUsername(username)
  if (!result) return null
  const [rates, audience, collaborations, reviews] = await Promise.all([
    fetchRates(result.identity.account.id),
    fetchAudienceStats(result.identity.account.id),
    fetchCollaborations(result.identity.account.id),
    fetchReviews(result.identity.account.id),
  ])
  return { result, rates, audience, collaborations, reviews }
}

// ============================================================
// BOOKINGS + CONTRACTS + PAYMENT TRACKING
// ============================================================

export async function fetchBookings(accountId: string): Promise<BookingWithParties[]> {
  const { data } = await supabase
    .from('bookings')
    .select('*, person:accounts!bookings_person_account_id_fkey(*), brand:accounts!bookings_brand_account_id_fkey(*)')
    .or(`person_account_id.eq.${accountId},brand_account_id.eq.${accountId}`)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as BookingWithParties[]
}

export async function fetchContract(bookingId: string): Promise<Contract | null> {
  const { data } = await supabase.from('contracts').select('*').eq('booking_id', bookingId).maybeSingle()
  return data ?? null
}

export async function fetchPaymentRequests(bookingId: string): Promise<PaymentRequest[]> {
  const { data } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false })
  return data ?? []
}

// ============================================================
// REPUTATION
// ============================================================

export interface Reputation {
  verifiedCollaborations: number
  distinctBrandsOrTalent: number
  averageRating: number | null
  reviewCount: number
}

export async function computeReputation(accountId: string): Promise<Reputation> {
  const [collaborations, reviews] = await Promise.all([
    fetchCollaborations(accountId),
    fetchReviews(accountId),
  ])
  const verified = collaborations.filter((c) => c.status === 'verified')
  const counterpartIds = new Set(
    verified.map((c) => (c.person_account_id === accountId ? c.brand_account_id : c.person_account_id)),
  )
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null

  return {
    verifiedCollaborations: verified.length,
    distinctBrandsOrTalent: counterpartIds.size,
    averageRating,
    reviewCount: reviews.length,
  }
}

// ============================================================
// ANALYTICS
// ============================================================

export async function logView(
  subjectType: 'profile' | 'card' | 'catalog' | 'product' | 'campaign',
  subjectAccountId: string,
  subjectId: string | null,
  viewerAccountId: string | null,
) {
  await supabase.from('view_events').insert({
    subject_type: subjectType,
    subject_account_id: subjectAccountId,
    subject_id: subjectId,
    viewer_account_id: viewerAccountId,
  })
}

export async function fetchViewCounts(accountId: string) {
  const { data } = await supabase
    .from('view_events')
    .select('subject_type')
    .eq('subject_account_id', accountId)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.subject_type] = (counts[row.subject_type] ?? 0) + 1
  }
  return counts
}

// ============================================================
// PRODUCT TAGGING
// ============================================================

export interface TaggedProduct {
  id: string
  name: string
  price_amount: number | null
  price_currency: string
  brand_account_id: string
  brand: { username: string }
}

export async function fetchProductTags(
  mediaId: string,
): Promise<(MediaProductTag & { product: TaggedProduct })[]> {
  const { data } = await supabase
    .from('media_product_tags')
    .select(
      '*, product:products(id, name, price_amount, price_currency, brand_account_id, brand:accounts!products_brand_account_id_fkey(username))',
    )
    .eq('media_id', mediaId)
  return (data ?? []) as unknown as (MediaProductTag & { product: TaggedProduct })[]
}
