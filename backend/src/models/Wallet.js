const pool = require('../config/database');

class Wallet {
  static async create(userId, name, currency = 'USD') {
    const result = await pool.query(
      'INSERT INTO wallets (user_id, name, currency, balance) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, currency, 0]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM wallets WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM wallets WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async update(id, userId, name, currency) {
    const result = await pool.query(
      'UPDATE wallets SET name = $1, currency = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, currency, id, userId]
    );
    
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM wallets WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async updateBalance(walletId) {
    const result = await pool.query(
      `UPDATE wallets 
       SET balance = (
         SELECT COALESCE(SUM(
           CASE 
             WHEN type = 'income' THEN amount 
             WHEN type = 'expense' THEN -amount 
           END
         ), 0)
         FROM transactions 
         WHERE wallet_id = $1
       )
       WHERE id = $1
       RETURNING balance`,
      [walletId]
    );
    
    return result.rows[0];
  }
}

module.exports = Wallet;
