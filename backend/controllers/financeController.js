const {
  getFinanceOverview,
  getMonthlyFinancials,
  getBillingDetail,
  getPayrollDetail,
  getChangeOrders,
  getBidPipeline,
} = require('../models/financeModel');

async function getFinanceDashboard(req, res, next) {
  try {
    const [overview, monthly, billing, payroll, changeOrders, bids] = await Promise.all([
      getFinanceOverview(),
      getMonthlyFinancials(),
      getBillingDetail(),
      getPayrollDetail(),
      getChangeOrders(),
      getBidPipeline(),
    ]);
    res.json({ overview, monthly, billing, payroll, changeOrders, bids });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFinanceDashboard };
