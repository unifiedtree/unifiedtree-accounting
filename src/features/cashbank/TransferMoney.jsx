import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRightLeft, CheckCircle2, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../lib/currency'
import { toast } from '../../lib/toast'
import { getBankAccounts } from '../../data/services/cashBankService'

const inputClass = 'h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase text-[var(--muted)]">{label}</span>
      {children}
    </label>
  )
}

export default function TransferMoney() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    from: '',
    to: '',
    amount: '',
    date: '2026-01-06',
    reason: 'Transfer between own accounts',
  })

  useEffect(() => {
    getBankAccounts().then(rows => {
      setAccounts(rows)
      setForm(current => ({
        ...current,
        from: rows[0]?.name ?? '',
        to: rows[3]?.name ?? rows[1]?.name ?? '',
      }))
    })
  }, [])

  function setValue(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSaved(true)
    toast.success('Transfer recorded')
  }

  const amount = Number(form.amount || 0)

  return (
    <div>
      <PageHeader
        title="Move Money"
        subtitle="Record a transfer between your own bank, cash, overdraft, or FD accounts"
        breadcrumb={['Cash & Bank', 'Move Money']}
        action={<Button variant="secondary" icon={ArrowLeft} size="sm" onClick={() => navigate('/cashbank/bank-accounts')}>Back</Button>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSubmit} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="From account">
              <select value={form.from} onChange={event => setValue('from', event.target.value)} className={inputClass}>
                {accounts.map(account => <option key={account.id}>{account.name}</option>)}
              </select>
            </Field>
            <Field label="To account">
              <select value={form.to} onChange={event => setValue('to', event.target.value)} className={inputClass}>
                {accounts.map(account => <option key={account.id}>{account.name}</option>)}
              </select>
            </Field>
            <Field label="Amount">
              <input required value={form.amount} onChange={event => setValue('amount', event.target.value)} className={inputClass} placeholder="Example: 5000" inputMode="decimal" />
            </Field>
            <Field label="Date">
              <input required type="date" value={form.date} onChange={event => setValue('date', event.target.value)} className={inputClass} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Reason">
                <input value={form.reason} onChange={event => setValue('reason', event.target.value)} className={inputClass} placeholder="Example: Petty cash replenishment" />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/cashbank/bank-accounts')}>Cancel</Button>
            <Button type="submit" variant="primary" icon={Save}>Record Transfer</Button>
          </div>
        </form>

        <aside className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary-tint)] text-[var(--primary)]">
            <ArrowRightLeft size={18} />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[var(--text)]">Transfer summary</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-[var(--muted)]">From</span>
              <span className="text-right font-medium text-[var(--text)]">{form.from || '-'}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[var(--muted)]">To</span>
              <span className="text-right font-medium text-[var(--text)]">{form.to || '-'}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[var(--muted)]">Amount</span>
              <span className="tabular font-bold text-[var(--text)]">{amount ? formatCurrency(amount) : '-'}</span>
            </div>
          </div>
          {saved && (
            <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--pos-tint)] p-3 text-sm font-semibold text-[var(--pos)]">
              <CheckCircle2 size={15} className="mr-2 inline" />
              Transfer recorded in this demo session.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
