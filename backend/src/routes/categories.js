const express = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All category routes require authentication
router.use(authMiddleware);

// Create category
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex color'),
    body('icon').optional().trim()
  ],
  CategoryController.create
);

// Get all categories
router.get('/', CategoryController.getAll);

// Get category by ID
router.get('/:id', CategoryController.getById);

// Update category
router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex color'),
    body('icon').optional().trim()
  ],
  CategoryController.update
);

// Delete category
router.delete('/:id', CategoryController.delete);

module.exports = router;
