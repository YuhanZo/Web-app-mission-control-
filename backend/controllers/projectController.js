const ProjectModel     = require('../models/projectModel');
const ProjectUserModel = require('../models/projectUserModel');
const UserModel        = require('../models/userModel');

const projectController = {
  // GET /api/projects
  async list(req, res) {
    try {
      const projects = await ProjectModel.findAll();
      res.json({ projects });
    } catch (err) {
      console.error('projects.list error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  // GET /api/projects/:id
  async getById(req, res) {
    try {
      const project = await ProjectModel.findById(req.params.id);
      if (!project) return res.status(404).json({ error: 'Project not found.' });

      const assignedUsers = await ProjectUserModel.findByProjectId(project.id);
      res.json({ project, assignedUsers });
    } catch (err) {
      console.error('projects.getById error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  // POST /api/projects
  async create(req, res) {
    const { project_name } = req.body;
    if (!project_name || !project_name.trim()) {
      return res.status(400).json({ error: 'project_name is required.' });
    }
    try {
      const project = await ProjectModel.create(req.body);
      res.status(201).json({ project });
    } catch (err) {
      console.error('projects.create error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  // PUT /api/projects/:id
  async update(req, res) {
    try {
      const project = await ProjectModel.update(req.params.id, req.body);
      if (!project) return res.status(404).json({ error: 'Project not found.' });
      res.json({ project });
    } catch (err) {
      console.error('projects.update error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  // DELETE /api/projects/:id
  async deleteProject(req, res) {
    try {
      const project = await ProjectModel.findById(req.params.id);
      if (!project) return res.status(404).json({ error: 'Project not found.' });
      await ProjectModel.remove(req.params.id);
      res.json({ message: 'Project deleted.' });
    } catch (err) {
      console.error('projects.delete error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  // POST /api/projects/:id/users
  async assignUser(req, res) {
    const { user_id, relationship_type } = req.body;
    if (!user_id || !relationship_type) {
      return res.status(400).json({ error: 'user_id and relationship_type are required.' });
    }
    const validTypes = ['project_manager', 'estimator', 'installer', 'customer', 'accounting', 'support_specialist', 'vendor'];
    if (!validTypes.includes(relationship_type)) {
      return res.status(400).json({ error: `relationship_type must be one of: ${validTypes.join(', ')}` });
    }
    try {
      const user = await UserModel.findById(user_id);
      if (!user) return res.status(404).json({ error: 'User not found.' });

      const entry = await ProjectUserModel.assign(req.params.id, user_id, relationship_type);
      res.status(201).json({ entry });
    } catch (err) {
      console.error('projects.assignUser error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  // DELETE /api/projects/:id/users/:userId
  async removeUser(req, res) {
    try {
      const entry = await ProjectUserModel.remove(req.params.id, req.params.userId);
      if (!entry) return res.status(404).json({ error: 'Assignment not found.' });
      res.json({ message: 'User removed from project.' });
    } catch (err) {
      console.error('projects.removeUser error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },
};

module.exports = projectController;
