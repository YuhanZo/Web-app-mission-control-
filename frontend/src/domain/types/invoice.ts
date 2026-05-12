// =============================================================================
// Invoice — canonical domain model
//
// Derived from 2026 Invoiceables.xlsx.
//
// Key normalizations from Excel column names:
//   "Bill This Month"          → currentBillingAmount
//   "Approved CO Total"        → approvedChangeOrderTotal
//   "Total Contract"           → totalContract
//   "Estimated Material Cost"  → estimatedMaterialCost
//   "Estimated Labor Total Cost" → estimatedLaborCost
//   "Percent Complete"         → percentComplete
//   "Previous Billed Amount"   → previousBilledAmount
//   "Sent to Customer"         → sentToCustomer
//   "QBO Invoice Number"       → qboInvoiceNumber
//   "Remaining"                → remainingAmount
//   "Bill Due Date"            → billDueDate
//
// AIA billing workflow:
//   Invoice progresses: draft → ready_to_bill → sent → paid
// =============================================================================

import type { Territory, DataSource, BillingMonth } from './common'

export type InvoiceStatus =
  | 'draft'          // Not yet ready
  | 'ready_to_bill'  // Ready to send to GC
  | 'sent'           // Sent to customer (QBO invoice created)
  | 'paid'           // Payment received
  | 'overdue'        // Past due date, unpaid
  | 'void'           // Cancelled/voided

export interface Invoice {
  id: string
  projectId: string           // links to Project.id
  projectNumber: string       // denormalized for quick display
  projectName: string         // canonical project name

  // Who/where
  territory: Territory
  generalContractor?: string

  // Billing period
  billingYear: number
  billingMonth: BillingMonth
  billDueDate?: string

  // Contract financials
  originalContract: number
  approvedChangeOrderTotal: number
  totalContract: number           // originalContract + approvedChangeOrderTotal

  // Cost estimates
  estimatedMaterialCost: number
  estimatedLaborCost: number
  estimatedTotalCost: number      // material + labor

  // Billing progress
  percentComplete: number         // 0–100
  previousBilledAmount: number    // billed in prior periods
  currentBillingAmount: number    // "Bill This Month"
  totalBilledToDate: number       // previousBilledAmount + currentBillingAmount
  remainingAmount: number         // totalContract - totalBilledToDate

  // Description of what's being billed (AIA schedule of values line)
  billingDescription?: string

  // Admin / QBO sync
  status: InvoiceStatus
  sentToCustomer: boolean
  qboInvoiceNumber?: string       // QBO sync reference

  source: DataSource
  sourceRowRef?: string           // e.g. "invoiceables_workbook:may_2026:row_12"
}
