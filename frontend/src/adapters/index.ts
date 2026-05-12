// Adapters barrel — one import point for all workbook adapters
export { adaptProjectRow, adaptProjectsSheet } from './projectsWorkbook.adapter'
export type { RawProjectsRow } from './projectsWorkbook.adapter'

export { adaptToInstallation, adaptToMaterialOrder, adaptToTask } from './measureOrders.adapter'
export type { RawMeasureOrderRow } from './measureOrders.adapter'

export { adaptInvoiceRow, adaptInvoiceSheet } from './invoiceables.adapter'
export type { RawInvoiceRow } from './invoiceables.adapter'
