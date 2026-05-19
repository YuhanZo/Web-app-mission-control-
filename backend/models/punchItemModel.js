const db = require('../config/db');

const PunchItemModel = {
  async findByProjectId(projectId) {
    const { rows } = await db.query(
      `SELECT pi.*, u.name AS resolved_by_name
         FROM punch_items pi
         LEFT JOIN users u ON u.id = pi.resolved_by
        WHERE pi.project_id = $1
        ORDER BY pi.created_at ASC`,
      [projectId]
    );
    return rows;
  },

  async create({ project_id, description }) {
    const { rows } = await db.query(
      `INSERT INTO punch_items (project_id, description)
       VALUES ($1, $2) RETURNING *`,
      [project_id, description]
    );
    return rows[0];
  },

  async resolve(itemId, userId) {
    const { rows } = await db.query(
      `UPDATE punch_items
          SET resolved = true, resolved_at = CURRENT_TIMESTAMP, resolved_by = $2
        WHERE id = $1 RETURNING *`,
      [itemId, userId]
    );
    return rows[0] || null;
  },

  async countUnresolved(projectId) {
    const { rows } = await db.query(
      'SELECT COUNT(*) FROM punch_items WHERE project_id = $1 AND resolved = false',
      [projectId]
    );
    return parseInt(rows[0].count, 10);
  },
};

module.exports = PunchItemModel;
