const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const db = require('../config/db');

router.get('/installers', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM (
        SELECT DISTINCT ON (u.id)
          u.id, u.name, u.phone,
          t.name AS territory_name,
          p.id   AS current_project_id,
          p.project_name AS current_job,
          p.install_start_date,
          p.install_end_date,
          p.status AS project_status
        FROM users u
        JOIN roles r ON r.id = u.role_id AND r.name = 'installer'
        LEFT JOIN territories t ON t.id = u.territory_id
        LEFT JOIN project_users pu ON pu.user_id = u.id
        LEFT JOIN projects p ON p.id = pu.project_id
          AND p.status IN ('active', 'pending')
          AND p.install_end_date >= CURRENT_DATE
        WHERE u.active = true
        ORDER BY u.id, p.install_start_date ASC NULLS LAST
      ) sub
      ORDER BY territory_name NULLS LAST, name
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
