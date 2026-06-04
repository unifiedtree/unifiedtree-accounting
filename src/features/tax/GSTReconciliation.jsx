import { useState, useEffect, useMemo } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getGSTR2B } from '../../data/services/taxService'

function ITCChip({ status }) {
  const styles = status === 'Available' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--neg-tint)] text-[var(--neg)]'
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>{status}</span>
}

export default function GSTReconciliation() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [itcFilter, setItcFilter] = useState('All')

  useEffect(() => { getGSTR2B().then(d => { setData(d); setLoading(false) }) }, [])

  const filtered = useMemo(() => data.filter(i => {
    const matchSearch = !search || i.supplier.toLowerCase().includes(search.toLowerCase()) || i.invoiceNo.toLowerCase().includes(search.toLowerCase()) || i.gstin.includes(search)
    const matchItc = itcFilter === 'All' || i.itcStatus === itcFilter
    return matchSearch && matchItc
  }), [data, search, itcFilter])

  const totalITC = data.filter(i => i.itcStatus === 'Available').reduce((s, i) => s + i.cgst + i.sgst, 0)
  const matchedCount = data.filter(i => i.matched).length
  const unmatchedCount = data.filter(i => !i.matched).length

  const kpis = [
    { label: 'Total ITC Available', value: formatCompact(totalITC), color: 'var(--pos)' },
    { label: 'Matched', value: matchedCount, color: 'var(--pos)' },
    { label: 'Unmatched', value: unmatchedCount, color: 'var(--neg)' },
  ]

  const columns = [
    { key: 'supplier', label: 'Supplier', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'gstin', label: 'GSTIN', render: v => <span className="font-mono text-xs text-[var(--muted)]">{v}</span> },
    { key: 'invoiceNo', label: 'Invoice No', render: v => <span className="text-sm text-[var(--text)]">{v}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'taxable', label: 'Taxable', align: 'right', render: v => <span className="tabular text-sm">{formatCurrency(v)}</span> },
    { key: 'cgst', label: 'GST (C+S)', align: 'right', render: (v, row) => <span className="tabular text-sm text-[var(--muted)]">{formatCurrency(v + row.sgst)}</span> },
    { key: 'itcStatus', label: 'ITC Status', render: v => <ITCChip status={v} /> },
    { key: 'matched', label: 'Matched', align: 'center', render: v => v ? <CheckCircle2 size={16} className="text-[var(--pos)] mx-auto" /> : <XCircle size={16} className="text-[var(--neg)] mx-auto" /> },
  ]

  return (
    <div>
      <PageHeader title="GST Reconciliation" subtitle="GSTR-2B ITC matching & reconciliation" breadcrumb={['Tax Center', 'GST Reconciliation']} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {kpis.map(k => (
          <div key={k.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">{k.label}</p>
            <p className="tabular text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} rowKey="id"
        toolbar={<Filters search={search} onSearchChange={setSearch} placeholder="Search supplier, GSTIN or invoice…">
          <select value={itcFilter} onChange={e => setItcFilter(e.target.value)} className="h-9 px-3 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]">
            <option value="All">All ITC Status</option>
            <option value="Available">Available</option>
            <option value="Blocked">Blocked</option>
          </select>
        </Filters>}
      />
    </div>
  )
}
