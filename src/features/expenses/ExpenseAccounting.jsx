import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, FileCheck2, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getJournalVouchers, getProvisions } from '../../data/services/expensesService'

export default function ExpenseAccounting() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getJournalVouchers(), getProvisions()]).then(([journals, provisions]) => {
      setRows([
        ...journals.map(item => ({
          id: item.id,
          ref: item.ref,
          type: 'Journal',
          date: item.date,
          description: item.narration,
          amount: item.entries.reduce((sum, entry) => sum + entry.dr, 0),
          status: item.status,
          owner: item.postedBy ?? 'Unassigned',
          next: item.status === 'draft' ? 'Review and post' : 'Posted to books',
        })),
        ...provisions.map(item => ({
          id: item.id,
          ref: item.ref,
          type: 'Accrual',
          date: item.date,
          description: item.desc,
          amount: item.amount,
          status: item.status,
          owner: item.account,
          next: item.status === 'draft' ? 'Approve accrual' : 'Reverse or carry forward',
        })),
      ])
      setLoading(false)
    })
  }, [])

  const postedAmount = rows.filter(row => row.status === 'posted').reduce((sum, row) => sum + row.amount, 0)
  const draftAmount = rows.filter(row => row.status === 'draft').reduce((sum, row) => sum + row.amount, 0)
  const journalCount = rows.filter(row => row.type === 'Journal').length
  const accrualCount = rows.filter(row => row.type === 'Accrual').length

  const columns = [
    { key: 'ref', label: 'Ref', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'type', label: 'Type', render: v => <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)]">{v}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'description', label: 'Description', render: v => <span className="text-sm text-[var(--text)]">{v}</span> },
    { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: v => <span className="tabular font-semibold">{formatCurrency(v)}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v === 'posted' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--primary-tint)] text-[var(--primary)]'}`}>{v}</span> },
    { key: 'owner', label: 'Owner / Account', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'next', label: 'Next Action', render: v => <span className="text-sm font-medium text-[var(--text)]">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Accounting"
        subtitle="Manual journals and accruals merged into one accounting workbench"
        breadcrumb={['Expenses', 'Accounting']}
        action={<Button variant="primary" icon={BookOpen} size="sm" onClick={() => navigate('/expenses/new-entry')}>New Entry</Button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          ['Posted Amount', postedAmount, 'var(--pos)'],
          ['Draft Amount', draftAmount, 'var(--primary)'],
          ['Journals', journalCount, 'var(--text)'],
          ['Accruals', accrualCount, 'var(--warn)'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
            <p className="tabular mt-2 text-2xl font-bold" style={{ color }}>{typeof value === 'number' && value > 999 ? formatCompact(value) : value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { icon: BookOpen, title: 'Voucher discipline', text: 'Tally-style journal control without a separate tab maze.' },
          { icon: ShieldCheck, title: 'Approval focus', text: 'Draft provisions and journals surface before month close.' },
          { icon: FileCheck2, title: 'Audit-ready', text: 'Owner, account, amount, and next action are visible in one row.' },
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

      <DataTable columns={columns} data={rows} loading={loading} rowKey="id" />
    </div>
  )
}
