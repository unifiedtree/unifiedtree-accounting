import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Globe, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/cn'
import sections from '../../config/sections'
import { useAppStore } from '../../store/useAppStore'
import { ROLES } from '../../config/permissions'
import AIInsightStrip from '../ai/AIInsightStrip'
import SetupProgressTrigger from '../dashboard/SetupProgressTrigger'

/**
 * TabPanel — horizontal sub-tab strip rendered at the top of the content area.
 * Shows the active section's tabs as pill buttons.
 * Hidden when the section has only one tab (nothing to switch between).
 */
export default function TabPanel() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t }    = useTranslation()

  const language       = useAppStore(s => s.language)
  const setLanguage    = useAppStore(s => s.setLanguage)
  const currentRole    = useAppStore(s => s.currentRole)
  const setCurrentRole = useAppStore(s => s.setCurrentRole)
  const theme          = useAppStore(s => s.theme)
  const setTheme       = useAppStore(s => s.setTheme)
  const systemDark     = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const isDark         = theme === 'dark' || (theme === 'system' && systemDark)
  const toggleTheme    = () => setTheme(isDark ? 'light' : 'dark')

  const parts     = location.pathname.split('/')
  const sectionId = parts[1] || 'dashboard'
  const tabId     = parts[2]

  const section = sections.find(s => s.id === sectionId)
  const isSettings = sectionId === 'settings'
  const showTabs = section && section.tabs.length > 1
  const visibleTabs = useMemo(() => section?.tabs ?? [], [section])

  if (!section && !isSettings) return null

  return (
    <div
      style={{
        flexShrink: 0,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 0 0 var(--border)',
      }}
    >
      {/* Section title row */}
      <div style={{
        padding: '12px 20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <h2 style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1,
          margin: 0,
        }}>
          {section ? t(`nav.${section.id}`, section.label) : t('shell.settings')}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <AIInsightStrip inline />
          <SetupProgressTrigger />

          {/* Role switcher (demo control for RBAC) */}
          <label
            title={t('shell.role')}
            className="flex items-center gap-1 h-7 px-2 rounded-lg"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <ShieldCheck size={12} style={{ color: 'var(--faint)' }} />
            <select
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value)}
              aria-label={t('shell.role')}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', cursor: 'pointer' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>

          {/* Language switcher */}
          <label
            title={t('shell.language')}
            className="flex items-center gap-1 h-7 px-2 rounded-lg"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <Globe size={12} style={{ color: 'var(--faint)' }} />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              aria-label={t('shell.language')}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-[var(--surface-2)]"
            style={{ color: 'var(--faint)', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--muted)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--faint)' }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Tab strip — horizontally scrollable */}
      {showTabs && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px 0',
            gap: 2,
            overflowX: 'auto',
            scrollbarWidth: 'none',      /* hide scrollbar on Firefox */
          }}
          className="hide-scrollbar"
        >
          {visibleTabs.map((tab) => {
            const active = tab.id === tabId
            return (
              <button
                key={tab.id}
                onClick={() => navigate(`/${sectionId}/${tab.id}`)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap text-sm font-medium transition-all duration-150',
                  'px-3 py-2 rounded-t-lg border-b-2 -mb-px',
                  active
                    ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-tint)]'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                )}
                style={{
                  background: active ? 'var(--primary-tint)' : 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
