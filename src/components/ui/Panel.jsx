import { cn } from '../../lib/cn'

export default function Panel({ children, className, padded = true, ...props }) {
  return (
    <div
      className={cn(
        'bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)]',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
