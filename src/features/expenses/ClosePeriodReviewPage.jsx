import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import { toast } from '../../lib/toast'

const INITIAL_TASKS = [
  { id: 'CLOSE-1', task: 'Salary processed', owner: 'Payroll', status: 'Pending', risk: 'High' },
  { id: 'CLOSE-2', task: 'Provisions reviewed', owner: 'Finance Lead', status: 'Pending', risk: 'Medium' },
  { id: 'CLOSE-3', task: 'Trial balance checked', owner: 'Accountant', status: 'Pending', risk: 'High' },
]

export default function ClosePeriodReviewPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [closed, setClosed] = useState(false)
  const doneCount = tasks.filter(task => task.status === 'Done').length
  const allDone = doneCount === tasks.length
  const pct = useMemo(() => Math.round((doneCount / tasks.length) * 100), [doneCount, tasks.length])

  function markDone(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, status: 'Done' } : task))
    toast.success(`${id} reviewed`)
  }

  function markAllReviewed() {
    setTasks(current => current.map(task => ({ ...task, status: 'Done' })))
    toast.success('Close checklist reviewed')
  }

  function closePeriod() {
    if (!allDone) {
      toast.warn('Review all close tasks before locking period')
      return
    }
    setClosed(true)
    toast.success('Period closed')
  }

  const columns = [
    { key: 'id', label: 'Ref', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'task', label: 'Task', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'owner', label: 'Owner', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'risk', label: 'Risk', render: v => <span className="text-sm font-semibold text-[var(--warn)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v === 'Done' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--warn-tint)] text-[var(--warn)]'}`}>{v}</span> },
    {
      key: 'id',
      label: 'Action',
      render: (id, row) => row.status === 'Done'
        ? <span className="text-xs text-[var(--faint)]">Reviewed</span>
        : <Button type="button" variant="ghost" size="sm" icon={CheckCircle2} onClick={() => markDone(id)}>Mark Done</Button>,
    },
  ]

  if (closed) {
    return (
      <div>
        <PageHeader
          title="Period Closed"
          subtitle="January 2026 expenses are locked"
          breadcrumb={['Expenses', 'Close Control', 'Review Close']}
          action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/close-control')}>Back to Close Control</Button>}
        />
        <section className="rounded-[var(--radius)] border border-[var(--pos)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Lock size={26} className="text-[var(--pos)]" />
            <div>
              <p className="text-lg font-black text-[var(--text)]">Period lock completed</p>
              <p className="text-sm text-[var(--muted)]">All close tasks were reviewed before locking.</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Close Period Review"
        subtitle="Review pending close tasks before locking the accounting period"
        breadcrumb={['Expenses', 'Close Control', 'Review Close']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/close-control')}>Back</Button>}
      />

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <section className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Reviewed</p>
          <p className="mt-2 tabular text-2xl font-black text-[var(--primary)]">{pct}%</p>
        </section>
        <section className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Pending Tasks</p>
          <p className="mt-2 tabular text-2xl font-black text-[var(--warn)]">{tasks.length - doneCount}</p>
        </section>
        <section className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Close Status</p>
          <p className="mt-2 text-2xl font-black" style={{ color: allDone ? 'var(--pos)' : 'var(--warn)' }}>{allDone ? 'Ready' : 'Open'}</p>
        </section>
      </div>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" icon={CheckCircle2} className="justify-center sm:w-auto" onClick={markAllReviewed}>Mark Reviewed</Button>
        <Button variant="primary" icon={Lock} className="justify-center sm:w-auto" onClick={closePeriod}>Close Period</Button>
      </div>

      <DataTable columns={columns} data={tasks} rowKey="id" />
    </div>
  )
}
