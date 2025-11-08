const { validationResult } = require('express-validator');
const Wallet = require('../models/Wallet');

class WalletController {
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, currency } = req.body;
      const wallet = await Wallet.create(req.userId, name, currency);

      res.status(201).json({ wallet });
    } catch (error) {
      console.error('Create wallet error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAll(req, res) {
    try {
      const wallets = await Wallet.findByUserId(req.userId);
      res.json({ wallets });
    } catch (error) {
      console.error('Get wallets error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const wallet = await Wallet.findById(req.params.id, req.userId);
      
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      res.json({ wallet });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, currency } = req.body;
      const wallet = await Wallet.update(req.params.id, req.userId, name, currency);

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      res.json({ wallet });
    } catch (error) {
      console.error('Update wallet error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const wallet = await Wallet.delete(req.params.id, req.userId);

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      res.json({ message: 'Wallet deleted successfully' });
    } catch (error) {
      console.error('Delete wallet error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = WalletController;
