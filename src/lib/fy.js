/**
 * Financial Year helpers — India: Apr–Mar, quarters Q1=Apr–Jun etc.
 * All functions use native Date or date-fns.
 */
import {
  startOfMonth, endOfMonth,
  format, parseISO, isWithinInterval,
  getMonth, getYear,
} from 'date-fns'

/**
 * Given any date, return the FY label it belongs to.
 * e.g. new Date('2024-07-01') → "FY 2024-25"
 */
export function getFYLabel(date = new Date()) {
  const d = date instanceof Date ? date : parseISO(date)
  const month = getMonth(d) // 0-indexed; 3 = April
  const year = getYear(d)
  const fyStart = month >= 3 ? year : year - 1
  return `FY ${fyStart}-${String(fyStart + 1).slice(-2)}`
}

/**
 * Return { from, to } Date objects for a full FY.
 * fyYear = the year the FY starts (e.g. 2024 for FY 2024-25).
 */
export function fyRange(fyYear) {
  return {
    from: new Date(fyYear, 3, 1),      // Apr 1
    to:   new Date(fyYear + 1, 2, 31), // Mar 31
  }
}

/**
 * Current FY start year based on today.
 */
export function currentFYYear(date = new Date()) {
  const month = getMonth(date)
  const year = getYear(date)
  return month >= 3 ? year : year - 1
}

/**
 * Quarters for a given FY start year.
 * Returns array of { label, quarter, from, to }
 */
export function fyQuarters(fyYear) {
  return [
    { label: 'Q1', quarter: 1, from: new Date(fyYear, 3, 1),  to: new Date(fyYear, 5, 30)  }, // Apr–Jun
    { label: 'Q2', quarter: 2, from: new Date(fyYear, 6, 1),  to: new Date(fyYear, 8, 30)  }, // Jul–Sep
    { label: 'Q3', quarter: 3, from: new Date(fyYear, 9, 1),  to: new Date(fyYear, 11, 31) }, // Oct–Dec
    { label: 'Q4', quarter: 4, from: new Date(fyYear + 1, 0, 1), to: new Date(fyYear + 1, 2, 31) }, // Jan–Mar
  ]
}

/**
 * Which quarter does a date belong to (within an FY)?
 * Returns 1–4 or null if outside FY.
 */
export function getQuarter(date, fyYear) {
  const d = date instanceof Date ? date : parseISO(date)
  const quarters = fyQuarters(fyYear)
  for (const q of quarters) {
    if (isWithinInterval(d, { start: q.from, end: q.to })) return q.quarter
  }
  return null
}

/**
 * Build a date range from a PeriodSelector value.
 * mode: 'month' | 'quarter' | 'half' | 'year' | 'custom'
 */
export function periodRange(mode, value, fyYear) {
  fyYear = fyYear ?? currentFYYear()
  switch (mode) {
    case 'month': {
      // value = Date (first of month)
      const d = value instanceof Date ? value : parseISO(value)
      return { from: startOfMonth(d), to: endOfMonth(d) }
    }
    case 'quarter': {
      // value = 1–4
      const qs = fyQuarters(fyYear)
      return qs[value - 1] ?? fyRange(fyYear)
    }
    case 'half': {
      // value = 1 (H1 Apr–Sep) or 2 (H2 Oct–Mar)
      if (value === 1) return { from: new Date(fyYear, 3, 1),     to: new Date(fyYear, 8, 30)  }
      return              { from: new Date(fyYear, 9, 1),     to: new Date(fyYear + 1, 2, 31) }
    }
    case 'year':
      return fyRange(fyYear)
    case 'custom':
      return { from: value.from, to: value.to }
    default:
      return fyRange(fyYear)
  }
}

/**
 * List of months in a FY (Apr → Mar), each as { label, date }.
 */
export function fyMonths(fyYear) {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(fyYear, 3 + i, 1)
    return { label: format(d, 'MMM yyyy'), date: d }
  })
}

/**
 * Format date range as readable label.
 */
export function formatRange(from, to) {
  if (!from || !to) return ''
  return `${format(from, 'd MMM yyyy')} – ${format(to, 'd MMM yyyy')}`
}
