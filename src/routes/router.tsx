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

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/:username/card', element: <CardPage /> },
  {
    element: <OnboardingRoute />,
    children: [{ path: '/onboarding', element: <OnboardingPage /> }],
  },
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/discover', element: <DiscoverPage /> },
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
        ],
      },
      { path: '/:username', element: <ProfilePage /> },
    ],
  },
])
