import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, Layers, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getAutomatedBills, getExpenseCategories } from '../../data/services/expensesService'

function MiniBar({ label, value, max, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
        <span className="tabular text-xs font-bold text-[var(--text)]">{formatCompact(value)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full rounded-full" style={{ width: `${Math.max(8, (value / max) * 100)}%`, background: color }} />
      </div>
    </div>
  )
}

export default function ExpenseRulesRecurring() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getExpenseCategories(), getAutomatedBills()]).then(([categories, bills]) => {
      setRows([
        ...categories.map(item => ({
          id: item.id,
          type: 'Budget Rule',
          name: item.name,
          owner: item.ledger,
          value: item.budget,
          used: item.used,
          status: item.used > item.budget * 0.9 ? 'review' : 'healthy',
          next: item.used > item.budget * 0.9 ? 'Tighten approval limit' : 'Auto-classify expenses',
        })),
        ...bills.map(item => ({
          id: item.id,
          type: 'Recurring Bill',
          name: item.desc,
          owner: item.vendor,
          value: item.amount,
          used: item.amount,
          status: item.status,
          next: `Post on ${item.nextDue}`,
        })),
      ])
      setLoading(false)
    })
  }, [])

  const budgetTotal = rows.filter(row => row.type === 'Budget Rule').reduce((sum, row) => sum + row.value, 0)
  const usedTotal = rows.filter(row => row.type === 'Budget Rule').reduce((sum, row) => sum + row.used, 0)
  const recurringTotal = rows.filter(row => row.type === 'Recurring Bill').reduce((sum, row) => sum + row.value, 0)
  const reviewCount = rows.filter(row => row.status === 'review').length
  const max = Math.max(budgetTotal, usedTotal, recurringTotal, 1)

  const columns = [
    { key: 'type', label: 'Type', render: v => <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)]">{v}</span> },
    { key: 'name', label: 'Rule / Bill', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'owner', label: 'Ledger / Vendor', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'value', label: 'Value', align: 'right', render: v => <span className="tabular font-semibold">{formatCurrency(v)}</span> },
    { key: 'used', label: 'Used / Run Rate', align: 'right', render: v => <span className="tabular text-sm">{formatCurrency(v)}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v === 'review' ? 'bg-[var(--warn-tint)] text-[var(--warn)]' : 'bg-[var(--pos-tint)] text-[var(--pos)]'}`}>{v}</span> },
    { key: 'next', label: 'Next Action', render: v => <span className="text-sm font-medium text-[var(--text)]">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Rules & Recurring"
        subtitle="Expense categories, budgets, recurring bills, and auto-classification in one control page"
        breadcrumb={['Expenses', 'Rules & Recurring']}
        action={<Button variant="primary" icon={ShieldCheck} size="sm" onClick={() => navigate('/expenses/new-rule')}>New Rule</Button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          ['Budget', budgetTotal, 'var(--primary)'],
          ['Used', usedTotal, 'var(--warn)'],
          ['Recurring Monthly', recurringTotal, 'var(--pos)'],
          ['Needs Review', reviewCount, 'var(--neg)'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
            <p className="tabular mt-2 text-2xl font-bold" style={{ color }}>{typeof value === 'number' && value > 999 ? formatCompact(value) : value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Spend Control Mix</p>
          <div className="space-y-3">
            <MiniBar label="Budget" value={budgetTotal} max={max} color="var(--primary)" />
            <MiniBar label="Used" value={usedTotal} max={max} color="var(--warn)" />
            <MiniBar label="Recurring" value={recurringTotal} max={max} color="var(--pos)" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { icon: Layers, title: 'Category merge', text: 'Budgets and ledgers sit beside recurring commitments.' },
            { icon: CalendarClock, title: 'Auto-posting', text: 'Subscriptions and rent show next posting dates.' },
            { icon: ShieldCheck, title: 'Policy control', text: 'High-utilization categories trigger review before spend.' },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                <Icon size={17} className="mb-3 text-[var(--primary)]" />
                <p className="text-sm font-bold text-[var(--text)]">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      <DataTable columns={columns} data={rows} loading={loading} rowKey="id" />
    </div>
  )
}
