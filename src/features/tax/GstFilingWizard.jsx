import { useState } from 'react'
import { CheckCircle2, Circle, Sparkles, ShieldCheck, AlertTriangle, FileText, Send, RotateCcw, ChevronRight, ChevronLeft, Eye, Lock } from 'lucide-react'
import PageHeader   from '../../components/layout/PageHeader'
import Button       from '../../components/ui/Button'
import { formatCurrency } from '../../lib/currency'
import { toast }    from '../../lib/toast'

/* ── Mock data ── */
const PERIOD = 'December 2024'
const GSTIN  = '27AAPCS1234H1Z5'

const LIABILITY = [
  { head: 'CGST', taxable: 2840000, rate: '9%', tax: 255600 },
  { head: 'SGST', taxable: 2840000, rate: '9%', tax: 255600 },
  { head: 'IGST', taxable:  980000, rate: '18%', tax: 176400 },
  { head: 'Cess', taxable:  120000, rate: '5%',  tax:   6000 },
]
const TOTAL_LIABILITY = LIABILITY.reduce((s, r) => s + r.tax, 0)

const ITC = [
  { head: 'CGST', available: 198000, reversed: 12000, net: 186000 },
  { head: 'SGST', available: 198000, reversed: 12000, net: 186000 },
  { head: 'IGST', available: 145000, reversed:  8000, net: 137000 },
]
const TOTAL_ITC = ITC.reduce((s, r) => s + r.net, 0)
const NET_PAYABLE = Math.max(TOTAL_LIABILITY - TOTAL_ITC, 0)

const AI_CHECKS = [
  { status: 'ok',   msg: 'GSTR-2B ITC matches books within 0.2% tolerance' },
  { status: 'ok',   msg: 'All B2B invoices have valid GSTINs' },
  { status: 'warn', msg: '3 invoices flagged for possible duplicate — review before filing' },
  { status: 'ok',   msg: 'No nil-rated supply discrepancy detected' },
  { status: 'ok',   msg: 'HSN summary complete for all line items' },
  { status: 'warn', msg: 'ITC reversal Rule 42 — minor difference of ₹1,240 detected' },
]

const STEPS = [
  { id: 'review',      label: 'Review Liability'    },
  { id: 'itc',         label: 'Input Tax Credit'    },
  { id: 'ai-check',    label: 'AI Verification'     },
  { id: 'declare',     label: 'Declare & File'      },
]

/* ── Step indicator ── */
function StepDot({ step, current, index }) {
  const done    = index < STEPS.findIndex(s => s.id === current)
  const active  = step.id === current
  return (
    <div className="flex items-center gap-2 flex-1 last:flex-none">
      <div className="flex flex-col items-center gap-1">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
          style={{
            borderColor: done || active ? 'var(--primary)' : 'var(--border)',
            background:  done ? 'var(--primary)' : active ? 'var(--primary-tint)' : 'var(--surface-2)',
          }}
        >
          {done
            ? <CheckCircle2 size={14} color="#fff" />
            : <span className="text-xs font-bold" style={{ color: active ? 'var(--primary)' : 'var(--faint)' }}>{index + 1}</span>
          }
        </div>
        <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: active ? 'var(--primary)' : done ? 'var(--muted)' : 'var(--faint)' }}>
          {step.label}
        </span>
      </div>
      {index < STEPS.length - 1 && (
        <div className="flex-1 h-px mb-5" style={{ background: done ? 'var(--primary)' : 'var(--border)' }} />
      )}
    </div>
  )
}

/* ── Step 1: Review Liability ── */
function StepReview({ onNext }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Outward Tax Liability — {PERIOD}</span>
          <span className="text-xs text-[var(--faint)]">GSTIN: {GSTIN}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Head', 'Taxable Value', 'Rate', 'Tax Amount'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LIABILITY.map(row => (
              <tr key={row.head} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{row.head}</td>
                <td className="px-4 py-3 tabular text-[var(--muted)]">{formatCurrency(row.taxable)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{row.rate}</td>
                <td className="px-4 py-3 tabular font-semibold text-[var(--text)]">{formatCurrency(row.tax)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--surface-2)]">
              <td colSpan={3} className="px-4 py-3 font-bold text-[var(--text)]">Total Liability</td>
              <td className="px-4 py-3 tabular font-bold" style={{ color: 'var(--neg)' }}>{formatCurrency(TOTAL_LIABILITY)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex justify-end">
        <Button variant="primary" onClick={onNext}>Review ITC <ChevronRight size={14} /></Button>
      </div>
    </div>
  )
}

