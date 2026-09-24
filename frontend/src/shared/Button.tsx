import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' 
  icon?: LucideIcon
}

const baseClasses =
  'flex cursor-pointer items-center justify-center font-medium text-sm gap-2 rounded-xl  transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-50 p-3'

const variantClasses = {
  primary: 'bg-primary text-primary-foreground font-semibold ',
  secondary: 'bg-secondary-button border border-border ',
  ghost: 'rounded-lg text-foreground hover:drop-shadow-sm  ',
}

export function Button({
  variant,
  icon: Icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[className, baseClasses, variantClasses[variant] ].join(' ')}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  )
}