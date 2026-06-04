import { useEffect, useRef } from 'react'
import { Ban, ChevronDown, FileDown, Printer, Receipt, Share2, ShieldCheck, Truck, X } from 'lucide-react'
import { formatCurrency } from '../../lib/currency'

const EWAY_CFG = {
  active:  { label: 'EWB active',  tone: 'text-[#15803d] bg-[#dcfce7]' },
  closed:  { label: 'EWB closed',  tone: 'text-[#64748b] bg-[#f1f5f9]' },
  expired: { label: 'EWB expired', tone: 'text-[#dc2626] bg-[#fee2e2]' },
  pending: { label: 'EWB due',     tone: 'text-[#b45309] bg-[#fef3c7]' },
  none:    { label: 'No EWB',      tone: 'text-[#64748b] bg-[#f1f5f9]' },
}

function EwayChip({ status }) {
  const cfg = EWAY_CFG[status] ?? EWAY_CFG.none
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.tone}`}>{cfg.label}</span>
}

/**
 * InvoicePreview — full-page invoice modal with print / PDF support.
 *
 * Props:
 *   open     boolean
 *   onClose  () => void
 *   onShare  () => void
 *   invoice  { ref, date, dueDate, customer, items, subtotal, gst, total, paid, status }
 */
export default function InvoicePreview({
  open,
  onClose,
  onShare,
  invoice,
  onEwayAction,
  onCreateChallan,
  onCreateReceipt,
}) {
  const printRef = useRef(null)
  const ewayOpen = open && !!invoice

  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open || !invoice) return null

  const outstanding = (invoice.total ?? 0) - (invoice.paid ?? 0)
  const ewayNo = invoice.ewayNo ?? (invoice.ewayStatus === 'active' || invoice.ewayStatus === 'closed' || invoice.ewayStatus === 'expired'
    ? `EWB-${invoice.ref.replace(/\D/g, '').slice(-8)}`
    : 'Not generated')

  function handlePrint() {
    const content = printRef.current?.innerHTML
    if (!content) return
    const w = window.open('', '_blank', 'width=850,height=1100')
    w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.ref}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; color: #0F172A; padding: 40px; font-size: 13px; }
    .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .company-name { font-size: 20px; font-weight: 800; color: #0F6E56; }
    .inv-meta { text-align: right; }
    .inv-meta h2 { font-size: 28px; font-weight: 900; color: #0F6E56; letter-spacing: -0.5px; }
    .inv-meta p { font-size: 12px; color: #64748B; margin-top: 2px; }
    .divider { border: none; border-top: 1px solid #E2E8F0; margin: 16px 0; }
    .bill-row { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .bill-box h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; margin-bottom: 6px; }
    .bill-box p { font-size: 13px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    thead tr { background: #F1F5F9; }
    th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B; }
    th:last-child, td:last-child { text-align: right; }
    td { padding: 12px 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
    .totals-box { margin-left: auto; width: 260px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .total-row.grand { border-top: 2px solid #0F6E56; margin-top: 8px; padding-top: 12px; font-weight: 800; font-size: 16px; color: #0F6E56; }
    .status-chip { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #DCFCE7; color: #16a34a; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>${content}</body>
</html>`)
    w.document.close()
    setTimeout(() => { w.focus(); w.print() }, 400)
  }

  const statusColor = {
    paid:    { bg: '#DCFCE7', color: '#16a34a' },
    partial: { bg: '#FEF3C7', color: '#d97706' },
    unpaid:  { bg: '#F1F5F9', color: '#64748B' },
    overdue: { bg: '#FEE2E2', color: '#EF4444' },
  }[invoice.status] ?? { bg: '#F1F5F9', color: '#64748B' }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[920] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-4 sm:inset-8 lg:inset-16 z-[930] bg-[var(--bg)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: 'previewIn 220ms cubic-bezier(0.16,1,0.3,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex-shrink-0">
          <p className="text-sm font-bold text-[var(--text)] flex-1">
            Invoice Preview — <span style={{ color: 'var(--primary)' }}>{invoice.ref}</span>
          </p>
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
            style={{ color: 'var(--text)' }}
          >
            <Share2 size={13} /> Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
            style={{ background: 'var(--primary)' }}
          >
            <Printer size={13} /> Print / PDF
          </button>
          <button
            onClick={() => onEwayAction?.('generate', invoice)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--primary)]/25 bg-[var(--primary-tint)] text-[var(--primary)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <ShieldCheck size={13} /> Generate E-way Bill <ChevronDown size={12} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--faint)] transition-colors ml-1">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable invoice body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-5">
          <div
            ref={printRef}
            className="w-full max-w-[760px] bg-white rounded-xl shadow-lg p-10"
            style={{ border: '1px solid #E2E8F0' }}
          >
            {/* Invoice header */}
            <div className="inv-header flex justify-between items-start mb-8">
              <div>
                <p className="text-xl font-extrabold" style={{ color: 'var(--primary)' }}>
                  Sunrise Traders Pvt. Ltd.
                </p>
                <p className="text-xs text-[#64748B] mt-1">GSTIN: 27AABCS1429B1Z3</p>
                <p className="text-xs text-[#64748B]">12, Business Park, Mumbai — 400001</p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black tracking-tight" style={{ color: 'var(--primary)' }}>INVOICE</h2>
                <p className="text-sm font-mono font-bold mt-1 text-[#0F172A]">{invoice.ref}</p>
                <span
                  className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase"
                  style={{ background: statusColor.bg, color: statusColor.color }}
                >
                  {invoice.status}
                </span>
              </div>
            </div>

            <hr style={{ borderColor: '#E2E8F0', marginBottom: 20 }} />

            {/* Bill to + dates */}
            <div className="flex justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2">Bill To</p>
                <p className="font-bold text-[#0F172A]">{invoice.customer}</p>
                <p className="text-xs text-[#64748B] mt-0.5">customer@example.com</p>
              </div>
              <div className="text-right">
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Invoice Date</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{invoice.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Due Date</p>
                  <p className="text-sm font-semibold" style={{ color: invoice.status === 'overdue' ? '#EF4444' : '#0F172A' }}>
                    {invoice.dueDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Line items table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#F1F5F9' }}>
                  {['#', 'Description', 'Qty', 'Rate', 'GST%', 'Amount'].map(h => (
                    <th key={h} style={{
                      padding: '10px 12px', textAlign: h === 'Amount' ? 'right' : 'left',
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: '#64748B',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: invoice.items ?? 2 }, (_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px', fontSize: 13, color: '#94A3B8' }}>{i + 1}</td>
                    <td style={{ padding: '12px', fontSize: 13 }}>
                      {i === 0 ? 'Professional Services — Nov 2024' : 'Software License (Annual)'}
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#64748B' }}>1</td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#64748B', fontFamily: 'monospace' }}>
                      {formatCurrency(i === 0
                        ? Math.round((invoice.subtotal ?? 0) * 0.6)
                        : Math.round((invoice.subtotal ?? 0) * 0.4)
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#64748B' }}>18%</td>
                    <td style={{ padding: '12px', fontSize: 13, textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                      {formatCurrency(i === 0
                        ? Math.round((invoice.subtotal ?? 0) * 0.6)
                        : Math.round((invoice.subtotal ?? 0) * 0.4)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ marginLeft: 'auto', width: 260 }}>
              {[
                { label: 'Subtotal',   val: invoice.subtotal, color: '#0F172A'          },
                { label: 'GST (18%)',  val: invoice.gst,      color: '#64748B'          },
                { label: 'Collected',  val: invoice.paid,     color: 'var(--pos)'       },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>{r.label}</span>
                  <span style={{ color: r.color, fontFamily: 'monospace' }}>{formatCurrency(r.val ?? 0)}</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                borderTop: '2px solid #0F6E56', marginTop: 8, paddingTop: 12,
                fontWeight: 800, fontSize: 16, color: '#0F6E56',
              }}>
                <span>Balance Due</span>
                <span style={{ fontFamily: 'monospace' }}>{formatCurrency(outstanding)}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
              <div>
                <p className="font-semibold text-[#64748B] mb-1">Bank Details</p>
                <p>HDFC Bank · A/c: 50200012345678</p>
                <p>IFSC: HDFC0001234 · GSTIN: 27AABCS1429B1Z3</p>
              </div>
              <div className="text-right">
                <p>Thank you for your business!</p>
                <p className="mt-1">Questions? accounts@sunrise.in</p>
              </div>
            </div>
          </div>

          {ewayOpen && (
            <aside className="w-full max-w-[760px] xl:max-w-[340px] bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-lg self-start overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">Generate E-way Bill</p>
                    <p className="text-[11px] text-[var(--muted)]">Invoice linked actions</p>
                  </div>
                  <EwayChip status={invoice.ewayStatus} />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Invoice', value: invoice.ref },
                    { label: 'EWB No', value: ewayNo },
                    { label: 'Mode', value: 'Road' },
                    { label: 'Valid Till', value: invoice.ewayStatus === 'none' || invoice.ewayStatus === 'pending' ? 'After generation' : '2026-01-20' },
                  ].map(item => (
                    <div key={item.label} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-2.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">{item.label}</p>
                      <p className="mt-1 text-xs font-semibold text-[var(--text)] break-words">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => onEwayAction?.('generate', invoice)}
                    className="w-full flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left hover:bg-[var(--primary-tint)]"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-[var(--text)]">Generate</span>
                      <span className="text-[11px] text-[var(--muted)]">Create EWB for this invoice</span>
                    </span>
                    <ShieldCheck size={15} className="text-[var(--primary)]" />
                  </button>
                  <button
                    onClick={() => onEwayAction?.('download', invoice)}
                    disabled={invoice.ewayStatus === 'none' || invoice.ewayStatus === 'pending'}
                    className="w-full flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-[var(--text)]">Download</span>
                      <span className="text-[11px] text-[var(--muted)]">Download EWB PDF</span>
                    </span>
                    <FileDown size={15} className="text-[var(--primary)]" />
                  </button>
                  <button
                    onClick={() => onEwayAction?.('cancel', invoice)}
                    disabled={invoice.ewayStatus !== 'active'}
                    className="w-full flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left hover:bg-[var(--neg-tint)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-[var(--text)]">Cancel</span>
                      <span className="text-[11px] text-[var(--muted)]">Cancel active e-way bill</span>
                    </span>
                    <Ban size={15} className="text-[var(--neg)]" />
                  </button>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-2">
                  <button
                    onClick={() => onCreateChallan?.(invoice)}
                    className="w-full flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2.5 text-left hover:text-[var(--primary)]"
                  >
                    <span className="text-sm font-semibold">Create delivery challan</span>
                    <Truck size={15} />
                  </button>
                  <button
                    onClick={() => onCreateReceipt?.(invoice)}
                    className="w-full flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2.5 text-left hover:text-[var(--primary)]"
                  >
                    <span className="text-sm font-semibold">Create receipt</span>
                    <Receipt size={15} />
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <style>{`
        @keyframes previewIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
