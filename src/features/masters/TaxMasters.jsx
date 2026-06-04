import { useState, useEffect, useMemo } from 'react'
import { useState as useLocalState } from 'react'
import { Plus, Percent } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import { getTaxMasters } from '../../data/services/mastersService'

const TAX_TYPE_COLORS = {
  GST: { bg: 'bg-[var(--primary-tint)]', text: 'text-[var(--primary)]' },
  TDS: { bg: 'bg-[var(--warn-tint)]',    text: 'text-[var(--warn)]' },
  TCS: { bg: 'bg-[var(--pos-tint)]',     text: 'text-[var(--pos)]' },
}

export default function TaxMasters() {
  const [taxes, setTaxes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [taxType, setTaxType] = useState('All')

  useEffect(() => {
    getTaxMasters().then(d => { setTaxes(d); setLoading(false) })
  }, [])

  const filtered = useMemo(() => taxes.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase())
    const matchType   = taxType === 'All' || t.taxType === taxType
    return matchSearch && matchType
  }), [taxes, search, taxType])

  // Summary per type
  const summary = ['GST','TDS','TCS'].map(tt => ({
    type: tt,
    count: taxes.filter(t => t.taxType === tt).length,
  }))

  const columns = [
    {
      key: 'taxType',
      label: 'Tax Type',
      sortable: true,
      render: (val) => {
        const c = TAX_TYPE_COLORS[val] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            {val}
          </span>
        )
      },
    },
    {
      key: 'code',
      label: 'Section / Code',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-[var(--muted)]">{val}</span>,
    },
    {
      key: 'name',
      label: 'Tax Name',
      sortable: true,
      render: (val) => <span className="font-medium text-[var(--text)]">{val}</span>,
    },
    {
      key: 'rate',
      label: 'Rate',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="tabular font-semibold text-[var(--text)]">
          {val}%
        </span>
      ),
    },
    {
      key: 'component',
      label: 'Components',
      render: (val) => <span className="text-sm text-[var(--muted)]">{val}</span>,
    },
    {
      key: 'applicableOn',
      label: 'Applicable On',
      render: (val) => <span className="text-sm text-[var(--text)]">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Tax Masters"
        subtitle={`GST rates, TDS sections, and TCS rules`}
        breadcrumb={['Masters', 'Tax Masters']}
        action={
          <Button variant="primary" icon={Plus} size="sm">New Tax Rate</Button>
        }
      />

      {/* Type tiles */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {summary.map(s => {
          const c = TAX_TYPE_COLORS[s.type]
          return (
            <button
              key={s.type}
              onClick={() => setTaxType(prev => prev === s.type ? 'All' : s.type)}
              className={`flex items-center justify-between p-4 rounded-[var(--radius-sm)] border transition-all duration-150
                ${taxType === s.type
                  ? `${c.bg} border-[var(--primary)]`
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]'
                }`}
            >
              <div className="text-left">
                <p className={`text-sm font-bold ${taxType === s.type ? c.text : 'text-[var(--text)]'}`}>{s.type}</p>
                <p className="text-xs text-[var(--muted)]">
                  {s.type === 'GST' ? 'Goods & Services Tax' : s.type === 'TDS' ? 'Tax Deducted at Source' : 'Tax Collected at Source'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.bg}`}>
                <span className={`text-sm font-bold tabular ${c.text}`}>{s.count}</span>
              </div>
            </button>
          )
        })}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        rowKey="id"
        toolbar={
          <Filters search={search} onSearchChange={setSearch} placeholder="Search tax name or section…">
            <select
              value={taxType}
              onChange={e => setTaxType(e.target.value)}
              className="h-9 px-3 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="All">All Types</option>
              <option>GST</option>
              <option>TDS</option>
              <option>TCS</option>
            </select>
          </Filters>
        }
        emptyState={
          <div className="flex flex-col items-center py-14 items-center text-center">
            <Percent size={28} className="text-[var(--faint)] mb-3" />
            <p className="text-sm font-semibold text-[var(--text)]">No tax rates found</p>
            <p className="text-xs text-[var(--muted)] mt-1">Adjust the filter or add a new tax rate.</p>
          </div>
        }
      />
    </div>
  )
}
