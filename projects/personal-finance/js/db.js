// db.js - localStorage data layer สำหรับแอปการเงินส่วนตัว
// คีย์หลัก: finance_v1

const DB = {
  KEY: 'finance_v1',

  _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  _set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  },

  // ---- Initialization ----
  init() {
    const data = this._get(this.KEY, null);
    if (data === null) {
      this._set(this.KEY, {
        transactions: [
          {
            id: Utils.uid(),
            type: 'income',
            amount: 15000,
            category: 'เงินเดือน',
            date: Utils.todayStr(),
            note: 'เงินเดือนเดือนนี้',
            createdAt: Date.now()
          }
        ],
        categories: [
          { id: Utils.uid(), name: 'เงินเดือน', type: 'income' },
          { id: Utils.uid(), name: 'รายรับอื่นๆ', type: 'income' },
          { id: Utils.uid(), name: 'อาหาร', type: 'expense' },
          { id: Utils.uid(), name: 'เดินทาง', type: 'expense' },
          { id: Utils.uid(), name: 'ที่พัก/หอพัก', type: 'expense' },
          { id: Utils.uid(), name: 'ของใช้ส่วนตัว', type: 'expense' },
          { id: Utils.uid(), name: 'อื่นๆ', type: 'expense' }
        ],
        settings: { currency: 'THB' }
      });
    }
  },

  // ---- Transactions ----
  getTransactions() {
    const data = this._get(this.KEY, { transactions: [] });
    return (data.transactions || [])
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  },

  addTransaction(t) {
    const data = this._get(this.KEY, { transactions: [], categories: [], settings: {} });
    const tx = {
      id: Utils.uid(),
      createdAt: Date.now(),
      ...t
    };
    data.transactions.push(tx);
    return this._set(this.KEY, data) ? tx : null;
  },

  deleteTransaction(id) {
    const data = this._get(this.KEY, { transactions: [] });
    data.transactions = (data.transactions || []).filter(t => t.id !== id);
    return this._set(this.KEY, data);
  },

  // ---- Categories ----
  getCategories(type) {
    const data = this._get(this.KEY, { categories: [] });
    const cats = data.categories || [];
    return type ? cats.filter(c => c.type === type) : cats;
  },

  addCategory(name, type) {
    const data = this._get(this.KEY, { categories: [] });
    data.categories.push({ id: Utils.uid(), name, type });
    return this._set(this.KEY, data);
  },

  deleteCategory(id) {
    const data = this._get(this.KEY, { categories: [] });
    data.categories = (data.categories || []).filter(c => c.id !== id);
    return this._set(this.KEY, data);
  },

  // ---- Monthly Summary ----
  monthlySummary(monthKey) {
    const data = this._get(this.KEY, { transactions: [] });
    const txs = data.transactions || [];
    let income = 0;
    let expense = 0;
    for (const t of txs) {
      if (Utils.monthKey(t.date) !== monthKey) continue;
      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  },

  currentMonthKey() {
    return Utils.monthKey(Utils.todayStr());
  },

  // ---- Settings / backup ----
  getSettings() {
    const data = this._get(this.KEY, { settings: {} });
    return data.settings || {};
  },

  setSettings(s) {
    const data = this._get(this.KEY, { settings: {} });
    data.settings = { ...data.settings, ...s };
    return this._set(this.KEY, data);
  },

  exportAll() {
    return this._get(this.KEY, null);
  },

  importAll(data) {
    if (!data || typeof data !== 'object') return false;
    return this._set(this.KEY, data);
  },

  clearAll() {
    return this._set(this.KEY, {
      transactions: [],
      categories: [],
      settings: { currency: 'THB' }
    });
  }
};

DB.init();
