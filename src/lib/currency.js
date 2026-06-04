/**
 * Indian Rupee formatting (en-IN locale, lakh/crore grouping).
 * Always use these helpers — never format ₹ inline.
 */

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const INR_NO_DECIMAL = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const NUM_IN = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Format as ₹ with 2 decimal places.
 * e.g. 1234567.5 → "₹12,34,567.50"
 */
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—'
  return INR.format(value)
}

/**
 * Format as ₹ with no decimals (for large rounded numbers).
 */
export function formatCurrencyWhole(value) {
  if (value == null || isNaN(value)) return '—'
  return INR_NO_DECIMAL.format(value)
}

/**
 * Format number with en-IN grouping (no ₹ symbol).
 */
export function formatNumber(value) {
  if (value == null || isNaN(value)) return '—'
  return NUM_IN.format(value)
}

/**
 * Compact notation: ₹1.2L, ₹3.4Cr etc.
 */
export function formatCompact(value) {
  if (value == null || isNaN(value)) return '—'
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)}L`
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`
  return `${sign}₹${abs.toFixed(2)}`
}

/**
 * Parse a string like "12,34,567.50" → number.
 */
export function parseCurrency(str) {
  if (!str) return 0
  return parseFloat(String(str).replace(/[₹,\s]/g, '')) || 0
}
