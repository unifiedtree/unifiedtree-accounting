import { useMemo, useState } from 'react'
import { ArrowLeft, Inbox, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import { toast } from '../../lib/toast'
import { formatCurrency } from '../../lib/currency'

const INITIAL_RECEIPTS = [
  { id: 'RCPT-001', vendor: 'Adobe Systems', category: 'Software', amount: 5000, status: 'Matched', next: 'Post expense' },
  { id: 'RCPT-002', vendor: 'Ola Corporate', category: 'Travel', amount: 1500, status: 'Policy review', next: 'Confirm client travel' },
  { id: 'RCPT-003', vendor: 'Staples India', category: 'Office Supplies', amount: 3776, status: 'GST found', next: 'Verify invoice number' },
]

function inputClass(extra = '') {
  return `h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] ${extra}`
}

export default function ReceiptInboxPage() {
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS)
  const totalValue = useMemo(() => receipts.reduce((sum, item) => sum + item.amount, 0), [receipts])

  function uploadReceipt(event) {
    event.preventDefault()
    if (!vendor.trim() || !Number(amount || 0)) {
      toast.error('Enter vendor and amount')
      return
    }
    const next = {
      id: `RCPT-${String(receipts.length + 1).padStart(3, '0')}`,
      vendor,
      category: 'Unclassified',
      amount: Number(amount),
      status: 'Uploaded',
      next: 'Review match',
    }
    setReceipts(current => [next, ...current])
    setFileName('')
    setVendor('')
    setAmount('')
    toast.success(`${next.id} uploaded`)
  }

  const columns = [
    { key: 'id', label: 'Receipt', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'vendor', label: 'Vendor', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'category', label: 'Category', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: v => <span className="tabular font-semibold">{formatCurrency(v)}</span> },
    { key: 'status', label: 'Status', render: v => <span className="rounded-full bg-[var(--primary-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'next', label: 'Next Action', render: v => <span className="text-sm font-medium text-[var(--text)]">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Receipt Inbox"
        subtitle="Upload receipts, extract key details, and prepare matched expenses"
        breadcrumb={['Expenses', 'Receipt Inbox']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/expense-center')}>Back</Button>}
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <UploadCloud size={18} className="text-[var(--primary)]" />
            <h2 className="text-sm font-bold text-[var(--text)]">Upload Receipt</h2>
          </div>
          <form onSubmit={uploadReceipt} className="grid gap-4 md:grid-cols-3">
            <input value={fileName} onChange={event => setFileName(event.target.value)} className={inputClass()} placeholder="receipt.jpg" />
            <input value={vendor} onChange={event => setVendor(event.target.value)} className={inputClass()} placeholder="Vendor name" />
            <input value={amount} onChange={event => setAmount(event.target.value)} type="number" min="0" className={inputClass()} placeholder="Amount" />
            <Button type="submit" variant="primary" icon={Inbox} className="md:col-span-3 justify-center">Upload Receipt</Button>
          </form>
        </section>

        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Inbox Value</p>
          <p className="mt-2 tabular text-2xl font-black text-[var(--primary)]">{formatCurrency(totalValue)}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">{receipts.length} receipts waiting for posting or review.</p>
        </section>
      </div>

      <DataTable columns={columns} data={receipts} rowKey="id" />
    </div>
  )
}
