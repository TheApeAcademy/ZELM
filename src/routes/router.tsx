import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute, OnboardingRoute } from './ProtectedRoute'
import { LandingPage } from '@/features/landing/LandingPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { DiscoverPage } from '@/features/discovery/DiscoverPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { CardPage } from '@/features/card/CardPage'
import { PhoneHome } from '@/features/phone/PhoneHome'
import { CardScreen } from '@/features/card/CardScreen'
import { GalleryScreen } from '@/features/gallery/GalleryScreen'
import { PortfolioScreen } from '@/features/portfolio/PortfolioScreen'
import { CollaborationsScreen } from '@/features/collaborations/CollaborationsScreen'
import { LinksScreen } from '@/features/links/LinksScreen'
import { CatalogScreen } from '@/features/brand/CatalogScreen'
import { SettingsScreen } from '@/features/settings/SettingsScreen'
import { OpportunitiesPage } from '@/features/opportunities/OpportunitiesPage'
import { CampaignDetailPage } from '@/features/opportunities/CampaignDetailPage'
import { CampaignsScreen } from '@/features/opportunities/CampaignsScreen'
import { CampaignApplicantsScreen } from '@/features/opportunities/CampaignApplicantsScreen'
import { MyOpportunitiesScreen } from '@/features/opportunities/MyOpportunitiesScreen'
import { MessagesScreen } from '@/features/messaging/MessagesScreen'
import { ConversationScreen } from '@/features/messaging/ConversationScreen'
import { AvailabilityScreen } from '@/features/availability/AvailabilityScreen'
import { LookbooksScreen } from '@/features/lookbooks/LookbooksScreen'
import { LookbookPage } from '@/features/lookbooks/LookbookPage'
import { ReviewsScreen } from '@/features/reviews/ReviewsScreen'
import { RatesScreen } from '@/features/rates/RatesScreen'
import { MediaKitPage } from '@/features/rates/MediaKitPage'
import { BookingsScreen } from '@/features/bookings/BookingsScreen'
import { BookingDetailScreen } from '@/features/bookings/BookingDetailScreen'
import { AnalyticsScreen } from '@/features/analytics/AnalyticsScreen'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/:username/card', element: <CardPage /> },
  { path: '/:username/media-kit', element: <MediaKitPage /> },
  {
    element: <OnboardingRoute />,
    children: [{ path: '/onboarding', element: <OnboardingPage /> }],
  },
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/discover', element: <DiscoverPage /> },
      { path: '/opportunities', element: <OpportunitiesPage /> },
      { path: '/opportunities/:id', element: <CampaignDetailPage /> },
      { path: '/lookbook/:slug', element: <LookbookPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/app', element: <PhoneHome /> },
          { path: '/app/card', element: <CardScreen /> },
          { path: '/app/gallery', element: <GalleryScreen /> },
          { path: '/app/portfolio', element: <PortfolioScreen /> },
          { path: '/app/collaborations', element: <CollaborationsScreen /> },
          { path: '/app/links', element: <LinksScreen /> },
          { path: '/app/catalog', element: <CatalogScreen /> },
          { path: '/app/settings', element: <SettingsScreen /> },
          { path: '/app/campaigns', element: <CampaignsScreen /> },
          { path: '/app/campaigns/:id', element: <CampaignApplicantsScreen /> },
          { path: '/app/opportunities', element: <MyOpportunitiesScreen /> },
          { path: '/app/messages', element: <MessagesScreen /> },
          { path: '/app/messages/:id', element: <ConversationScreen /> },
          { path: '/app/availability', element: <AvailabilityScreen /> },
          { path: '/app/lookbooks', element: <LookbooksScreen /> },
          { path: '/app/reviews', element: <ReviewsScreen /> },
          { path: '/app/rates', element: <RatesScreen /> },
          { path: '/app/bookings', element: <BookingsScreen /> },
          { path: '/app/bookings/:id', element: <BookingDetailScreen /> },
          { path: '/app/analytics', element: <AnalyticsScreen /> },
        ],
      },
      { path: '/:username', element: <ProfilePage /> },
    ],
  },
])
