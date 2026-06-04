import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildCompanyRecord } from '../lib/company'
import { currentFYYear, fyRange } from '../lib/fy'
import i18n from '../i18n'

const defaultFYYear = currentFYYear()
const defaultFYRange = fyRange(defaultFYYear)
const defaultLanguage = (() => {
  try {
    return localStorage.getItem('ut-lang') || 'en'
  } catch {
    return 'en'
  }
})()
const defaultTheme = (() => {
  try {
    return localStorage.getItem('ut-theme') || 'system'
  } catch {
    return 'system'
  }
})()

function applyTheme(theme) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && systemDark)
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

const MOCK_COMPANIES = [
  {
    id: 'c1',
    name: 'Nclever',
    gstin: '27AABCU9603R1ZX',
    branch: 'Head Office',
    departments: ['Accounts'],
    zones: [
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
    ],
  },
  {
    id: 'c2',
    name: 'Apex Solutions LLP',
    gstin: '29AABCU9603R1ZY',
    branch: 'Bangalore',
    departments: ['Accounts'],
    zones: ['Bangalore Branch', 'Mumbai Branch'],
  },
]

const DEFAULT_COMPLIANCE_PIPELINE = [
  { id: 'invoice-posted', label: 'Invoice Posted', status: 'done', owner: 'Accountant', due: 'Today', risk: 'low' },
  { id: 'irn-generated', label: 'IRN Generated', status: 'ready', owner: 'Senior Accountant', due: 'Today', risk: 'medium' },
  { id: 'eway-generated', label: 'E-way Bill Generated', status: 'blocked', owner: 'Finance Lead', due: 'Tomorrow', risk: 'medium' },
  { id: 'gstr1-staged', label: 'GSTR-1 Staged', status: 'pending', owner: 'Finance Lead', due: '11 Jun 2026', risk: 'high' },
  { id: 'gstr3b-reviewed', label: 'GSTR-3B Reviewed', status: 'pending', owner: 'CA / Auditor', due: '20 Jun 2026', risk: 'high' },
  { id: 'return-filed', label: 'Return Filed', status: 'pending', owner: 'Super Admin', due: '20 Jun 2026', risk: 'high' },
]

