import { cn } from '../../lib/cn'

/**
 * Button primitive.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  disabled,
  className,
  ...props
}) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-[var(--radius-sm)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0'

  const variants = {
    primary:   'bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] shadow-sm',
    secondary: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)] shadow-sm',
    ghost:     'bg-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
    danger:    'bg-[var(--neg)] text-white hover:bg-red-700 shadow-sm',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-7',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-sm px-5 py-2.5 h-10',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 13 : 15} strokeWidth={2} />}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 13 : 15} strokeWidth={2} />}
    </button>
  )
}
