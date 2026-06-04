import { useMemo, useState } from 'react'
import { FileCheck2 } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Filters from '../../components/ui/Filters'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppStore } from '../../store/useAppStore'
import { currentFYYear } from '../../lib/fy'
import { formatDate } from '../../lib/date'

const DEADLINES = [
  { id: 'TAX-001', dueDate: '2025-01-11', form: 'GSTR-1', category: 'GST', period: 'Dec 2024', owner: 'Tax Team', status: 'pending', priority: 'High' },
  { id: 'TAX-002', dueDate: '2025-01-20', form: 'GSTR-3B', category: 'GST', period: 'Dec 2024', owner: 'Tax Team', status: 'pending', priority: 'High' },
  { id: 'TAX-003', dueDate: '2025-01-30', form: 'TDS Payment', category: 'TDS', period: 'Q3 FY 2024-25', owner: 'Payroll', status: 'open', priority: 'Medium' },
  { id: 'TAX-004', dueDate: '2025-01-31', form: 'TCS Statement', category: 'TCS', period: 'Q3 FY 2024-25', owner: 'Compliance', status: 'open', priority: 'Medium' },
  { id: 'TAX-005', dueDate: '2025-02-10', form: 'E-Way Bill Audit', category: 'E-Way', period: 'Jan 2025', owner: 'Operations', status: 'open', priority: 'Low' },
  { id: 'TAX-006', dueDate: '2025-02-15', form: 'GST Reconciliation', category: 'GST', period: 'Jan 2025', owner: 'CA Office', status: 'open', priority: 'Medium' },
  { id: 'TAX-007', dueDate: '2025-03-07', form: 'TDS Payment', category: 'TDS', period: 'Feb 2025', owner: 'Payroll', status: 'open', priority: 'High' },
]

export default function DashboardTaxCalendar() {
  const { financialYear, activeCompany } = useAppStore()
  const fy = financialYear ?? currentFYYear()
  const [search, setSearch] = useState('')
  const [deadlines, setDeadlines] = useState(DEADLINES)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return deadlines
    return deadlines.filter((item) =>
      [item.form, item.category, item.period, item.owner, item.priority]
        .some((value) => value.toLowerCase().includes(term))
    )
  }, [deadlines, search])

  function markComplete(row) {
    setDeadlines((items) =>
      items.map((item) =>
        item.id === row.id ? { ...item, status: 'closed' } : item
      )
    )
  }

  const columns = [
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value) => <span className="tabular">{formatDate(value)}</span>,
    },
    { key: 'form', label: 'Compliance', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'period', label: 'Period', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value) => (
        <span className={value === 'High' ? 'text-[var(--neg)] font-medium' : 'text-[var(--muted)]'}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Tax Calendar"
        subtitle={`FY ${fy}-${String(fy + 1).slice(-2)} - ${activeCompany?.name}`}
        breadcrumb={['Dashboard', 'Tax Calendar']}
      />

      <DataTable
        columns={columns}
        data={filtered}
        pageSize={7}
        toolbar={
          <Filters
            search={search}
            onSearchChange={setSearch}
            placeholder="Search compliance, owner, period..."
          />
        }
        actions={(row) => (
          <Button
            size="sm"
            variant={row.status === 'closed' ? 'ghost' : 'secondary'}
            icon={FileCheck2}
            disabled={row.status === 'closed'}
            onClick={(event) => {
              event.stopPropagation()
              markComplete(row)
            }}
          >
            {row.status === 'closed' ? 'Done' : 'Mark'}
          </Button>
        )}
      />
    </div>
  )
}
