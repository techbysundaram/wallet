const pool = require('../config/database');

class Transaction {
  static async create(userId, walletId, categoryId, amount, type, description, transactionDate) {
    const result = await pool.query(
      `INSERT INTO transactions 
       (user_id, wallet_id, category_id, amount, type, description, transaction_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, walletId, categoryId, amount, type, description, transactionDate]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color, 
             c.icon as category_icon, w.name as wallet_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN wallets w ON t.wallet_id = w.id
      WHERE t.user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (filters.walletId) {
      query += ` AND t.wallet_id = $${paramIndex}`;
      params.push(filters.walletId);
      paramIndex++;
    }

    if (filters.categoryId) {
      query += ` AND t.category_id = $${paramIndex}`;
      params.push(filters.categoryId);
      paramIndex++;
    }

    if (filters.type) {
      query += ` AND t.type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters.startDate) {
      query += ` AND t.transaction_date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND t.transaction_date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.color as category_color, 
              c.icon as category_icon, w.name as wallet_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN wallets w ON t.wallet_id = w.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async update(id, userId, walletId, categoryId, amount, type, description, transactionDate) {
    const result = await pool.query(
      `UPDATE transactions 
       SET wallet_id = $1, category_id = $2, amount = $3, type = $4, 
           description = $5, transaction_date = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8 
       RETURNING *`,
      [walletId, categoryId, amount, type, description, transactionDate, id, userId]
    );
    
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async getSummary(userId, startDate, endDate) {
    const result = await pool.query(
      `SELECT 
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
         COUNT(*) as total_transactions
       FROM transactions
       WHERE user_id = $1 AND transaction_date BETWEEN $2 AND $3`,
      [userId, startDate, endDate]
    );
    
    return result.rows[0];
  }

  static async getCategoryBreakdown(userId, startDate, endDate, type) {
    const result = await pool.query(
      `SELECT c.name, c.color, c.icon, SUM(t.amount) as total, COUNT(t.id) as count
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.type = $2 AND t.transaction_date BETWEEN $3 AND $4
       GROUP BY c.id, c.name, c.color, c.icon
       ORDER BY total DESC`,
      [userId, type, startDate, endDate]
    );
    
    return result.rows;
  }
}

module.exports = Transaction;
