import { cn } from '../../lib/cn'

/**
 * PageHeader — title + optional subtitle + action slot.
 * breadcrumb is intentionally de-emphasised — shown only when passed,
 * in a lighter style to reduce visual noise for beginners.
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumb,   // Array<string> — optional, shown faintly
  action,       // ReactNode — primary CTA button(s)
  children,     // additional toolbar items
  className,
}) {
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : breadcrumb ? [breadcrumb] : []

  return (
    <div className={cn('flex items-start justify-between mb-6 gap-4', className)}>
      <div className="min-w-0">
        {/* Breadcrumb — very light, secondary context only */}
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-1.5" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-[11px] text-[var(--faint)]">{crumb}</span>
                {i < crumbs.length - 1 && (
                  <span className="text-[var(--faint)] text-[11px]">/</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-[22px] font-bold text-[var(--text)] leading-tight tracking-tight">
          {title}
        </h1>

        {/* Subtitle — plain language description of the page */}
        {subtitle && (
          <p className="text-sm text-[var(--muted)] mt-1 leading-snug">{subtitle}</p>
        )}
      </div>

      {/* Actions */}
      {(action || children) && (
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          {children}
          {action}
        </div>
      )}
    </div>
  )
}
