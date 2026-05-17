const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/analytics', requireAuth, getAnalytics);

module.exports = router;
