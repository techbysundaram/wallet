import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async register(username, email, password) {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('authToken');
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};

export const walletService = {
  async getAll() {
    const response = await api.get('/wallets');
    return response.data.wallets;
  },

  async getById(id) {
    const response = await api.get(`/wallets/${id}`);
    return response.data.wallet;
  },

  async create(name, currency = 'USD') {
    const response = await api.post('/wallets', { name, currency });
    return response.data.wallet;
  },

  async update(id, name, currency) {
    const response = await api.put(`/wallets/${id}`, { name, currency });
    return response.data.wallet;
  },

  async delete(id) {
    const response = await api.delete(`/wallets/${id}`);
    return response.data;
  },
};

export const categoryService = {
  async getAll(type = null) {
    const params = type ? { type } : {};
    const response = await api.get('/categories', { params });
    return response.data.categories;
  },

  async getById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
  },

  async create(name, type, color, icon) {
    const response = await api.post('/categories', { name, type, color, icon });
    return response.data.category;
  },

  async update(id, name, type, color, icon) {
    const response = await api.put(`/categories/${id}`, { name, type, color, icon });
    return response.data.category;
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const transactionService = {
  async getAll(filters = {}) {
    const response = await api.get('/transactions', { params: filters });
    return response.data.transactions;
  },

  async getById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data.transaction;
  },

  async create(walletId, categoryId, amount, type, description, transactionDate) {
    const response = await api.post('/transactions', {
      walletId,
      categoryId,
      amount,
      type,
      description,
      transactionDate,
    });
    return response.data.transaction;
  },

  async update(id, walletId, categoryId, amount, type, description, transactionDate) {
    const response = await api.put(`/transactions/${id}`, {
      walletId,
      categoryId,
      amount,
      type,
      description,
      transactionDate,
    });
    return response.data.transaction;
  },

  async delete(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  async getSummary(startDate, endDate) {
    const response = await api.get('/transactions/summary', {
      params: { startDate, endDate },
    });
    return response.data.summary;
  },

  async getCategoryBreakdown(startDate, endDate, type) {
    const response = await api.get('/transactions/breakdown', {
      params: { startDate, endDate, type },
    });
    return response.data.breakdown;
  },
};
