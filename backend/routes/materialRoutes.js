const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const db = require('../config/db');

// GET all materials (optionally filter by stage)
router.get('/materials', requireAuth, async (req, res, next) => {
  try {
    const { stage } = req.query;
    const { rows } = await db.query(
      `SELECT m.*, p.project_name AS linked_project_name
       FROM materials m
       LEFT JOIN projects p ON p.id = m.project_id
       ${stage ? 'WHERE m.stage = $1' : ''}
       ORDER BY m.stage, m.sort_order, m.created_at`,
      stage ? [stage] : []
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST create
router.post('/materials', requireAuth, async (req, res, next) => {
  try {
    const { project_id, project_name, stage, city, assigned_to, scheduled_date,
            install_date, vendor, notes, eta, tracking_number } = req.body;
    const { rows } = await db.query(
      `INSERT INTO materials
         (project_id, project_name, stage, city, assigned_to, scheduled_date,
          install_date, vendor, notes, eta, tracking_number)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [project_id || null, project_name || null, stage || 'schedule_calls',
       city || null, assigned_to || null, scheduled_date || null,
       install_date || null, vendor || null, notes || null,
       eta || null, tracking_number || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PATCH update (including stage move)
router.patch('/materials/:id', requireAuth, async (req, res, next) => {
  try {
    const fields = ['stage','city','assigned_to','scheduled_date','install_date',
                    'vendor','notes','eta','tracking_number','billed','sort_order','project_name'];
    const updates = [];
    const values  = [];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        values.push(req.body[f]);
        updates.push(`${f} = $${values.length}`);
      }
    });
    if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });
    values.push(req.params.id);
    const { rows } = await db.query(
      `UPDATE materials SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/materials/:id', requireAuth, async (req, res, next) => {
  try {
    await db.query('DELETE FROM materials WHERE id = $1', [req.params.id]);
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
