const express = require('express');
const { body } = require('express-validator');
const WalletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All wallet routes require authentication
router.use(authMiddleware);
router.use(apiLimiter);

// Create wallet
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Wallet name is required'),
    body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters')
  ],
  WalletController.create
);

// Get all wallets
router.get('/', WalletController.getAll);

// Get wallet by ID
router.get('/:id', WalletController.getById);

// Update wallet
router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Wallet name is required'),
    body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters')
  ],
  WalletController.update
);

// Delete wallet
router.delete('/:id', WalletController.delete);

module.exports = router;
