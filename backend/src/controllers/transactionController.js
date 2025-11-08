const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

class TransactionController {
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { walletId, categoryId, amount, type, description, transactionDate } = req.body;
      
      const transaction = await Transaction.create(
        req.userId,
        walletId,
        categoryId,
        amount,
        type,
        description,
        transactionDate
      );

      // Update wallet balance
      await Wallet.updateBalance(walletId);

      res.status(201).json({ transaction });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAll(req, res) {
    try {
      const filters = {
        walletId: req.query.walletId,
        categoryId: req.query.categoryId,
        type: req.query.type,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        limit: req.query.limit ? parseInt(req.query.limit) : null
      };

      const transactions = await Transaction.findByUserId(req.userId, filters);
      res.json({ transactions });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.id, req.userId);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ transaction });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { walletId, categoryId, amount, type, description, transactionDate } = req.body;
      
      // Get old transaction to update old wallet balance
      const oldTransaction = await Transaction.findById(req.params.id, req.userId);
      if (!oldTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      const transaction = await Transaction.update(
        req.params.id,
        req.userId,
        walletId,
        categoryId,
        amount,
        type,
        description,
        transactionDate
      );

      // Update wallet balances (both old and new if different)
      await Wallet.updateBalance(oldTransaction.wallet_id);
      if (walletId !== oldTransaction.wallet_id) {
        await Wallet.updateBalance(walletId);
      }

      res.json({ transaction });
    } catch (error) {
      console.error('Update transaction error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const transaction = await Transaction.delete(req.params.id, req.userId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Update wallet balance
      await Wallet.updateBalance(transaction.wallet_id);

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required' });
      }

      const summary = await Transaction.getSummary(req.userId, startDate, endDate);
      res.json({ summary });
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getCategoryBreakdown(req, res) {
    try {
      const { startDate, endDate, type } = req.query;
      
      if (!startDate || !endDate || !type) {
        return res.status(400).json({ 
          error: 'startDate, endDate, and type are required' 
        });
      }

      const breakdown = await Transaction.getCategoryBreakdown(
        req.userId,
        startDate,
        endDate,
        type
      );
      
      res.json({ breakdown });
    } catch (error) {
      console.error('Get category breakdown error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = TransactionController;
