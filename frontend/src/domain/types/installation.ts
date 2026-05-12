// =============================================================================
// Installation — canonical domain model
//
// Derived from:
//   - Measure_Order List.xlsx  (measure scheduling, pre-install workflow)
//   - Weekly Schedule sheet    (James Blinds Projects.xlsx)
//   - 4 WK LOOK AHEAD sheet
//
// Key normalizations:
//   "Location"  → projectName (or location within a project)
//   "Section"   → section (room/zone within a location)
//   "Measure Date" → measureDate
//   "Submittal Approved" → submittalsApproved
//   "Motors?"   → hasMotors
//   "Pockets?"  → hasPockets
//   "Install Date" → scheduledInstallDate
//   "Action"    → pendingAction
//   "Who"       → assignedTo
// =============================================================================

import type { Territory, DataSource } from './common'

export type InstallationStatus =
  | 'pending_submittal'  // Waiting for submittal approval
  | 'pending_measure'    // Submittal approved, needs measuring
  | 'measured'           // Measured, awaiting order
  | 'material_ordered'   // Material on order
  | 'material_received'  // Ready to schedule install
  | 'scheduled'          // Install date confirmed
  | 'in_progress'        // Currently being installed
  | 'completed'          // Installation done
  | 'punch'              // Punch list items remaining
  | 'cancelled'

export interface Installation {
  id: string
  projectId: string
  projectName: string      // canonical
  territory?: Territory

  // Location detail — can be a room, floor, zone, building section
  location: string         // from "Location" — specific install area
  section?: string         // from "Section" — subdivision within location

  // Pre-production gates
  submittalsApproved: boolean   // "Submittal Approved"
  measureDate?: string          // "Measure Date"

  // Product specification flags
  hasMotors: boolean            // "Motors?" — motorized blinds
  hasPockets: boolean           // "Pockets?" — pocket/recess mounting

  // Scheduling
  scheduledInstallDate?: string // "Install Date"
  status: InstallationStatus
  assignedTo?: string           // "Who"

  // Workflow state
  pendingAction?: string        // "Action" — what needs to happen next
  notes?: string

  source: DataSource
  sourceRowRef?: string
}
