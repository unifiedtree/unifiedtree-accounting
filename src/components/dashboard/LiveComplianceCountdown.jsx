import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, ChevronRight, AlertTriangle } from 'lucide-react'

/* Deadlines expressed as hours from now (demo data) */
const DEADLINES = [
  { label: 'GSTR-1 Dec',       category: 'GST', hoursFromNow: 11 * 24 + 4,   href: '/tax/gst-returns'    },
  { label: 'TDS Q3 Deposit',   category: 'TDS', hoursFromNow: 18 * 24 + 9,   href: '/tax/tds'            },
  { label: 'GSTR-3B Dec',      category: 'GST', hoursFromNow: 21 * 24 + 2,   href: '/tax/gst-returns'    },
  { label: 'Advance Tax Q3',   category: 'ADV', hoursFromNow: 34 * 24 + 14,  href: '/tax/tax-payments'   },
]

function tokenCfg(secs) {
  const days = Math.floor(secs / 86400)
  if (days <= 3)  return { color: 'var(--neg)',  bg: 'var(--neg-tint)',  ring: '#EF4444', urgent: true  }
  if (days <= 10) return { color: 'var(--warn)', bg: 'var(--warn-tint)', ring: '#F59E0B', urgent: false }
  return               { color: 'var(--pos)',  bg: 'var(--pos-tint)',  ring: '#22C55E', urgent: false }
}

function decompose(secs) {
  return {
    d: Math.floor(secs / 86400),
    h: Math.floor((secs % 86400) / 3600),
    m: Math.floor((secs % 3600) / 60),
    s: secs % 60,
  }
}

function pad(n) { return String(n).padStart(2, '0') }

export default function LiveComplianceCountdown() {
  const navigate = useNavigate()

  /* compute target timestamps once, then tick every second */
  const [targets] = useState(() => {
    const now = Date.now()
    return DEADLINES.map(d => now + d.hoursFromNow * 3_600_000)
  })

  const calc = () => targets.map(t => Math.max(0, Math.floor((t - Date.now()) / 1000)))
  const [remaining, setRemaining] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setRemaining(calc()), 1000)
    return () => clearInterval(id)
  }, [targets])

  return (
    <div
      className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5 flex flex-col"
      style={{ boxShadow: 'var(--shadow)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock size={13} style={{ color: 'var(--primary)' }} />
        <span className="text-sm font-bold text-[var(--text)]">Live Compliance Countdown</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold" style={{ color: 'var(--pos)' }}>
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: 'var(--pos)', animation: 'pulse 1.5s infinite' }}
          />
          Live
        </span>
      </div>

      {/* Deadline rows */}
      <div className="space-y-2.5">
        {DEADLINES.map((dl, i) => {
          const secs = remaining[i]
          const tc   = tokenCfg(secs)
          const { d, h, m, s } = decompose(secs)

          return (
            <button
              key={dl.label}
              onClick={() => navigate(dl.href)}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all hover:shadow-sm active:scale-[0.99]"
              style={{ background: tc.bg, borderColor: tc.ring + '40' }}
            >
              {/* Category badge */}
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: tc.color, color: '#fff' }}
              >
                {dl.category}
              </span>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text)] mb-1">{dl.label}</p>

                {/* Ticking units */}
                <div className="flex items-baseline gap-1.5">
                  {d > 0 && <Unit v={d} u="d" color={tc.color} />}
                  <Unit v={h} u="h" color={tc.color} />
                  <Unit v={m} u="m" color={tc.color} />
                  <Unit v={s} u="s" color={tc.color} />
                </div>
              </div>

              {tc.urgent && (
                <AlertTriangle size={13} style={{ color: tc.color, flexShrink: 0 }} />
              )}
              <ChevronRight size={12} style={{ color: tc.color, opacity: 0.6, flexShrink: 0 }} />
            </button>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

function Unit({ v, u, color }) {
  return (
    <span className="flex items-baseline gap-0.5">
      <span className="text-sm font-black tabular" style={{ color }}>{pad(v)}</span>
      <span className="text-[9px] font-medium" style={{ color, opacity: 0.65 }}>{u}</span>
    </span>
  )
}
