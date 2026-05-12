// =============================================================================
// Common / shared domain primitives
//
// These types are referenced across all domain models. Keeping them here
// prevents circular imports and provides a single place to evolve shared
// vocabulary (e.g. adding a new Territory when James Blinds expands).
// =============================================================================

// Territory codes matching James Blinds' operational regions.
// These appear as sheet names (OH, IN, NC, ORL) in the Projects workbook.
export type Territory = 'OH' | 'IN' | 'NC' | 'ORL' | 'OTHER'

export const TERRITORY_LABELS: Record<Territory, string> = {
  OH:    'Ohio',
  IN:    'Indiana',
  NC:    'North Carolina',
  ORL:   'Orlando / FL',
  OTHER: 'Other',
}

// Unified priority — used across projects, tasks, installations
export type Priority = 'low' | 'normal' | 'high' | 'urgent'

// Tracks where a record originated.
// Critical for the migration path: Excel → Supabase.
// Lets us query "what still lives only in spreadsheets?"
export type DataSource =
  | 'projects_workbook'      // James Blinds Projects.xlsx
  | 'measure_order_list'     // Measure_Order List.xlsx
  | 'invoiceables_workbook'  // 2026 Invoiceables.xlsx
  | 'manual'                 // Entered directly in Mission Control
  | 'supabase'               // Canonical Supabase record (future)

// Billing month enum for invoice period tracking
export type BillingMonth = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun'
                         | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec'

export const BILLING_MONTH_LABELS: Record<BillingMonth, string> = {
  jan: 'January', feb: 'February', mar: 'March',    apr: 'April',
  may: 'May',     jun: 'June',     jul: 'July',      aug: 'August',
  sep: 'September', oct: 'October', nov: 'November', dec: 'December',
}

// Reusable parse helpers — used by adapters to safely coerce Excel values
export function parseNumber(val: unknown): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  if (typeof val === 'string') {
    const cleaned = val.replace(/[$,%\s]/g, '')
    const n = parseFloat(cleaned)
    return isNaN(n) ? 0 : n
  }
  return 0
}

export function parsePercent(val: unknown): number {
  const n = parseNumber(val)
  // Spreadsheets may store as 0-1 or 0-100; normalize to 0-100
  return n <= 1 && n > 0 ? Math.round(n * 100) : n
}

export function parseBoolean(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase()
    return v === 'yes' || v === 'y' || v === 'true' || v === '1' || v === 'x'
  }
  return Boolean(val)
}

export function parseDate(val: unknown): string | undefined {
  if (!val) return undefined
  if (typeof val === 'string' && val.trim()) return val.trim()
  if (val instanceof Date) return val.toISOString().split('T')[0]
  // Excel serial date numbers
  if (typeof val === 'number' && val > 40000) {
    const d = new Date((val - 25569) * 86400 * 1000)
    return d.toISOString().split('T')[0]
  }
  return undefined
}
