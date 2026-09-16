import { useState } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import { toast } from '../../lib/toast'

const INITIAL_RULES = [
  { id: 'POL-001', rule: 'Travel over Rs 10,000', action: 'Manager approval', status: 'Active', scope: 'Travel' },
  { id: 'POL-002', rule: 'Cash over Rs 5,000', action: 'Finance review', status: 'Active', scope: 'Cash' },
  { id: 'POL-003', rule: 'Duplicate vendor/date/amount', action: 'Block duplicate', status: 'Active', scope: 'All expenses' },
]

function inputClass(extra = '') {
  return `h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] ${extra}`
}

export default function PolicyRulesPage() {
  const navigate = useNavigate()
  const [rules, setRules] = useState(INITIAL_RULES)
  const [rule, setRule] = useState('')
  const [scope, setScope] = useState('Travel')
  const [action, setAction] = useState('Manager approval')

  function addRule(event) {
    event.preventDefault()
    if (!rule.trim()) {
      toast.error('Enter policy rule')
      return
    }
    const next = { id: `POL-${String(rules.length + 1).padStart(3, '0')}`, rule, scope, action, status: 'Active' }
    setRules(current => [next, ...current])
    setRule('')
    toast.success(`${next.id} added`)
  }

  const columns = [
    { key: 'id', label: 'Rule ID', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'rule', label: 'Rule', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'scope', label: 'Scope', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'action', label: 'Action', render: v => <span className="text-sm font-medium text-[var(--text)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className="rounded-full bg-[var(--pos-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--pos)]">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Policy Rules"
        subtitle="Control budgets, approvals, duplicate checks, cash limits, and GST review"
        breadcrumb={['Expenses', 'Policy Rules']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/expense-center')}>Back</Button>}
      />

      <section className="mb-5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[var(--primary)]" />
          <h2 className="text-sm font-bold text-[var(--text)]">Add Policy</h2>
        </div>
        <form onSubmit={addRule} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_220px_140px]">
          <input value={rule} onChange={event => setRule(event.target.value)} className={inputClass()} placeholder="Example: Meals over Rs 2,000" />
          <select value={scope} onChange={event => setScope(event.target.value)} className={inputClass()}>
            <option>Travel</option>
            <option>Office Supplies</option>
            <option>Cash</option>
            <option>All expenses</option>
          </select>
          <select value={action} onChange={event => setAction(event.target.value)} className={inputClass()}>
            <option>Manager approval</option>
            <option>Finance review</option>
            <option>Block duplicate</option>
            <option>Warn user</option>
          </select>
          <Button type="submit" variant="primary" icon={ShieldCheck} className="justify-center">Add Policy</Button>
        </form>
      </section>

      <DataTable columns={columns} data={rules} rowKey="id" />
    </div>
  )
}
