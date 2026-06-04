import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays, FilePlus, Plus, QrCode, Save, ScanBarcode,
  Send, Settings, Trash2, X,
} from 'lucide-react'
import { formatCurrency } from '../../lib/currency'
import { toast } from '../../lib/toast'
import { useAppStore } from '../../store/useAppStore'

const DEFAULT_ITEM = {
  id: 1,
  name: '',
  hsn: '',
  qty: 1,
  price: 0,
  discount: 0,
  taxRate: 18,
}

const TERMS = [
  'Goods once sold will not be taken back or exchanged.',
  'All disputes are subject to local jurisdiction only.',
]

function today() {
  return new Date().toISOString().slice(0, 10)
}

function fieldClass(extra = '') {
  return `h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] ${extra}`
}

export default function QuickInvoiceModal({ open, onClose }) {
  const recordAudit = useAppStore(s => s.recordAudit)
  const markSetupAction = useAppStore(s => s.markSetupAction)

  const [party, setParty] = useState({
    name: '',
    phone: '',
    gstin: '',
    address: '',
  })
  const [invoice, setInvoice] = useState({
    prefix: 'UT/SI/26-27',
    number: '59',
    date: today(),
    terms: 30,
    dueDate: today(),
    ewayBill: '',
  })
  const [items, setItems] = useState([DEFAULT_ITEM])
  const [notes, setNotes] = useState('')
  const [additionalCharges, setAdditionalCharges] = useState(0)
  const [invoiceDiscount, setInvoiceDiscount] = useState(0)
  const [applyTcs, setApplyTcs] = useState(false)
  const [roundOff, setRoundOff] = useState(false)
  const [amountReceived, setAmountReceived] = useState(0)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setParty({ name: '', phone: '', gstin: '', address: '' })
    setInvoice({ prefix: 'UT/SI/26-27', number: '59', date: today(), terms: 30, dueDate: today(), ewayBill: '' })
    setItems([DEFAULT_ITEM])
    setNotes('')
    setAdditionalCharges(0)
    setInvoiceDiscount(0)
    setApplyTcs(false)
    setRoundOff(false)
    setAmountReceived(0)
    setPaymentMode('Cash')
    setSaving(false)
  }, [open])

  const totals = useMemo(() => {
    const itemRows = items.map(item => {
      const taxable = Number(item.qty || 0) * Number(item.price || 0)
      const discount = Number(item.discount || 0)
      const taxableAfterDiscount = Math.max(taxable - discount, 0)
      const tax = taxableAfterDiscount * (Number(item.taxRate || 0) / 100)
      return { taxable, discount, taxableAfterDiscount, tax, total: taxableAfterDiscount + tax }
    })
    const subtotal = itemRows.reduce((sum, row) => sum + row.taxableAfterDiscount, 0)
    const tax = itemRows.reduce((sum, row) => sum + row.tax, 0)
    const tcs = applyTcs ? (subtotal + tax) * 0.001 : 0
    const beforeRound = subtotal + tax + Number(additionalCharges || 0) + tcs - Number(invoiceDiscount || 0)
    const rounded = roundOff ? Math.round(beforeRound) : beforeRound
    return {
      subtotal,
      tax,
      tcs,
      total: rounded,
      balance: Math.max(rounded - Number(amountReceived || 0), 0),
    }
  }, [items, additionalCharges, invoiceDiscount, applyTcs, roundOff, amountReceived])

  if (!open) return null

  function updateItem(id, field, value) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { ...DEFAULT_ITEM, id: Date.now() }])
  }

  function removeItem(id) {
    setItems(prev => prev.length === 1 ? prev : prev.filter(item => item.id !== id))
  }

  function saveInvoice(sendAfterSave = false) {
    if (!party.name.trim()) {
      toast.error('Add a customer before saving the invoice')
      return
    }
    const hasItem = items.some(item => item.name.trim() && Number(item.price) > 0)
    if (!hasItem) {
      toast.error('Add at least one item with a price')
      return
    }
    setSaving(true)
    window.setTimeout(() => {
      recordAudit(
        'sales',
        sendAfterSave ? 'Sales invoice saved and sent' : 'Sales invoice saved',
        `Invoice ${invoice.prefix}-${invoice.number} for ${party.name} totals ${formatCurrency(totals.total)}.`,
        { module: 'Sales' }
      )
      markSetupAction('first-invoice')
      toast.success(sendAfterSave ? 'Invoice saved and ready to send' : 'Invoice saved')
      setSaving(false)
      onClose?.()
    }, 450)
  }

  return (
    <div className="fixed inset-0 z-[920] bg-black/45">
      <div className="flex h-full flex-col bg-[var(--bg)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-2)]">
              <X size={17} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <FilePlus size={16} className="text-[var(--primary)]" />
                <h2 className="text-sm font-bold text-[var(--text)]">Create Sales Invoice</h2>
              </div>
              <p className="text-[11px] text-[var(--muted)]">GST-ready invoice with payment QR, bank details, and item taxes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--muted)]">
              <Settings size={13} /> Settings
            </button>
            <button
              onClick={() => saveInvoice(true)}
              disabled={saving}
              className="flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--primary-tint)] px-3 text-xs font-semibold text-[var(--primary)] disabled:opacity-50"
            >
              <Send size={13} /> Save & Send
            </button>
            <button
              onClick={() => saveInvoice(false)}
              disabled={saving}
              className="flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-xs font-semibold text-white disabled:opacity-50"
            >
              <Save size={13} /> Save
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-h-full grid-cols-1 xl:grid-cols-[1fr_380px]">
            <section className="border-r border-[var(--border)] bg-[var(--surface)]">
              <div className="grid gap-4 border-b border-[var(--border)] p-4 lg:grid-cols-[minmax(320px,1fr)_minmax(360px,430px)]">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Bill To</p>
                  <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--primary)] bg-[var(--primary-tint)]/35 p-4">
                    <input
                      value={party.name}
                      onChange={e => setParty(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="+ Add Party / Customer Name"
                      className="mb-3 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)]"
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={party.phone} onChange={e => setParty(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className={fieldClass()} />
                      <input value={party.gstin} onChange={e => setParty(prev => ({ ...prev, gstin: e.target.value }))} placeholder="GSTIN" className={fieldClass('font-mono')} />
                    </div>
                    <textarea
                      value={party.address}
                      onChange={e => setParty(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Billing address"
                      rows={2}
                      className="mt-3 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="mb-1 block text-[11px] font-semibold text-[var(--muted)]">Invoice Prefix</span>
                    <input value={invoice.prefix} onChange={e => setInvoice(prev => ({ ...prev, prefix: e.target.value }))} className={fieldClass('font-mono')} />
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-semibold text-[var(--muted)]">Invoice Number</span>
                    <input value={invoice.number} onChange={e => setInvoice(prev => ({ ...prev, number: e.target.value }))} className={fieldClass('font-mono')} />
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-semibold text-[var(--muted)]">Sales Invoice Date</span>
                    <div className="relative">
                      <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
                      <input type="date" value={invoice.date} onChange={e => setInvoice(prev => ({ ...prev, date: e.target.value }))} className={fieldClass('pl-8')} />
                    </div>
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-semibold text-[var(--muted)]">Due Date</span>
                    <input type="date" value={invoice.dueDate} onChange={e => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))} className={fieldClass()} />
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-semibold text-[var(--muted)]">Payment Terms</span>
                    <div className="flex items-center gap-2">
                      <input type="number" value={invoice.terms} onChange={e => setInvoice(prev => ({ ...prev, terms: e.target.value }))} className={fieldClass('w-20 tabular')} />
                      <span className="text-xs text-[var(--muted)]">days</span>
                    </div>
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-semibold text-[var(--muted)]">E-Way Bill No.</span>
                    <input value={invoice.ewayBill} onChange={e => setInvoice(prev => ({ ...prev, ewayBill: e.target.value }))} placeholder="Optional" className={fieldClass('font-mono')} />
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1120px] text-sm">
                  <thead className="bg-[var(--surface-2)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    <tr>
                      <th className="w-12 px-3 py-2 text-left">No</th>
                      <th className="px-3 py-2 text-left">Items / Services</th>
                      <th className="w-32 px-3 py-2 text-left">HSN / SAC</th>
                      <th className="w-24 px-3 py-2 text-right">Qty</th>
                      <th className="w-32 px-3 py-2 text-right">Price / Item</th>
                      <th className="w-32 px-3 py-2 text-right">Discount</th>
                      <th className="w-28 px-3 py-2 text-right">Tax %</th>
                      <th className="w-36 px-3 py-2 text-right">Amount</th>
                      <th className="w-12 px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const taxable = Math.max((Number(item.qty || 0) * Number(item.price || 0)) - Number(item.discount || 0), 0)
                      const total = taxable + taxable * (Number(item.taxRate || 0) / 100)
                      return (
                        <tr key={item.id} className="border-b border-[var(--border)]">
                          <td className="px-3 py-2 text-[var(--muted)]">{index + 1}</td>
                          <td className="px-3 py-2">
                            <input value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="+ Add Item" className={fieldClass()} />
                          </td>
                          <td className="px-3 py-2">
                            <input value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} placeholder="9983" className={fieldClass('font-mono')} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} className={fieldClass('text-right tabular')} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} className={fieldClass('text-right tabular')} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={item.discount} onChange={e => updateItem(item.id, 'discount', e.target.value)} className={fieldClass('text-right tabular')} />
                          </td>
                          <td className="px-3 py-2">
                            <select value={item.taxRate} onChange={e => updateItem(item.id, 'taxRate', e.target.value)} className={fieldClass('text-right tabular')}>
                              {[0, 5, 12, 18, 28].map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2 text-right tabular font-semibold text-[var(--text)]">{formatCurrency(total)}</td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => removeItem(item.id)} className="rounded-lg p-1.5 text-[var(--faint)] hover:bg-[var(--neg-tint)] hover:text-[var(--neg)]">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 border-b border-[var(--border)] p-3 lg:grid-cols-[1fr_260px]">
                <button
                  onClick={addItem}
                  className="flex h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--primary)] bg-[var(--primary-tint)] text-sm font-semibold text-[var(--primary)]"
                >
                  <Plus size={14} /> Add Item
                </button>
                <button className="flex h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text)]">
                  <ScanBarcode size={18} /> Scan Barcode
                </button>
              </div>

              <div className="grid gap-5 p-4 lg:grid-cols-2">
                <div>
                  <button className="mb-3 text-xs font-semibold text-[var(--primary)]">+ Add Notes</button>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Customer notes..." className="w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]" />
                  <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-3">
                    <p className="mb-2 text-xs font-semibold text-[var(--muted)]">Terms and Conditions</p>
                    <ol className="list-decimal space-y-1 pl-4 text-xs text-[var(--muted)]">
                      {TERMS.map(term => <li key={term}>{term}</li>)}
                    </ol>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[110px_1fr] lg:grid-cols-[100px_1fr]">
                  <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--primary)] bg-white">
                    <QrCode size={74} className="text-[var(--text)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">Payment QR</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">sunrise@upi</p>
                    <p className="mt-2 text-xs text-[var(--faint)]">Customers can pay this invoice by scanning the QR.</p>
                    <button className="mt-3 text-xs font-semibold text-[var(--primary)]">Change QR Code</button>
                  </div>
                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-semibold text-[var(--muted)]">Bank Details</p>
                    <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-3 text-xs text-[var(--muted)]">
                      <p>Account Number: 259505050255</p>
                      <p>IFSC Code: INDB0002064</p>
                      <p>Bank: IndusInd Bank, Vanasthalipuram</p>
                      <p>Account Holder: Sunrise Traders Pvt. Ltd.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="bg-[var(--surface)] p-4">
              <div className="sticky top-4 space-y-4">
                <div className="rounded-[var(--radius-sm)] border border-[var(--border)] p-4">
                  <h3 className="mb-3 text-sm font-bold text-[var(--text)]">Invoice Summary</h3>
                  <div className="space-y-3 text-sm">
                    <SummaryRow label="Subtotal" value={totals.subtotal} />
                    <SummaryRow label="Tax" value={totals.tax} />
                    <label className="block">
                      <span className="mb-1 block text-xs text-[var(--muted)]">Additional Charges</span>
                      <input type="number" value={additionalCharges} onChange={e => setAdditionalCharges(e.target.value)} className={fieldClass('text-right tabular')} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-[var(--muted)]">Invoice Discount</span>
                      <input type="number" value={invoiceDiscount} onChange={e => setInvoiceDiscount(e.target.value)} className={fieldClass('text-right tabular')} />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
                      <input type="checkbox" checked={applyTcs} onChange={e => setApplyTcs(e.target.checked)} />
                      Apply TCS
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
                      <input type="checkbox" checked={roundOff} onChange={e => setRoundOff(e.target.checked)} />
                      Auto round off
                    </label>
                    <div className="border-t border-[var(--border)] pt-3">
                      <SummaryRow label="Total Amount" value={totals.total} strong />
                    </div>
                  </div>
                </div>

                <div className="rounded-[var(--radius-sm)] border border-[var(--border)] p-4">
                  <h3 className="mb-3 text-sm font-bold text-[var(--text)]">Payment</h3>
                  <label className="block">
                    <span className="mb-1 block text-xs text-[var(--muted)]">Amount Received</span>
                    <input type="number" value={amountReceived} onChange={e => setAmountReceived(e.target.value)} className={fieldClass('text-right tabular')} />
                  </label>
                  <label className="mt-3 block">
                    <span className="mb-1 block text-xs text-[var(--muted)]">Payment Mode</span>
                    <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className={fieldClass()}>
                      {['Cash', 'UPI', 'Card', 'NEFT', 'Cheque'].map(mode => <option key={mode}>{mode}</option>)}
                    </select>
                  </label>
                  <button
                    onClick={() => setAmountReceived(Math.round(totals.total))}
                    className="mt-3 w-full rounded-[var(--radius-sm)] bg-[var(--primary-tint)] px-3 py-2 text-xs font-semibold text-[var(--primary)]"
                  >
                    Mark as fully paid
                  </button>
                  <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-3">
                    <SummaryRow label="Balance Amount" value={totals.balance} strong color={totals.balance > 0 ? 'var(--neg)' : 'var(--pos)'} />
                  </div>
                </div>

                <div className="rounded-[var(--radius-sm)] border border-[var(--primary)]/20 bg-[var(--primary-tint)] p-4">
                  <p className="text-sm font-bold text-[var(--primary)]">Competitor-grade checklist</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-[var(--primary)]">
                    <li>Party GSTIN and address captured</li>
                    <li>HSN/SAC, GST rate, discounts and totals visible</li>
                    <li>Payment QR and bank details included</li>
                    <li>Amount received and balance tracked at creation</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, strong = false, color }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? 'text-sm font-bold text-[var(--text)]' : 'text-sm text-[var(--muted)]'}>{label}</span>
      <span className={strong ? 'tabular text-sm font-bold' : 'tabular text-sm font-medium text-[var(--text)]'} style={{ color: color ?? undefined }}>
        {formatCurrency(value)}
      </span>
    </div>
  )
}
