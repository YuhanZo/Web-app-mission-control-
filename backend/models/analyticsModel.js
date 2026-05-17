const db = require('../config/db');

async function getRevenueByTerritory() {
  const res = await db.query(`
    SELECT
      COALESCE(t.name, 'Unassigned') AS territory_name,
      COUNT(p.id)                                             AS project_count,
      COALESCE(SUM(p.total_contract), 0)                      AS total_revenue,
      COALESCE(SUM(p.estimated_labor_cost), 0)                AS est_labor,
      COALESCE(SUM(p.estimated_material_cost), 0)             AS est_material,
      COALESCE(SUM(p.total_estimate), 0)                      AS total_estimate,
      COALESCE(SUM(p.total_contract) - SUM(p.total_estimate), 0) AS est_profit
    FROM projects p
    LEFT JOIN territories t ON p.territory_id = t.id
    GROUP BY t.id, t.name
    ORDER BY total_revenue DESC
  `);
  return res.rows;
}

async function getTopCustomers() {
  const res = await db.query(`
    SELECT
      c.name                                                        AS company_name,
      t.name                                                        AS territory_name,
      COUNT(p.id)                                                   AS project_count,
      COALESCE(SUM(p.total_contract), 0)                            AS total_revenue,
      COALESCE(SUM(p.total_contract - p.total_estimate), 0)         AS est_profit
    FROM projects p
    JOIN companies c ON p.company_id = c.id
    LEFT JOIN territories t ON p.territory_id = t.id
    GROUP BY c.id, c.name, t.name
    ORDER BY total_revenue DESC
    LIMIT 10
  `);
  return res.rows;
}

async function getMonthlyRevenue() {
  const res = await db.query(`
    SELECT
      metric_month,
      COALESCE(total_won_value, 0)  AS revenue,
      COALESCE(gp_dollars, 0)       AS gp_dollars,
      COALESCE(np_dollars, 0)       AS np_dollars,
      COALESCE(pipeline_value, 0)   AS pipeline_value,
      COALESCE(total_bid_value, 0)  AS bid_value,
      COALESCE(bids_sent, 0)        AS bids_sent
    FROM monthly_metrics
    ORDER BY metric_month
    LIMIT 24
  `);
  return res.rows;
}

async function getInvoiceAging() {
  const res = await db.query(`
    SELECT
      p.id                                              AS project_id,
      p.job_number,
      p.project_name,
      c.name                                            AS company_name,
      t.name                                            AS territory_name,
      mb.billing_month,
      COALESCE(mb.bill_this_month, 0)                   AS amount_due,
      COALESCE(mb.total_billed_to_date, 0)              AS total_billed,
      COALESCE(mb.accrued_retainage, 0)                 AS retainage,
      mb.invoice_sent,
      mb.qbo_invoice_number,
      (CURRENT_DATE - mb.billing_month::DATE)           AS days_outstanding
    FROM monthly_billings mb
    JOIN projects p ON mb.project_id = p.id
    LEFT JOIN companies c ON p.company_id = c.id
    LEFT JOIN territories t ON p.territory_id = t.id
    WHERE mb.bill_this_month > 0
    ORDER BY mb.billing_month ASC
    LIMIT 50
  `);
  return res.rows;
}

async function getExpenseBreakdown() {
  const res = await db.query(`
    SELECT
      p.id               AS project_id,
      p.job_number,
      p.project_name,
      p.status,
      t.name             AS territory_name,
      u.name             AS pm_name,
      COALESCE(p.total_contract, 0)          AS contract_value,
      COALESCE(p.estimated_labor_cost, 0)    AS est_labor,
      COALESCE(p.estimated_material_cost, 0) AS est_material,
      COALESCE(p.total_estimate, 0)          AS total_estimate,
      COALESCE((
        SELECT SUM(mb.cost_to_recognize)
        FROM monthly_billings mb WHERE mb.project_id = p.id
      ), 0) AS actual_cost
    FROM projects p
    LEFT JOIN territories t ON p.territory_id = t.id
    LEFT JOIN users u ON p.project_manager_user_id = u.id
    ORDER BY p.total_contract DESC
    LIMIT 50
  `);
  return res.rows;
}

async function getBidsFull() {
  const res = await db.query(`
    SELECT
      b.id,
      b.project_name,
      b.bid_date,
      COALESCE(b.bid_amount, 0)      AS bid_amount,
      COALESCE(b.estimated_gp, 0)    AS estimated_gp,
      COALESCE(b.estimated_np, 0)    AS estimated_np,
      COALESCE(b.estimated_hours, 0) AS estimated_hours,
      b.bid_status,
      b.won,
      b.notes,
      t.name AS territory_name,
      c.name AS company_name
    FROM bids b
    LEFT JOIN territories t ON b.territory_id = t.id
    LEFT JOIN companies c ON b.company_id = c.id
    ORDER BY b.bid_date DESC
    LIMIT 100
  `);
  return res.rows;
}

module.exports = {
  getRevenueByTerritory,
  getTopCustomers,
  getMonthlyRevenue,
  getInvoiceAging,
  getExpenseBreakdown,
  getBidsFull,
};
