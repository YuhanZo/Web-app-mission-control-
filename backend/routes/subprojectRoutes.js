const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/subprojectController');

// All subprojects (for Gantt view)
router.get('/subprojects',                        requireAuth, ctrl.listAll);

// Per-project subprojects
router.get('/projects/:projectId/subprojects',    requireAuth, ctrl.list);
router.post('/projects/:projectId/subprojects',   requireAuth, ctrl.create);
router.patch('/subprojects/:id',                  requireAuth, ctrl.update);
router.delete('/subprojects/:id',                 requireAuth, ctrl.remove);

module.exports = router;
