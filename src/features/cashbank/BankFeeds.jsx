import { useEffect, useState } from 'react'
import { ArrowLeftRight, CheckCircle2, Landmark, RefreshCw, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import { toast } from '../../lib/toast'
import { getBankAccounts } from '../../data/services/cashBankService'

const FEED_STATUS = {
  Current: { label: 'Connected', detail: 'Statement sync is ready', connected: true },
  Overdraft: { label: 'Connected', detail: 'OD movements sync with bank entries', connected: true },
  FD: { label: 'Manual', detail: 'Upload statement or interest certificate', connected: false },
  Cash: { label: 'Not needed', detail: 'Cash boxes are counted manually', connected: null },
  Savings: { label: 'Connected', detail: 'Statement sync is ready', connected: true },
}

function StatusPill({ status }) {
  if (status.connected === true) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-tint)] px-2 py-1 text-xs font-semibold text-[var(--pos)]">
        <CheckCircle2 size={12} />
        {status.label}
      </span>
    )
  }
  if (status.connected === false) {
    return <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{status.label}</span>
  }
  return <span className="rounded-full bg-[var(--surface-2)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">{status.label}</span>
}

export default function BankFeeds() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBankAccounts().then(rows => {
      setAccounts(rows)
      setLoading(false)
    })
  }, [])

  const bankAccounts = accounts.filter(account => account.type !== 'Cash')
  const connected = bankAccounts.filter(account => FEED_STATUS[account.type]?.connected === true).length

  return (
    <div>
      <PageHeader
        title="Bank Feeds"
        subtitle="Connect banks once, then let statements sync automatically"
        breadcrumb={['Cash & Bank', 'Bank Feeds']}
        action={<Button variant="primary" icon={RefreshCw} size="sm" onClick={() => toast.success('Bank feeds synced')}>Sync Now</Button>}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Connected Banks</p>
          <p className="mt-1 tabular text-2xl font-bold text-[var(--pos)]">{connected}</p>
          <p className="mt-1 text-xs text-[var(--faint)]">Ready to sync statements</p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Manual Accounts</p>
          <p className="mt-1 tabular text-2xl font-bold text-[var(--text)]">{bankAccounts.length - connected}</p>
          <p className="mt-1 text-xs text-[var(--faint)]">Use statement import for these</p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Last Sync</p>
          <p className="mt-1 tabular text-2xl font-bold text-[var(--text)]">Today</p>
          <p className="mt-1 text-xs text-[var(--faint)]">Latest connected feed refresh</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--text)]">Bank connections</h2>
            <p className="text-xs text-[var(--muted)]">Connect active operating banks. Cash boxes do not need feeds.</p>
          </div>
          {loading ? (
            <p className="p-8 text-center text-sm text-[var(--faint)]">Loading...</p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {accounts.map(account => {
                const status = FEED_STATUS[account.type] ?? FEED_STATUS.Current
                return (
                  <div key={account.id} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_160px_120px] md:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--text)]">{account.name}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{status.detail}</p>
                    </div>
                    <StatusPill status={status} />
                    <Button
                      variant={status.connected === true ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => toast.info(status.connected === true ? `${account.name} settings opened` : `Started setup for ${account.name}`)}
                    >
                      {status.connected === true ? 'Settings' : status.connected === false ? 'Connect' : 'View'}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary-tint)] text-[var(--primary)]">
              <Landmark size={18} />
            </span>
            <h2 className="mt-3 text-sm font-semibold text-[var(--text)]">What bank feed means</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              A bank feed brings statement entries into UnifiedTree so you can match them without downloading files daily.
            </p>
          </section>

          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text)]">Setup steps</h2>
            <div className="mt-3 space-y-3">
              {[
                [ShieldCheck, 'Choose bank account'],
                [ArrowLeftRight, 'Allow statement access'],
                [RefreshCw, 'Sync and match entries'],
              ].map(([Icon, label]) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[var(--text)]">
                  <Icon size={15} className="text-[var(--primary)]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
