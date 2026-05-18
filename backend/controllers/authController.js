const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const authController = {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const user = await UserModel.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Store minimal user info in session — never store password_hash
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        territoryId: user.territory_id,
      };

      res.json({ user: req.session.user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  logout(req, res) {
    req.session.destroy(() => res.json({ message: 'Logged out.' }));
  },

  // Returns the currently logged-in user from session
  me(req, res) {
    res.json({ user: req.session.user });
  },
};

module.exports = authController;
