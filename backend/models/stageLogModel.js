const db = require('../config/db');

const StageLogModel = {
  async findByProjectId(projectId) {
    const { rows } = await db.query(
      `SELECT psl.*, u.name AS changed_by_name
         FROM project_stage_log psl
         LEFT JOIN users u ON u.id = psl.changed_by
        WHERE psl.project_id = $1
        ORDER BY psl.changed_at DESC`,
      [projectId]
    );
    return rows;
  },
};

module.exports = StageLogModel;
