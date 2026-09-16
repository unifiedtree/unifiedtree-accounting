import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Download, Inbox, ShieldCheck, FileCheck2 } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import TrendChart from '../../components/charts/TrendChart'
import DistributionChart from '../../components/charts/DistributionChart'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getExpenses } from '../../data/services/expensesService'
import { exportCsv } from '../../lib/csvExport'
import { toast } from '../../lib/toast'

const EXPENSE_TREND = [
  { label: 'W1', travel: 12000, office: 4200, software: 5000, services: 10000 },
  { label: 'W2', travel: 6400, office: 8200, software: 5000, services: 18000 },
  { label: 'W3', travel: 15000, office: 2600, software: 5000, services: 12000 },
  { label: 'W4', travel: 10000, office: 3776, software: 5000, services: 50000 },
]

export default function ExpenseCenter() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => { getExpenses().then(d => { setExpenses(d); setLoading(false) }) }, [])

  const filtered = useMemo(() => expenses.filter(i => {
    const matchSearch = !search || i.desc.toLowerCase().includes(search.toLowerCase()) || i.ref.toLowerCase().includes(search.toLowerCase()) || i.vendor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || i.status === statusFilter
    return matchSearch && matchStatus
  }), [expenses, search, statusFilter])

  const totalExpenses = expenses.reduce((s, i) => s + i.total, 0)
  const totalApproved = expenses.filter(i => i.status === 'approved').reduce((s, i) => s + i.total, 0)
  const pendingCount = expenses.filter(i => i.status === 'pending').length

  function handleExport() {
    exportCsv(filtered, 'expenses', ['ref', 'date', 'category', 'desc', 'vendor', 'total', 'paidBy', 'mode', 'status'])
    toast.success(`Exported ${filtered.length} expenses to CSV`)
  }

  const kpis = [
    { label: 'Total Expenses', value: formatCompact(totalExpenses), color: 'var(--text)' },
    { label: 'Approved', value: formatCompact(totalApproved), color: 'var(--pos)' },
    { label: 'Pending', value: `${pendingCount} items`, color: 'var(--warn)' },
  ]

  const columns = [
    { key: 'ref', label: 'Ref #', render: v => <span className="font-mono text-xs text-[var(--primary)]">{v}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'category', label: 'Category', render: v => <span className="text-sm font-medium text-[var(--text)]">{v}</span> },
    { key: 'desc', label: 'Description', render: v => <span className="text-sm text-[var(--text)]">{v}</span> },
    { key: 'vendor', label: 'Vendor', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'total', label: 'Total', align: 'right', sortable: true, render: v => <span className="tabular text-sm font-semibold text-[var(--text)]">{formatCurrency(v)}</span> },
    { key: 'paidBy', label: 'Paid By', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'mode', label: 'Mode', render: v => <span className="text-sm text-[var(--text)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
  ]

  return (
    <div>
      <PageHeader title="Expense Center" subtitle="Employee & operational expenses" breadcrumb={['Expenses & Journals', 'Expense Center']}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Download} size="sm" onClick={handleExport}>Export</Button>
            <Link to="/expenses/new-expense" className="inline-flex h-7 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-150 hover:bg-[var(--primary-600)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">
              <Plus size={13} strokeWidth={2} />
              New Expense
            </Link>
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {kpis.map(k => (
          <div key={k.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">{k.label}</p>
            <p className="tabular text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Expense Trend</p>
            <p className="mt-1 text-xs text-[var(--faint)]">Weekly movement by major spend type</p>
          </div>
          <TrendChart
            type="bar"
            height={220}
            data={EXPENSE_TREND}
            series={[
              { key: 'travel', label: 'Travel', color: '#5b5bef' },
              { key: 'office', label: 'Office', color: '#16a34a' },
              { key: 'software', label: 'Software', color: '#d97706' },
              { key: 'services', label: 'Services', color: '#e11d48' },
            ]}
          />
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Category Mix</p>
            <p className="mt-1 text-xs text-[var(--faint)]">Where money is being spent</p>
          </div>
          <DistributionChart
            height={220}
            innerRadius={48}
            outerRadius={80}
            data={Object.values(expenses.reduce((acc, item) => {
              acc[item.category] ??= { name: item.category, value: 0 }
              acc[item.category].value += item.total
              return acc
            }, {}))}
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          { icon: Inbox, title: 'Receipt Inbox', text: 'Capture receipt, OCR, and match vendor.', path: '/expenses/receipt-inbox' },
          { icon: ShieldCheck, title: 'Policy Rules', text: 'Budget, duplicate, cash, and GST checks.', path: '/expenses/policy-rules' },
          { icon: FileCheck2, title: 'Approval Queue', text: 'Pending and exception expenses.', path: '/expenses/approval-queue' },
          { icon: Plus, title: 'Quick Entry', text: 'Voucher-style expense entry.', path: '/expenses/new-expense' },
        ].map(item => {
          const Icon = item.icon
          return (
            <Link key={item.title} to={item.path} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-sm transition-all hover:-translate-y-px hover:border-[var(--primary)]">
              <Icon size={17} className="mb-3 text-[var(--primary)]" />
              <p className="text-sm font-bold text-[var(--text)]">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{item.text}</p>
            </Link>
          )
        })}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} rowKey="id"
        toolbar={<Filters search={search} onSearchChange={setSearch} placeholder="Search expense or vendor…">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]">
            <option value="All">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </Filters>}
      />
    </div>
  )
}
