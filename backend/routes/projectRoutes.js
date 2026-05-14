const express           = require('express');
const router            = express.Router();
const { requireAuth }   = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');

// All project routes require login
router.use(requireAuth);

router.get('/',                       projectController.list);
router.get('/:id',                    projectController.getById);
router.post('/',                      projectController.create);
router.put('/:id',                    projectController.update);
router.delete('/:id',                 projectController.deleteProject);
router.post('/:id/users',             projectController.assignUser);
router.delete('/:id/users/:userId',   projectController.removeUser);

module.exports = router;
