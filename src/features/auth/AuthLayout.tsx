import type { ReactNode } from 'react'
import { Logo } from '@/components/layout/Logo'

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm animate-fade-up">
          <Logo className="mb-10 block" />
          <h1 className="text-display mb-2 text-3xl text-bone-50">{title}</h1>
          <p className="mb-8 text-sm text-bone-500">{subtitle}</p>
          {children}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-signal-500) 35%, transparent), transparent 55%), radial-gradient(circle at 80% 75%, color-mix(in srgb, var(--color-signal-600) 25%, transparent), transparent 50%)',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-16">
          <p className="text-display max-w-md text-4xl leading-[1.05] text-bone-50">
            The professional world of fashion.
          </p>
          <p className="text-label mt-6 text-bone-400">People. Brands. Fashion. Connected.</p>
        </div>
      </div>
    </div>
  )
}
