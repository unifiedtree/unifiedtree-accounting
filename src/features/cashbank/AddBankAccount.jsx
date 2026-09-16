import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Landmark, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { toast } from '../../lib/toast'

const inputClass = 'h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase text-[var(--muted)]">{label}</span>
      {children}
    </label>
  )
}

export default function AddBankAccount() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'Bank account',
    bank: '',
    accountNo: '',
    ifsc: '',
    openingBalance: '',
  })

  function setValue(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSaved(true)
    toast.success('Account added to Cash & Bank')
  }

  return (
    <div>
      <PageHeader
        title="Add Account"
        subtitle="Add a bank account, cash box, overdraft, or fixed deposit"
        breadcrumb={['Cash & Bank', 'Add Account']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/cashbank/bank-accounts')}>Back</Button>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSubmit} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Account name">
              <input required value={form.name} onChange={event => setValue('name', event.target.value)} className={inputClass} placeholder="Example: ICICI Current Account" />
            </Field>
            <Field label="Account type">
              <select value={form.type} onChange={event => setValue('type', event.target.value)} className={inputClass}>
                <option>Bank account</option>
                <option>Cash box</option>
                <option>Overdraft</option>
                <option>Fixed deposit</option>
              </select>
            </Field>
            <Field label="Bank name">
              <input value={form.bank} onChange={event => setValue('bank', event.target.value)} className={inputClass} placeholder="Example: ICICI Bank" />
            </Field>
            <Field label="Opening balance">
              <input value={form.openingBalance} onChange={event => setValue('openingBalance', event.target.value)} className={inputClass} placeholder="Example: 50000" inputMode="decimal" />
            </Field>
            <Field label="Account number">
              <input value={form.accountNo} onChange={event => setValue('accountNo', event.target.value)} className={inputClass} placeholder="Last 4 digits are enough" />
            </Field>
            <Field label="IFSC">
              <input value={form.ifsc} onChange={event => setValue('ifsc', event.target.value)} className={inputClass} placeholder="Example: ICIC0000195" />
            </Field>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/cashbank/bank-accounts')}>Cancel</Button>
            <Button type="submit" variant="primary" icon={Plus}>Add Account</Button>
          </div>
        </form>

        <aside className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary-tint)] text-[var(--primary)]">
            <Landmark size={18} />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[var(--text)]">Beginner tip</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Start with the bank account you use most. You can add cash boxes and fixed deposits later.
          </p>
          {saved && (
            <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--pos-tint)] p-3 text-sm font-semibold text-[var(--pos)]">
              <CheckCircle2 size={15} className="mr-2 inline" />
              Saved in this demo session.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
