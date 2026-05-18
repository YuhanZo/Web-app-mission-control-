const db = require('../config/db');

async function getFinanceOverview() {
  const startOfYear = `${new Date().getFullYear()}-01-01`;
  const [metricsRes, billingRes] = await Promise.all([
    db.query(`
      SELECT
        COALESCE(SUM(total_won_value), 0)   AS ytd_revenue,
        COALESCE(SUM(gp_dollars), 0)        AS ytd_gp_dollars,
        COALESCE(SUM(np_dollars), 0)        AS ytd_np_dollars,
        COALESCE(SUM(bids_sent), 0)         AS ytd_bids_sent,
        COALESCE(SUM(total_bid_value), 0)   AS ytd_bid_value,
        COALESCE(SUM(installer_hours), 0)   AS ytd_installer_hours,
        COALESCE(SUM(pipeline_value), 0)    AS total_pipeline
      FROM monthly_metrics
      WHERE metric_month >= $1
    `, [startOfYear]),
    db.query(`
      SELECT
        COALESCE(SUM(remaining_to_bill), 0) AS total_backlog,
        COALESCE(SUM(bill_this_month), 0)   AS bill_this_month
      FROM monthly_billings
      WHERE billing_month = (SELECT MAX(billing_month) FROM monthly_billings)
    `),
  ]);

  const m = metricsRes.rows[0];
  const ytdRev = Number(m.ytd_revenue || 0);
  const ytdGp  = Number(m.ytd_gp_dollars || 0);
  const ytdNp  = Number(m.ytd_np_dollars || 0);

  return {
    ytd_revenue:          ytdRev,
    ytd_gp_dollars:       ytdGp,
    ytd_gp_percent:       ytdRev ? ytdGp / ytdRev : 0,
    ytd_np_dollars:       ytdNp,
    ytd_np_percent:       ytdRev ? ytdNp / ytdRev : 0,
    ytd_bids_sent:        Number(m.ytd_bids_sent || 0),
    ytd_bid_value:        Number(m.ytd_bid_value || 0),
    ytd_installer_hours:  Number(m.ytd_installer_hours || 0),
    total_pipeline:       Number(m.total_pipeline || 0),
    total_backlog:        Number(billingRes.rows[0].total_backlog || 0),
    bill_this_month:      Number(billingRes.rows[0].bill_this_month || 0),
  };
}

async function getMonthlyFinancials() {
  const res = await db.query(`
    SELECT
      metric_month,
      COALESCE(total_won_value, 0)     AS revenue,
      COALESCE(gp_dollars, 0)          AS gp_dollars,
      COALESCE(gp_percent, 0)          AS gp_percent,
      COALESCE(np_dollars, 0)          AS np_dollars,
      COALESCE(np_percent, 0)          AS np_percent,
      COALESCE(installer_hours, 0)     AS installer_hours,
      COALESCE(profit_per_man_hour, 0) AS ppmh,
      COALESCE(bids_sent, 0)           AS bids_sent,
      COALESCE(total_bid_value, 0)     AS bid_value,
      COALESCE(pipeline_value, 0)      AS pipeline_value,
      COALESCE(hit_rate, 0)            AS hit_rate,
      COALESCE(capture_rate, 0)        AS capture_rate
    FROM monthly_metrics
    ORDER BY metric_month
    LIMIT 24
  `);
  return res.rows;
}

async function getBillingDetail() {
  const res = await db.query(`
    SELECT
      p.id               AS project_id,
      p.job_number,
      p.project_name,
      p.status,
      p.total_contract,
      t.name             AS territory_name,
      u.name             AS pm_name,
      mb.billing_month,
      COALESCE(mb.total_billed_to_date, 0)   AS total_billed_to_date,
      COALESCE(mb.remaining_to_bill, 0)      AS remaining_to_bill,
      COALESCE(mb.percent_complete, 0)       AS percent_complete,
      COALESCE(mb.bill_this_month, 0)        AS bill_this_month,
      COALESCE(mb.accrued_retainage, 0)      AS accrued_retainage,
      COALESCE(mb.revenue_earned_to_date, 0) AS revenue_earned_to_date,
      COALESCE(mb.under_over_billed, 0)      AS under_over_billed,
      mb.invoice_sent
    FROM projects p
    LEFT JOIN territories t ON p.territory_id = t.id
    LEFT JOIN users u ON p.project_manager_user_id = u.id
    LEFT JOIN LATERAL (
      SELECT * FROM monthly_billings
      WHERE project_id = p.id
      ORDER BY billing_month DESC
      LIMIT 1
    ) mb ON true
    WHERE p.status IN ('active', 'pending')
    ORDER BY mb.billing_month DESC NULLS LAST, p.job_number
    LIMIT 50
  `);
  return res.rows;
}

async function getPayrollDetail() {
  const res = await db.query(`
    SELECT
      p.id                                    AS project_id,
      p.job_number,
      p.project_name,
      p.status,
      p.payroll_reporting,
      p.total_contract,
      COALESCE(p.estimated_labor_cost, 0)    AS estimated_labor_cost,
      COALESCE(p.estimated_material_cost, 0) AS estimated_material_cost,
      COALESCE(p.total_estimate, 0)          AS total_estimate,
      t.name AS territory_name,
      u.name AS pm_name,
      COALESCE((
        SELECT SUM(mb.cost_to_recognize)
        FROM monthly_billings mb
        WHERE mb.project_id = p.id
      ), 0) AS actual_cost_recognized
    FROM projects p
    LEFT JOIN territories t ON p.territory_id = t.id
    LEFT JOIN users u ON p.project_manager_user_id = u.id
    WHERE p.status IN ('active', 'pending', 'completed')
    ORDER BY p.job_number
    LIMIT 60
  `);
  return res.rows;
}

async function getChangeOrders() {
  const res = await db.query(`
    SELECT
      co.id,
      co.project_id,
      p.job_number,
      p.project_name,
      p.status,
      co.co_number,
      co.description,
      COALESCE(co.amount, 0)                AS amount,
      COALESCE(co.estimated_cost_change, 0) AS estimated_cost_change,
      co.created_at
    FROM change_orders co
    JOIN projects p ON co.project_id = p.id
    ORDER BY co.created_at DESC
    LIMIT 50
  `);
  return res.rows;
}

async function getBidPipeline() {
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
    LIMIT 50
  `);
  return res.rows;
}

module.exports = {
  getFinanceOverview,
  getMonthlyFinancials,
  getBillingDetail,
  getPayrollDetail,
  getChangeOrders,
  getBidPipeline,
};
