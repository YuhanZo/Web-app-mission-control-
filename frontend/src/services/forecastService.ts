// =============================================================================
// Forecast Service
//
// Computes forward-looking metrics for the 4-week and 4-month look-ahead views.
// Derived from: 4 WK LOOK AHEAD and 4 MO LOOK AHEAD sheets in Projects workbook.
//
// Future migration path:
//   Feed from Supabase + real schedule data instead of seed-derived estimates.
// =============================================================================

import type { Project } from '../domain/types/project'
import type { Installation } from '../domain/types/installation'
import type { Invoice } from '../domain/types/invoice'

import { projectsSeed, invoicesSeed, installationsSeed } from '../data/seed'

// ---------------------------------------------------------------------------
// View-model types
// ---------------------------------------------------------------------------

export interface WeekForecast {
  weekLabel: string            // e.g. "May 12–18"
  scheduledInstalls: Installation[]
  estimatedRevenue: number
}

export interface MonthForecast {
  monthLabel: string           // e.g. "June 2026"
  projectsActive: Project[]
  estimatedBilling: number
  installsExpected: number
}

export interface ProjectRisk {
  project: Project
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
}

// ---------------------------------------------------------------------------
// 4-Week look-ahead
// ---------------------------------------------------------------------------

export function getFourWeekForecast(): WeekForecast[] {
  const today = new Date('2026-05-12') // anchored to current date

  return Array.from({ length: 4 }, (_, weekOffset) => {
    const monday = new Date(today)
    monday.setDate(today.getDate() + weekOffset * 7)
    // Align to Monday
    const dayOfWeek = monday.getDay()
    monday.setDate(monday.getDate() - ((dayOfWeek + 6) % 7))

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const start = monday.toISOString().split('T')[0]
    const end   = sunday.toISOString().split('T')[0]

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const weekLabel = `${monthNames[monday.getMonth()]} ${monday.getDate()}–${sunday.getDate()}`

    const scheduledInstalls = installationsSeed.filter(i => {
      const d = i.scheduledInstallDate
      return d && d >= start && d <= end
    })

    // Estimate revenue from projects with installs this week
    const projectIds = new Set(scheduledInstalls.map(i => i.projectId))
    const weekProjects = projectsSeed.filter(p => projectIds.has(p.id))
    const estimatedRevenue = weekProjects.reduce(
      (sum, p) => sum + (p.financials.contractValue.totalContract * 0.08), 0
    )

    return { weekLabel, scheduledInstalls, estimatedRevenue }
  })
}

// ---------------------------------------------------------------------------
// 4-Month look-ahead
// ---------------------------------------------------------------------------

export function getFourMonthForecast(): MonthForecast[] {
  const MONTHS = [
    { label: 'May 2026',  key: 'may'  },
    { label: 'Jun 2026',  key: 'jun'  },
    { label: 'Jul 2026',  key: 'jul'  },
    { label: 'Aug 2026',  key: 'aug'  },
  ]

  const activeProjects = projectsSeed.filter(p =>
    ['pre_production', 'in_production', 'punch', 'awarded'].includes(p.status)
  )

  return MONTHS.map(({ label, key }) => {
    // Real billing from seed (May); estimate forward months
    const seedInvoices = invoicesSeed.filter(
      (i: Invoice) => i.billingYear === 2026 && i.billingMonth === (key as Invoice['billingMonth'])
    )

    const seededBilling = seedInvoices.reduce(
      (sum: number, i: Invoice) => sum + i.currentBillingAmount, 0
    )

    // For future months without seed data, estimate from active project completion rates
    const estimatedBilling = seededBilling > 0
      ? seededBilling
      : activeProjects
          .filter(p => ['in_production', 'punch'].includes(p.status))
          .reduce((sum, p) => sum + p.financials.contractValue.totalContract * 0.08, 0)

    const installsExpected = installationsSeed.filter(i => {
      if (!i.scheduledInstallDate) return false
      const month = i.scheduledInstallDate.substring(5, 7)
      const monthIndex = parseInt(month, 10) - 1
      const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
      return monthKeys[monthIndex] === key
    }).length

    return {
      monthLabel: label,
      projectsActive: activeProjects,
      estimatedBilling,
      installsExpected,
    }
  })
}

// ---------------------------------------------------------------------------
// Risk detection — flags projects that may need attention
// ---------------------------------------------------------------------------

export function getProjectRisks(): ProjectRisk[] {
  return projectsSeed
    .filter(p => !['lead', 'bidding', 'cancelled', 'completed'].includes(p.status))
    .map(project => {
      const riskFactors: string[] = []

      if (!project.submittalsApproved && project.status !== 'awarded') {
        riskFactors.push('Submittals not approved')
      }

      if (project.financials.percentComplete > 80 && project.status === 'in_production') {
        riskFactors.push('High completion % but not in punch phase')
      }

      const totalBilled = project.financials.totalBilledToDate
      const totalContract = project.financials.contractValue.totalContract
      const billedPct = totalContract > 0 ? (totalBilled / totalContract) * 100 : 0
      const completionPct = project.financials.percentComplete
      if (completionPct - billedPct > 20) {
        riskFactors.push('Completion ahead of billing — cash flow risk')
      }

      if (project.priority === 'urgent' && project.status === 'pre_production') {
        riskFactors.push('Urgent priority but still in pre-production')
      }

      if (project.hasMotors && !project.submittalsApproved) {
        riskFactors.push('Motorized spec not yet approved')
      }

      const riskLevel: ProjectRisk['riskLevel'] =
        riskFactors.length >= 3 ? 'high'
        : riskFactors.length >= 1 ? 'medium'
        : 'low'

      return { project, riskLevel, riskFactors }
    })
    .filter(r => r.riskLevel !== 'low')
    .sort((a, b) =>
      (a.riskLevel === 'high' ? 0 : a.riskLevel === 'medium' ? 1 : 2) -
      (b.riskLevel === 'high' ? 0 : b.riskLevel === 'medium' ? 1 : 2)
    )
}
