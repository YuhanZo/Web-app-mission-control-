// =============================================================================
// Invoiceables Workbook Adapter
//
// Source: 2026 Invoiceables.xlsx
// Sheets: January 2026 … December 2026, Reconciliations, Onboard, Job Codes
//
// This adapter is the only place that knows about Excel billing column names.
//
// Key normalizations:
//   "Bill Due Date"              → billDueDate
//   "Territory"                  → territory
//   "GC"                         → generalContractor
//   "Job Number"                 → projectNumber
//   "Job Name"                   → projectName
//   "Description of Billing"     → billingDescription
//   "Original Contract"          → originalContract
//   "Approved CO Total"          → approvedChangeOrderTotal
//   "Total Contract"             → totalContract
//   "Estimated Material Cost"    → estimatedMaterialCost
//   "Estimated Labor Total Cost" → estimatedLaborCost
//   "Percent Complete"           → percentComplete
//   "Previous Billed Amount"     → previousBilledAmount
//   "Bill This Month"            → currentBillingAmount  ← key normalization
//   "Sent to Customer"           → sentToCustomer
//   "QBO Invoice Number"         → qboInvoiceNumber
//   "Remaining"                  → remainingAmount
// =============================================================================

import type { Invoice, InvoiceStatus } from '../domain/types/invoice'
import type { Territory, BillingMonth } from '../domain/types/common'
import { parseNumber, parsePercent, parseBoolean, parseDate } from '../domain/types/common'

// ---------------------------------------------------------------------------
// Raw row shape — exact Excel column headers from 2026 Invoiceables.xlsx
// ---------------------------------------------------------------------------
export interface RawInvoiceRow {
  'Bill Due Date'?:              string | number
  'Territory'?:                  string
  'GC'?:                         string
  'Job Number'?:                 string | number
  'Job Name'?:                   string
  'Description of Billing'?:     string
  'Original Contract'?:          string | number
  'Approved CO Total'?:          string | number
  'Total Contract'?:             string | number
  'Estimated Material Cost'?:    string | number
  'Estimated Labor Total Cost'?: string | number
  'Percent Complete'?:           string | number
  'Previous Billed Amount'?:     string | number
  'Bill This Month'?:            string | number
  'Sent to Customer'?:           string | boolean
  'QBO Invoice Number'?:         string | number
  'Remaining'?:                  string | number
}

// ---------------------------------------------------------------------------
// Normalize territory string to canonical Territory type
// ---------------------------------------------------------------------------
const TERRITORY_MAP: Record<string, Territory> = {
  oh: 'OH', ohio: 'OH',
  in: 'IN', indiana: 'IN',
  nc: 'NC', 'north carolina': 'NC',
  orl: 'ORL', orlando: 'ORL', fl: 'ORL', florida: 'ORL',
}

function mapTerritory(raw: string | undefined): Territory {
  if (!raw) return 'OTHER'
  return TERRITORY_MAP[raw.toLowerCase().trim()] ?? 'OTHER'
}

// ---------------------------------------------------------------------------
// Derive invoice status from available data
// ---------------------------------------------------------------------------
function deriveInvoiceStatus(row: RawInvoiceRow): InvoiceStatus {
  if (parseBoolean(row['Sent to Customer'])) {
    return row['QBO Invoice Number'] ? 'sent' : 'sent'
  }
  const billingAmount = parseNumber(row['Bill This Month'])
  if (billingAmount > 0) return 'ready_to_bill'
  return 'draft'
}

let _invoiceCounter = 0

// ---------------------------------------------------------------------------
// Main transform function — one Excel row → one Invoice domain object
// ---------------------------------------------------------------------------
export function adaptInvoiceRow(
  raw: RawInvoiceRow,
  billingYear: number,
  billingMonth: BillingMonth,
  rowIndex: number
): Invoice | null {
  // Skip rows without a project name or any billing amount
  const projectName = raw['Job Name']?.trim()
  if (!projectName) return null

  const originalContract       = parseNumber(raw['Original Contract'])
  const approvedChangeOrderTotal = parseNumber(raw['Approved CO Total'])
  const totalContract          = parseNumber(raw['Total Contract']) || (originalContract + approvedChangeOrderTotal)
  const estimatedMaterialCost  = parseNumber(raw['Estimated Material Cost'])
  const estimatedLaborCost     = parseNumber(raw['Estimated Labor Total Cost'])
  const previousBilledAmount   = parseNumber(raw['Previous Billed Amount'])
  const currentBillingAmount   = parseNumber(raw['Bill This Month'])
  const totalBilledToDate      = previousBilledAmount + currentBillingAmount
  const remainingAmount        = parseNumber(raw['Remaining']) || (totalContract - totalBilledToDate)

  const projectNumber = raw['Job Number']
    ? String(raw['Job Number']).trim()
    : `IMPORT-${billingYear}-${String(++_invoiceCounter).padStart(3, '0')}`

  return {
    id: `inv-${billingYear}-${billingMonth}-${String(++_invoiceCounter).padStart(4, '0')}`,
    projectId: projectNumber.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    projectNumber,
    projectName,
    territory:             mapTerritory(raw['Territory']),
    generalContractor:     raw['GC'] ?? undefined,
    billingYear,
    billingMonth,
    billDueDate:           parseDate(raw['Bill Due Date']),
    originalContract,
    approvedChangeOrderTotal,
    totalContract,
    estimatedMaterialCost,
    estimatedLaborCost,
    estimatedTotalCost:    estimatedMaterialCost + estimatedLaborCost,
    percentComplete:       parsePercent(raw['Percent Complete']),
    previousBilledAmount,
    currentBillingAmount,
    totalBilledToDate,
    remainingAmount,
    billingDescription:    raw['Description of Billing'],
    status:                deriveInvoiceStatus(raw),
    sentToCustomer:        parseBoolean(raw['Sent to Customer']),
    qboInvoiceNumber:      raw['QBO Invoice Number'] ? String(raw['QBO Invoice Number']) : undefined,
    source:                'invoiceables_workbook',
    sourceRowRef:          `invoiceables_workbook:${billingMonth}_${billingYear}:row_${rowIndex}`,
  }
}

// ---------------------------------------------------------------------------
// Batch transform — process a full monthly sheet
// ---------------------------------------------------------------------------
export function adaptInvoiceSheet(
  rows: RawInvoiceRow[],
  billingYear: number,
  billingMonth: BillingMonth
): Invoice[] {
  return rows
    .map((row, i) => adaptInvoiceRow(row, billingYear, billingMonth, i + 2))
    .filter((inv): inv is Invoice => inv !== null)
}
