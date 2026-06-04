import { useState } from 'react'
import { Building2, Check, ChevronDown, Factory, MapPin, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { validateCompanyDraft } from '../../lib/company'
import { useAppStore } from '../../store/useAppStore'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const EMPTY_COMPANY = {
  name: '',
  legalType: 'Private Limited',
  branch: '',
  gstin: '',
  departments: 'Accounts',
  zones: 'Factory - Hyderabad, Office - Hyderabad, Maharashtra Branch, Karnataka Branch, Delhi Branch',
}

const DEFAULT_BRANCHES = [
  'Factory - Hyderabad',
  'Office - Hyderabad',
  'Maharashtra Branch',
  'Karnataka Branch',
  'Delhi Branch',
  'Tamil Nadu Branch',
  'Telangana Branch',
  'Gujarat Branch',
  'Uttar Pradesh Branch',
  'West Bengal Branch',
]

export default function CompanySwitcher() {
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [draft, setDraft] = useState(EMPTY_COMPANY)
  const [newZone, setNewZone] = useState('')
  const [errors, setErrors] = useState({})
  const {
    companies,
    activeCompany,
    activeDepartment,
    activeZone,
    setCompanyContext,
    setActiveDepartment,
    setActiveZone,
    addCompanyZone,
    addCompany,
  } = useAppStore()

  const departments = activeCompany?.departments?.length ? activeCompany.departments : ['Accounts']
  const zones = activeCompany?.zones?.length ? activeCompany.zones : DEFAULT_BRANCHES

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  const openCreateCompany = () => {
    setOpen(false)
    setCreateOpen(true)
  }

  const closeCreateCompany = () => {
    setCreateOpen(false)
    setDraft(EMPTY_COMPANY)
    setErrors({})
  }

  const handleCreateCompany = (event) => {
    event.preventDefault()
    const result = validateCompanyDraft(draft)

    if (!result.valid) {
      setErrors(result.errors)
      return
    }

    addCompany(draft)
    closeCreateCompany()
  }

  function submitZone(event) {
    event.preventDefault()
    addCompanyZone(newZone)
    setNewZone('')
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full rounded-[var(--radius-sm)] border border-white/10 px-3 py-2 text-left transition-all duration-150',
            'bg-white/[0.04] text-[var(--nav-text)] hover:bg-[var(--nav-2)] hover:text-white',
            open && 'bg-[var(--nav-2)] text-white border-white/15'
          )}
        >
          <div className="flex items-center gap-2">
            <Building2 size={14} className="flex-shrink-0" />
            <span className="min-w-0 flex-1 truncate text-xs font-bold">{activeCompany?.name}</span>
            <ChevronDown size={12} className={cn('flex-shrink-0 transition-transform duration-150', open && 'rotate-180')} />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--nav-text)] opacity-70">
            <span className="truncate">{activeDepartment ?? departments[0]}</span>
            <span>•</span>
            <span className="truncate">{activeZone ?? zones[0]}</span>
          </div>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
            <div className="fixed bottom-16 left-4 z-30 w-[640px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
              <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Company Context</p>
                    <p className="mt-1 text-base font-bold text-[var(--text)]">{activeCompany?.name}</p>
                  </div>
                  <div className="rounded-full bg-[var(--primary-tint)] px-3 py-1 text-xs font-bold text-[var(--primary)]">
                    {activeDepartment ?? departments[0]} / {activeZone ?? zones[0]}
                  </div>
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="border-b border-[var(--border)] bg-[var(--surface)] p-3 md:border-b-0 md:border-r">
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--faint)]">Companies</p>
                  {companies.map((co) => (
                    <button
                      key={co.id}
                      onClick={() => {
                        setCompanyContext({
                          company: co,
                          department: co.departments?.[0] ?? 'Accounts',
                          zone: co.zones?.[0] ?? 'Default',
                        })
                      }}
                      className={cn(
                        'mb-1 flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition-colors',
                        activeCompany?.id === co.id ? 'bg-[var(--primary-tint)] text-[var(--primary)]' : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{co.name}</p>
                        <p className="mt-0.5 truncate text-xs text-[var(--faint)]">{co.branch}</p>
                      </div>
                      {activeCompany?.id === co.id && <Check size={14} className="mt-0.5 flex-shrink-0" />}
                    </button>
                  ))}
                  <button
                    onClick={openCreateCompany}
                    className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary-tint)]"
                  >
                    <Plus size={14} />
                    Create Company
                  </button>
                </div>

                <div className="p-4">
                  <div className="grid gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        <Factory size={13} />
                        Department
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {departments.map(department => (
                          <button
                            key={department}
                            onClick={() => setActiveDepartment(department)}
                            className={cn(
                              'flex h-12 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition-colors',
                              activeDepartment === department
                                ? 'border-[var(--primary)] bg-[var(--primary-tint)] text-[var(--primary)]'
                                : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]'
                            )}
                          >
                            {department}
                            {activeDepartment === department && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        <MapPin size={13} />
                        Branch
                      </div>
                      <div className="grid max-h-56 grid-cols-2 gap-1.5 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2">
                        {zones.map(zone => (
                          <button
                            key={zone}
                            onClick={() => setActiveZone(zone)}
                            className={cn(
                              'flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors',
                              activeZone === zone
                                ? 'bg-[var(--primary)] font-semibold text-white'
                                : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                            )}
                          >
                            {zone}
                            {activeZone === zone && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                      <form onSubmit={submitZone} className="mt-2 flex gap-2">
                        <input
                          value={newZone}
                          onChange={event => setNewZone(event.target.value)}
                          className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
                          placeholder="Add branch"
                        />
                        <button
                          type="submit"
                          disabled={!newZone.trim()}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 text-xs font-bold text-white disabled:opacity-50"
                        >
                          <Plus size={12} />
                          Add
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Active scope</p>
                    <p className="mt-1 text-sm font-bold text-[var(--text)]">{activeCompany?.name} · {activeDepartment ?? departments[0]} · {activeZone ?? zones[0]}</p>
                    <p className="mt-0.5 text-xs text-[var(--faint)]">{activeCompany?.gstin || 'GSTIN not added'}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={closeCreateCompany}
        title="Create Company"
        size="lg"
        footer={(
          <>
            <Button type="button" variant="ghost" onClick={closeCreateCompany}>Cancel</Button>
            <Button type="submit" form="create-company-form" variant="primary" icon={Plus}>Create Company</Button>
          </>
        )}
      >
        <form id="create-company-form" onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">Company Name</span>
            <input
              value={draft.name}
              onChange={(event) => updateDraft('name', event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]"
              placeholder="Enter company name"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-xs font-medium text-[var(--neg)]">{errors.name}</p>}
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text)]">Legal Type</span>
            <select
              value={draft.legalType}
              onChange={(event) => updateDraft('legalType', event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]"
            >
              <option>Private Limited</option>
              <option>LLP</option>
              <option>Partnership</option>
              <option>Proprietorship</option>
              <option>Public Limited</option>
            </select>
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text)]">Branch</span>
            <input
              value={draft.branch}
              onChange={(event) => updateDraft('branch', event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]"
              placeholder="Mumbai HO"
            />
            {errors.branch && <p className="mt-1 text-xs font-medium text-[var(--neg)]">{errors.branch}</p>}
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-medium text-[var(--text)]">GSTIN</span>
            <input
              value={draft.gstin}
              onChange={(event) => updateDraft('gstin', event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm uppercase text-[var(--text)]"
              placeholder="27AABCU9603R1ZX"
              maxLength={15}
            />
            {errors.gstin && <p className="mt-1 text-xs font-medium text-[var(--neg)]">{errors.gstin}</p>}
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text)]">Departments</span>
            <input
              value={draft.departments}
              onChange={(event) => updateDraft('departments', event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]"
              placeholder="Sales, Accounts, Warehouse"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text)]">Branches</span>
            <input
              value={draft.zones}
              onChange={(event) => updateDraft('zones', event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]"
              placeholder="Factory - Hyderabad, Office - Hyderabad"
            />
          </label>
        </form>
      </Modal>
    </>
  )
}
