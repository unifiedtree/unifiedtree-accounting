import { CheckCircle2, MinusCircle, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import sections from '../../config/sections'

const PARTY_FIELD_AUDIT = [
  { surface: 'All Contacts', fields: 'Party name, GSTIN, type, city, outstanding, overdue, last transaction, status, row actions', status: 'Good' },
  { surface: 'New Party', fields: 'Name, type, GSTIN, PAN, registration type, contact, phone, email, city, state, billing/shipping address, credit limit, credit period, opening balance, preferred mode', status: 'Good' },
  { surface: 'Party Profile', fields: 'Profile, GST check, duplicate warning, portal status, credit usage, bill-wise outstanding, timeline, documents, communication/payment actions', status: 'Partial' },
  { surface: 'Customer History', fields: 'Customer, GSTIN, city, credit limit, outstanding, overdue, last transaction, status, receipt/reminder/statement actions', status: 'Good' },
  { surface: 'Supplier History', fields: 'Supplier, GSTIN, city, payable, overdue, advance paid, last transaction, status, payment/reminder/statement actions', status: 'Good' },
  { surface: 'Ledger View', fields: 'Party, city, receivable, payable, net position, last transaction, status, settlement action', status: 'Partial' },
  { surface: 'Statements', fields: 'Party selector, period selector, opening balance, debit, credit, closing balance, print, PDF export', status: 'Good' },
]

const COMPETITOR_GAPS = [
  { area: 'Party master depth', unifiedTree: 'Good master and create flow, but no multi-address/custom fields yet', tally: 'Mailing details, state/country, tax registration, credit period', zoho: 'Rich contacts, custom fields, customer/vendor details', vyapar: 'Simple customer/supplier contact management', gap: 'Add multi-addresses, tags, custom fields, owner, branch/address selector', priority: 'High' },
  { area: 'GST validation', unifiedTree: 'Format and state hint only', tally: 'GSTIN/UIN validation/fetch from portal', zoho: 'Tax registration support', vyapar: 'GST billing focus', gap: 'Add real GSTIN fetch, legal name, taxpayer status, state mismatch blocking', priority: 'High' },
  { area: 'Bill-wise balances', unifiedTree: 'Mock bill-wise drawer in party profile', tally: 'Core bill-by-bill balances and allocation', zoho: 'Invoice/bill contact history', vyapar: 'Party-wise receivable/payable', gap: 'Connect to actual invoices, bills, debit/credit notes, advances, receipts, payments', priority: 'High' },
  { area: 'Credit control', unifiedTree: 'Credit limit and warning started', tally: 'Default credit period and credit-day check in voucher entry', zoho: 'Receivables/payment workflow controls', vyapar: 'Due tracking and reminders', gap: 'Add hard/soft blocks before invoice creation when credit rules fail', priority: 'High' },
  { area: 'Payment reminders', unifiedTree: 'Reminder action only', tally: 'Ledger-focused, not reminder-led', zoho: 'Automated reminders', vyapar: 'WhatsApp/SMS/email reminders', gap: 'Build reminder scheduler, templates, promise-to-pay, bulk reminders', priority: 'High' },
  { area: 'Statement sharing', unifiedTree: 'Print/PDF and share action mock', tally: 'Strong ledger statements', zoho: 'Statement generation and portal access', vyapar: 'Easy sharing workflows', gap: 'Add send history, monthly auto-send, delivery status', priority: 'High' },
  { area: 'Customer portal', unifiedTree: 'Portal status mock', tally: 'Not a cloud portal focus', zoho: 'Customer portal for quotes, invoices, payments, documents, comments', vyapar: 'Lightweight sharing/payment links', gap: 'Build portal invite/status, viewed invoices, accepted quotes, payment activity', priority: 'Medium' },
  { area: 'Vendor portal', unifiedTree: 'Missing', tally: 'Supplier ledgers', zoho: 'Vendor collaboration and document upload', vyapar: 'Supplier payable tracking', gap: 'Add vendor invoice upload, PO acknowledgement, payment status', priority: 'Medium' },
  { area: 'Contact timeline', unifiedTree: 'Basic mocked timeline', tally: 'Ledger transaction history', zoho: 'Contact transaction and collaboration history', vyapar: 'Customer history and transaction log', gap: 'Make timeline real: calls, notes, reminders, statement sent, invoice viewed, disputes', priority: 'High' },
  { area: 'Documents', unifiedTree: 'Mock document vault', tally: 'Not the core differentiator', zoho: 'Document management and attachments', vyapar: 'Basic billing document sharing', gap: 'Add upload, preview, expiry, verification status, required-doc checklist', priority: 'Medium' },
  { area: 'Duplicate detection', unifiedTree: 'Basic duplicate warning', tally: 'Master discipline through ledger setup', zoho: 'Organized contact management', vyapar: 'Simple party creation', gap: 'Add fuzzy matching and merge workflow', priority: 'Medium' },
  { area: 'Import/export', unifiedTree: 'Export and migration area, no party import wizard yet', tally: 'Incumbent source data', zoho: 'Import ecosystem', vyapar: 'Import/export for SMB use', gap: 'Add Excel/Tally party import, validation preview, duplicate merge, rejected rows', priority: 'High' },
]

const COMPANY_MATRIX = [
  { capability: 'Basic party master', unifiedTree: 'Good', tally: 'Excellent', zoho: 'Excellent', vyapar: 'Good', gap: 'Mostly covered' },
  { capability: 'Customer/supplier ledger', unifiedTree: 'Good', tally: 'Excellent', zoho: 'Good', vyapar: 'Good', gap: 'Improve transaction depth' },
  { capability: 'Bill-wise balance', unifiedTree: 'Partial', tally: 'Excellent', zoho: 'Good', vyapar: 'Medium', gap: 'Major gap vs Tally' },
  { capability: 'Credit period control', unifiedTree: 'Partial', tally: 'Excellent', zoho: 'Good', vyapar: 'Medium', gap: 'Needs enforcement' },
  { capability: 'GSTIN validation', unifiedTree: 'Basic', tally: 'Excellent', zoho: 'Medium', vyapar: 'Medium', gap: 'Major gap vs Tally' },
  { capability: 'Multi-address profile', unifiedTree: 'Missing', tally: 'Good', zoho: 'Good', vyapar: 'Basic', gap: 'Add branch/billing/shipping addresses' },
  { capability: 'Customer portal', unifiedTree: 'Mock', tally: 'Low', zoho: 'Excellent', vyapar: 'Medium', gap: 'Major gap vs Zoho' },
  { capability: 'Vendor portal', unifiedTree: 'Missing', tally: 'Low', zoho: 'Good', vyapar: 'Basic', gap: 'Gap vs Zoho' },
  { capability: 'Payment reminders', unifiedTree: 'Mock', tally: 'Medium', zoho: 'Excellent', vyapar: 'Excellent', gap: 'Major gap vs Zoho/Vyapar' },
  { capability: 'WhatsApp/SMS sharing', unifiedTree: 'Mock', tally: 'Low', zoho: 'Medium', vyapar: 'Excellent', gap: 'Gap vs Vyapar' },
  { capability: 'Statement auto-send', unifiedTree: 'Missing', tally: 'Medium', zoho: 'Good', vyapar: 'Medium', gap: 'Important automation gap' },
  { capability: 'Document vault', unifiedTree: 'Partial', tally: 'Medium', zoho: 'Good', vyapar: 'Medium', gap: 'Needs upload/verification' },
  { capability: 'Party import', unifiedTree: 'Missing', tally: 'Native source', zoho: 'Good', vyapar: 'Basic', gap: 'High switching gap' },
]

function StatusIcon({ value }) {
  if (['Good', 'Excellent', 'Mostly covered'].includes(value)) return <CheckCircle2 size={13} className="text-[var(--pos)]" />
  if (['Missing', 'Low', 'Major gap vs Tally', 'Major gap vs Zoho', 'Major gap vs Zoho/Vyapar', 'High switching gap'].includes(value)) return <AlertTriangle size={13} className="text-[var(--neg)]" />
  return <MinusCircle size={13} className="text-[var(--warn)]" />
}

function SimpleTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--surface-2)]">
            {columns.map(col => (
              <th key={col.key} className="border-b border-[var(--border)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.area ?? row.capability ?? row.surface ?? index} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 align-top text-[var(--text)]">
                  {col.status ? (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <StatusIcon value={row[col.key]} />
                      {row[col.key]}
                    </span>
                  ) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CompetitorGap() {
  const appAudit = sections.map(section => ({
    section: section.label,
    tabs: section.tabs.map(tab => tab.label).join(', '),
    count: section.tabs.length,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parties Gap Analysis"
        subtitle="Website tab and field audit compared with TallyPrime, Zoho Books, and Vyapar"
        breadcrumb={['Parties & Ledgers', 'Gap Analysis']}
      />

      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Website Tab Audit</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">All navigation sections currently exposed in the app shell.</p>
        </div>
        <SimpleTable
          columns={[
            { key: 'section', label: 'Main Section' },
            { key: 'tabs', label: 'Tabs' },
            { key: 'count', label: 'Tab Count' },
          ]}
          rows={appAudit}
        />
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Parties Field Audit</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Fields and workflows already present in the Parties section after the recent add-ons.</p>
        </div>
        <SimpleTable
          columns={[
            { key: 'surface', label: 'Parties Surface' },
            { key: 'fields', label: 'Current Fields / Actions' },
            { key: 'status', label: 'Coverage', status: true },
          ]}
          rows={PARTY_FIELD_AUDIT}
        />
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Competitor Gap Table</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Feature gaps between UnifiedTree and common accounting competitors.</p>
        </div>
        <SimpleTable
          columns={[
            { key: 'area', label: 'Feature Area' },
            { key: 'unifiedTree', label: 'UnifiedTree Today' },
            { key: 'tally', label: 'TallyPrime' },
            { key: 'zoho', label: 'Zoho Books' },
            { key: 'vyapar', label: 'Vyapar' },
            { key: 'gap', label: 'Gap / Improvement Needed' },
            { key: 'priority', label: 'Priority' },
          ]}
          rows={COMPETITOR_GAPS}
        />
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Company vs Competitors Gap Matrix</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">A compact capability scorecard for product planning.</p>
        </div>
        <SimpleTable
          columns={[
            { key: 'capability', label: 'Capability' },
            { key: 'unifiedTree', label: 'UnifiedTree', status: true },
            { key: 'tally', label: 'TallyPrime', status: true },
            { key: 'zoho', label: 'Zoho Books', status: true },
            { key: 'vyapar', label: 'Vyapar', status: true },
            { key: 'gap', label: 'Gap Status', status: true },
          ]}
          rows={COMPANY_MATRIX}
        />
      </section>
    </div>
  )
}
