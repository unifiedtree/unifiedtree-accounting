import { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getTaxPayments } from '../../data/services/taxService'

function TypeChip({ type }) {
  const map = {
    'GST':     'bg-[var(--primary-tint)] text-[var(--primary)]',
    'TDS':     'bg-[#fef3c7] text-[#92400e]',
    'Adv Tax': 'bg-[#ede9fe] text-[#6d28d9]',
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[type] ?? 'bg-[var(--faint)] text-[var(--muted)]'}`}>{type}</span>
}

function StatusChip({ status }) {
  const styles = status === 'paid' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--primary-tint)] text-[var(--primary)]'
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>{status}</span>
}

export default function TaxPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => { getTaxPayments().then(d => { setPayments(d); setLoading(false) }) }, [])

  const filtered = useMemo(() => payments.filter(i => {
    const matchSearch = !search || i.task?.toLowerCase().includes(search.toLowerCase()) || (i.challanNo && i.challanNo.toLowerCase().includes(search.toLowerCase()))
    const matchType = typeFilter === 'All' || i.type === typeFilter
    return matchSearch && matchType
  }), [payments, search, typeFilter])

  const totalPaid = payments.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = payments.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)

  const kpis = [
    { label: 'Total Paid', value: formatCompact(totalPaid), color: 'var(--pos)' },
    { label: 'Pending', value: formatCompact(totalPending), color: 'var(--warn)' },
    { label: 'Entries', value: payments.length, color: 'var(--text)' },
  ]

  const columns = [
    { key: 'type', label: 'Type', render: v => <TypeChip type={v} /> },
    { key: 'period', label: 'Period', render: v => <span className="text-sm text-[var(--text)]">{v}</span> },
    { key: 'challanNo', label: 'Challan No', render: v => <span className="font-mono text-xs text-[var(--muted)]">{v ?? '—'}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-sm text-[var(--muted)]">{v ?? '—'}</span> },
    { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: v => <span className="tabular text-sm font-semibold text-[var(--text)]">{formatCurrency(v)}</span> },
    { key: 'bank', label: 'Bank', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <StatusChip status={v} /> },
  ]

  return (
    <div>
      <PageHeader title="Tax Payments" subtitle="GST, TDS & advance tax payment records" breadcrumb={['Tax Center', 'Tax Payments']}
        action={<Button variant="primary" icon={Plus} size="sm">Record Payment</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {kpis.map(k => (
          <div key={k.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">{k.label}</p>
            <p className="tabular text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} rowKey="id"
        toolbar={<Filters search={search} onSearchChange={setSearch} placeholder="Search challan or period…">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 px-3 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]">
            <option value="All">All Types</option>
            <option value="GST">GST</option>
            <option value="TDS">TDS</option>
            <option value="Adv Tax">Adv Tax</option>
          </select>
        </Filters>}
      />
    </div>
  )
}
