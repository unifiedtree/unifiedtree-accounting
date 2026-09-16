import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRightLeft,
  Banknote,
  CheckCircle2,
  Download,
  Landmark,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { toast } from '../../lib/toast'
import {
  getBankAccounts,
  getBankTransactions,
  getPettyCash,
} from '../../data/services/cashBankService'

const TYPE_LABEL = {
  Current: 'Bank account',
  Savings: 'Bank account',
  Overdraft: 'Overdraft',
  FD: 'Fixed deposit',
  Cash: 'Cash box',
}

function SummaryCard({ label, value, hint, icon: Icon, tone = 'text' }) {
  const color = tone === 'good'
    ? 'var(--pos)'
    : tone === 'warn'
      ? 'var(--neg)'
      : 'var(--text)'

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">{label}</p>
          <p className="mt-1 tabular text-2xl font-bold" style={{ color }}>{value}</p>
          <p className="mt-1 text-xs text-[var(--faint)]">{hint}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary-tint)] text-[var(--primary)]">
          <Icon size={17} />
        </span>
      </div>
    </div>
  )
}

function TaskCard({ icon: Icon, title, text, button, tone = 'primary', onClick }) {
  const iconClass = tone === 'warn'
    ? 'bg-amber-50 text-amber-700'
    : tone === 'good'
      ? 'bg-[var(--pos-tint)] text-[var(--pos)]'
      : 'bg-[var(--primary-tint)] text-[var(--primary)]'

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-[var(--radius-sm)] ${iconClass}`}>
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{text}</p>
          <Button variant={tone === 'warn' ? 'primary' : 'secondary'} size="sm" className="mt-3" onClick={onClick}>{button}</Button>
        </div>
      </div>
    </div>
  )
}

export default function BankAccounts() {
  const navigate = useNavigate()
  const [data, setData] = useState({ accounts: [], txns: [], pettyCash: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBankAccounts(), getBankTransactions(), getPettyCash()])
      .then(([accounts, txns, pettyCash]) => {
        setData({ accounts, txns, pettyCash })
        setLoading(false)
      })
  }, [])

  const metrics = useMemo(() => {
    const bankMoney = data.accounts.reduce((sum, account) => sum + account.balance, 0)
    const cashMoney = data.accounts
      .filter(account => account.type === 'Cash')
      .reduce((sum, account) => sum + account.balance, 0)
    const toMatch = data.txns.filter(txn => !txn.reconciled)

    return {
      bankMoney,
      cashMoney,
      toMatch,
      matched: data.txns.length - toMatch.length,
    }
  }, [data])

  const latest = data.txns.slice(0, 4)
  const cashEntries = data.pettyCash.slice(0, 3)

  return (
    <div>
      <PageHeader
        title="Cash & Bank"
        subtitle="Check balances, import statements, and match bank entries"
        breadcrumb={['Cash & Bank', 'Center']}
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={Plus} size="sm" onClick={() => navigate('/cashbank/accounts/new')}>Add Account</Button>
            <Button variant="primary" icon={Download} size="sm" onClick={() => navigate('/cashbank/import-statement')}>Import Statement</Button>
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryCard label="Money Available" value={formatCompact(metrics.bankMoney)} hint="Bank, cash and FD total" icon={Landmark} tone="good" />
        <SummaryCard label="Needs Matching" value={metrics.toMatch.length} hint="Bank entries to confirm" icon={AlertTriangle} tone={metrics.toMatch.length ? 'warn' : 'good'} />
        <SummaryCard label="Cash in Hand" value={formatCompact(metrics.cashMoney)} hint="Across petty cash boxes" icon={Banknote} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[var(--text)]">What to do today</h2>
                <p className="text-xs text-[var(--muted)]">Start here if you are not sure what to do next.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <TaskCard
                icon={AlertTriangle}
                title="Match bank entries"
                text={`${metrics.toMatch.length} imported bank entries need a receipt, payment, or expense match.`}
                button="Review"
                tone={metrics.toMatch.length ? 'warn' : 'good'}
                onClick={() => navigate('/cashbank/reconciliation')}
              />
              <TaskCard
                icon={RefreshCw}
                title="Connect bank feed"
                text="Auto-fetch ICICI and HDFC statements so you do not upload files every day."
                button="Connect"
                onClick={() => toast.info('Bank feed connection will open after banking integrations are enabled.')}
              />
              <TaskCard
                icon={ArrowRightLeft}
                title="Move money"
                text="Record transfer between bank, overdraft, fixed deposit, or petty cash."
                button="Transfer"
                onClick={() => navigate('/cashbank/transfer')}
              />
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <h2 className="text-sm font-semibold text-[var(--text)]">Your accounts</h2>
              <p className="text-xs text-[var(--muted)]">Balances and simple status for every cash or bank account.</p>
            </div>

            {loading ? (
              <p className="p-8 text-center text-sm text-[var(--faint)]">Loading...</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {data.accounts.map(account => {
                  const needsReview = account.type === 'Current' ? metrics.toMatch.length : 0
                  const isCash = account.type === 'Cash'
                  return (
                    <div key={account.id} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.2fr)_150px_170px_90px] md:items-center">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">{account.name}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{TYPE_LABEL[account.type] ?? account.type}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-[var(--muted)]">Balance</p>
                        <p className="tabular text-sm font-bold" style={{ color: account.balance >= 0 ? 'var(--pos)' : 'var(--neg)' }}>
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                      <div>
                        {needsReview > 0 ? (
                          <span className="inline-flex rounded-full bg-[var(--neg-tint)] px-2 py-1 text-xs font-semibold text-[var(--neg)]">
                            {needsReview} entries to match
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-tint)] px-2 py-1 text-xs font-semibold text-[var(--pos)]">
                            <CheckCircle2 size={12} />
                            {isCash ? 'Count ready' : 'Up to date'}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(needsReview ? '/cashbank/reconciliation' : '/cashbank/bank-accounts')}
                      >
                        {needsReview ? 'Match' : 'Open'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text)]">Recent bank entries</h2>
            <div className="mt-3 space-y-2">
              {latest.map(txn => (
                <div key={txn.id} className="rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{txn.desc}</p>
                    <p className={`tabular text-sm font-bold ${txn.credit > 0 ? 'text-[var(--pos)]' : 'text-[var(--neg)]'}`}>
                      {formatCurrency(txn.credit || txn.debit)}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--faint)]">{txn.reconciled ? 'Matched' : 'Needs match'} - {txn.date}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text)]">Petty cash</h2>
            <div className="mt-3 space-y-2">
              {cashEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{entry.desc}</p>
                    <p className="text-[11px] text-[var(--faint)]">{entry.by}</p>
                  </div>
                  <p className={`tabular text-sm font-bold ${entry.credit > 0 ? 'text-[var(--pos)]' : 'text-[var(--neg)]'}`}>
                    {formatCurrency(entry.credit || entry.debit)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
