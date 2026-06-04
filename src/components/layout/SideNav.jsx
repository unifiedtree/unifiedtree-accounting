import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  TreePine, Search, Bell, HelpCircle, Settings,
  Building2, SlidersHorizontal, CalendarDays, ShieldCheck,
  Plug, BellDot, ScrollText, ChevronRight,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import sections from '../../config/sections'
import { useCan } from '../../hooks/useCan'
import CompanySwitcher from './CompanySwitcher'

const SETTINGS_ITEMS = [
  { id: 'company-profile', label: 'Company Profile', icon: Building2 },
  { id: 'configuration', label: 'Configuration', icon: SlidersHorizontal },
  { id: 'fiscal-periods', label: 'Fiscal Periods', icon: CalendarDays },
  { id: 'roles', label: 'Roles & Users', icon: ShieldCheck },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'notifications', label: 'Notifications', icon: BellDot },
  { id: 'audit-logs', label: 'Audit & Logs', icon: ScrollText },
]

const PRIMARY_IDS = [
  'dashboard',
  'parties',
  'inventory',
  'sales',
  'procurement',
  'receivables',
  'payables',
  'expenses',
  'cashbank',
  'tax',
  'reports',
  'advanced-features',
]

const ADVANCED_FEATURE_IDS = new Set([
  'masters',
  'assets',
  'business-tools',
  'party-tools',
  'item-tools',
  'storage',
  'alerts',
  'migration',
])

const SIMPLE_LABELS = {
  procurement: 'Purchases',
  receivables: 'Money In',
  payables: 'Money Out',
  parties: 'Parties',
  inventory: 'Items',
  cashbank: 'Cash & Bank',
  tax: 'GST',
  'advanced-features': 'Advanced Features',
}

const byId = Object.fromEntries(sections.map(section => [section.id, section]))
const PRIMARY_SECTIONS = PRIMARY_IDS.map(id => byId[id]).filter(Boolean)

export default function SideNav({ onSearch, onNotifications, onHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const can = useCan()

  const activeSectionId = location.pathname.split('/')[1] || 'dashboard'
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ bottom: 0, left: 10 })
  const settingsRef = useRef(null)
  const settingsBtnRef = useRef(null)

  useEffect(() => {
    if (!settingsOpen) return
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [settingsOpen])

  function toggleSettings() {
    if (settingsBtnRef.current) {
      const r = settingsBtnRef.current.getBoundingClientRect()
      setPopoverPos({ bottom: window.innerHeight - r.top + 8, left: 10 })
    }
    setSettingsOpen(o => !o)
  }

  function goToSection(section) {
    navigate(`/${section.id}/${section.tabs[0].id}`)
  }

  const primaryItems = PRIMARY_SECTIONS.filter(section => can('view', section.id))

  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--nav)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          height: 56,
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TreePine size={16} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            UnifiedTree
          </p>
          <p style={{ fontSize: 10, color: 'var(--nav-text)', opacity: 0.45, marginTop: 2, lineHeight: 1 }}>
            Accounting
          </p>
        </div>
      </div>

      <div style={{ padding: '10px 10px 8px', flexShrink: 0 }}>
        <button
          onClick={onSearch}
          className="flex h-8 w-full items-center gap-2 rounded-lg px-3 text-xs transition-all duration-150 hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', color: 'var(--nav-text)' }}
        >
          <Search size={13} style={{ opacity: 0.5 }} />
          <span style={{ flex: 1, textAlign: 'left', opacity: 0.45, fontSize: 12 }}>{t('shell.searchPlaceholder')}</span>
          <kbd
            style={{
              fontSize: 9,
              opacity: 0.3,
              fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 5px',
              borderRadius: 4,
            }}
          >
            Ctrl K
          </kbd>
        </button>
      </div>

      <nav
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '2px 8px 12px',
        }}
      >
        <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--nav-text)] opacity-35">
          Main Menu
        </p>

        {primaryItems.map((section) => {
          const Icon = section.icon
          const isActive = activeSectionId === section.id
            || (section.id === 'advanced-features' && ADVANCED_FEATURE_IDS.has(activeSectionId))
          const label = SIMPLE_LABELS[section.id] ?? section.label

          return (
            <button
              key={section.id}
              onClick={() => goToSection(section)}
              title={label}
              className={cn(
                'mb-1 flex w-full items-center gap-2.5 rounded-lg text-left transition-all duration-150',
                isActive ? 'text-white' : 'text-[var(--nav-text)] hover:bg-white/[0.07] hover:text-white'
              )}
              style={{
                padding: '8px 10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 700 : 550,
                background: isActive ? 'var(--primary)' : 'transparent',
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.85} style={{ flexShrink: 0 }} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
            </button>
          )
        })}
      </nav>

      <div
        style={{
          flexShrink: 0,
          padding: '10px 10px 12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            title="Notifications"
            onClick={onNotifications}
            className="flex h-8 flex-1 items-center justify-center rounded-lg transition-all duration-150 hover:bg-white/10"
            style={{ border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--nav-text)', opacity: 0.5 }}
          >
            <Bell size={15} />
          </button>

          <button
            title="Help"
            onClick={onHelp}
            className="flex h-8 flex-1 items-center justify-center rounded-lg transition-all duration-150 hover:bg-white/10"
            style={{ border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--nav-text)', opacity: 0.5 }}
          >
            <HelpCircle size={15} />
          </button>

          <div ref={settingsRef} style={{ flex: 1 }}>
            {settingsOpen && (
              <div
                style={{
                  position: 'fixed',
                  bottom: popoverPos.bottom,
                  left: popoverPos.left,
                  width: 220,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
                  overflow: 'hidden',
                  animation: 'settingsUp 150ms cubic-bezier(0.16,1,0.3,1) both',
                  zIndex: 9999,
                }}
              >
                <div
                  style={{
                    padding: '8px 12px 6px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Settings size={11} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)' }}>
                    {t('shell.settings')}
                  </span>
                </div>

                {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => {
                  const active = location.pathname.startsWith(`/settings/${id}`)
                  return (
                    <button
                      key={id}
                      onClick={() => { navigate(`/settings/${id}`); setSettingsOpen(false) }}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors',
                        active ? 'bg-[var(--primary-tint)] text-[var(--primary)]' : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                      )}
                      style={{ border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 400 }}
                    >
                      <Icon size={13} style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }} />
                      <span style={{ flex: 1 }}>{t(`shell.settingsItems.${id}`, label)}</span>
                      {active && <ChevronRight size={11} style={{ opacity: 0.5 }} />}
                    </button>
                  )
                })}
              </div>
            )}

            {can('view', 'settings') && (
              <button
                ref={settingsBtnRef}
                title={t('shell.settings')}
                onClick={toggleSettings}
                className="flex h-8 w-full items-center justify-center rounded-lg transition-all duration-150 hover:bg-white/10"
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  background: settingsOpen ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: 'var(--nav-text)',
                  opacity: settingsOpen ? 1 : 0.5,
                }}
              >
                <Settings size={15} />
              </button>
            )}
          </div>
        </div>
        <CompanySwitcher />
      </div>

      <style>{`
        @keyframes settingsUp {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </aside>
  )
}
