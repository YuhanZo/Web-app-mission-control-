const db = require('../config/db');

const SubprojectModel = {
  async findByProject(projectId) {
    const { rows } = await db.query(
      `SELECT * FROM subprojects WHERE project_id = $1 ORDER BY sort_order, type, start_date`,
      [projectId]
    );
    return rows;
  },

  async create({ project_id, type, label, start_date, end_date, color, sort_order }) {
    const { rows } = await db.query(
      `INSERT INTO subprojects (project_id, type, label, start_date, end_date, color, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [project_id, type, label || type, start_date || null, end_date || null, color || '#2a9d8f', sort_order || 0]
    );
    return rows[0];
  },

  async update(id, { type, label, start_date, end_date, color, complete, sort_order }) {
    const { rows } = await db.query(
      `UPDATE subprojects
       SET type        = COALESCE($1, type),
           label       = COALESCE($2, label),
           start_date  = $3,
           end_date    = $4,
           color       = COALESCE($5, color),
           complete    = COALESCE($6, complete),
           sort_order  = COALESCE($7, sort_order),
           updated_at  = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [type, label, start_date || null, end_date || null, color, complete, sort_order, id]
    );
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM subprojects WHERE id = $1', [id]);
  },

  async findAllWithProjects() {
    const { rows } = await db.query(
      `SELECT s.*, p.project_name, p.territory_id,
              t.name AS territory_name,
              u.name AS project_manager_name
       FROM subprojects s
       JOIN projects p ON p.id = s.project_id
       LEFT JOIN territories t ON t.id = p.territory_id
       LEFT JOIN users u ON u.id = p.project_manager_user_id
       ORDER BY s.start_date NULLS LAST, p.project_name`
    );
    return rows;
  },
};

module.exports = SubprojectModel;
