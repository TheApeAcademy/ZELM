import type { Campaign, PersonProfile } from './types'

/**
 * Deterministic, explainable campaign <-> talent matching. Every point on
 * the score is traceable to a stated reason — no opaque model, per ZELM's
 * own rule that AI should accelerate discovery without becoming a black box.
 */

export interface MatchCandidate {
  accountId: string
  displayName: string
  username: string
  locationCity: string | null
  profile: PersonProfile
  verifiedCollabCount: number
}

export interface MatchResult {
  accountId: string
  displayName: string
  username: string
  score: number
  reasons: string[]
}

function scoreOne(campaign: Campaign, candidate: MatchCandidate): MatchResult {
  let score = 0
  const reasons: string[] = []

  const roleOverlap = campaign.talent_types.filter((role) => candidate.profile.roles.includes(role))
  if (roleOverlap.length > 0) {
    score += 35
    reasons.push(`${roleOverlap.join(', ')}`)
  }

  if (campaign.location && candidate.locationCity) {
    if (campaign.location.toLowerCase().includes(candidate.locationCity.toLowerCase())) {
      score += 25
      reasons.push(`Based in ${candidate.locationCity}`)
    }
  }

  if (candidate.profile.availability === 'available') {
    score += 20
    reasons.push('Available now')
  } else if (candidate.profile.availability === 'limited') {
    score += 8
    reasons.push('Limited availability')
  }

  if (campaign.style) {
    const style = campaign.style.toLowerCase()
    const matchesOpenTo = candidate.profile.open_to.some((o) => o.toLowerCase().includes(style))
    if (matchesOpenTo) {
      score += 10
      reasons.push(`Open to ${campaign.style.toLowerCase()} work`)
    }
  }

  if (candidate.verifiedCollabCount > 0) {
    score += 10
    reasons.push(
      `${candidate.verifiedCollabCount} verified collaboration${candidate.verifiedCollabCount === 1 ? '' : 's'}`,
    )
  }

  return {
    accountId: candidate.accountId,
    displayName: candidate.displayName,
    username: candidate.username,
    score: Math.min(100, score),
    reasons,
  }
}

export function matchTalentForCampaign(
  campaign: Campaign,
  candidates: MatchCandidate[],
  minScore = 30,
): MatchResult[] {
  return candidates
    .map((c) => scoreOne(campaign, c))
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
}

export function matchCampaignsForPerson(
  campaigns: Campaign[],
  candidate: MatchCandidate,
  minScore = 30,
): { campaign: Campaign; score: number; reasons: string[] }[] {
  return campaigns
    .map((campaign) => ({ campaign, ...scoreOne(campaign, candidate) }))
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
}