function makeAuditEvent(type, title, detail, meta = {}) {
  return {
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ts: new Date().toISOString(),
    type,
    title,
    detail,
    actor: meta.actor ?? 'Demo User',
    role: meta.role ?? null,
    severity: meta.severity ?? 'info',
    module: meta.module ?? 'System',
  }
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      /* ── Company ── */
      companies: MOCK_COMPANIES,
      activeCompany: MOCK_COMPANIES[0],
      activeDepartment: MOCK_COMPANIES[0].departments[0],
      activeZone: MOCK_COMPANIES[0].zones[0],
      setActiveCompany: (company) => set({ activeCompany: company }),
      setCompanyContext: ({ company, department, zone }) => set((state) => {
        const nextCompany = company ?? state.activeCompany
        const nextDepartment = department ?? state.activeDepartment ?? nextCompany?.departments?.[0]
        const nextZone = zone ?? state.activeZone ?? nextCompany?.zones?.[0]
        return {
          activeCompany: nextCompany,
          activeDepartment: nextDepartment,
          activeZone: nextZone,
        }
      }),
      setActiveDepartment: (activeDepartment) => set({ activeDepartment }),
      setActiveZone: (activeZone) => set({ activeZone }),
      addCompanyDepartment: (department) => set((state) => {
        const value = department.trim()
        if (!value || !state.activeCompany) return {}
        const departments = state.activeCompany.departments ?? []
        if (departments.includes(value)) return { activeDepartment: value }
        const activeCompany = { ...state.activeCompany, departments: [...departments, value] }
        return {
          activeCompany,
          activeDepartment: value,
          companies: state.companies.map(company => company.id === activeCompany.id ? activeCompany : company),
        }
      }),
      addCompanyZone: (zone) => set((state) => {
        const value = zone.trim()
        if (!value || !state.activeCompany) return {}
        const zones = state.activeCompany.zones ?? []
        if (zones.includes(value)) return { activeZone: value }
        const activeCompany = { ...state.activeCompany, zones: [...zones, value] }
        return {
          activeCompany,
          activeZone: value,
          companies: state.companies.map(company => company.id === activeCompany.id ? activeCompany : company),
        }
      }),
      addCompany: (draft) => set((state) => {
        const company = buildCompanyRecord(draft)
        return {
          companies: [...state.companies, company],
          activeCompany: company,
          activeDepartment: company.departments?.[0] ?? 'Accounts',
          activeZone: company.zones?.[0] ?? 'Default',
        }
      }),

      /* ── Financial Year ── */
      financialYear: defaultFYYear,          // e.g. 2024 → FY 2024-25
      setFinancialYear: (year) => set({ financialYear: year }),

      /* ── Period (used by period-aware pages) ── */
      period: {
        mode: 'year',
        from: defaultFYRange.from,
        to:   defaultFYRange.to,
      },
      setPeriod: (period) => set({ period }),

      /* ── Theme ── */
      theme: defaultTheme,
      setTheme: (theme) => {
        try {
          localStorage.setItem('ut-theme', theme)
        } catch {
          /* localStorage can be unavailable in private/embedded contexts */
        }
        applyTheme(theme)
        set({ theme })
      },

      /* ── Language (i18n) ── */
      language: defaultLanguage,
      setLanguage: (language) => {
        try {
          localStorage.setItem('ut-lang', language)
        } catch {
          /* localStorage can be unavailable in private/embedded contexts */
        }
        i18n.changeLanguage(language)
        set({ language })
      },

      /* ── RBAC (frontend mock) ── */
      currentRole: 'Super Admin',
      setCurrentRole: (currentRole) => set({ currentRole }),
      permissionOverrides: {},                       // { sectionId: { role: level } }
      setPermission: (sectionId, role, level) => {
        get().recordAudit('rbac', 'Permission changed', `${role} access for ${sectionId} changed to ${level}.`, { module: 'Settings' })
        set((state) => ({
          permissionOverrides: {
            ...state.permissionOverrides,
            [sectionId]: { ...(state.permissionOverrides[sectionId] ?? {}), [role]: level },
          },
        }))
      },
      resetPermissions: () => {
        get().recordAudit('rbac', 'Permissions reset', 'Permission matrix reset to defaults.', { module: 'Settings', severity: 'warning' })
        set({ permissionOverrides: {} })
      },

      /* ── Audit trail (frontend mock) ── */
      auditEvents: [],
      recordAudit: (type, title, detail, meta = {}) => set((state) => ({
        auditEvents: [
          makeAuditEvent(type, title, detail, { ...meta, role: state.currentRole }),
          ...state.auditEvents,
        ].slice(0, 100),
      })),

      /* ── Compliance pipeline (frontend mock) ── */
      compliancePipeline: DEFAULT_COMPLIANCE_PIPELINE,
      runComplianceAction: (stepId) => set((state) => {
        const next = state.compliancePipeline.map((step, index, all) => {
          if (step.id === stepId) return { ...step, status: 'done', risk: 'low', completedAt: new Date().toISOString() }
          const prevDone = all[index - 1]?.id === stepId
          if (prevDone && step.status === 'pending') return { ...step, status: 'ready' }
          if (prevDone && step.status === 'blocked') return { ...step, status: 'ready' }
          return step
        })
        return { compliancePipeline: next }
      }),
      resetCompliancePipeline: () => set({ compliancePipeline: DEFAULT_COMPLIANCE_PIPELINE }),

      /* ── Import jobs (frontend mock) ── */
      importJobs: [],
      addImportJob: (job) => set((state) => ({
        importJobs: [{ id: `IMP-${Date.now()}`, createdAt: new Date().toISOString(), ...job }, ...state.importJobs].slice(0, 20),
      })),

      /* ── Setup completion (frontend mock) ── */
      completedSetupActions: [],
      markSetupAction: (id) => set((state) => ({
        completedSetupActions: state.completedSetupActions.includes(id)
          ? state.completedSetupActions
          : [...state.completedSetupActions, id],
      })),

      /* ── Integrations (frontend mock) ── */
      integrations: {},                              // { id: { status, lastSync, apiKey } }
      connectIntegration: (id, creds = {}) => {
        get().recordAudit('integration', 'Integration connected', `${id} connected with mock credentials.`, { module: 'Integrations' })
        set((state) => ({
          integrations: {
            ...state.integrations,
            [id]: { status: 'connected', lastSync: new Date().toISOString(), apiKey: creds.apiKey ?? null },
          },
        }))
      },
      disconnectIntegration: (id) => {
        get().recordAudit('integration', 'Integration disconnected', `${id} disconnected.`, { module: 'Integrations', severity: 'warning' })
        set((state) => ({
          integrations: { ...state.integrations, [id]: { status: 'disconnected', lastSync: null, apiKey: null } },
        }))
      },
      syncIntegration: (id) => {
        get().recordAudit('integration', 'Integration synced', `${id} synced mock data.`, { module: 'Integrations' })
        set((state) => ({
          integrations: {
            ...state.integrations,
            [id]: { ...(state.integrations[id] ?? {}), status: 'connected', lastSync: new Date().toISOString() },
          },
        }))
      },

      /* ── Sidebar / nav state ── */
      activeSection: 'dashboard',
      setActiveSection: (id) => set({ activeSection: id }),
    }),
    {
      name: 'ut-accounting-store',
      partialize: (s) => ({
        companies:           s.companies,
        activeCompany:       s.activeCompany,
        activeDepartment:    s.activeDepartment,
        activeZone:          s.activeZone,
        financialYear:       s.financialYear,
        theme:               s.theme,
        language:            s.language,
        currentRole:         s.currentRole,
        permissionOverrides: s.permissionOverrides,
        integrations:        s.integrations,
        auditEvents:         s.auditEvents,
        compliancePipeline:  s.compliancePipeline,
        importJobs:          s.importJobs,
        completedSetupActions: s.completedSetupActions,
      }),
    }
  )
)
