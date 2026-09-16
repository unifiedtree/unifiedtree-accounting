import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../lib/currency'
import { toast } from '../../lib/toast'

const INITIAL_FORM = {
  date: new Date().toISOString().slice(0, 10),
  narration: '',
  debitAccount: 'Travel & Conveyance',
  creditAccount: 'Cash / Bank',
  debit: '',
  credit: '',
  reference: '',
}

function inputClass(extra = '') {
  return `h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] ${extra}`
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

export default function NewAccountingEntryPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [posted, setPosted] = useState(null)
  const debit = Number(form.debit || 0)
  const credit = Number(form.credit || 0)
  const balanced = debit > 0 && debit === credit
  const ref = useMemo(() => `JV-2026-${String(Math.max(49, Math.round(debit || 49))).slice(-3).padStart(3, '0')}`, [debit])

  function setValue(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!form.narration.trim()) {
      toast.error('Enter narration')
      return
    }
    if (!balanced) {
      toast.error('Debit and credit must match')
      return
    }
    setPosted({ ref, amount: debit, narration: form.narration })
    toast.success(`${ref} posted`)
  }

  if (posted) {
    return (
      <div>
        <PageHeader
          title="Entry Posted"
          subtitle={`${posted.ref} posted to books`}
          breadcrumb={['Expenses', 'Accounting', 'New Entry']}
          action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/accounting')}>Back to Accounting</Button>}
        />
        <section className="rounded-[var(--radius)] border border-[var(--pos)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={26} className="text-[var(--pos)]" />
            <div>
              <p className="text-lg font-black text-[var(--text)]">{posted.ref}</p>
              <p className="text-sm text-[var(--muted)]">{posted.narration} - {formatCurrency(posted.amount)}</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="New Accounting Entry"
        subtitle="Create a balanced journal or accrual entry"
        breadcrumb={['Expenses', 'Accounting', 'New Entry']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/accounting')}>Back</Button>}
      />

      <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--primary)]" />
            <h2 className="text-sm font-bold text-[var(--text)]">Voucher Details</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Date" required>
              <input type="date" value={form.date} onChange={event => setValue('date', event.target.value)} className={inputClass()} />
            </Field>
            <Field label="Reference">
              <input value={form.reference} onChange={event => setValue('reference', event.target.value)} className={inputClass()} placeholder="Bill / memo ref" />
            </Field>
            <Field label="Draft Ref">
              <input value={ref} readOnly className={inputClass('bg-[var(--surface-2)] font-mono')} />
            </Field>
            <Field label="Debit Account">
              <select value={form.debitAccount} onChange={event => setValue('debitAccount', event.target.value)} className={inputClass()}>
                <option>Travel & Conveyance</option>
                <option>Provision for Audit Fees</option>
                <option>Repairs & Maintenance</option>
                <option>Software & Licenses</option>
              </select>
            </Field>
            <Field label="Debit Amount" required>
              <input type="number" min="0" value={form.debit} onChange={event => setValue('debit', event.target.value)} className={inputClass()} placeholder="0" />
            </Field>
            <Field label="Credit Account">
              <select value={form.creditAccount} onChange={event => setValue('creditAccount', event.target.value)} className={inputClass()}>
                <option>Cash / Bank</option>
                <option>Salary Payable</option>
                <option>Provision Ledger</option>
                <option>Vendor Payable</option>
              </select>
            </Field>
            <Field label="Credit Amount" required>
              <input type="number" min="0" value={form.credit} onChange={event => setValue('credit', event.target.value)} className={inputClass()} placeholder="0" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Narration" required>
              <textarea value={form.narration} onChange={event => setValue('narration', event.target.value)} className={inputClass('h-24 resize-none py-2')} placeholder="Expense accrual or journal reason" />
            </Field>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Balance Check</p>
            <p className="mt-2 tabular text-2xl font-black" style={{ color: balanced ? 'var(--pos)' : 'var(--warn)' }}>{balanced ? 'Balanced' : formatCurrency(Math.abs(debit - credit))}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Debit {formatCurrency(debit)} / Credit {formatCurrency(credit)}</p>
          </section>
          <Button type="submit" variant="primary" icon={CheckCircle2} className="w-full justify-center">Post Entry</Button>
        </aside>
      </form>
    </div>
  )
}
