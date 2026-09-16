import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, Lock, ShieldAlert } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getWriteOffs } from '../../data/services/expensesService'

const CHECKLIST = [
  { id: 'PC001', name: 'Bank reconciliation complete', status: 'done', by: 'Rahul M', date: '2026-01-06' },
  { id: 'PC002', name: 'GST reconciled', status: 'done', by: 'Priya S', date: '2026-01-06' },
  { id: 'PC003', name: 'TDS deposited', status: 'done', by: 'Priya S', date: '2026-01-07' },
  { id: 'PC004', name: 'Salary processed', status: 'pending', by: null, date: null },
  { id: 'PC005', name: 'Provisions reviewed', status: 'pending', by: null, date: null },
  { id: 'PC006', name: 'Trial balance checked', status: 'pending', by: null, date: null },
]

export default function ExpenseCloseControl() {
  const navigate = useNavigate()
  const [writeOffs, setWriteOffs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getWriteOffs().then(data => { setWriteOffs(data); setLoading(false) }) }, [])

  const doneCount = CHECKLIST.filter(item => item.status === 'done').length
  const totalCount = CHECKLIST.length
  const closePct = Math.round((doneCount / totalCount) * 100)
  const totalWrittenOff = writeOffs.reduce((sum, item) => sum + item.amount, 0)
  const allDone = doneCount === totalCount

  const columns = [
    { key: 'ref', label: 'Ref', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'desc', label: 'Write-off', render: v => <span className="text-sm text-[var(--text)]">{v}</span> },
    { key: 'account', label: 'Account', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: v => <span className="tabular font-semibold text-[var(--neg)]">{formatCurrency(v)}</span> },
    { key: 'approvedBy', label: 'Approved By', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className="rounded-full bg-[var(--pos-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--pos)]">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Close Control"
        subtitle="Month-end close, write-offs, and risk approvals in one place"
        breadcrumb={['Expenses', 'Close Control']}
        action={<Button variant="primary" icon={Lock} onClick={() => navigate('/expenses/close-period-action')}>{allDone ? 'Close Period' : 'Review Close'}</Button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          ['Close Progress', `${closePct}%`, allDone ? 'var(--pos)' : 'var(--warn)'],
          ['Pending Tasks', totalCount - doneCount, 'var(--warn)'],
          ['Write-off Value', totalWrittenOff, 'var(--neg)'],
          ['Approved Items', writeOffs.length, 'var(--pos)'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
            <p className="tabular mt-2 text-2xl font-bold" style={{ color }}>{typeof value === 'number' && value > 999 ? formatCompact(value) : value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Close Checklist</p>
          <div className="space-y-2">
            {CHECKLIST.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2">
                {item.status === 'done' ? <CheckCircle2 size={15} className="text-[var(--pos)]" /> : <Circle size={15} className="text-[var(--warn)]" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text)]">{item.name}</p>
                  <p className="text-[11px] text-[var(--faint)]">{item.by ? `${item.by} - ${item.date}` : 'Pending owner'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={16} className="text-[var(--warn)]" />
            <p className="text-sm font-bold text-[var(--text)]">Close Risk</p>
          </div>
          <p className="mb-4 text-sm text-[var(--muted)]">Write-offs and pending close tasks are shown together so users do not approve losses without checking period readiness.</p>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div className="h-full rounded-full" style={{ width: `${closePct}%`, background: allDone ? 'var(--pos)' : 'var(--warn)' }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--muted)]">{doneCount} of {totalCount} close tasks complete</p>
        </div>
      </div>

      <DataTable columns={columns} data={writeOffs} loading={loading} rowKey="id" />
    </div>
  )
}