/* ── Step 2: ITC ── */
function StepITC({ onNext, onBack }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary-tint)]">
        <Sparkles size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm text-[var(--text)]">
          AI matched your purchase register with GSTR-2B auto-populated data. Review and confirm ITC claims below.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Input Tax Credit Available</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Head', 'Available', 'Reversed', 'Net Claim'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITC.map(row => (
              <tr key={row.head} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{row.head}</td>
                <td className="px-4 py-3 tabular text-[var(--pos)]">{formatCurrency(row.available)}</td>
                <td className="px-4 py-3 tabular text-[var(--neg)]">({formatCurrency(row.reversed)})</td>
                <td className="px-4 py-3 tabular font-semibold" style={{ color: 'var(--primary)' }}>{formatCurrency(row.net)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--surface-2)]">
              <td colSpan={3} className="px-4 py-3 font-bold text-[var(--text)]">Net ITC Claimed</td>
              <td className="px-4 py-3 tabular font-bold" style={{ color: 'var(--pos)' }}>{formatCurrency(TOTAL_ITC)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Net payable card */}
      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--primary)] bg-[var(--primary-tint)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-0.5">Net Tax Payable</p>
          <p className="text-xs text-[var(--muted)]">After adjusting ITC from total liability</p>
        </div>
        <p className="text-2xl font-black tabular" style={{ color: 'var(--primary)' }}>{formatCurrency(NET_PAYABLE)}</p>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}><ChevronLeft size={14} /> Back</Button>
        <Button variant="primary" onClick={onNext}>AI Verification <ChevronRight size={14} /></Button>
      </div>
    </div>
  )
}

/* ── Step 3: AI Verification ── */
function StepAICheck({ onNext, onBack }) {
  const warnings = AI_CHECKS.filter(c => c.status === 'warn').length
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl border border-[var(--pos)]/30 bg-[var(--pos-tint)]">
          <p className="text-2xl font-black text-[var(--pos)]">{AI_CHECKS.length - warnings}</p>
          <p className="text-xs font-semibold text-[var(--muted)] mt-0.5">Checks Passed</p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--warn)]/30 bg-[var(--warn-tint)]">
          <p className="text-2xl font-black text-[var(--warn)]">{warnings}</p>
          <p className="text-xs font-semibold text-[var(--muted)] mt-0.5">Warnings (review recommended)</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center gap-2">
          <Sparkles size={11} style={{ color: 'var(--primary)' }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>AI Pre-Filing Checks</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {AI_CHECKS.map((c, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              {c.status === 'ok'
                ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--pos)' }} />
                : <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--warn)' }} />
              }
              <p className="text-sm text-[var(--text)]">{c.msg}</p>
            </div>
          ))}
        </div>
      </div>

      {warnings > 0 && (
        <div className="p-3 rounded-xl border border-[var(--warn)]/40 bg-[var(--warn-tint)] text-xs text-[var(--text)]">
          <strong className="text-[var(--warn)]">Note:</strong> Warnings don't block filing but should be reviewed. You may proceed and file with known discrepancies.
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}><ChevronLeft size={14} /> Back</Button>
        <Button variant="primary" onClick={onNext}>Proceed to File <ChevronRight size={14} /></Button>
      </div>
    </div>
  )
}

