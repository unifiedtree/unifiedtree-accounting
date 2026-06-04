import { useState, useEffect } from 'react'
import { Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getGSTR1Summary, getGSTR3B, getGSTR2B } from '../../data/services/taxService'

const GST_TABS = ['GSTR-1 Summary', 'GSTR-3B', 'GSTR-2B ITC']

export default function GSTReports() {
  const [tab, setTab]       = useState('GSTR-1 Summary')
  const [gstr1, setGstr1]   = useState([])
  const [gstr3b, setGstr3b] = useState(null)
  const [gstr2b, setGstr2b] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getGSTR1Summary(), getGSTR3B(), getGSTR2B()]).then(([g1, g3b, g2b]) => {
      setGstr1(g1); setGstr3b(g3b); setGstr2b(g2b); setLoading(false)
    })
  }, [])

  const totalOutput = gstr1.reduce((s,r) => s + r.cgst + r.sgst + r.igst, 0)
  const totalTaxable = gstr1.reduce((s,r) => s + r.taxableAmt, 0)

  return (
    <div>
      <PageHeader title="GST Reports" subtitle="GSTR-1 · GSTR-3B · GSTR-2B ITC" breadcrumb={['Reports & Analytics', 'GST Reports']}
        action={<Button variant="secondary" icon={Download} size="sm">Export</Button>}
      />

      <div className="flex gap-1 mb-5">
        {GST_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${tab===t?'bg-[var(--primary)] text-white':'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center text-sm text-[var(--faint)] py-12">Loading…</p> : (
        <>
          {/* GSTR-1 Summary */}
          {tab === 'GSTR-1 Summary' && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label:'Taxable Turnover', value:formatCompact(totalTaxable), color:'var(--text)' },
                  { label:'Output Tax',        value:formatCompact(totalOutput),  color:'var(--primary)' },
                  { label:'Total Invoices',    value:gstr1.reduce((s,r)=>s+r.invoiceCount,0), color:'var(--muted)' },
                ].map(k => (
                  <div key={k.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">{k.label}</p>
                    <p className="tabular text-xl font-bold" style={{color:k.color}}>{k.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                      {['GST Rate','Invoices','Taxable Amount','CGST','SGST','IGST','Total Tax'].map(h => (
                        <th key={h} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] ${h==='GST Rate'||h==='Invoices'?'text-left':'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gstr1.map((r,i) => (
                      <tr key={r.id} className={`border-b border-[var(--border)] ${i%2===1?'bg-[var(--surface-2)]':''}`}>
                        <td className="px-4 py-2.5 font-semibold text-[var(--primary)]">{r.rate}</td>
                        <td className="px-4 py-2.5 text-center text-[var(--muted)]">{r.invoiceCount}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--text)]">{formatCurrency(r.taxableAmt)}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--muted)]">{r.cgst > 0 ? formatCurrency(r.cgst) : '—'}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--muted)]">{r.sgst > 0 ? formatCurrency(r.sgst) : '—'}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--muted)]">{r.igst > 0 ? formatCurrency(r.igst) : '—'}</td>
                        <td className="px-4 py-2.5 tabular text-right font-semibold text-[var(--primary)]">{formatCurrency(r.cgst+r.sgst+r.igst)}</td>
                      </tr>
                    ))}
                    <tr className="bg-[var(--surface-2)] border-t-2 border-[var(--primary)]">
                      <td className="px-4 py-3 text-sm font-bold text-[var(--text)]">TOTAL</td>
                      <td className="px-4 py-3 text-center font-bold">{gstr1.reduce((s,r)=>s+r.invoiceCount,0)}</td>
                      <td className="px-4 py-3 tabular text-right font-bold">{formatCurrency(totalTaxable)}</td>
                      <td className="px-4 py-3 tabular text-right font-bold">{formatCurrency(gstr1.reduce((s,r)=>s+r.cgst,0))}</td>
                      <td className="px-4 py-3 tabular text-right font-bold">{formatCurrency(gstr1.reduce((s,r)=>s+r.sgst,0))}</td>
                      <td className="px-4 py-3 tabular text-right font-bold">{formatCurrency(gstr1.reduce((s,r)=>s+r.igst,0))}</td>
                      <td className="px-4 py-3 tabular text-right font-bold text-[var(--primary)]">{formatCurrency(totalOutput)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* GSTR-3B */}
          {tab === 'GSTR-3B' && gstr3b && (
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--pos-tint)] border border-[var(--pos)]">
                <CheckCircle2 size={16} className="text-[var(--pos)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--pos)]">Filed — {gstr3b.period}</p>
                  <p className="text-xs text-[var(--muted)]">ARN: {gstr3b.arn} · Filed on {gstr3b.filedOn}</p>
                </div>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Particulars</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">IGST</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">CGST</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">SGST</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label:'3.1 Outward Liability',  data:gstr3b.outwardLiability, color:'var(--text)'    },
                      { label:'4. ITC Available',        data:gstr3b.itcAvailable,     color:'var(--pos)'     },
                      { label:'Net Tax Payable',         data:gstr3b.netPayable,       color:'var(--primary)' },
                      { label:'6. Cash Paid',            data:gstr3b.cashPaid,         color:'var(--neg)'     },
                    ].map((row,i) => (
                      <tr key={row.label} className={`border-b border-[var(--border)] ${i%2===1?'bg-[var(--surface-2)]':''}`}>
                        <td className="px-4 py-3 font-medium text-[var(--text)]">{row.label}</td>
                        <td className="px-4 py-3 tabular text-right" style={{color:row.color}}>{row.data.igst > 0 ? formatCurrency(row.data.igst) : '—'}</td>
                        <td className="px-4 py-3 tabular text-right" style={{color:row.color}}>{formatCurrency(row.data.cgst)}</td>
                        <td className="px-4 py-3 tabular text-right" style={{color:row.color}}>{formatCurrency(row.data.sgst)}</td>
                        <td className="px-4 py-3 tabular text-right font-semibold" style={{color:row.color}}>{formatCurrency(row.data.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GSTR-2B ITC */}
          {tab === 'GSTR-2B ITC' && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label:'Total ITC Available', value:formatCompact(gstr2b.filter(r=>r.itcStatus==='Available').reduce((s,r)=>s+r.cgst+r.sgst+r.igst,0)), color:'var(--pos)' },
                  { label:'Matched',             value:gstr2b.filter(r=>r.matched).length, color:'var(--pos)' },
                  { label:'Unmatched / Blocked', value:gstr2b.filter(r=>!r.matched).length, color:'var(--neg)' },
                ].map(k => (
                  <div key={k.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">{k.label}</p>
                    <p className="tabular text-xl font-bold" style={{color:k.color}}>{k.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                      {['Supplier','Invoice No','Date','CGST','SGST','IGST','ITC Status','Matched'].map(h => (
                        <th key={h} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] ${['CGST','SGST','IGST'].includes(h)?'text-right':'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gstr2b.map((r,i) => (
                      <tr key={r.id} className={`border-b border-[var(--border)] ${i%2===1?'bg-[var(--surface-2)]':''}`}>
                        <td className="px-4 py-2.5 font-medium text-[var(--text)]">{r.supplier}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-[var(--primary)]">{r.invoiceNo}</td>
                        <td className="px-4 py-2.5 text-[var(--muted)] text-xs">{r.date}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--muted)]">{r.cgst > 0 ? formatCurrency(r.cgst) : '—'}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--muted)]">{r.sgst > 0 ? formatCurrency(r.sgst) : '—'}</td>
                        <td className="px-4 py-2.5 tabular text-right text-[var(--muted)]">{r.igst > 0 ? formatCurrency(r.igst) : '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r.itcStatus==='Available'?'bg-[var(--pos-tint)] text-[var(--pos)]':'bg-[var(--neg-tint)] text-[var(--neg)]'}`}>{r.itcStatus}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          {r.matched
                            ? <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--pos)]"><CheckCircle2 size={11}/>Matched</span>
                            : <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--warn)]"><AlertCircle size={11}/>Unmatched</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
