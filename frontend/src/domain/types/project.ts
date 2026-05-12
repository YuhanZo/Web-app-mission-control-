// =============================================================================
// Project — canonical domain model
//
// Absorbs concepts from multiple workbook sources that refer to the same
// business entity under different names:
//
//   "Job Name"  (Projects workbook territory sheets)
//   "Location"  (Measure_Order List)
//   "Project"   (Backlog sheet)
//   "Site"      (New Contracts sheet)
//
// All normalize into `projectName`.
//
// Similarly:
//   "Job Number" / "Job Code" → projectNumber
//   "GC" / "General Contractor" → generalContractor
//   "% Complete" / "Percent Complete" → percentComplete
// =============================================================================

import type { Territory, Priority, DataSource } from './common'

// Status vocabulary maps to the James Blinds business lifecycle:
// Lead Gen → Pre-Production → Production → Financial → Reporting
export type ProjectStatus =
  | 'lead'           // In backlog / opportunity stage
  | 'bidding'        // Quote submitted, awaiting award
  | 'awarded'        // Contract signed, not yet started
  | 'pre_production' // Measure/submittal/ordering phase
  | 'in_production'  // Active installation underway
  | 'punch'          // Punch list / rework phase
  | 'completed'      // All work done, final billing
  | 'on_hold'        // Paused
  | 'cancelled'

export interface ContractValue {
  originalContract: number       // Base contract amount
  approvedChangeOrders: number   // Approved CO total
  totalContract: number          // originalContract + approvedChangeOrders
}

export interface ProjectSchedule {
  startDate?: string
  estimatedCompletionDate?: string
  measureDate?: string
  installStartDate?: string
  installEndDate?: string
}

export interface ProjectFinancials {
  contractValue: ContractValue
  estimatedMaterialCost: number
  estimatedLaborCost: number
  percentComplete: number         // 0–100
  totalBilledToDate: number
  remainingValue: number          // totalContract - totalBilledToDate
}

export interface Project {
  id: string
  projectNumber: string           // canonical — e.g. "JB-OH-25-001"
  projectName: string             // canonical — normalized from various Excel column names
  territory: Territory
  generalContractor?: string      // "GC" in workbooks
  status: ProjectStatus
  priority: Priority
  isCommercial: boolean           // All James Blinds projects are commercial
  financials: ProjectFinancials
  schedule: ProjectSchedule

  // Pre-production flags (from Measure_Order List)
  hasMotors?: boolean             // "Motors?" column
  hasPockets?: boolean            // "Pockets?" column
  submittalsApproved?: boolean    // "Submittal Approved" column

  notes?: string
  createdAt: string
  updatedAt: string
  source: DataSource
  sourceRowRef?: string           // e.g. "projects_workbook:OH:row_7"
}
