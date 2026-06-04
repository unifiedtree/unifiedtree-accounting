import { cn } from '../../lib/cn'

/**
 * Tabs — inner horizontal tab strip.
 * Used within a page (distinct from TabPanel which is the section-level strip).
 */
export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 border-b border-[var(--border)]', className)}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px',
              isActive
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={cn(
                  'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                  isActive
                    ? 'bg-[var(--primary-tint)] text-[var(--primary)]'
                    : 'bg-[var(--surface-2)] text-[var(--muted)]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
