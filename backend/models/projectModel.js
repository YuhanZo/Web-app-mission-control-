const db = require('../config/db');

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

  async findAll() {
    const { rows } = await db.query(
      `SELECT p.*,
              pm.name AS project_manager_name,
              c.name  AS customer_name
         FROM projects p
         LEFT JOIN users pm ON pm.id = p.project_manager_user_id
         LEFT JOIN users c  ON c.id  = p.customer_user_id
        ORDER BY p.created_at DESC`
    );
    return rows;
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

  async findById(id) {
    const { rows } = await db.query(
      `SELECT p.*,
              pm.name AS project_manager_name,
              c.name  AS customer_name
         FROM projects p
         LEFT JOIN users pm ON pm.id = p.project_manager_user_id
         LEFT JOIN users c  ON c.id  = p.customer_user_id
        WHERE p.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ project_name, customer_user_id, territory_id, project_manager_user_id, status, contract_value, start_date, install_start_date, install_end_date, completion_date }) {
    const { rows } = await db.query(
      `INSERT INTO projects
         (project_name, customer_user_id, territory_id, project_manager_user_id,
          status, contract_value, start_date, install_start_date, install_end_date, completion_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [project_name, customer_user_id || null, territory_id || null,
       project_manager_user_id || null, status || 'pending',
       contract_value || null, start_date || null,
       install_start_date || null, install_end_date || null, completion_date || null]
    );
    return rows[0];
  },

  async remove(id) {
    // delete assignments first to satisfy foreign key constraint
    await db.query('DELETE FROM project_users WHERE project_id = $1', [id]);
    const { rows } = await db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    return rows[0] || null;
  },

  async update(id, fields) {
    const allowed = ['project_name', 'customer_user_id', 'territory_id',
                     'project_manager_user_id', 'status', 'contract_value',
                     'start_date', 'install_start_date', 'install_end_date', 'completion_date'];
    const keys   = Object.keys(fields).filter(k => allowed.includes(k));
    if (keys.length === 0) return null;

    const sets   = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE projects SET ${sets}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${values.length} RETURNING *`,
      values
    );
    return rows[0] || null;
  },
};

module.exports = ProjectModel;
