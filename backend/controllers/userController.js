const UserModel = require('../models/userModel');
const RoleModel = require('../models/roleModel');

const userController = {
  async list(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, email, password, role_id, phone } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email, and password are required.' });
      }
      const user = await UserModel.create({ name, email, password, role_id, phone });
      res.status(201).json({ user });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already in use.' });
      }
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { name, email, phone, role_id } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required.' });
      }
      const user = await UserModel.update(req.params.id, { name, email, phone, role_id });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json({ user });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already in use.' });
      }
      next(err);
    }
  },

  async deactivate(req, res, next) {
    try {
      const user = await UserModel.deactivate(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json({ message: `${user.name} has been deactivated.` });
    } catch (err) {
      next(err);
    }
  },

  async roles(req, res, next) {
    try {
      const roles = await RoleModel.findAll();
      res.json({ roles });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
