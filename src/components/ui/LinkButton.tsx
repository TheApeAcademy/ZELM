import { Link, type LinkProps } from 'react-router-dom'
import { buttonClasses, type Size, type Variant } from './Button'

interface LinkButtonProps extends LinkProps {
  variant?: Variant
  size?: Size
  className?: string
}

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />
}
