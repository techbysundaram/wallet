const pool = require('../config/database');

class Category {
  static async create(userId, name, type, color, icon) {
    const result = await pool.query(
      'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, type, color, icon]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId, type = null) {
    let query = 'SELECT * FROM categories WHERE user_id = $1';
    const params = [userId];
    
    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }
    
    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async update(id, userId, name, type, color, icon) {
    const result = await pool.query(
      'UPDATE categories SET name = $1, type = $2, color = $3, icon = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, type, color, icon, id, userId]
    );
    
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    
    return result.rows[0];
  }
}

module.exports = Category;
