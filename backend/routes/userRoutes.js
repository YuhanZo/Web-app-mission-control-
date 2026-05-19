const express           = require('express');
const userController    = require('../controllers/userController');
const ProjectUserModel  = require('../models/projectUserModel');
const db                = require('../config/db');
const { requireAuth }   = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',                 requireAuth, userController.list);
router.post('/',                requireAuth, userController.create);
router.get('/roles',            requireAuth, userController.roles);
router.put('/:id',              requireAuth, userController.update);
router.patch('/:id/deactivate', requireAuth, userController.deactivate);

// Simple projects list for assignment dropdown
router.get('/projects-list', requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, job_number, project_name, status
         FROM projects
        WHERE status IN ('active', 'pending')
        ORDER BY job_number`
    );
    res.json({ projects: rows });
  } catch (err) { next(err); }
});

// GET assigned projects for a user
router.get('/:id/projects', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT pu.project_id, p.job_number, p.project_name, p.status, pu.relationship_type
         FROM project_users pu
         JOIN projects p ON p.id = pu.project_id
        WHERE pu.user_id = $1
        ORDER BY p.job_number`,
      [req.params.id]
    );
    res.json({ projects: rows });
  } catch (err) { next(err); }
});

// POST assign user to project
router.post('/:id/projects', requireAuth, async (req, res, next) => {
  try {
    const { project_id, relationship_type = 'installer' } = req.body;
    if (!project_id) return res.status(400).json({ error: 'project_id required' });
    const row = await ProjectUserModel.assign(project_id, req.params.id, relationship_type);
    res.status(201).json({ assignment: row });
  } catch (err) { next(err); }
});

// DELETE unassign user from project
router.delete('/:id/projects/:projectId', requireAuth, async (req, res, next) => {
  try {
    await ProjectUserModel.remove(req.params.projectId, req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
