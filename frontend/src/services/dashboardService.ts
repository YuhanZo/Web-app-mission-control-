// =============================================================================
// Dashboard Service
//
// Aggregates data from domain seed collections (or, in future, Supabase)
// into typed view-model objects consumed by the Dashboard page.
//
// The Dashboard component should import ONLY from this service —
// never directly from seed files or domain types.
//
// Future migration path:
//   Replace seed imports with Supabase service calls.
//   The return types stay identical; only this file changes.
// =============================================================================

import type { Project }      from '../domain/types/project'
import type { Invoice }      from '../domain/types/invoice'
import type { Installation } from '../domain/types/installation'
import type { Task }         from '../domain/types/task'
import type { Territory }    from '../domain/types/common'
import { TERRITORY_LABELS }  from '../domain/types/common'

import { projectsSeed, invoicesSeed, installationsSeed, tasksSeed } from '../data/seed'

// ---------------------------------------------------------------------------
// View-model types returned to the Dashboard
// ---------------------------------------------------------------------------

export interface DashboardStats {
  activeProjectCount: number
  totalPipelineValue: number    // sum of totalContract for all non-cancelled/lead
  currentMonthBilling: number   // sum of currentBillingAmount for May 2026
  readyToBillCount: number      // invoices ready to send
  installsThisWeek: number      // installations scheduled in current week
  pendingTaskCount: number      // todo + in_progress tasks
}

export interface TerritoryMetric {
  territory: Territory
  label: string
  projectCount: number
  pipelineValue: number
  activeProjectCount: number
}

export interface MonthlyBillingTrend {
  month: string              // e.g. "Jan 2026"
  billed: number
  paid: number
}

export interface DashboardData {
  stats: DashboardStats
  recentProjects: Project[]
  upcomingInstallations: Installation[]
  openTasks: Task[]
  territoryBreakdown: TerritoryMetric[]
  billingTrend: MonthlyBillingTrend[]
  readyToBillInvoices: Invoice[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ACTIVE_STATUSES = new Set([
  'pre_production', 'in_production', 'punch',
])

const PIPELINE_STATUSES = new Set([
  'awarded', 'pre_production', 'in_production', 'punch',
])

function isoWeekRange(): { start: string; end: string } {
  const now = new Date()
  const day = now.getDay() // 0=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split('T')[0],
    end:   sunday.toISOString().split('T')[0],
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function getDashboardData(): DashboardData {
  const projects      = projectsSeed
  const invoices      = invoicesSeed
  const installations = installationsSeed
  const tasks         = tasksSeed

  // --- Stats ---
  const activeProjects = projects.filter(p => ACTIVE_STATUSES.has(p.status))
  const pipelineProjects = projects.filter(p => PIPELINE_STATUSES.has(p.status))

  const currentMonthBilling = invoices
    .filter(i => i.billingMonth === 'may' && i.billingYear === 2026)
    .reduce((sum, i) => sum + i.currentBillingAmount, 0)

  const readyToBillInvoices = invoices.filter(i =>
    i.status === 'ready_to_bill' || i.status === 'draft'
  )

  const { start, end } = isoWeekRange()
  const installsThisWeek = installations.filter(i => {
    const d = i.scheduledInstallDate
    return d && d >= start && d <= end
  }).length

  const pendingTasks = tasks.filter(t =>
    t.status === 'todo' || t.status === 'in_progress'
  )

  const stats: DashboardStats = {
    activeProjectCount: activeProjects.length,
    totalPipelineValue: pipelineProjects.reduce(
      (sum, p) => sum + p.financials.contractValue.totalContract, 0
    ),
    currentMonthBilling,
    readyToBillCount: readyToBillInvoices.length,
    installsThisWeek,
    pendingTaskCount: pendingTasks.length,
  }

  // --- Territory breakdown ---
  const territories: Territory[] = ['OH', 'IN', 'NC', 'ORL']
  const territoryBreakdown: TerritoryMetric[] = territories.map(t => {
    const tProjects = projects.filter(p => p.territory === t)
    return {
      territory: t,
      label: TERRITORY_LABELS[t],
      projectCount: tProjects.length,
      pipelineValue: tProjects
        .filter(p => PIPELINE_STATUSES.has(p.status))
        .reduce((sum, p) => sum + p.financials.contractValue.totalContract, 0),
      activeProjectCount: tProjects.filter(p => ACTIVE_STATUSES.has(p.status)).length,
    }
  })

  // --- Monthly billing trend (Jan–May 2026) ---
  const MONTHS: Array<{ key: Invoice['billingMonth']; label: string }> = [
    { key: 'jan', label: 'Jan' },
    { key: 'feb', label: 'Feb' },
    { key: 'mar', label: 'Mar' },
    { key: 'apr', label: 'Apr' },
    { key: 'may', label: 'May' },
  ]

  const billingTrend: MonthlyBillingTrend[] = MONTHS.map(({ key, label }) => {
    const monthInvoices = invoices.filter(
      i => i.billingYear === 2026 && i.billingMonth === key
    )
    return {
      month: `${label} 2026`,
      billed: monthInvoices.reduce((sum, i) => sum + i.currentBillingAmount, 0),
      paid:   monthInvoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.currentBillingAmount, 0),
    }
  })

  // --- Recent projects (most recently updated, active or punch) ---
  const recentProjects = [...projects]
    .filter(p => !['lead', 'bidding', 'cancelled'].includes(p.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)

  // --- Upcoming installations (scheduled, soonest first) ---
  const upcomingInstallations = [...installations]
    .filter(i => i.scheduledInstallDate && ['scheduled', 'material_received'].includes(i.status))
    .sort((a, b) => (a.scheduledInstallDate ?? '').localeCompare(b.scheduledInstallDate ?? ''))
    .slice(0, 5)

  // --- Open tasks (todo + in_progress, urgent/high first) ---
  const PRIORITY_WEIGHT: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
  const openTasks = pendingTasks
    .sort((a, b) =>
      (PRIORITY_WEIGHT[a.priority] ?? 2) - (PRIORITY_WEIGHT[b.priority] ?? 2)
    )
    .slice(0, 8)

  return {
    stats,
    recentProjects,
    upcomingInstallations,
    openTasks,
    territoryBreakdown,
    billingTrend,
    readyToBillInvoices,
  }
}
