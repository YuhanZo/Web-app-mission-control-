const db = require('../config/db');

const ProjectUserModel = {
  async findByProjectId(projectId) {
    const { rows } = await db.query(
      `SELECT pu.*, u.name, u.email, r.name AS role_name
         FROM project_users pu
         JOIN users u ON u.id = pu.user_id
         LEFT JOIN roles r ON r.id = u.role_id
        WHERE pu.project_id = $1
        ORDER BY pu.created_at ASC`,
      [projectId]
    );
    return rows;
  },

  async assign(project_id, user_id, relationship_type) {
    const { rows } = await db.query(
      `INSERT INTO project_users (project_id, user_id, relationship_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, user_id) DO UPDATE SET relationship_type = EXCLUDED.relationship_type
       RETURNING *`,
      [project_id, user_id, relationship_type]
    );
    return rows[0] || null;
  },

  async remove(project_id, user_id) {
    const { rows } = await db.query(
      `DELETE FROM project_users
        WHERE project_id = $1 AND user_id = $2
       RETURNING *`,
      [project_id, user_id]
    );
    return rows[0] || null;
  },
};

module.exports = ProjectUserModel;
