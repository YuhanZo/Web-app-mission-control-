const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getFinanceDashboard } = require('../controllers/financeController');

const router = express.Router();

router.get('/finance', requireAuth, getFinanceDashboard);

module.exports = router;
