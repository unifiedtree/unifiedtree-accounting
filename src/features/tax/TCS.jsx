import { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getTCSCollections } from '../../data/services/taxService'

function StatusChip({ status }) {
  const styles = status === 'deposited' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--primary-tint)] text-[var(--primary)]'
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>{status}</span>
}

export default function TCS() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => { getTCSCollections().then(d => { setCollections(d); setLoading(false) }) }, [])

  const filtered = useMemo(() => collections.filter(i => {
    const matchSearch = !search || i.customer.toLowerCase().includes(search.toLowerCase()) || i.nature.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || i.status === statusFilter
    return matchSearch && matchStatus
  }), [collections, search, statusFilter])

  const totalCollected = collections.reduce((s, i) => s + i.tcsAmt, 0)
  const totalDeposited = collections.filter(i => i.status === 'deposited').reduce((s, i) => s + i.tcsAmt, 0)
  const totalPending = collections.filter(i => i.status === 'pending').reduce((s, i) => s + i.tcsAmt, 0)

  const kpis = [
    { label: 'Total TCS Collected', value: formatCompact(totalCollected), color: 'var(--text)' },
    { label: 'Deposited', value: formatCompact(totalDeposited), color: 'var(--pos)' },
    { label: 'Pending', value: formatCompact(totalPending), color: 'var(--warn)' },
  ]

  const columns = [
    { key: 'date', label: 'Date', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'customer', label: 'Customer', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'invoice', label: 'Invoice', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'nature', label: 'Nature / Section', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'grossAmt', label: 'Gross Amt', align: 'right', render: v => <span className="tabular text-sm text-[var(--text)]">{formatCurrency(v)}</span> },
    { key: 'tcsRate', label: 'TCS Rate', align: 'center', render: v => <span className="tabular text-sm text-[var(--muted)]">{v}</span> },
    { key: 'tcsAmt', label: 'TCS Amt', align: 'right', sortable: true, render: v => <span className="tabular text-sm font-semibold text-[var(--pos)]">{formatCurrency(v)}</span> },
    { key: 'challanNo', label: 'Challan No', render: v => <span className="font-mono text-xs text-[var(--muted)]">{v ?? '—'}</span> },
    { key: 'status', label: 'Status', render: v => <StatusChip status={v} /> },
  ]

  return (
    <div>
      <PageHeader title="TCS Collections" subtitle="Tax Collected at Source — tracking & challan" breadcrumb={['Tax Center', 'TCS']}
        action={<Button variant="primary" icon={Plus} size="sm">Record TCS</Button>}
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
        toolbar={<Filters search={search} onSearchChange={setSearch} placeholder="Search customer or section…">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]">
            <option value="All">All Status</option>
            <option value="deposited">Deposited</option>
            <option value="pending">Pending</option>
          </select>
        </Filters>}
      />
    </div>
  )
}
