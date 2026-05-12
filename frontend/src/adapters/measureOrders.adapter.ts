// =============================================================================
// Measure & Order List Adapter
//
// Source: Measure_Order List.xlsx
//
// This workbook is the pre-production queue — it tracks every window/zone
// that needs to be measured, submitted, and ordered before installation.
//
// Key column normalizations:
//   "Location"           → projectName + location
//   "Section"            → section
//   "Measure Date"       → measureDate
//   "Submittal Approved" → submittalsApproved
//   "Motors?"            → hasMotors
//   "Pockets?"           → hasPockets
//   "Install Date"       → scheduledInstallDate
//   "Action"             → pendingAction
//   "Who"                → assignedTo
//   "Notes"              → notes
// =============================================================================

import type { Installation, InstallationStatus } from '../domain/types/installation'
import type { MaterialOrder, MaterialOrderStatus } from '../domain/types/materialOrder'
import type { Task } from '../domain/types/task'
import { parseBoolean, parseDate } from '../domain/types/common'

// ---------------------------------------------------------------------------
// Raw row shape — exact Excel column headers
// ---------------------------------------------------------------------------
export interface RawMeasureOrderRow {
  'Location'?: string
  'Section'?: string
  'Measure Date'?: string | number
  'Submittal Approved'?: string | boolean
  'Motors?'?: string | boolean
  'Pockets?'?: string | boolean
  'Install Date'?: string | number
  'Action'?: string
  'Who'?: string
  'Notes'?: string
}

// ---------------------------------------------------------------------------
// Derive installation status from the row's state flags
// ---------------------------------------------------------------------------
function deriveInstallationStatus(row: RawMeasureOrderRow): InstallationStatus {
  const submittals = parseBoolean(row['Submittal Approved'])
  const hasMeasureDate = !!parseDate(row['Measure Date'])
  const hasInstallDate = !!parseDate(row['Install Date'])
  const action = (row['Action'] ?? '').toLowerCase()

  if (action.includes('complete') || action.includes('done')) return 'completed'
  if (hasInstallDate) return 'scheduled'
  if (hasMeasureDate && submittals) return 'material_ordered'
  if (hasMeasureDate) return 'measured'
  if (submittals) return 'pending_measure'
  return 'pending_submittal'
}

function deriveMaterialOrderStatus(row: RawMeasureOrderRow): MaterialOrderStatus {
  const submittals = parseBoolean(row['Submittal Approved'])
  const hasMeasureDate = !!parseDate(row['Measure Date'])
  const action = (row['Action'] ?? '').toLowerCase()

  if (action.includes('received') || action.includes('complete')) return 'received'
  if (action.includes('ship') || action.includes('transit')) return 'shipped'
  if (action.includes('order') && !action.includes('ready')) return 'submitted'
  if (hasMeasureDate && submittals) return 'ready_to_order'
  if (hasMeasureDate) return 'ready_to_order'
  return 'pending_measure'
}

let _installCounter = 0
let _orderCounter = 0
let _taskCounter = 0

// ---------------------------------------------------------------------------
// Transform a row into an Installation domain object
// ---------------------------------------------------------------------------
export function adaptToInstallation(
  row: RawMeasureOrderRow,
  projectId: string,
  rowIndex: number
): Installation {
  const location = row['Location'] ?? 'Unknown Location'

  return {
    id: `inst-mo-${String(++_installCounter).padStart(4, '0')}`,
    projectId,
    projectName: location,
    location,
    section: row['Section'],
    submittalsApproved: parseBoolean(row['Submittal Approved']),
    measureDate: parseDate(row['Measure Date']),
    hasMotors: parseBoolean(row['Motors?']),
    hasPockets: parseBoolean(row['Pockets?']),
    scheduledInstallDate: parseDate(row['Install Date']),
    status: deriveInstallationStatus(row),
    assignedTo: row['Who'],
    pendingAction: row['Action'],
    notes: row['Notes'],
    source: 'measure_order_list',
    sourceRowRef: `measure_order_list:row_${rowIndex}`,
  }
}

// ---------------------------------------------------------------------------
// Transform a row into a MaterialOrder domain object
// ---------------------------------------------------------------------------
export function adaptToMaterialOrder(
  row: RawMeasureOrderRow,
  projectId: string,
  rowIndex: number
): MaterialOrder {
  return {
    id: `mo-${String(++_orderCounter).padStart(4, '0')}`,
    projectId,
    projectName: row['Location'] ?? 'Unknown Location',
    location: row['Location'] ?? 'Unknown Location',
    section: row['Section'],
    status: deriveMaterialOrderStatus(row),
    pendingAction: row['Action'],
    assignedTo: row['Who'],
    submittalsApproved: parseBoolean(row['Submittal Approved']),
    measureDate: parseDate(row['Measure Date']),
    scheduledDate: parseDate(row['Install Date']),
    hasMotors: parseBoolean(row['Motors?']),
    hasPockets: parseBoolean(row['Pockets?']),
    notes: row['Notes'],
    source: 'measure_order_list',
    sourceRowRef: `measure_order_list:row_${rowIndex}`,
  }
}

// ---------------------------------------------------------------------------
// Extract action items as Tasks from "Action" + "Who" columns
// ---------------------------------------------------------------------------
export function adaptToTask(
  row: RawMeasureOrderRow,
  projectId: string,
  rowIndex: number
): Task | null {
  const action = row['Action']?.trim()
  if (!action) return null

  const location = row['Location'] ?? 'Unknown'
  const section = row['Section'] ? ` — ${row['Section']}` : ''

  return {
    id: `task-mo-${String(++_taskCounter).padStart(4, '0')}`,
    projectId,
    projectName: location,
    type: action.toLowerCase().includes('measure') ? 'measure'
        : action.toLowerCase().includes('order')   ? 'order_material'
        : action.toLowerCase().includes('submit')  ? 'submittal'
        : 'other',
    title: `${action} — ${location}${section}`,
    assignedTo: row['Who'],
    status: 'todo',
    priority: 'normal',
    dueDate: parseDate(row['Install Date']),
    notes: row['Notes'],
    source: 'measure_order_list',
    sourceRowRef: `measure_order_list:row_${rowIndex}`,
  }
}
