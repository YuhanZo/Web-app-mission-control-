// =============================================================================
// Task — canonical operational task model
//
// Unifies task concepts from:
//   - Punch List sheet (rework / deficiency items)
//   - Measure_Order List "Action" / "Who" columns
//   - Weekly Schedule action items
//   - 4 WK LOOK AHEAD / 4 MO LOOK AHEAD
//
// A Task represents any discrete action item that needs to be completed
// by a specific person, optionally linked to a Project.
// =============================================================================

import type { Priority, DataSource } from './common'

// Task type classifies the nature of the work — drives routing and filtering
export type TaskType =
  | 'measure'           // Schedule or complete a measurement
  | 'order_material'    // Place or follow up on a material order
  | 'submittal'         // Prepare or follow up on a submittal
  | 'punch'             // Punch list / rework / deficiency
  | 'install'           // Installation coordination
  | 'billing'           // Invoice prep, QBO sync, follow-up
  | 'coordination'      // GC meetings, scheduling calls
  | 'document'          // AS-builts, close-out docs
  | 'other'

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked' | 'cancelled'

export interface Task {
  id: string
  projectId?: string      // optional — some tasks are not project-specific
  projectName?: string    // denormalized for display
  type: TaskType
  title: string
  description?: string
  assignedTo?: string     // "Who" in workbooks
  status: TaskStatus
  priority: Priority
  dueDate?: string
  completedAt?: string
  notes?: string
  source: DataSource
  sourceRowRef?: string
}
