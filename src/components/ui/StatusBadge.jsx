import { cn } from '../../lib/cn'

/**
 * StatusBadge — for financial document / entity states.
 * status: 'paid' | 'unpaid' | 'partial' | 'overdue' | 'draft' |
 *         'active' | 'expired' | 'revoked' | 'pending' | 'cancelled' |
 *         'open' | 'closed' | 'locked' | 'synced'
 */
const CONFIG = {
  paid:      { label: 'Paid',      bg: 'bg-[var(--pos-tint)]',   text: 'text-[var(--pos)]' },
  unpaid:    { label: 'Unpaid',    bg: 'bg-[var(--warn-tint)]',  text: 'text-[var(--warn)]' },
  partial:   { label: 'Partial',   bg: 'bg-[var(--warn-tint)]',  text: 'text-[var(--warn)]' },
  overdue:   { label: 'Overdue',   bg: 'bg-[var(--neg-tint)]',   text: 'text-[var(--neg)]' },
  draft:     { label: 'Draft',     bg: 'bg-gray-100',             text: 'text-gray-500' },
  active:    { label: 'Active',    bg: 'bg-[var(--pos-tint)]',   text: 'text-[var(--pos)]' },
  expired:   { label: 'Expired',   bg: 'bg-gray-100',             text: 'text-gray-500' },
  revoked:   { label: 'Revoked',   bg: 'bg-[var(--neg-tint)]',   text: 'text-[var(--neg)]' },
  pending:   { label: 'Pending',   bg: 'bg-[var(--warn-tint)]',  text: 'text-[var(--warn)]' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100',             text: 'text-gray-500' },
  open:      { label: 'Open',      bg: 'bg-[var(--primary-tint)]', text: 'text-[var(--primary)]' },
  closed:    { label: 'Closed',    bg: 'bg-[var(--pos-tint)]',   text: 'text-[var(--pos)]' },
  locked:    { label: 'Locked',    bg: 'bg-gray-100',             text: 'text-gray-600' },
  synced:    { label: 'Synced',    bg: 'bg-[var(--primary-tint)]', text: 'text-[var(--primary)]' },
}

export default function StatusBadge({ status, label: customLabel, className }) {
  const cfg = CONFIG[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide',
        cfg.bg, cfg.text, className
      )}
    >
      {customLabel ?? cfg.label}
    </span>
  )
}
