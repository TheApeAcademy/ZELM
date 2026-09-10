import type { Database } from './database.types'

export type AccountKind = Database['public']['Enums']['account_kind']
export type ProfessionalRole = Database['public']['Enums']['professional_role']
export type AvailabilityStatus = Database['public']['Enums']['availability_status']
export type MediaKind = Database['public']['Enums']['media_kind']
export type VisibilityLevel = Database['public']['Enums']['visibility_level']
export type CollabStatus = Database['public']['Enums']['collab_status']
export type SocialPlatform = Database['public']['Enums']['social_platform']

export type Account = Database['public']['Tables']['accounts']['Row']
export type PersonProfile = Database['public']['Tables']['person_profiles']['Row']
export type PersonMeasurements = Database['public']['Tables']['person_measurements']['Row']
export type BrandProfile = Database['public']['Tables']['brand_profiles']['Row']
export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type ContactInfo = Database['public']['Tables']['contact_info']['Row']
export type Collection = Database['public']['Tables']['collections']['Row']
export type MediaItem = Database['public']['Tables']['media_items']['Row']
export type CardSettings = Database['public']['Tables']['card_settings']['Row']
export type PhoneSettings = Database['public']['Tables']['phone_settings']['Row']
export type BrandCollection = Database['public']['Tables']['brand_collections']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Collaboration = Database['public']['Tables']['collaborations']['Row']
export interface CollaborationWithParties extends Collaboration {
  person: Account
  brand: Account
}

export type CampaignStatus = Database['public']['Enums']['campaign_status']
export type ApplicationStatus = Database['public']['Enums']['application_status']
export type InvitationStatus = Database['public']['Enums']['invitation_status']
export type BookingStatus = Database['public']['Enums']['booking_status']
export type PaymentRequestStatus = Database['public']['Enums']['payment_request_status']
export type ViewSubjectKind = Database['public']['Enums']['view_subject']

export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type CampaignApplication = Database['public']['Tables']['campaign_applications']['Row']
export type CampaignInvitation = Database['public']['Tables']['campaign_invitations']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type ConversationParticipant = Database['public']['Tables']['conversation_participants']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type AvailabilityDay = Database['public']['Tables']['availability_days']['Row']
export type Lookbook = Database['public']['Tables']['lookbooks']['Row']
export type LookbookItem = Database['public']['Tables']['lookbook_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Rate = Database['public']['Tables']['rates']['Row']
export type AudienceStat = Database['public']['Tables']['audience_stats']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Contract = Database['public']['Tables']['contracts']['Row']
export type PaymentRequest = Database['public']['Tables']['payment_requests']['Row']
export type MediaProductTag = Database['public']['Tables']['media_product_tags']['Row']

export interface CampaignWithBrand extends Campaign {
  brand: Account
}
export interface ApplicationWithPerson extends CampaignApplication {
  person: Account
}
export interface InvitationWithCampaign extends CampaignInvitation {
  campaign: CampaignWithBrand
}
export interface ConversationWithParticipants extends Conversation {
  conversation_participants: { account: Account }[]
}
export interface BookingWithParties extends Booking {
  person: Account
  brand: Account
}

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  closed: 'Closed',
}

export const RATE_SERVICES = [
  'Photoshoot',
  'Campaign',
  'UGC',
  'Social post',
  'Event',
  'Runway',
  'Brand ambassador',
  'Video',
  'Editorial',
] as const

/** A fully-loaded person account, as read on a public profile page. */
export interface PersonIdentity {
  account: Account
  profile: PersonProfile
  measurements: PersonMeasurements | null
  socials: SocialLink[]
  contact: ContactInfo | null
  card: CardSettings | null
  phone: PhoneSettings | null
}

/** An account row joined with just enough person_profile data for discovery cards. */
export interface DiscoveryAccount extends Account {
  person_profiles: Pick<PersonProfile, 'roles' | 'availability'> | null
}

/** A fully-loaded brand account, as read on a public brand page. */
export interface BrandIdentity {
  account: Account
  profile: BrandProfile
  socials: SocialLink[]
  contact: ContactInfo | null
  card: CardSettings | null
  phone: PhoneSettings | null
}

export const ROLE_LABEL: Record<ProfessionalRole, string> = {
  model: 'Model',
  influencer: 'Influencer',
  creator: 'Creator',
  photographer: 'Photographer',
  videographer: 'Videographer',
  stylist: 'Stylist',
  makeup_artist: 'Makeup Artist',
  hair_artist: 'Hair Artist',
  designer: 'Designer',
  other: 'Creative',
}

export const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  available: 'Available',
  limited: 'Limited availability',
  unavailable: 'Unavailable',
}

export const OPEN_TO_OPTIONS = [
  'Paid campaigns',
  'Brand collaborations',
  'Editorials',
  'Runway',
  'Photoshoots',
  'Events',
  'UGC',
  'Brand ambassador',
  'Travel work',
  'Representation',
] as const

export const SOCIAL_PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  linkedin: 'LinkedIn',
  behance: 'Behance',
  website: 'Website',
  whatsapp: 'WhatsApp',
  other: 'Link',
}
