const express = require('express');
const { body } = require('express-validator');
const TransactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All transaction routes require authentication
router.use(authMiddleware);
router.use(apiLimiter);

// Create transaction
router.post(
  '/',
  [
    body('walletId').isInt().withMessage('Wallet ID is required'),
    body('categoryId').optional().isInt(),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('description').optional().trim(),
    body('transactionDate').isDate().withMessage('Valid transaction date is required')
  ],
  TransactionController.create
);

// Get all transactions
router.get('/', TransactionController.getAll);

// Get summary
router.get('/summary', TransactionController.getSummary);

// Get category breakdown
router.get('/breakdown', TransactionController.getCategoryBreakdown);

// Get transaction by ID
router.get('/:id', TransactionController.getById);

// Update transaction
router.put(
  '/:id',
  [
    body('walletId').isInt().withMessage('Wallet ID is required'),
    body('categoryId').optional().isInt(),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('description').optional().trim(),
    body('transactionDate').isDate().withMessage('Valid transaction date is required')
  ],
  TransactionController.update
);

// Delete transaction
router.delete('/:id', TransactionController.delete);

module.exports = router;
