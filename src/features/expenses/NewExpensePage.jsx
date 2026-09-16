import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, FileText, ReceiptText, Save, ShieldCheck, WalletCards } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../lib/currency'
import { toast } from '../../lib/toast'

const CATEGORIES = ['Travel', 'Office Supplies', 'Software', 'Repairs', 'Marketing', 'Professional', 'Utilities']
const PAYMENT_MODES = ['Company Card', 'UPI', 'Cash', 'NEFT', 'Cheque', 'Employee Paid']
const POLICY_STATUSES = ['Auto approved', 'Needs manager approval', 'Finance review']

const INITIAL_FORM = {
  vendor: '',
  category: 'Travel',
  date: new Date().toISOString().slice(0, 10),
  invoiceNo: '',
  description: '',
  amount: '',
  gst: '',
  paidBy: '',
  mode: 'Company Card',
  policyStatus: 'Auto approved',
  receipt: '',
  notes: '',
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        {label}{required && <span className="text-[var(--neg)]"> *</span>}
      </span>
      {children}
    </label>
  )
}

function inputClass(extra = '') {
  return `h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] ${extra}`
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-[var(--primary)]" />
        <h2 className="text-sm font-bold text-[var(--text)]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function SummaryLine({ label, value, tone, strong }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className={`tabular text-sm ${strong ? 'font-black' : 'font-semibold'}`} style={tone ? { color: tone } : undefined}>{value}</span>
    </div>
  )
}

