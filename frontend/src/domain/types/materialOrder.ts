// =============================================================================
// MaterialOrder — pre-production ordering domain model
//
// Derived from Measure_Order List.xlsx.
//
// Represents the lifecycle of a material request:
//   Measure needed → Submitted → Approved → Ordered → Received → Ready to install
//
// Note: MaterialOrder is more granular than Installation — one Installation
// may have multiple MaterialOrders (e.g. separate orders per room or product type).
// =============================================================================

import type { DataSource } from './common'

export type MaterialOrderStatus =
  | 'pending_measure'    // Not yet measured
  | 'ready_to_order'     // Measured, submittal approved, ready to order
  | 'submitted'          // Order submitted to supplier
  | 'confirmed'          // Supplier confirmed
  | 'in_production'      // Being manufactured / fabricated
  | 'shipped'            // In transit
  | 'received'           // At warehouse / job site
  | 'cancelled'

export interface MaterialOrder {
  id: string
  projectId?: string
  projectName: string

  // Where this material is going
  location: string         // "Location" — which site / project
  section?: string         // "Section" — room, floor, zone

  // Workflow
  status: MaterialOrderStatus
  pendingAction?: string   // "Action" — what needs to happen next
  assignedTo?: string      // "Who" — responsible person

  // Gating conditions
  submittalsApproved: boolean
  measureDate?: string
  scheduledDate?: string   // Target delivery / install date

  // Product flags
  hasMotors?: boolean
  hasPockets?: boolean

  notes?: string
  source: DataSource
  sourceRowRef?: string
}
