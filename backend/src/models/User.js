const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async createDefaultWalletAndCategories(userId) {
    // Create default wallet
    const walletResult = await pool.query(
      'INSERT INTO wallets (user_id, name, balance) VALUES ($1, $2, $3) RETURNING id',
      [userId, 'My Wallet', 0]
    );

    // Copy default categories for the user
    await pool.query(
      `INSERT INTO categories (user_id, name, type, color, icon)
       SELECT $1, name, type, color, icon FROM default_categories`,
      [userId]
    );

    return walletResult.rows[0].id;
  }
}

module.exports = User;
