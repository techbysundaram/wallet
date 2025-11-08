const { validationResult } = require('express-validator');
const Category = require('../models/Category');

class CategoryController {
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, type, color, icon } = req.body;
      const category = await Category.create(req.userId, name, type, color, icon);

      res.status(201).json({ category });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAll(req, res) {
    try {
      const { type } = req.query;
      const categories = await Category.findByUserId(req.userId, type);
      res.json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const category = await Category.findById(req.params.id, req.userId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ category });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, type, color, icon } = req.body;
      const category = await Category.update(
        req.params.id,
        req.userId,
        name,
        type,
        color,
        icon
      );

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ category });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const category = await Category.delete(req.params.id, req.userId);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = CategoryController;