/* ── Step 4: Declare & File ── */
function StepDeclare({ onBack }) {
  const [otp,       setOtp]       = useState('')
  const [declared,  setDeclared]  = useState(false)
  const [filing,    setFiling]    = useState(false)
  const [filed,     setFiled]     = useState(false)

  function handleFile() {
    if (!declared)      { toast.error('Check the declaration checkbox first'); return }
    if (otp.length < 6) { toast.error('Enter a valid 6-digit OTP'); return }
    setFiling(true)
    setTimeout(() => {
      setFiled(true)
      setFiling(false)
      toast.success('GSTR-3B filed successfully! ARN generated.')
    }, 2800)
  }

  if (filed) {
    return (
      <div className="flex flex-col items-center py-10 gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--pos)' }}>
          <CheckCircle2 size={32} color="#fff" />
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[var(--text)]">Filed Successfully!</p>
          <p className="text-sm text-[var(--muted)] mt-1">GSTR-3B for {PERIOD} has been submitted to GSTN.</p>
        </div>
        <div className="w-full p-4 rounded-xl border border-[var(--pos)]/30 bg-[var(--pos-tint)] space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">ARN</span>
            <span className="font-mono font-semibold text-[var(--text)]">AA271224{Math.floor(Math.random()*900000+100000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Period</span>
            <span className="font-semibold text-[var(--text)]">{PERIOD}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Net Tax Paid</span>
            <span className="tabular font-bold text-[var(--pos)]">{formatCurrency(NET_PAYABLE)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Status</span>
            <span className="font-semibold text-[var(--pos)]">Filed</span>
          </div>
        </div>
        <Button variant="secondary" icon={Eye} onClick={() => toast.info('Opening GSTN portal receipt…')}>
          Download Acknowledgement
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Liability', value: formatCurrency(TOTAL_LIABILITY), color: 'var(--neg)' },
          { label: 'ITC Claimed',     value: formatCurrency(TOTAL_ITC),       color: 'var(--pos)' },
          { label: 'Net Payable',     value: formatCurrency(NET_PAYABLE),      color: 'var(--primary)' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-center">
            <p className="text-xs text-[var(--muted)] mb-1">{s.label}</p>
            <p className="tabular text-base font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* OTP */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={13} style={{ color: 'var(--primary)' }} />
          <p className="text-sm font-semibold text-[var(--text)]">OTP Verification</p>
        </div>
        <p className="text-xs text-[var(--muted)]">Enter the OTP sent to your registered mobile number linked with GSTIN <strong>{GSTIN}</strong>.</p>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit OTP"
            className="flex-1 h-10 px-3 text-sm tabular font-mono tracking-widest rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <button
            onClick={() => { toast.info('OTP sent to registered mobile'); }}
            className="h-10 px-4 text-sm font-semibold rounded-lg border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-tint)] transition-colors"
          >
            Send OTP
          </button>
        </div>
      </div>

      {/* Declaration */}
      <label className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] cursor-pointer hover:bg-[var(--surface-2)] transition-colors">
        <input
          type="checkbox"
          checked={declared}
          onChange={e => setDeclared(e.target.checked)}
          className="mt-0.5 accent-[var(--primary)]"
        />
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom. I am authorized to sign this return. <span className="text-[var(--primary)] font-semibold">(Section 44 of the CGST Act, 2017)</span>
        </p>
      </label>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} disabled={filing}><ChevronLeft size={14} /> Back</Button>
        <Button
          variant="primary"
          icon={filing ? RotateCcw : Send}
          onClick={handleFile}
          disabled={filing}
        >
          {filing ? 'Filing…' : `File GSTR-3B · ${formatCurrency(NET_PAYABLE)}`}
        </Button>
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function GstFilingWizard() {
  const [currentStep, setCurrentStep] = useState('review')

  const stepIdx = STEPS.findIndex(s => s.id === currentStep)
  function next() { if (stepIdx < STEPS.length - 1) setCurrentStep(STEPS[stepIdx + 1].id) }
  function back() { if (stepIdx > 0) setCurrentStep(STEPS[stepIdx - 1].id) }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="GSTR-3B Filing Wizard"
        subtitle={`File directly from UnifiedTree · ${PERIOD}`}
        breadcrumb={['Tax Center', 'File GSTR-3B']}
      />

      {/* Step indicator */}
      <div className="flex items-start gap-0 mb-6 px-2">
        {STEPS.map((step, i) => (
          <StepDot key={step.id} step={step} current={currentStep} index={i} />
        ))}
      </div>

      {/* Step content */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        {currentStep === 'review'   && <StepReview   onNext={next} />}
        {currentStep === 'itc'      && <StepITC      onNext={next} onBack={back} />}
        {currentStep === 'ai-check' && <StepAICheck  onNext={next} onBack={back} />}
        {currentStep === 'declare'  && <StepDeclare  onBack={back} />}
      </div>
    </div>
  )
}
