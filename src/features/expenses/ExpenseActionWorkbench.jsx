import { useState } from 'react'
import { FileText, Inbox, Lock, Plus, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { toast } from '../../lib/toast'
import { formatCompact } from '../../lib/currency'

const ACTION_CONFIG = {
  'new-expense': {
    title: 'New Expense',
    subtitle: 'Quick voucher-style expense entry with receipt, GST, policy, and payment checks',
    icon: Plus,
    primary: 'Save Expense',
    rows: [
      { id: 'STEP-1', field: 'Expense details', value: 'Vendor, category, date, amount', status: 'Required', next: 'Capture or upload receipt' },
      { id: 'STEP-2', field: 'GST / ITC', value: 'GST amount and eligibility', status: 'Review', next: 'Check tax treatment' },
      { id: 'STEP-3', field: 'Policy check', value: 'Budget and approval limit', status: 'Auto', next: 'Send for approval if needed' },
    ],
  },
  'receipt-inbox': {
    title: 'Receipt Inbox',
    subtitle: 'OCR-ready expense receipt queue inspired by modern cloud accounting workflows',
    icon: Inbox,
    primary: 'Upload Receipt',
    rows: [
      { id: 'RCPT-001', field: 'Adobe Systems', value: 'Software - Rs 5,000', status: 'Matched', next: 'Post expense' },
      { id: 'RCPT-002', field: 'Ola Corporate', value: 'Travel - Rs 1,500', status: 'Policy review', next: 'Confirm client travel' },
      { id: 'RCPT-003', field: 'Staples India', value: 'Office supplies - Rs 3,776', status: 'GST found', next: 'Verify invoice number' },
    ],
  },
  'policy-rules': {
    title: 'Policy Rules',
    subtitle: 'Budget, category, approval, duplicate, cash-limit, and GST checks before posting',
    icon: ShieldCheck,
    primary: 'Add Policy',
    rows: [
      { id: 'POL-001', field: 'Travel over Rs 10,000', value: 'Manager approval', status: 'Active', next: 'Applies before posting' },
      { id: 'POL-002', field: 'Cash over Rs 5,000', value: 'Finance review', status: 'Active', next: 'Warn user at entry' },
      { id: 'POL-003', field: 'Duplicate vendor/date/amount', value: 'Block duplicate', status: 'Active', next: 'Compare receipt hash' },
    ],
  },
  'approval-queue': {
    title: 'Approval Queue',
    subtitle: 'Pending expenses, policy exceptions, and close-sensitive approvals',
    icon: FileText,
    primary: 'Approve Selected',
    rows: [
      { id: 'EXP-2526-0079', field: 'Ola Corporate', value: 'Travel - Rs 1,500', status: 'Pending', next: 'Approve or reject' },
      { id: 'POL-TRAVEL', field: 'Air Travel', value: '95% budget used', status: 'Review', next: 'Tighten approval rule' },
      { id: 'CLOSE-PV', field: 'Income tax provision', value: 'Draft accrual', status: 'Pending close', next: 'Approve before close' },
    ],
  },
  'new-rule': {
    title: 'New Rule',
    subtitle: 'Create budget limits, approval rules, duplicate checks, and recurring controls from one page',
    icon: ShieldCheck,
    primary: 'Save Rule',
    rows: [
      { id: 'RULE-1', field: 'Scope', value: 'Category, vendor, employee, or amount band', status: 'Required', next: 'Choose who the rule applies to' },
      { id: 'RULE-2', field: 'Condition', value: 'Budget, cash, GST, duplicate, or recurring check', status: 'Required', next: 'Set approval threshold' },
      { id: 'RULE-3', field: 'Action', value: 'Warn, route for approval, or block posting', status: 'Required', next: 'Preview affected expenses' },
    ],
  },
  'new-entry': {
    title: 'New Accounting Entry',
    subtitle: 'Voucher-style journal and accrual entry with debit-credit validation',
    icon: FileText,
    primary: 'Post Entry',
    rows: [
      { id: 'ENTRY-1', field: 'Voucher details', value: 'Date, narration, reference, and branch', status: 'Required', next: 'Add ledger lines' },
      { id: 'ENTRY-2', field: 'Debit lines', value: 'Expense, provision, or adjustment account', status: 'Required', next: 'Balance against credit lines' },
      { id: 'ENTRY-3', field: 'Approval', value: 'Finance owner and supporting document', status: 'Review', next: 'Post or save as draft' },
    ],
  },
  'new-category': {
    title: 'New Category',
    subtitle: 'Create an expense category with budget, ledger mapping, and policy defaults',
    icon: Plus,
    primary: 'Save Category',
    rows: [
      { id: 'CAT-1', field: 'Category setup', value: 'Name, parent category, and expense ledger', status: 'Required', next: 'Set budget limit' },
      { id: 'CAT-2', field: 'Budget control', value: 'Monthly and annual limits', status: 'Optional', next: 'Attach policy rule' },
      { id: 'CAT-3', field: 'Automation', value: 'Default GST, TDS, and posting behavior', status: 'Optional', next: 'Use for new expenses' },
    ],
  },
  'new-recurring-bill': {
    title: 'New Recurring Bill',
    subtitle: 'Schedule subscriptions, rent, utilities, and repeat vendor bills before they become overdue',
    icon: Plus,
    primary: 'Save Recurring Bill',
    rows: [
      { id: 'REC-1', field: 'Bill details', value: 'Vendor, description, amount, and tax setup', status: 'Required', next: 'Choose frequency' },
      { id: 'REC-2', field: 'Schedule', value: 'Monthly, quarterly, annual, or custom dates', status: 'Required', next: 'Set next posting date' },
      { id: 'REC-3', field: 'Posting rule', value: 'Auto-post, draft, or approval first', status: 'Review', next: 'Activate schedule' },
    ],
  },
  'new-journal-voucher': {
    title: 'New Journal Voucher',
    subtitle: 'Manual accounting voucher with balanced ledger lines and posting approval',
    icon: FileText,
    primary: 'Save Voucher',
    rows: [
      { id: 'JV-1', field: 'Voucher header', value: 'Date, reference, narration, and cost center', status: 'Required', next: 'Add debit lines' },
      { id: 'JV-2', field: 'Ledger lines', value: 'Debit and credit accounts must balance', status: 'Required', next: 'Attach support' },
      { id: 'JV-3', field: 'Posting', value: 'Save as draft or post to books', status: 'Review', next: 'Confirm audit trail' },
    ],
  },
  'new-provision': {
    title: 'New Provision',
    subtitle: 'Accrue expected expenses and keep them visible for period close',
    icon: Plus,
    primary: 'Save Provision',
    rows: [
      { id: 'PV-1', field: 'Provision details', value: 'Expense account, period, amount, and reason', status: 'Required', next: 'Set reversal rule' },
      { id: 'PV-2', field: 'Reversal', value: 'Reverse next month or carry forward', status: 'Required', next: 'Attach support' },
      { id: 'PV-3', field: 'Approval', value: 'Finance review before close', status: 'Review', next: 'Post accrual' },
    ],
  },
  'new-write-off': {
    title: 'New Write-off',
    subtitle: 'Record approved asset, inventory, or receivable write-offs with audit evidence',
    icon: Plus,
    primary: 'Submit Write-off',
    rows: [
      { id: 'WO-1', field: 'Write-off item', value: 'Account, asset, vendor, or receivable reference', status: 'Required', next: 'Enter amount' },
      { id: 'WO-2', field: 'Reason', value: 'Damage, bad debt, expiry, or management decision', status: 'Required', next: 'Attach approval' },
      { id: 'WO-3', field: 'Control', value: 'Finance approval and close impact check', status: 'Review', next: 'Post write-off' },
    ],
  },
  'close-period-action': {
    title: 'Close Period Review',
    subtitle: 'Resolve pending close tasks before locking the accounting period',
    icon: Lock,
    primary: 'Mark Reviewed',
    rows: [
      { id: 'CLOSE-1', field: 'Salary processed', value: 'Pending payroll confirmation', status: 'Pending', next: 'Assign payroll owner' },
      { id: 'CLOSE-2', field: 'Provisions reviewed', value: 'Draft accruals still open', status: 'Pending', next: 'Review accounting entries' },
      { id: 'CLOSE-3', field: 'Trial balance checked', value: 'Final balance check required', status: 'Pending', next: 'Run finance review' },
    ],
  },
}

export default function ExpenseActionWorkbench({ type }) {
  const config = ACTION_CONFIG[type] ?? ACTION_CONFIG['new-expense']
  const Icon = config.icon
  const [rows, setRows] = useState(config.rows)
  const [lastAction, setLastAction] = useState(null)

  const handlePrimaryAction = () => {
    setRows(current => current.map(row => ({
      ...row,
      status: row.status === 'Active' ? 'Active' : 'Completed',
      next: row.status === 'Active' ? row.next : 'Done',
    })))
    setLastAction(`${config.primary} completed`)
    toast.success(`${config.primary} completed`)
  }

  const amountTotal = rows.reduce((sum, row) => {
    const match = String(row.value).match(/Rs ([\d,]+)/)
    return sum + (match ? Number(match[1].replace(/,/g, '')) : 0)
  }, 0)

  const columns = [
    { key: 'id', label: 'Ref', render: v => <span className="font-mono text-xs font-semibold text-[var(--primary)]">{v}</span> },
    { key: 'field', label: 'Item', render: v => <span className="font-medium text-[var(--text)]">{v}</span> },
    { key: 'value', label: 'Value / Rule', render: v => <span className="text-sm text-[var(--muted)]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v === 'Completed' ? 'bg-[var(--pos-tint)] text-[var(--pos)]' : 'bg-[var(--primary-tint)] text-[var(--primary)]'}`}>{v}</span> },
    { key: 'next', label: 'Next Action', render: v => <span className="text-sm font-medium text-[var(--text)]">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        breadcrumb={['Expenses', config.title]}
        action={<Button variant="primary" icon={Icon} size="sm" onClick={handlePrimaryAction}>{config.primary}</Button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Rows</p>
          <p className="tabular mt-2 text-2xl font-bold text-[var(--text)]">{rows.length}</p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Detected Value</p>
          <p className="tabular mt-2 text-2xl font-bold text-[var(--primary)]">{formatCompact(amountTotal)}</p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Controls</p>
          <p className="tabular mt-2 text-2xl font-bold text-[var(--pos)]">{lastAction ? 'Done' : 'Active'}</p>
        </div>
      </div>

      {lastAction && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--pos)] bg-[var(--pos-tint)] px-4 py-3 shadow-sm">
          <p className="text-sm font-bold text-[var(--pos)]">{lastAction}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Rows marked complete and ready for finance review.</p>
        </div>
      )}

      <DataTable columns={columns} data={rows} rowKey="id" />
    </div>
  )
}
