const ProjectModel = require('../models/projectModel');

const dashboardController = {
  async getDashboard(req, res) {
    try {
      const [totalProjects, activeProjects, recentProjects] = await Promise.all([
        ProjectModel.countAll(),
        ProjectModel.countActive(),
        ProjectModel.findRecent(10),
      ]);
      const territoryId = req.query.territory ? Number(req.query.territory) : req.session.user.territoryId;
      const managerDashboard = await ProjectModel.getManagerDashboard({
        userId: req.session.user.id,
        role: req.session.user.role,
        territoryId,
      });

      res.json({
        user: req.session.user,
        stats: { totalProjects, activeProjects },
        recentProjects,
        dashboards: {
          projectManager: managerDashboard,
        },
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },
};

module.exports = dashboardController;
