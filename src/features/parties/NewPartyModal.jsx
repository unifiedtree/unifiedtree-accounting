import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Save } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

const INITIAL_FORM = {
  name: '',
  type: 'Customer',
  gstin: '',
  pan: '',
  phone: '',
  email: '',
  contactPerson: '',
  owner: 'Finance Team',
  branch: '',
  tags: '',
  city: '',
  state: '',
  billingAddress: '',
  shippingAddress: '',
  creditLimit: '',
  creditPeriod: '30',
  openingBalance: '',
  preferredMode: 'NEFT',
  creditPolicy: 'Standard',
  statementAutoSend: 'Monthly',
  customField: '',
  registrationType: 'Regular',
  status: 'active',
}

const STATE_BY_GST = {
  '07': 'Delhi',
  '09': 'Uttar Pradesh',
  '27': 'Maharashtra',
  '29': 'Karnataka',
}

function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
        {label}{required && <span className="text-[var(--neg)]"> *</span>}
      </span>
      {children}
    </label>
  )
}

function inputClass(extra = '') {
  return `h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] ${extra}`
}

export default function NewPartyModal({ open, onClose, onCreate, existingParties = [] }) {
  const [form, setForm] = useState(INITIAL_FORM)

  const gstState = STATE_BY_GST[form.gstin.slice(0, 2)]
  const gstValid = !form.gstin || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(form.gstin)
  const stateMismatch = Boolean(form.gstin && form.state && gstState && form.state !== gstState)
  const duplicate = useMemo(() => {
    const nameKey = form.name.trim().toLowerCase()
    const phoneKey = form.phone.trim()
    const gstKey = form.gstin.trim().toUpperCase()
    if (!nameKey && !phoneKey && !gstKey) return null
    return existingParties.find(p =>
      (gstKey && p.gstin?.toUpperCase() === gstKey)
      || (phoneKey && p.phone === phoneKey)
      || (nameKey && p.name.toLowerCase() === nameKey)
    )
  }, [existingParties, form.gstin, form.name, form.phone])

  function setValue(key, value) {
    setForm(prev => ({ ...prev, [key]: key === 'gstin' || key === 'pan' ? value.toUpperCase() : value }))
  }

  function resetAndClose() {
    setForm(INITIAL_FORM)
    onClose?.()
  }

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.city.trim()) return
    const now = new Date().toISOString().slice(0, 10)
    onCreate?.({
      id: `P${Date.now()}`,
      name: form.name.trim(),
      gstin: form.gstin.trim(),
      type: form.type,
      phone: form.phone.trim(),
      city: form.city.trim(),
      creditLimit: Number(form.creditLimit || 0),
      outstanding: Number(form.openingBalance || 0),
      overdue: 0,
      advance: 0,
      lastTxn: now,
      status: form.status,
      email: form.email.trim(),
      contactPerson: form.contactPerson.trim(),
      owner: form.owner.trim(),
      branch: form.branch.trim() || form.city.trim(),
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      pan: form.pan.trim(),
      state: form.state.trim() || gstState || '',
      billingAddress: form.billingAddress.trim(),
      shippingAddress: form.shippingAddress.trim() || form.billingAddress.trim(),
      creditPeriod: Number(form.creditPeriod || 0),
      creditPolicy: form.creditPolicy,
      statementAutoSend: form.statementAutoSend,
      customField: form.customField.trim(),
      preferredMode: form.preferredMode,
      registrationType: form.registrationType,
    })
    resetAndClose()
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="New Party"
      size="2xl"
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose}>Cancel</Button>
          <Button
            variant="primary"
            icon={Save}
            disabled={!form.name.trim() || !form.city.trim() || !gstValid || stateMismatch || !!duplicate}
            onClick={submit}
          >
            Create Party
          </Button>
        </>
      }
    >
      <form id="new-party-form" onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Party Name" required>
            <input value={form.name} onChange={e => setValue('name', e.target.value)} className={inputClass()} placeholder="e.g. Acme Traders" />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={e => setValue('type', e.target.value)} className={inputClass()}>
              <option>Customer</option>
              <option>Supplier</option>
              <option>Both</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setValue('status', e.target.value)} className={inputClass()}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="GSTIN">
            <input value={form.gstin} onChange={e => setValue('gstin', e.target.value)} maxLength={15} className={inputClass('font-mono')} placeholder="27ABCDE1234F1Z5" />
          </Field>
          <Field label="PAN">
            <input value={form.pan} onChange={e => setValue('pan', e.target.value)} maxLength={10} className={inputClass('font-mono')} placeholder="ABCDE1234F" />
          </Field>
          <Field label="Registration Type">
            <select value={form.registrationType} onChange={e => setValue('registrationType', e.target.value)} className={inputClass()}>
              <option>Regular</option>
              <option>Composition</option>
              <option>Unregistered</option>
              <option>Consumer</option>
            </select>
          </Field>
        </div>

        {(form.gstin || duplicate) && (
          <div className={`flex items-start gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-xs ${
            duplicate || !gstValid || stateMismatch
              ? 'border-[var(--warn)]/25 bg-[var(--warn-tint)] text-[var(--warn)]'
              : 'border-[var(--pos)]/25 bg-[var(--pos-tint)] text-[var(--pos)]'
          }`}>
            {duplicate || !gstValid || stateMismatch ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
            <span>
              {duplicate
                ? `Possible duplicate: ${duplicate.name}`
                : !gstValid
                  ? 'GSTIN format looks invalid.'
                  : stateMismatch
                    ? `GSTIN state maps to ${gstState}, but party state is ${form.state}.`
                  : `GSTIN format is valid${gstState ? ` and maps to ${gstState}` : ''}.`}
            </span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Contact Person">
            <input value={form.contactPerson} onChange={e => setValue('contactPerson', e.target.value)} className={inputClass()} placeholder="Accounts Manager" />
          </Field>
          <Field label="Owner">
            <input value={form.owner} onChange={e => setValue('owner', e.target.value)} className={inputClass()} placeholder="Finance owner" />
          </Field>
          <Field label="Tags">
            <input value={form.tags} onChange={e => setValue('tags', e.target.value)} className={inputClass()} placeholder="Enterprise, Priority" />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Phone">
            <input value={form.phone} onChange={e => setValue('phone', e.target.value)} className={inputClass()} placeholder="9876543210" />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={e => setValue('email', e.target.value)} type="email" className={inputClass()} placeholder="accounts@example.com" />
          </Field>
          <Field label="Branch / Address Book">
            <input value={form.branch} onChange={e => setValue('branch', e.target.value)} className={inputClass()} placeholder="Mumbai - BKC" />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="City" required>
            <input value={form.city} onChange={e => setValue('city', e.target.value)} className={inputClass()} placeholder="Mumbai" />
          </Field>
          <Field label="State">
            <input value={form.state} onChange={e => setValue('state', e.target.value)} className={inputClass()} placeholder={gstState || 'Maharashtra'} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Billing Address">
            <textarea value={form.billingAddress} onChange={e => setValue('billingAddress', e.target.value)} className={inputClass('h-20 py-2 resize-none')} placeholder="Billing address" />
          </Field>
          <Field label="Shipping Address">
            <textarea value={form.shippingAddress} onChange={e => setValue('shippingAddress', e.target.value)} className={inputClass('h-20 py-2 resize-none')} placeholder="Leave blank to use billing address" />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Credit Limit">
            <input value={form.creditLimit} onChange={e => setValue('creditLimit', e.target.value)} type="number" min="0" className={inputClass()} placeholder="0" />
          </Field>
          <Field label="Credit Period">
            <input value={form.creditPeriod} onChange={e => setValue('creditPeriod', e.target.value)} type="number" min="0" className={inputClass()} />
          </Field>
          <Field label="Credit Policy">
            <select value={form.creditPolicy} onChange={e => setValue('creditPolicy', e.target.value)} className={inputClass()}>
              <option>Standard</option>
              <option>Warn only</option>
              <option>Soft block</option>
              <option>Hard block</option>
              <option>Pay run approval</option>
            </select>
          </Field>
          <Field label="Statement Auto-send">
            <select value={form.statementAutoSend} onChange={e => setValue('statementAutoSend', e.target.value)} className={inputClass()}>
              <option>Off</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Opening Balance">
            <input value={form.openingBalance} onChange={e => setValue('openingBalance', e.target.value)} type="number" min="0" className={inputClass()} placeholder="0" />
          </Field>
          <Field label="Preferred Mode">
            <select value={form.preferredMode} onChange={e => setValue('preferredMode', e.target.value)} className={inputClass()}>
              <option>NEFT</option>
              <option>RTGS</option>
              <option>UPI</option>
              <option>Cheque</option>
              <option>Cash</option>
            </select>
          </Field>
          <Field label="Custom Field">
            <input value={form.customField} onChange={e => setValue('customField', e.target.value)} className={inputClass()} placeholder="Segment, region, or code" />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
