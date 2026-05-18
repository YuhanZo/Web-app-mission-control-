const db = require('../config/db');

const contractValueSql = 'COALESCE(NULLIF(p.total_contract, 0), p.contract_value, p.original_contract, 0)';

const ProjectModel = {
  async countAll() {
    const { rows } = await db.query('SELECT COUNT(*) FROM projects');
    return parseInt(rows[0].count, 10);
  },

  async countActive() {
    const { rows } = await db.query(
      "SELECT COUNT(*) FROM projects WHERE status = 'active'"
    );
    return parseInt(rows[0].count, 10);
  },

  async findRecent(limit = 10) {
    const { rows } = await db.query(
      `SELECT p.*, u.name AS project_manager_name
         FROM projects p
         LEFT JOIN users u ON u.id = p.project_manager_user_id
        ORDER BY p.created_at DESC
        LIMIT $1`,
      [limit]
    );
    return rows;
  },

  async getManagerDashboard({ userId, role, territoryId }) {
    const params = [];
    const filters = [];

    if (role === 'project_manager') {
      params.push(userId);
      filters.push(`p.project_manager_user_id = $${params.length}`);
    }

    if (territoryId) {
      params.push(territoryId);
      filters.push(`p.territory_id = $${params.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const summarySql = `
      SELECT
        COUNT(*)::int AS total_projects,
        COUNT(*) FILTER (WHERE status IN ('active', 'pending'))::int AS open_projects,
        COALESCE(SUM(${contractValueSql}), 0)::numeric AS total_contract_value,
        COALESCE(SUM(${contractValueSql}) FILTER (WHERE status IN ('active', 'pending')), 0)::numeric AS open_contract_value,
        COALESCE(SUM(${contractValueSql}) FILTER (WHERE status = 'completed'), 0)::numeric AS completed_contract_value,
        COALESCE(AVG(${contractValueSql}), 0)::numeric AS average_project_value
      FROM projects p
      ${whereClause}
    `;

    const byStatusSql = `
      SELECT
        COALESCE(status, 'unassigned') AS status,
        COUNT(*)::int AS project_count,
        COALESCE(SUM(${contractValueSql}), 0)::numeric AS contract_value
      FROM projects p
      ${whereClause}
      GROUP BY COALESCE(status, 'unassigned')
      ORDER BY contract_value DESC
    `;

    const byTerritorySql = `
      SELECT
        COALESCE(territory_id, 0)::int AS territory_id,
        COUNT(*)::int AS project_count,
        COALESCE(SUM(${contractValueSql}), 0)::numeric AS contract_value
      FROM projects p
      ${whereClause}
      GROUP BY COALESCE(territory_id, 0)
      ORDER BY contract_value DESC
    `;

    const recentSql = `
      SELECT
        p.*,
        ${contractValueSql} AS display_contract_value,
        u.name AS project_manager_name
      FROM projects p
      LEFT JOIN users u ON u.id = p.project_manager_user_id
      ${whereClause}
      ORDER BY p.updated_at DESC, p.created_at DESC
      LIMIT 12
    `;

    const projectsSql = `
      SELECT
        p.*,
        ${contractValueSql} AS display_contract_value,
        c.name AS company_name,
        t.name AS territory_name,
        u.name AS project_manager_name
      FROM projects p
      LEFT JOIN companies c ON c.id = p.company_id
      LEFT JOIN territories t ON t.id = p.territory_id
      LEFT JOIN users u ON u.id = p.project_manager_user_id
      ${whereClause}
      ORDER BY p.install_start_date NULLS LAST, p.updated_at DESC, p.created_at DESC
      LIMIT 100
    `;

    const monthlyMetricsSql = `
      SELECT *
      FROM monthly_metrics
      ORDER BY metric_month
      LIMIT 24
    `;

    const bidFilters = [];
    const bidParams = [];
    if (territoryId) {
      bidParams.push(territoryId);
      bidFilters.push(`b.territory_id = $${bidParams.length}`);
    }
    const bidWhereClause = bidFilters.length ? `WHERE ${bidFilters.join(' AND ')}` : '';
    const bidSummarySql = `
      SELECT
        date_trunc('month', bid_date)::date AS bid_month,
        COUNT(*)::int AS bids_sent,
        COALESCE(SUM(bid_amount), 0)::numeric AS bid_dollars,
        COALESCE(SUM(estimated_gp), 0)::numeric AS estimated_gp,
        COALESCE(SUM(estimated_np), 0)::numeric AS estimated_np,
        COUNT(*) FILTER (WHERE won = true)::int AS bids_won
      FROM bids b
      ${bidWhereClause}
      GROUP BY date_trunc('month', bid_date)
      ORDER BY bid_month
    `;

    const [summary, byStatus, byTerritory, recentProjects, projects, monthlyMetrics, bidSummary] = await Promise.all([
      db.query(summarySql, params),
      db.query(byStatusSql, params),
      db.query(byTerritorySql, params),
      db.query(recentSql, params),
      db.query(projectsSql, params),
      db.query(monthlyMetricsSql),
      db.query(bidSummarySql, bidParams),
    ]);

    return {
      summary: summary.rows[0],
      byStatus: byStatus.rows,
      byTerritory: byTerritory.rows,
      recentProjects: recentProjects.rows,
      projects: projects.rows,
      monthlyMetrics: monthlyMetrics.rows,
      bidSummary: bidSummary.rows,
    };
  },

  // TODO: findById - needed for project detail page
  // TODO: create - needed for new project form
  // TODO: update - needed for project edit
};

module.exports = ProjectModel;
