import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import { toast } from '../../lib/toast'
import { formatCurrency } from '../../lib/currency'

const INITIAL_QUEUE = [
  { id: 'EXP-2526-0079', vendor: 'Ola Corporate', category: 'Travel', amount: 1500, status: 'Pending', reason: 'Client travel confirmation' },
  { id: 'POL-TRAVEL', vendor: 'Air Travel', category: 'Travel', amount: 95000, status: 'Review', reason: '95% budget used' },
  { id: 'CLOSE-PV', vendor: 'Income tax provision', category: 'Accrual', amount: 650000, status: 'Pending close', reason: 'Approve before close' },
]

export default function ApprovalQueuePage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState(INITIAL_QUEUE)
  const pending = rows.filter(row => !['Approved', 'Rejected'].includes(row.status))
  const pendingValue = useMemo(() => pending.reduce((sum, row) => sum + row.amount, 0), [pending])

  function decide(id, status) {
    setRows(current => current.map(row => row.id === id ? { ...row, status } : row))
    toast.success(`${id} ${status.toLowerCase()}`)
  }

  function approveSelected() {
    setRows(current => current.map(row => ['Approved', 'Rejected'].includes(row.status) ? row : { ...row, status: 'Approved' }))
    toast.success('Pending approvals approved')
  }

  const columns = [
    { key: 'id', label: 'Ref', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'vendor', label: 'Item', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'category', label: 'Category', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: v => <span className="tabular font-semibold">{formatCurrency(v)}</span> },
    { key: 'reason', label: 'Reason', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v === 'Approved' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : v === 'Rejected' ? 'bg-[var(--neg-tint)] text-[var(--neg)]' : 'bg-[var(--warn-tint)] text-[var(--warn)]'}`}>{v}</span> },
    {
      key: 'id',
      label: 'Action',
      render: (id, row) => ['Approved', 'Rejected'].includes(row.status) ? <span className="text-xs text-[var(--faint)]">Closed</span> : (
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" icon={CheckCircle2} onClick={() => decide(id, 'Approved')}>Approve</Button>
          <Button type="button" variant="ghost" size="sm" icon={XCircle} onClick={() => decide(id, 'Rejected')}>Reject</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Approval Queue"
        subtitle="Approve, reject, and close pending expense exceptions"
        breadcrumb={['Expenses', 'Approval Queue']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/expense-center')}>Back</Button>}
      />

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Open Items</p>
          <p className="mt-2 tabular text-2xl font-black text-[var(--warn)]">{pending.length}</p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Pending Value</p>
          <p className="mt-2 tabular text-2xl font-black text-[var(--primary)]">{formatCurrency(pendingValue)}</p>
        </div>
        <Button variant="primary" icon={CheckCircle2} className="h-full justify-center" onClick={approveSelected}>Approve Selected</Button>
      </div>

      <DataTable columns={columns} data={rows} rowKey="id" />
    </div>
  )
}
