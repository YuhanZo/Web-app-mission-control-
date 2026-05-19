const db   = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
  async findAll() {
    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.active, u.created_at,
              u.territory_id, t.name AS territory_name,
              r.name AS role_name, r.id AS role_id
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
         LEFT JOIN territories t ON t.id = u.territory_id
        ORDER BY u.name`
    );
    return rows;
  },

  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
        WHERE u.email = $1 AND u.active = true`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password, role_id, phone }) {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role_id, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role_id, active, created_at`,
      [name, email, hash, role_id || null, phone || null]
    );
    return rows[0];
  },

  async update(id, { name, email, phone, role_id, territory_id }) {
    const { rows } = await db.query(
      `UPDATE users
          SET name = $1, email = $2, phone = $3, role_id = $4, territory_id = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING id, name, email, phone, role_id, territory_id, active, created_at`,
      [name, email, phone || null, role_id || null, territory_id || null, id]
    );
    return rows[0] || null;
  },

  async deactivate(id) {
    const { rows } = await db.query(
      `UPDATE users SET active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 RETURNING id, name, active`,
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = UserModel;
