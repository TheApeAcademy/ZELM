import { cn } from '@/lib/cn'

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null
  name: string
  size?: number
  className?: string
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-full bg-ink-800 ring-1 ring-bone-50/10',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div
          className="text-display flex h-full w-full items-center justify-center text-bone-300"
          style={{ fontSize: size * 0.38 }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}
