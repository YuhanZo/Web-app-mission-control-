// Domain types barrel — single import point for all domain models
// import type { Project, ProjectStatus } from '@/domain/types'

export type { Territory, Priority, DataSource, BillingMonth, TERRITORY_LABELS, BILLING_MONTH_LABELS } from './common'
export { parseNumber, parsePercent, parseBoolean, parseDate } from './common'

export type {
  ProjectStatus,
  ContractValue,
  ProjectSchedule,
  ProjectFinancials,
  Project,
} from './project'

export type {
  InvoiceStatus,
  Invoice,
} from './invoice'

export type {
  InstallationStatus,
  Installation,
} from './installation'

export type {
  TaskType,
  TaskStatus,
  Task,
} from './task'

export type {
  MaterialOrderStatus,
  MaterialOrder,
} from './materialOrder'
