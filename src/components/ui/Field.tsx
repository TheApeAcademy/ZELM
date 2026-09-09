import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const fieldBase =
  'w-full rounded-xl border border-bone-50/15 bg-ink-950/60 px-3.5 py-2.5 text-sm text-bone-50 placeholder:text-bone-500 outline-none transition-colors focus:border-signal-500/70'

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-label text-bone-300">{children}</span>
      {hint && <span className="text-xs text-bone-500">{hint}</span>}
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, 'resize-none', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, 'appearance-none', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-1.5">{children}</div>
}
