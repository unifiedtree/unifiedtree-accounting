import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import SideNav              from './SideNav'
import TabPanel             from './TabPanel'
import CommandPalette       from '../ui/CommandPalette'
import QuickCreateFAB       from '../ui/QuickCreateFAB'
import ToastContainer       from '../ui/Toast'
import AIAssistantPanel     from '../ai/AIAssistantPanel'
import NotificationsPanel   from '../notifications/NotificationsPanel'
import HelpPanel            from '../help/HelpPanel'

/**
 * AppShell — root layout shell.
 *
 * Panels managed here (single source of truth for open/close):
 *  • Command palette  — Ctrl+K
 *  • AI assistant     — Ctrl+Shift+A  |  floating "Ask AI" button
 *  • Notifications    — Bell icon in SideNav bottom bar
 *  • Help             — HelpCircle icon in SideNav bottom bar
 *
 * Only one right-side panel can be open at a time.
 */
export default function AppShell() {
  const location = useLocation()

  const [paletteOpen, setPaletteOpen]  = useState(false)
  const [aiOpen,      setAiOpen]       = useState(false)
  const [notiOpen,    setNotiOpen]     = useState(false)
  const [helpOpen,    setHelpOpen]     = useState(false)
  const [fabOpen,     setFabOpen]      = useState(false)

  // Ensure only one right panel open at a time
  function openAI()    { setAiOpen(true);   setNotiOpen(false); setHelpOpen(false) }
  function openNoti()  { setNotiOpen(true);  setAiOpen(false);  setHelpOpen(false) }
  function openHelp()  { setHelpOpen(true);  setAiOpen(false);  setNotiOpen(false) }

  const openPalette  = useCallback(() => setPaletteOpen(true),  [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); setPaletteOpen(prev => !prev)
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault(); setAiOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false); setAiOpen(false)
        setNotiOpen(false);    setHelpOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const anyPanelOpen = aiOpen || notiOpen || helpOpen

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* ── Left sidebar ── */}
      <SideNav
        onSearch={openPalette}
        onNotifications={openNoti}
        onHelp={openHelp}
      />

      {/* ── Right column ── */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <TabPanel />

        <main style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: 'var(--bg)',
        }}>
          <div key={location.key} className="p-6 page-enter">
            <Outlet />
          </div>
        </main>

      </div>

      {/* ── Right panels (mutually exclusive) ── */}
      <AIAssistantPanel   open={aiOpen}   onClose={() => setAiOpen(false)}   />
      <NotificationsPanel open={notiOpen} onClose={() => setNotiOpen(false)} />
      <HelpPanel          open={helpOpen} onClose={() => setHelpOpen(false)} onOpenAI={openAI} />

      {/* ── Command palette ── */}
      <CommandPalette open={paletteOpen} onClose={closePalette} />

      {/* ── Quick Create FAB — always visible unless panel open ── */}
      <QuickCreateFAB hidden={anyPanelOpen} onOpenChange={setFabOpen} />

      {/* ── Ask AI pill — sits above FAB (hidden while FAB speed-dial open) ── */}
      {!anyPanelOpen && !fabOpen && (
        <button
          onClick={openAI}
          title="AI Assistant (Ctrl+Shift+A)"
          style={{
            position: 'fixed',
            bottom: 100,   /* 24 FAB bottom + 56 FAB + 20 gap */
            right: 24,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 36,
            padding: '0 14px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(15,110,86,0.40)',
            transition: 'transform 150ms ease, box-shadow 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform  = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,110,86,0.52)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform  = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,110,86,0.40)'
          }}
        >
          <Sparkles size={13} />
          Ask AI
        </button>
      )}

      {/* ── Toast notifications ── */}
      <ToastContainer />
    </div>
  )
}
