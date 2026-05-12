// =============================================================================
// Projects Workbook Adapter
//
// Source: James Blinds Projects.xlsx
// Sheets: OH, IN, NC, ORL, Backlog, New Contracts
//
// This adapter is the ONLY place in the codebase that knows about the
// raw column names used in the Projects workbook. The rest of the app
// consumes canonical Project domain objects.
//
// When the workbook schema changes, only this file needs updating.
// =============================================================================

import type { Project, ProjectStatus } from '../domain/types/project'
import type { Territory, DataSource } from '../domain/types/common'
import { parseNumber, parsePercent, parseBoolean, parseDate } from '../domain/types/common'

// ---------------------------------------------------------------------------
// Raw row shape — matches actual Excel column headers
// Fields are optional because column presence varies across sheets
// ---------------------------------------------------------------------------
export interface RawProjectsRow {
  // Territory sheets (OH, IN, NC, ORL)
  'Job Number'?: string | number
  'Job Name'?: string
  'GC'?: string
  'Contract Amount'?: string | number
  'Status'?: string
  'Start Date'?: string | number
  'Completion Date'?: string | number
  'Est Completion'?: string | number
  '% Complete'?: string | number
  'Notes'?: string

  // Backlog sheet variants
  'Project'?: string
  'Location'?: string
  'Value'?: string | number
  'Bid Date'?: string | number

  // New Contracts sheet variants
  'Site'?: string
  'General Contractor'?: string
  'Original Contract'?: string | number
  'CO Total'?: string | number
  'Total Contract'?: string | number
  'Award Date'?: string | number

  // Measure_Order cross-reference
  'Submittal Approved'?: string | boolean
  'Motors?'?: string | boolean
  'Pockets?'?: string | boolean
  'Measure Date'?: string | number
  'Install Date'?: string | number
}

// ---------------------------------------------------------------------------
// Status mapping — workbook text values → canonical ProjectStatus
// ---------------------------------------------------------------------------
const STATUS_MAP: Record<string, ProjectStatus> = {
  'lead':            'lead',
  'opportunity':     'lead',
  'backlog':         'lead',
  'bidding':         'bidding',
  'bid':             'bidding',
  'awarded':         'awarded',
  'new contract':    'awarded',
  'pre-production':  'pre_production',
  'pre production':  'pre_production',
  'measure':         'pre_production',
  'ordering':        'pre_production',
  'active':          'in_production',
  'in production':   'in_production',
  'in progress':     'in_production',
  'production':      'in_production',
  'punch':           'punch',
  'punch list':      'punch',
  'complete':        'completed',
  'completed':       'completed',
  'done':            'completed',
  'on hold':         'on_hold',
  'hold':            'on_hold',
  'cancelled':       'cancelled',
  'canceled':        'cancelled',
}

function mapStatus(raw: string | undefined): ProjectStatus {
  if (!raw) return 'in_production'
  return STATUS_MAP[raw.toLowerCase().trim()] ?? 'in_production'
}

// ---------------------------------------------------------------------------
// Main transform function
// ---------------------------------------------------------------------------
export function adaptProjectRow(
  raw: RawProjectsRow,
  territory: Territory,
  rowIndex: number,
  source: DataSource = 'projects_workbook'
): Project {
  // Normalize projectName from whichever column is present
  const projectName =
    raw['Job Name'] ??
    raw['Project'] ??
    raw['Location'] ??
    raw['Site'] ??
    'Unknown Project'

  // Normalize projectNumber
  const rawNumber = raw['Job Number']
  const projectNumber = rawNumber
    ? String(rawNumber).trim()
    : `JB-${territory}-IMPORT-${String(rowIndex).padStart(3, '0')}`

  // Normalize GC
  const generalContractor =
    (raw['GC'] ?? raw['General Contractor'] ?? undefined) as string | undefined

  // Contract values
  const originalContract = parseNumber(
    raw['Contract Amount'] ?? raw['Original Contract'] ?? raw['Value'] ?? 0
  )
  const approvedChangeOrders = parseNumber(raw['CO Total'] ?? 0)
  const totalContract = parseNumber(raw['Total Contract'] ?? 0) || (originalContract + approvedChangeOrders)

  // Dates
  const startDate = parseDate(raw['Start Date'] ?? raw['Award Date'])
  const estimatedCompletionDate = parseDate(raw['Completion Date'] ?? raw['Est Completion'])
  const measureDate = parseDate(raw['Measure Date'])
  const installStartDate = parseDate(raw['Install Date'])

  const percentComplete = parsePercent(raw['% Complete'] ?? 0)
  const totalBilledToDate = totalContract * (percentComplete / 100) * 0.85 // estimate

  return {
    id: projectNumber.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    projectNumber,
    projectName: String(projectName).trim(),
    territory,
    generalContractor,
    status: mapStatus(raw['Status']),
    priority: 'normal',
    isCommercial: true,
    financials: {
      contractValue: { originalContract, approvedChangeOrders, totalContract },
      estimatedMaterialCost: totalContract * 0.45,
      estimatedLaborCost: totalContract * 0.35,
      percentComplete,
      totalBilledToDate,
      remainingValue: totalContract - totalBilledToDate,
    },
    schedule: {
      startDate,
      estimatedCompletionDate,
      measureDate,
      installStartDate,
    },
    submittalsApproved: parseBoolean(raw['Submittal Approved']),
    hasMotors: parseBoolean(raw['Motors?']),
    hasPockets: parseBoolean(raw['Pockets?']),
    notes: raw['Notes'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source,
    sourceRowRef: `projects_workbook:${territory}:row_${rowIndex}`,
  }
}

// ---------------------------------------------------------------------------
// Batch transform — process a full sheet at once
// ---------------------------------------------------------------------------
export function adaptProjectsSheet(
  rows: RawProjectsRow[],
  territory: Territory
): Project[] {
  return rows
    .filter(row => !!(row['Job Name'] ?? row['Project'] ?? row['Location'] ?? row['Site']))
    .map((row, i) => adaptProjectRow(row, territory, i + 2)) // +2 = 1-indexed + header row
}
