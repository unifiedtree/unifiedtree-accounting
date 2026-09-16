import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Download,
  FileCheck2,
  ListFilter,
  RefreshCw,
  Wand2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { toast } from '../../lib/toast'
import { getBankTransactions } from '../../data/services/cashBankService'

const SUGGESTIONS = {
  BT004: {
    confidence: 99,
    match: 'Bank charges expense',
    category: 'Expense',
    rule: 'Remember bank charges',
    action: 'Add expense',
  },
  BT005: {
    confidence: 86,
    match: 'POS sales collection',
    category: 'Sales receipt',
    rule: 'Remember UPI settlements',
    action: 'Check receipt',
  },
}

const RULES = [
  { id: 'RULE001', name: 'Bank charges', when: 'Narration says Bank Charges', then: 'Add bank charge expense', status: 'Ready' },
  { id: 'RULE002', name: 'UPI collections', when: 'Reference starts with UPI', then: 'Match with POS sales', status: 'Review' },
  { id: 'RULE003', name: 'Customer NEFT', when: 'Narration has invoice number', then: 'Match customer receipt', status: 'On' },
]

function enrich(txn) {
  const suggestion = SUGGESTIONS[txn.id]
  if (suggestion) return { ...txn, amount: txn.credit || txn.debit, ...suggestion }
  return {
    ...txn,
    amount: txn.credit || txn.debit,
    confidence: txn.reconciled ? 100 : 0,
    match: txn.reconciled ? 'Already matched' : 'No suggestion yet',
    category: txn.credit > 0 ? 'Money received' : 'Money paid',
    rule: txn.reconciled ? 'No action needed' : 'Choose a match',
    action: txn.reconciled ? 'View' : 'Choose',
  }
}

function Step({ number, title, text, done }) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
      <span className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-xs font-bold ${done ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--primary-tint)] text-[var(--primary)]'}`}>
        {done ? <CheckCircle2 size={14} /> : number}
      </span>
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{text}</p>
      </div>
    </div>
  )
}

function Confidence({ value }) {
  const className = value >= 95
    ? 'bg-[var(--pos-tint)] text-[var(--pos)]'
    : value >= 80
      ? 'bg-amber-50 text-amber-700'
      : 'bg-[var(--surface-2)] text-[var(--muted)]'

  return <span className={`rounded-full px-2 py-1 text-xs font-bold ${className}`}>{value}%</span>
}