export default function NewExpensePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(null)

  const amount = Number(form.amount || 0)
  const gst = Number(form.gst || 0)
  const total = amount + gst
  const approvalRequired = form.policyStatus !== 'Auto approved' || total > 10000
  const draftRef = useMemo(() => `EXP-2526-${String(Math.max(1, Math.round(total || 89))).padStart(4, '0').slice(-4)}`, [total])

  function setValue(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!form.vendor.trim()) {
      toast.error('Enter vendor name')
      return
    }
    if (!form.description.trim()) {
      toast.error('Enter expense description')
      return
    }
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount')
      return
    }

    const saved = {
      ref: draftRef,
      vendor: form.vendor,
      category: form.category,
      total,
      status: approvalRequired ? 'Pending approval' : 'Approved',
    }
    setSubmitted(saved)
    toast.success(`${saved.ref} submitted`)
  }

  if (submitted) {
    return (
      <div>
        <PageHeader
          title="Expense Submitted"
          subtitle={`${submitted.ref} is ${submitted.status.toLowerCase()}`}
          breadcrumb={['Expenses', 'New Expense', 'Submitted']}
          action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/expense-center')}>Back to Expenses</Button>}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[var(--radius)] border border-[var(--pos)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={26} className="text-[var(--pos)]" />
              <div>
                <p className="text-lg font-black text-[var(--text)]">{submitted.ref}</p>
                <p className="text-sm text-[var(--muted)]">{submitted.vendor} - {submitted.category}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Total</p>
                <p className="mt-2 tabular text-xl font-black text-[var(--text)]">{formatCurrency(submitted.total)}</p>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Status</p>
                <p className="mt-2 text-xl font-black text-[var(--primary)]">{submitted.status}</p>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Next Step</p>
                <p className="mt-2 text-sm font-bold text-[var(--text)]">{approvalRequired ? 'Manager review' : 'Ready to post'}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-3">
            <Button variant="primary" className="w-full justify-center" icon={ReceiptText} onClick={() => setSubmitted(null)}>Create Another</Button>
            <Button variant="secondary" className="w-full justify-center" onClick={() => navigate('/expenses/approval-queue')}>Open Approval Queue</Button>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="New Expense"
        subtitle="Enter expense details, GST, policy checks, and payment source"
        breadcrumb={['Expenses', 'Expense Center', 'New Expense']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/expense-center')}>Back</Button>}
      />

      <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Section title="Expense Details" icon={ReceiptText}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Vendor" required>
                <input value={form.vendor} onChange={event => setValue('vendor', event.target.value)} className={inputClass()} placeholder="Ola Corporate" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={event => setValue('category', event.target.value)} className={inputClass()}>
                  {CATEGORIES.map(category => <option key={category}>{category}</option>)}
                </select>
              </Field>
              <Field label="Expense Date" required>
                <input type="date" value={form.date} onChange={event => setValue('date', event.target.value)} className={inputClass()} />
              </Field>
              <Field label="Invoice / Bill No">
                <input value={form.invoiceNo} onChange={event => setValue('invoiceNo', event.target.value)} className={inputClass()} placeholder="INV-1029" />
              </Field>
              <Field label="Receipt File">
                <input value={form.receipt} onChange={event => setValue('receipt', event.target.value)} className={inputClass()} placeholder="receipt-photo.jpg" />
              </Field>
              <Field label="Policy Status">
                <select value={form.policyStatus} onChange={event => setValue('policyStatus', event.target.value)} className={inputClass()}>
                  {POLICY_STATUSES.map(status => <option key={status}>{status}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description" required>
                <textarea value={form.description} onChange={event => setValue('description', event.target.value)} className={inputClass('h-24 resize-none py-2')} placeholder="Taxi for client meeting" />
              </Field>
            </div>
          </Section>

          <Section title="Amount & Tax" icon={FileText}>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Base Amount" required>
                <input type="number" min="0" step="1" value={form.amount} onChange={event => setValue('amount', event.target.value)} className={inputClass()} placeholder="0" />
              </Field>
              <Field label="GST">
                <input type="number" min="0" step="1" value={form.gst} onChange={event => setValue('gst', event.target.value)} className={inputClass()} placeholder="0" />
              </Field>
              <Field label="Total">
                <input value={formatCurrency(total)} readOnly className={inputClass('bg-[var(--surface-2)] font-bold')} />
              </Field>
            </div>
          </Section>

          <Section title="Payment & Notes" icon={WalletCards}>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Paid By">
                <input value={form.paidBy} onChange={event => setValue('paidBy', event.target.value)} className={inputClass()} placeholder="Priya S" />
              </Field>
              <Field label="Payment Mode">
                <select value={form.mode} onChange={event => setValue('mode', event.target.value)} className={inputClass()}>
                  {PAYMENT_MODES.map(mode => <option key={mode}>{mode}</option>)}
                </select>
              </Field>
              <Field label="Draft Ref">
                <input value={draftRef} readOnly className={inputClass('bg-[var(--surface-2)] font-mono')} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Notes">
                <textarea value={form.notes} onChange={event => setValue('notes', event.target.value)} className={inputClass('h-24 resize-none py-2')} placeholder="Approval notes or reimbursement context" />
              </Field>
            </div>
          </Section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[var(--primary)]" />
              <h2 className="text-sm font-bold text-[var(--text)]">Expense Summary</h2>
            </div>
            <div className="mt-4 space-y-3">
              <SummaryLine label="Vendor" value={form.vendor || '-'} />
              <SummaryLine label="Category" value={form.category} />
              <SummaryLine label="Base amount" value={formatCurrency(amount)} />
              <SummaryLine label="GST" value={formatCurrency(gst)} />
              <SummaryLine label="Total" value={formatCurrency(total)} strong tone="var(--primary)" />
              <SummaryLine label="Policy" value={approvalRequired ? 'Approval required' : 'Auto approved'} tone={approvalRequired ? 'var(--warn)' : 'var(--pos)'} />
            </div>
          </section>

          <section className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Posting Impact</p>
            <p className="mt-2 text-sm text-[var(--text)]">{approvalRequired ? 'Expense will wait in approval queue before posting.' : 'Expense can be posted directly after submit.'}</p>
          </section>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" icon={Save} className="flex-1 justify-center" onClick={() => toast.info('Expense draft saved')}>Draft</Button>
            <Button type="submit" variant="primary" icon={CheckCircle2} className="flex-1 justify-center">Submit</Button>
          </div>
        </aside>
      </form>
    </div>
  )
}
