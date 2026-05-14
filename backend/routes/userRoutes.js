const express        = require('express');
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',                   requireAuth, userController.list);
router.post('/',                  requireAuth, userController.create);
router.get('/roles',              requireAuth, userController.roles);
router.put('/:id',                requireAuth, userController.update);
router.patch('/:id/deactivate',   requireAuth, userController.deactivate);

module.exports = router;
