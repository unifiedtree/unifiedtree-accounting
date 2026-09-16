import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { toast } from '../../lib/toast'

const INITIAL_FORM = {
  name: '',
  scope: 'Travel',
  condition: 'Amount greater than',
  threshold: '',
  action: 'Manager approval',
  owner: '',
  notes: '',
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

export default function NewRulePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [saved, setSaved] = useState(null)

  function setValue(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      toast.error('Enter rule name')
      return
    }
    if (!Number(form.threshold || 0)) {
      toast.error('Enter threshold amount')
      return
    }
    const rule = { ...form, id: 'POL-NEW-001' }
    setSaved(rule)
    toast.success(`${rule.id} saved`)
  }

  if (saved) {
    return (
      <div>
        <PageHeader
          title="Rule Saved"
          subtitle={`${saved.name} is active for ${saved.scope}`}
          breadcrumb={['Expenses', 'Rules & Recurring', 'New Rule']}
          action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/rules-recurring')}>Back to Rules</Button>}
        />
        <section className="rounded-[var(--radius)] border border-[var(--pos)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={26} className="text-[var(--pos)]" />
            <div>
              <p className="text-lg font-black text-[var(--text)]">{saved.id}</p>
              <p className="text-sm text-[var(--muted)]">{saved.condition} Rs {Number(saved.threshold).toLocaleString('en-IN')} to {saved.action}</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="New Rule"
        subtitle="Create budget, duplicate, cash, GST, and approval controls"
        breadcrumb={['Expenses', 'Rules & Recurring', 'New Rule']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/expenses/rules-recurring')}>Back</Button>}
      />

      <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[var(--primary)]" />
            <h2 className="text-sm font-bold text-[var(--text)]">Rule Setup</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Rule Name" required>
              <input value={form.name} onChange={event => setValue('name', event.target.value)} className={inputClass()} placeholder="Travel over limit" />
            </Field>
            <Field label="Scope">
              <select value={form.scope} onChange={event => setValue('scope', event.target.value)} className={inputClass()}>
                <option>Travel</option>
                <option>Office Supplies</option>
                <option>Software</option>
                <option>Cash</option>
                <option>All expenses</option>
              </select>
            </Field>
            <Field label="Condition">
              <select value={form.condition} onChange={event => setValue('condition', event.target.value)} className={inputClass()}>
                <option>Amount greater than</option>
                <option>Budget usage above</option>
                <option>Duplicate detected</option>
                <option>Missing receipt</option>
              </select>
            </Field>
            <Field label="Threshold" required>
              <input type="number" min="0" value={form.threshold} onChange={event => setValue('threshold', event.target.value)} className={inputClass()} placeholder="10000" />
            </Field>
            <Field label="Action">
              <select value={form.action} onChange={event => setValue('action', event.target.value)} className={inputClass()}>
                <option>Manager approval</option>
                <option>Finance review</option>
                <option>Warn user</option>
                <option>Block posting</option>
              </select>
            </Field>
            <Field label="Owner">
              <input value={form.owner} onChange={event => setValue('owner', event.target.value)} className={inputClass()} placeholder="Finance Lead" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Notes">
              <textarea value={form.notes} onChange={event => setValue('notes', event.target.value)} className={inputClass('h-24 resize-none py-2')} placeholder="Rule context or exception notes" />
            </Field>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Preview</p>
            <p className="mt-3 text-sm font-semibold text-[var(--text)]">{form.name || 'Unnamed rule'}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{form.condition} Rs {Number(form.threshold || 0).toLocaleString('en-IN')}</p>
            <p className="mt-1 text-sm text-[var(--primary)]">{form.action}</p>
          </section>
          <Button type="submit" variant="primary" icon={CheckCircle2} className="w-full justify-center">Save Rule</Button>
        </aside>
      </form>
    </div>
  )
}
