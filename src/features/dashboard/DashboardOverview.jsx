import { useEffect, useState } from 'react'
import {
  TrendingUp, ArrowUpCircle, Landmark,
  Receipt, Clock, BellRing, Sparkles,
  CreditCard, Wallet, BarChart2,
  Building2, Banknote,
  ArrowDown, ArrowUp, ChevronRight,
  Activity, CircleDollarSign, TimerReset, CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TransactionExplain     from '../../components/ai/TransactionExplain'
import PageHeader             from '../../components/layout/PageHeader'
import KpiCard                from '../../components/ui/KpiCard'
import Panel                  from '../../components/ui/Panel'
import StatusBadge            from '../../components/ui/StatusBadge'
import Button                 from '../../components/ui/Button'
import FinancialHealthScore   from '../../components/dashboard/FinancialHealthScore'
import LiveComplianceCountdown from '../../components/dashboard/LiveComplianceCountdown'
import IntegrationWorkflowHints from '../../components/integrations/IntegrationWorkflowHints'
import TrendChart             from '../../components/charts/TrendChart'
import DistributionChart      from '../../components/charts/DistributionChart'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { useAppStore }        from '../../store/useAppStore'
import { currentFYYear }      from '../../lib/fy'
import {
  getAccountantAlerts,
  getAiDashboardInsights,
} from '../../data/services/aiInsightService'

/* ── Mock data ── */
const TODAY_SNAPSHOT = [
  { label: 'Sales Today',     value: 120000, prefix: '₹',  color: 'var(--pos)',     icon: TrendingUp },
  { label: 'Collected Today', value: 85000,  prefix: '₹',  color: 'var(--primary)', icon: CreditCard },
  { label: 'Spent Today',     value: 32000,  prefix: '₹',  color: 'var(--neg)',     icon: Wallet     },
  { label: 'Net Today',       value: 53000,  prefix: '+₹', color: 'var(--pos)',     icon: BarChart2  },
]

const UPCOMING_DUES = [
  { id: 1, vendor: 'Amazon Web Services', amount: 12500, daysLeft: 1 },
  { id: 2, vendor: 'Freshworks India',    amount: 45000, daysLeft: 3 },
  { id: 3, vendor: 'Office Rent — Jan',   amount: 75000, daysLeft: 5 },
  { id: 4, vendor: 'Zoho Corporation',    amount: 8900,  daysLeft: 7 },
]

const BANK_ACCOUNTS = [
  { name: 'HDFC Current A/c', number: '****4821', balance: 8245000, icon: Building2 },
  { name: 'SBI OD Account',   number: '****2201', balance: 3100000, icon: Building2 },
  { name: 'Kotak Savings',    number: '****9934', balance: 1200000, icon: Building2 },
  { name: 'Petty Cash',       number: null,       balance:  150000, icon: Banknote  },
]

const RECENT_ACTIVITY = [
  { id: 'RCV-2024-0842', type: 'Payment Received', party: 'Infosys BPO Ltd', amount: 850000, status: 'paid',    date: '18 Dec 2024', dir: 'in'  },
  { id: 'PAY-2024-0631', type: 'Payment Sent',     party: 'Reliance Ind',    amount: 420000, status: 'paid',    date: '17 Dec 2024', dir: 'out' },
  { id: 'JV-2024-0204',  type: 'Manual Entry',     party: 'Depreciation',    amount: 125000, status: 'draft',   date: '16 Dec 2024', dir: null  },
  { id: 'RCV-2024-0839', type: 'Payment Received', party: 'Wipro Digital',   amount: 390000, status: 'partial', date: '15 Dec 2024', dir: 'in'  },
  { id: 'PAY-2024-0629', type: 'Payment Sent',     party: 'AWS India',       amount: 78500,  status: 'paid',    date: '14 Dec 2024', dir: 'out' },
]

const KPI = [
  {
    label:     'Money Owed to You',
    value:     formatCompact(7890000),
    delta:     12.4,
    sentiment: 'pos',
    subline:   '23 unpaid invoices',
    icon:      TrendingUp,
    iconColor: '#16a34a',
    tooltip:   "Total amount your customers haven't paid yet.",
    href:      '/receivables/ageing',
  },
  {
    label:     'Bills to Pay',
    value:     formatCompact(3240000),
    delta:     -5.1,
    sentiment: 'neg',
    subline:   '11 bills coming due',
    icon:      ArrowUpCircle,
    iconColor: '#e11d48',
    tooltip:   'Total amount you owe to your suppliers.',
    href:      '/payables/ageing',
  },
  {
    label:     'Available Cash',
    value:     formatCompact(12650000),
    delta:     8.2,
    subline:   '4 accounts · ₹1.5L cash',
    icon:      Landmark,
    iconColor: '#5b5bef',
    tooltip:   'Total balance across all your bank accounts and cash.',
    href:      '/cashbank/bank-accounts',
  },
  {
    label:     'Profit This Year',
    value:     formatCompact(5420000),
    delta:     18.7,
    sentiment: 'pos',
    subline:   'April – December 2024',
    icon:      TrendingUp,
    iconColor: '#5b5bef',
    tooltip:   'Net profit earned since the start of this financial year.',
    href:      '/reports/financial-statements',
  },
]

const BUSINESS_TREND = [
  { label: 'Apr', sales: 58_00_000, collections: 42_00_000, expenses: 31_00_000 },
  { label: 'May', sales: 66_00_000, collections: 58_00_000, expenses: 38_00_000 },
  { label: 'Jun', sales: 49_00_000, collections: 39_00_000, expenses: 42_00_000 },
  { label: 'Jul', sales: 74_00_000, collections: 67_00_000, expenses: 36_00_000 },
  { label: 'Aug', sales: 81_00_000, collections: 72_00_000, expenses: 41_00_000 },
  { label: 'Sep', sales: 63_00_000, collections: 55_00_000, expenses: 39_00_000 },
  { label: 'Oct', sales: 92_00_000, collections: 81_00_000, expenses: 48_00_000 },
  { label: 'Nov', sales: 71_00_000, collections: 63_00_000, expenses: 52_00_000 },
  { label: 'Dec', sales: 1_08_00_000, collections: 94_00_000, expenses: 56_00_000 },
]

const MONEY_SPLIT = [
  { name: 'Cash in Bank', value: 1_26_50_000 },
  { name: 'Receivables', value: 78_90_000 },
  { name: 'Payables', value: 32_40_000 },
  { name: 'GST Due', value: 8_90_000 },
]

const RECEIVABLE_BUCKETS = [
  { label: 'Current', value: 34_00_000, color: 'var(--pos)' },
  { label: '1-30 Days', value: 22_50_000, color: 'var(--primary)' },
  { label: '31-60 Days', value: 13_10_000, color: 'var(--warn)' },
  { label: '60+ Days', value: 9_30_000, color: 'var(--neg)' },
]

const QUICK_SIGNALS = [
  { label: 'Collection Efficiency', value: 87, detail: 'Collected against billed value', color: 'var(--pos)', icon: CheckCircle2 },
  { label: 'Cash Runway', value: 76, detail: 'Strong for next 45 days', color: 'var(--primary)', icon: TimerReset },
  { label: 'Compliance Readiness', value: 68, detail: 'GST and TDS need review', color: 'var(--warn)', icon: Activity },
]

function MiniGauge({ label, value, detail, color, icon: Icon }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(${color} ${value * 3.6}deg, var(--surface-2) 0deg)` }}
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface)]">
            <Icon size={17} style={{ color }} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
          <p className="tabular mt-1 text-xl font-black text-[var(--text)]">{value}%</p>
          <p className="truncate text-xs text-[var(--muted)]">{detail}</p>
        </div>
      </div>
    </div>
  )
}

function VisualBar({ label, value, total, color }) {
  const percent = total > 0 ? Math.max(6, Math.round((value / total) * 100)) : 0
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
        <span className="tabular text-sm font-bold text-[var(--text)]">{formatCompact(value)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
      </div>
    </div>
  )
}

function urgencyBadge(days) {
  if (days <= 3) return { text: 'text-[var(--neg)]',  bg: 'bg-[var(--neg-tint)]',  label: `${days}d left` }
  if (days <= 7) return { text: 'text-[var(--warn)]', bg: 'bg-[var(--warn-tint)]', label: `${days}d left` }
  return               { text: 'text-[var(--pos)]',  bg: 'bg-[var(--pos-tint)]',  label: `${days}d left` }
}

export default function DashboardOverview() {
  const navigate           = useNavigate()
  const { financialYear }  = useAppStore()
  const fy                 = financialYear ?? currentFYYear()
  const [aiInsights, setAiInsights] = useState(null)
  const [alerts,     setAlerts]     = useState([])
  const [explainTx,  setExplainTx]  = useState(null)

  useEffect(() => {
    let mounted = true
    Promise.all([
      getAiDashboardInsights(),
      getAccountantAlerts(),
    ]).then(([insights, alertItems]) => {
      if (!mounted) return
      setAiInsights(insights)
      setAlerts(alertItems)
    })
    return () => { mounted = false }
  }, [])

  const urgentAlerts   = alerts.filter(a => ['critical', 'high'].includes(a.severity))
  const totalCash      = BANK_ACCOUNTS.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Good morning 👋"
        subtitle={`FY ${fy}–${String(fy + 1).slice(-2)} · Sunrise Traders Pvt. Ltd.`}
      />

      {/* ── Today's Snapshot ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TODAY_SNAPSHOT.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={12} style={{ color: item.color }} strokeWidth={2.5} />
                <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
              <p className="tabular text-[17px] font-bold leading-none" style={{ color: item.color }}>
                {item.prefix}{formatCompact(item.value)}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        {KPI.map((kpi) => (
          <KpiCard
            key={kpi.label}
            {...kpi}
            onClick={() => navigate(kpi.href)}
          />
        ))}
      </div>

      {/* ── Exclusive Features: Health Score + Live Countdown ── */}
      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)] gap-4">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Business Pulse</h3>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">Sales, collections, and expenses in one view</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ['Sales', 'var(--primary)'],
                ['Collections', 'var(--pos)'],
                ['Expenses', 'var(--neg)'],
              ].map(([label, color]) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <TrendChart
            data={BUSINESS_TREND}
            series={[
              { key: 'sales', label: 'Sales', color: 'var(--primary)' },
              { key: 'collections', label: 'Collections', color: 'var(--pos)' },
              { key: 'expenses', label: 'Expenses', color: 'var(--neg)' },
            ]}
            type="area"
            height={265}
          />
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <CircleDollarSign size={16} className="text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Money Map</h3>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">Where money is available, stuck, or due</p>
            </div>
            <span className="rounded-full bg-[var(--primary-tint)] px-2.5 py-1 text-[11px] font-bold text-[var(--primary)]">Live</span>
          </div>
          <DistributionChart data={MONEY_SPLIT} height={220} innerRadius={52} outerRadius={86} />
          <div className="grid grid-cols-2 gap-2 mt-3">
            {MONEY_SPLIT.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.name === 'Cash in Bank' ? '/cashbank/bank-accounts' : item.name === 'Receivables' ? '/receivables/ageing' : item.name === 'Payables' ? '/payables/ageing' : '/tax/gst-returns')}
                className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2 text-left hover:bg-[var(--primary-tint)] transition-colors"
              >
                <p className="truncate text-[11px] font-semibold text-[var(--muted)]">{item.name}</p>
                <p className="tabular mt-1 text-sm font-bold text-[var(--text)]">{formatCompact(item.value)}</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
          {QUICK_SIGNALS.map((signal) => (
            <MiniGauge key={signal.label} {...signal} />
          ))}
        </div>
        <Panel>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Receivable Ageing Visual</h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">See which customer money needs follow-up first</p>
            </div>
            <button
              onClick={() => navigate('/receivables/ageing')}
              className="text-xs text-[var(--primary)] font-medium hover:underline flex items-center gap-0.5"
            >
              Open ageing <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {RECEIVABLE_BUCKETS.map((bucket) => (
              <VisualBar
                key={bucket.label}
                label={bucket.label}
                value={bucket.value}
                total={RECEIVABLE_BUCKETS.reduce((sum, row) => sum + row.value, 0)}
                color={bucket.color}
              />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ['Follow-up', '23 invoices', 'var(--warn)'],
              ['Critical', '6 invoices', 'var(--neg)'],
              ['Healthy', '71%', 'var(--pos)'],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2">
                <p className="text-[11px] font-semibold text-[var(--muted)]">{label}</p>
                <p className="tabular mt-1 text-sm font-black" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FinancialHealthScore />
        <LiveComplianceCountdown />
      </div>

      <IntegrationWorkflowHints />

      {/* ── Upcoming Dues + Bank Accounts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Upcoming payments due */}
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Upcoming Payments Due</h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">Bills you need to pay in the next 7 days</p>
            </div>
            <button
              onClick={() => navigate('/payables/ageing')}
              className="text-xs text-[var(--primary)] font-medium hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-2 mb-5">
            {UPCOMING_DUES.map((due) => {
              const ug = urgencyBadge(due.daysLeft)
              return (
                <button
                  key={due.id}
                  onClick={() => navigate('/payables/bills')}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface)] hover:shadow-sm transition-all text-left"
                >
                  <span className="text-sm font-medium text-[var(--text)] truncate min-w-0 mr-3">
                    {due.vendor}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="tabular text-sm font-semibold text-[var(--text)]">
                      {formatCurrency(due.amount)}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ug.bg} ${ug.text}`}>
                      {ug.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

        </Panel>

        {/* Bank & Cash Balances */}
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Bank & Cash Balances</h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">Current balance across all accounts</p>
            </div>
            <button
              onClick={() => navigate('/cashbank/bank-accounts')}
              className="text-xs text-[var(--primary)] font-medium hover:underline flex items-center gap-0.5"
            >
              Manage <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {BANK_ACCOUNTS.map((acc) => {
              const Icon = acc.icon
              return (
                <button
                  key={acc.name}
                  onClick={() => navigate('/cashbank/bank-accounts')}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface)] hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary-tint)] flex items-center justify-center flex-shrink-0">
                      <Icon size={13} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{acc.name}</p>
                      {acc.number && (
                        <p className="text-[11px] text-[var(--faint)]">{acc.number}</p>
                      )}
                    </div>
                  </div>
                  <span className="tabular text-sm font-bold text-[var(--text)] ml-3 flex-shrink-0">
                    {formatCompact(acc.balance)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Total row */}
          <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--primary-tint)] border border-[var(--primary)]/20">
            <span className="text-xs font-semibold text-[var(--primary)]">Total Available</span>
            <span className="tabular text-sm font-bold text-[var(--primary)]">{formatCompact(totalCash)}</span>
          </div>
        </Panel>
      </div>

      {/* ── Recent Activity ── */}
      <Panel padded={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">Recent Activity</h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Your last 5 transactions ·{' '}
              <span className="text-[var(--primary)]">click any row to explain with AI</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/expenses/journal-vouchers')}
            className="text-xs text-[var(--primary)] font-medium hover:underline flex items-center gap-0.5"
          >
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Reference', 'Type', 'Contact', 'Amount', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)] text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITY.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setExplainTx(v)}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--primary-tint)] transition-colors cursor-pointer group"
                  title="Click to get AI explanation"
                >
                  <td className="px-5 py-3 font-mono text-xs text-[var(--faint)] group-hover:text-[var(--primary)] transition-colors">{v.id}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      {v.dir === 'in'  && <ArrowDown  size={12} className="text-[var(--pos)] flex-shrink-0" />}
                      {v.dir === 'out' && <ArrowUp    size={12} className="text-[var(--neg)] flex-shrink-0" />}
                      <span className="font-medium text-[var(--text)]">{v.type}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)] whitespace-nowrap">{v.party}</td>
                  <td
                    className="px-5 py-3 tabular text-right font-semibold whitespace-nowrap"
                    style={{
                      color: v.dir === 'in' ? 'var(--pos)' : v.dir === 'out' ? 'var(--neg)' : 'var(--text)',
                    }}
                  >
                    {v.dir === 'in' ? '+' : v.dir === 'out' ? '−' : ''}{formatCurrency(v.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)] text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock size={11} className="opacity-50" />{v.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* ── AI Transaction Explain panel ── */}
      <TransactionExplain
        open={!!explainTx}
        onClose={() => setExplainTx(null)}
        transaction={explainTx}
      />

      {/* ── AI Suggestions + Alerts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel className="xl:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Suggestions for You</h3>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {aiInsights?.narrative ?? 'Analysing your account…'}
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] bg-[var(--primary-tint)] rounded-full px-2.5 py-1 flex-shrink-0">
              {aiInsights?.summary.confidence ?? 0}% confidence
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {(aiInsights?.suggestions ?? []).slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/alerts/accountant-alerts')}
                className="text-left rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-4 hover:border-[var(--primary)] hover:bg-[var(--primary-tint)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-[var(--text)] leading-snug">{item.title}</p>
                  <StatusBadge
                    status={['critical', 'high'].includes(item.severity) ? 'overdue' : 'pending'}
                    label={item.severity}
                  />
                </div>
                <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">{item.suggestion}</p>
                <p className="text-xs font-semibold text-[var(--primary)]">{item.action} →</p>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <KpiCard
            label="Urgent Alerts"
            value={String(urgentAlerts.length)}
            subline={`${alerts.length} open alerts total`}
            icon={BellRing}
            iconColor="#e11d48"
            sentiment="neg"
            onClick={() => navigate('/alerts/accountant-alerts')}
          />
          <KpiCard
            label="GST Due This Month"
            value={formatCompact(890000)}
            subline="Due 20 Jan 2025"
            icon={Receipt}
            iconColor="#d97706"
            sentiment="warn"
            tooltip="GST you need to deposit with the government this month."
            onClick={() => navigate('/tax/gst-returns')}
          />
          <Panel className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Do This Next
            </p>
            <p className="text-sm font-semibold text-[var(--text)] mb-1">
              {urgentAlerts[0]?.title ?? "You're all caught up!"}
            </p>
            <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
              {urgentAlerts[0]?.message ?? 'No urgent actions right now. Great job keeping up.'}
            </p>
            <Button
              size="sm"
              variant="secondary"
              icon={BellRing}
              onClick={() => navigate('/alerts/accountant-alerts')}
            >
              View Alerts
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  )
}
