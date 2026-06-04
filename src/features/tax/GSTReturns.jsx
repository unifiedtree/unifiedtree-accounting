import { useState, useEffect } from 'react'
import { FileText, Eye } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import CompliancePipeline from '../../components/compliance/CompliancePipeline'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getGSTR1Summary, getGSTR3B } from '../../data/services/taxService'

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${active ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'}`}>
      {children}
    </button>
  )
}

function StatusChip({ label, variant = 'pos' }) {
  const styles = variant === 'pos' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--primary-tint)] text-[var(--primary)]'
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>{label}</span>
}

export default function GSTReturns() {
  const [tab, setTab] = useState('gstr1')
  const [gstr1, setGstr1] = useState([])
  const [gstr3b, setGstr3b] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getGSTR1Summary(), getGSTR3B()]).then(([g1, g3b]) => {
      setGstr1(g1); setGstr3b(g3b); setLoading(false)
    })
  }, [])

  const totalTaxable = gstr1.reduce((s, i) => s + i.taxableAmt, 0)
  const totalGST = gstr1.reduce((s, i) => s + i.cgst + i.sgst + i.igst, 0)
  const totalInvoices = gstr1.reduce((s, i) => s + i.invoiceCount, 0)

  const gstr1Columns = [
    { key: 'rate', label: 'Rate', render: v => <span className="font-semibold text-[var(--text)]">{v}</span> },
    { key: 'taxableAmt', label: 'Taxable Amt', align: 'right', render: v => <span className="tabular text-sm">{formatCurrency(v)}</span> },
    { key: 'cgst', label: 'CGST', align: 'right', render: v => <span className="tabular text-sm text-[var(--muted)]">{formatCurrency(v)}</span> },
    { key: 'sgst', label: 'SGST', align: 'right', render: v => <span className="tabular text-sm text-[var(--muted)]">{formatCurrency(v)}</span> },
    { key: 'igst', label: 'IGST', align: 'right', render: v => <span className="tabular text-sm text-[var(--muted)]">{formatCurrency(v)}</span> },
    { key: 'total', label: 'Total', align: 'right', render: v => <span className="tabular text-sm font-semibold text-[var(--text)]">{formatCurrency(v)}</span> },
    { key: 'invoiceCount', label: 'Invoices', align: 'center', render: v => <span className="tabular text-sm text-[var(--muted)]">{v}</span> },
  ]

  const G3B = gstr3b
  const g3bRows = G3B ? [
    { label: 'CGST', liability: G3B.outwardLiability.cgst, itc: G3B.itcAvailable.cgst, net: G3B.netPayable.cgst },
    { label: 'SGST', liability: G3B.outwardLiability.sgst, itc: G3B.itcAvailable.sgst, net: G3B.netPayable.sgst },
    { label: 'IGST', liability: G3B.outwardLiability.igst, itc: G3B.itcAvailable.igst, net: G3B.netPayable.igst },
    { label: 'Total', liability: G3B.outwardLiability.total, itc: G3B.itcAvailable.total, net: G3B.netPayable.total, bold: true },
  ] : []

  return (
    <div>
      <PageHeader title="GST Returns" subtitle="GSTR-1 & GSTR-3B filing" breadcrumb={['Tax Center', 'GST Returns']} />
      <CompliancePipeline />

      <div className="flex gap-1 border-b border-[var(--border)] mb-5">
        <TabButton active={tab === 'gstr1'} onClick={() => setTab('gstr1')}>GSTR-1</TabButton>
        <TabButton active={tab === 'gstr3b'} onClick={() => setTab('gstr3b')}>GSTR-3B</TabButton>
      </div>

      {tab === 'gstr1' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Total Taxable', value: formatCompact(totalTaxable), color: 'var(--text)' },
              { label: 'Total GST', value: formatCompact(totalGST), color: 'var(--primary)' },
              { label: 'Invoice Count', value: totalInvoices, color: 'var(--muted)' },
            ].map(k => (
              <div key={k.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">{k.label}</p>
                <p className="tabular text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              </div>
            ))}
          </div>
          <DataTable columns={gstr1Columns} data={gstr1} loading={loading} rowKey="id"
            toolbar={<div className="flex justify-end"><Button variant="primary" icon={FileText} size="sm">File GSTR-1</Button></div>}
          />
        </>
      )}

      {tab === 'gstr3b' && G3B && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <StatusChip label={`${G3B.status} — ARN: ${G3B.arn}`} variant="pos" />
            <span className="text-sm text-[var(--muted)]">Filed on {G3B.filedOn} · Period: {G3B.period}</span>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden shadow-sm mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Head</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Liability</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">ITC</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {g3bRows.map(row => (
                  <tr key={row.label} className={row.bold ? 'bg-[var(--surface-2)]' : ''}>
                    <td className={`px-4 py-3 ${row.bold ? 'font-bold text-[var(--text)]' : 'text-[var(--muted)]'}`}>{row.label}</td>
                    <td className={`px-4 py-3 text-right tabular ${row.bold ? 'font-bold text-[var(--text)]' : 'text-[var(--text)]'}`}>{formatCurrency(row.liability)}</td>
                    <td className={`px-4 py-3 text-right tabular ${row.bold ? 'font-bold text-[var(--pos)]' : 'text-[var(--pos)]'}`}>{formatCurrency(row.itc)}</td>
                    <td className={`px-4 py-3 text-right tabular ${row.bold ? 'font-bold text-[var(--primary)]' : 'text-[var(--primary)]'}`}>{formatCurrency(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" icon={Eye} size="sm">View Filed Return</Button>
          </div>
        </>
      )}
    </div>
  )
}