export default function Reconciliation() {
  const navigate = useNavigate()
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('check')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getBankTransactions().then(rows => {
      setTxns(rows.map(enrich))
      setLoading(false)
    })
  }, [])

  const toCheck = txns.filter(txn => !txn.reconciled)
  const done = txns.filter(txn => txn.reconciled)
  const autoReady = toCheck.filter(txn => txn.confidence >= 95)
  const rows = tab === 'done' ? done : toCheck
  const query = search.toLowerCase()
  const filtered = query
    ? rows.filter(row => (
      row.desc.toLowerCase().includes(query)
      || row.ref.toLowerCase().includes(query)
      || row.match.toLowerCase().includes(query)
      || row.category.toLowerCase().includes(query)
    ))
    : rows

  const columns = [
    {
      key: 'date',
      label: 'Date',
      className: 'w-24',
      render: value => <span className="whitespace-nowrap font-mono text-xs text-[var(--muted)]">{value}</span>,
    },
    {
      key: 'desc',
      label: 'Bank Entry',
      render: (_, row) => (
        <div className="min-w-0">
          <p className="max-w-md truncate text-sm font-semibold text-[var(--text)]">{row.desc}</p>
          <p className="mt-0.5 font-mono text-[11px] text-[var(--faint)]">{row.ref}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (_, row) => (
        <span className={`tabular text-sm font-bold ${row.credit > 0 ? 'text-[var(--pos)]' : 'text-[var(--neg)]'}`}>
          {row.credit > 0 ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'match',
      label: 'Suggested Match',
      render: (_, row) => (
        <div>
          <p className="text-sm font-medium text-[var(--text)]">{row.match}</p>
          <p className="mt-0.5 text-[11px] text-[var(--faint)]">{row.category}</p>
        </div>
      ),
    },
    { key: 'confidence', label: 'Confidence', align: 'center', render: value => <Confidence value={value} /> },
  ]

  const ruleColumns = [
    { key: 'name', label: 'Rule', render: value => <span className="text-sm font-semibold text-[var(--text)]">{value}</span> },
    { key: 'when', label: 'When this happens', render: value => <span className="text-sm text-[var(--muted)]">{value}</span> },
    { key: 'then', label: 'Do this next time', render: value => <span className="text-sm text-[var(--text)]">{value}</span> },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: value => <span className="rounded-full bg-[var(--surface-2)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">{value}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Bank Matching"
        subtitle="Match bank statement entries with sales, payments, or expenses"
        breadcrumb={['Cash & Bank', 'Bank Matching']}
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={Download} size="sm" onClick={() => navigate('/cashbank/import-statement')}>Import Statement</Button>
            <Button variant="secondary" icon={Wand2} size="sm" onClick={() => setTab('rules')}>Remember Matches</Button>
            <Button variant="primary" icon={RefreshCw} size="sm" onClick={() => toast.success('Suggestions refreshed')}>Find Matches</Button>
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Step number="1" title="Import statement" text="Upload CSV, Excel, or PDF from your bank." done={txns.length > 0} />
        <Step number="2" title="Check suggestions" text={`${toCheck.length} entries still need confirmation.`} done={toCheck.length === 0} />
        <Step number="3" title="Remember repeats" text="Save common matches as rules for next time." done={RULES.some(rule => rule.status === 'On')} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm">
              {[
                ['check', 'To Check', toCheck.length],
                ['done', 'Done', done.length],
                ['rules', 'Saved Rules', RULES.length],
              ].map(([id, label, count]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`h-8 rounded-[var(--radius-sm)] px-3 text-xs font-semibold transition-colors ${tab === id ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'}`}
                >
                  {label} <span className="tabular opacity-80">{count}</span>
                </button>
              ))}
            </div>
            {tab !== 'rules' && (
              <p className="text-xs text-[var(--muted)]">
                {autoReady.length ? `${autoReady.length} strong suggestion can be confirmed quickly.` : 'No strong suggestions waiting.'}
              </p>
            )}
          </div>

          {tab === 'rules' ? (
            <DataTable
              columns={ruleColumns}
              data={RULES}
              loading={false}
              rowKey="id"
              actions={row => (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.success(row.status === 'On' ? 'Rule opened for editing' : `${row.name} rule turned on`)}
                >
                  {row.status === 'On' ? 'Edit' : 'Turn On'}
                </Button>
              )}
            />
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              loading={loading}
              rowKey="id"
              selectable={tab === 'check'}
              bulkActions={[
                { label: 'Confirm', icon: CheckCircle2, onClick: rows => toast.success(`${rows.length} bank entries confirmed`) },
                { label: 'Remember Match', icon: ListFilter, onClick: rows => toast.success(`${rows.length} saved rule suggestion${rows.length === 1 ? '' : 's'} created`) },
              ]}
              toolbar={<Filters search={search} onSearchChange={setSearch} placeholder="Search bank entry, ref, or match..." />}
              actions={row => (
                <Button
                  variant={row.confidence >= 95 ? 'primary' : 'secondary'}
                  size="sm"
                  className="min-w-24 justify-center whitespace-nowrap"
                  onClick={() => toast.success(row.reconciled ? 'Matched entry opened' : `${row.action} completed`)}
                >
                  {row.action}
                </Button>
              )}
            />
          )}
        </div>

        <aside className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text)]">Plain guide</h2>
            <div className="mt-3 space-y-3">
              {[
                ['Bank entry', 'Line from your bank statement'],
                ['Suggested match', 'Where UnifiedTree thinks it belongs'],
                ['Confidence', 'How sure the system is'],
                ['Rule', 'A saved instruction for future entries'],
              ].map(([label, text]) => (
                <div key={label}>
                  <p className="text-sm font-medium text-[var(--text)]">{label}</p>
                  <p className="text-xs text-[var(--muted)]">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text)]">This month</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted)]">Matched</span>
                <span className="font-bold text-[var(--pos)]">{done.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted)]">To check</span>
                <span className="font-bold text-[var(--neg)]">{toCheck.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted)]">Unmatched value</span>
                <span className="font-bold text-[var(--text)]">{formatCompact(Math.abs(toCheck.reduce((sum, row) => sum + row.credit - row.debit, 0)))}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text)]">Close checklist</h2>
            <div className="mt-3 space-y-3">
              {[
                ['Statement imported', true],
                ['All entries matched', toCheck.length === 0],
                ['Rules reviewed', false],
              ].map(([label, doneFlag]) => (
                <div key={label} className="flex items-center gap-2">
                  {doneFlag ? <CheckCircle2 size={15} className="text-[var(--pos)]" /> : <FileCheck2 size={15} className="text-[var(--muted)]" />}
                  <span className={`text-sm ${doneFlag ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>{label}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
