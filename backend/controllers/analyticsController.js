const {
  getRevenueByTerritory,
  getTopCustomers,
  getMonthlyRevenue,
  getInvoiceAging,
  getExpenseBreakdown,
  getBidsFull,
} = require('../models/analyticsModel');

async function getAnalytics(req, res, next) {
  try {
    const [revenueByTerritory, topCustomers, monthlyRevenue, invoices, expenses, bids] =
      await Promise.all([
        getRevenueByTerritory(),
        getTopCustomers(),
        getMonthlyRevenue(),
        getInvoiceAging(),
        getExpenseBreakdown(),
        getBidsFull(),
      ]);

    res.json({ revenueByTerritory, topCustomers, monthlyRevenue, invoices, expenses, bids });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics };
