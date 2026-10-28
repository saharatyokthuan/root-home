// ทดสอบ lógica ของแอป personal-finance โดยจำลอง browser environment
// โหลด utils.js, db.js แล้วทดสอบฟังก์ชันหลักทีละขั้นตอน

// ===== Mock browser environment =====
const _store = {};
global.localStorage = {
  getItem(key) { return _store[key] || null; },
  setItem(key, val) { _store[key] = String(val); },
  removeItem(key) { delete _store[key]; },
  clear() { Object.keys(_store).forEach(k => delete _store[k]); },
  get length() { return Object.keys(_store).length; },
  key(i) { return Object.keys(_store)[i] || null; }
};

function mockEl() {
  return {
    textContent: '',
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(v) { this._innerHTML = v; },
    set textContent(v) {
      this._textContent = v;
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      this._innerHTML = String(v).replace(/[&<>"']/g, c => map[c]);
    },
    classList: { add() {}, remove() {}, contains() { return false; } },
    style: {},
    onclick: null,
    addEventListener() {},
    removeAttribute() {},
    setAttribute() {},
    appendChild() {},
    value: '',
    checked: false
  };
}

global.document = {
  createElement(tag) { return mockEl(); },
  getElementById() { return mockEl(); },
  querySelectorAll() { return []; },
  querySelector() { return null; }
};

global.alert = function (msg) { console.log('[alert]', msg); };
global.confirm = function () { return true; };
global.URL = { createObjectURL() { return 'blob:mock'; }, revokeObjectURL() {} };

// ===== โหลดไฟล์ JS =====
const { Utils } = require('./js/utils.js');
globalThis.Utils = Utils;
const { DB } = require('./js/db.js');
DB.init();

// ===== ทดสอบ =====
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log('  PASS:', message);
  } else {
    failed++;
    console.error('  FAIL:', message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    passed++;
    console.log('  PASS:', message);
  } else {
    failed++;
    console.error('  FAIL:', message + ` (คาดหวัง: ${JSON.stringify(expected)}, ได้: ${JSON.stringify(actual)})`);
  }
}

// ---------- Test 1: DB.init() ----------
console.log('\n--- Test 1: DB.init() สร้างข้อมูลเริ่มต้น ---');
assert(DB.getTransactions().length === 1, 'มีรายการเริ่มต้น 1 รายการ (เงินเดือน)');
assert(DB.getCategories('income').length >= 1, 'มีหมวดหมู่รายรับอย่างน้อย 1 หมวด');
assert(DB.getCategories('expense').length >= 1, 'มีหมวดหมู่รายจ่ายอย่างน้อย 1 หมวด');
assertEqual(DB.currentMonthKey().length, 7, 'monthKey เป็นรูปแบบ YYYY-MM (7 ตัวอักษร)');

// ---------- Test 2: addTransaction() ----------
console.log('\n--- Test 2: addTransaction() ---');
const beforeCount = DB.getTransactions().length;
const tx = DB.addTransaction({ type: 'expense', amount: 150, category: 'อาหาร', date: '2026-10-26', note: 'ค่ากาแฟ' });
assert(tx !== null, 'addTransaction คืนค่ารายการ ไม่ใช่ null');
assert(tx.id.startsWith('id_'), 'รายการมี id เริ่มต้นด้วย id_');
assert(tx.type === 'expense', 'ประเภทเป็น expense');
assertEqual(tx.amount, 150, 'จำนวนเงิน 150');
assertEqual(tx.category, 'อาหาร', 'หมวดหมู่ อาหาร');
assertEqual(tx.date, '2026-10-26', 'วันที่ 2026-10-26');
assertEqual(tx.note, 'ค่ากาแฟ', 'หมายเหตุ ค่ากาแฟ');
assert(DB.getTransactions().length === beforeCount + 1, 'จำนวนรายการเพิ่มขึ้น 1 รายการ');

// ---------- Test 3: getTransactions() เรียงจากใหม่ไปเก่า ----------
console.log('\n--- Test 3: getTransactions() เรียงจากใหม่ไปเก่า ---');
const txs = DB.getTransactions();
assert(txs[0].date >= txs[1].date || (txs[0].date === txs[1].date && txs[0].createdAt >= txs[1].createdAt), 'รายการแรกใหม่ที่สุด');

// ---------- Test 4: monthlySummary() ----------
console.log('\n--- Test 4: monthlySummary() ---');
const monthKey = '2026-10';
const summary = DB.monthlySummary(monthKey);
assert(typeof summary.income === 'number', 'income เป็นตัวเลข');
assert(typeof summary.expense === 'number', 'expense เป็นตัวเลข');
assert(typeof summary.balance === 'number', 'balance เป็นตัวเลข');
assertEqual(summary.balance, summary.income - summary.expense, 'balance = income - expense');

// ---------- Test 5: getCategories() ----------
console.log('\n--- Test 5: getCategories() ---');
const incCats = DB.getCategories('income');
const expCats = DB.getCategories('expense');
assert(incCats.every(c => c.type === 'income', 'หมวดหมู่รายรับทั้งหมดเป็น type income'));
assert(expCats.every(c => c.type === 'expense', 'หมวดหมู่รายจ่ายทั้งหมดเป็น type expense'));

// ---------- Test 6: addCategory() / deleteCategory() ----------
console.log('\n--- Test 6: addCategory() / deleteCategory() ---');
const beforeCatCount = DB.getCategories('expense').length;
DB.addCategory('ค่าผ่อนบ้าน', 'expense');
assert(DB.getCategories('expense').length === beforeCatCount + 1, 'เพิ่มหมวดหมู่รายจ่ายแล้วจำนวนเพิ่มขึ้น');

const newCat = DB.getCategories('expense').find(c => c.name === 'ค่าผ่อนบ้าน');
assert(newCat !== undefined, 'หมวดหมู่ค่าผ่อนบ้านถูกสร้าง');
assert(newCat.type === 'expense', 'หมวดหมู่ค่าผ่อนบ้านเป็น type expense');

DB.deleteCategory(newCat.id);
assert(DB.getCategories('expense').length === beforeCatCount, 'ลบหมวดหมู่แล้วจำนวนกลับมาเท่าเดิม');

// ---------- Test 7: deleteTransaction() ----------
console.log('\n--- Test 7: deleteTransaction() ---');
const beforeTxCount = DB.getTransactions().length;
DB.deleteTransaction(tx.id);
assert(DB.getTransactions().length === beforeTxCount - 1, 'ลบรายการแล้วจำนวนลดลง 1');

// ---------- Test 8: escapeHTML() ----------
console.log('\n--- Test 8: escapeHTML() ป้องกัน XSS ---');
assertEqual(Utils.escapeHTML('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'escape HTML tags และ quotes');
assertEqual(Utils.escapeHTML('วิ่งเช้า & ฟิตเนส'), 'วิ่งเช้า &amp; ฟิตเนส', 'escape ampersand');

// ---------- Test 9: Utils.todayStr() ----------
console.log('\n--- Test 9: Utils.todayStr() วันที่ท้องถิ่น ---');
const today = Utils.todayStr();
assert(/^\d{4}-\d{2}-\d{2}$/.test(today), 'todayStr คืนรูปแบบ YYYY-MM-DD');
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const expected = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
assertEqual(today, expected, 'todayStr ตรงกับวันที่ท้องถิ่น');

// ---------- Test 10: Utils.isValidDate() ----------
console.log('\n--- Test 10: Utils.isValidDate() ---');
assert(Utils.isValidDate('2026-10-26') === true, '2026-10-26 ถูกต้อง');
assert(Utils.isValidDate('2026-13-01') === false, 'เดือน 13 ไม่ถูกต้อง');
assert(Utils.isValidDate('2026-02-30') === false, 'วันที่ 30 เดือน 2 ไม่ถูกต้อง');
assert(Utils.isValidDate('abc') === false, 'abc ไม่ถูกต้อง');
assert(Utils.isValidDate('') === false, 'วันที่ว่างไม่ถูกต้อง');

// ---------- Test 11: Utils.money() ----------
console.log('\n--- Test 11: Utils.money() ---');
const formatted = Utils.money(1500.5);
assert(typeof formatted === 'string', 'money คืนสตริง');
assert(formatted.includes('1,500.50') || formatted.includes('1,500.5'), 'money formatted ถูกต้อง');

// ---------- Test 12: import/export ----------
console.log('\n--- Test 12: import/export ข้อมูล ---');
const exported = DB.exportAll();
assert(exported !== null, 'exportAll คืนข้อมูลไม่ใช่ null');
assert(exported.transactions.length >= 1, 'ข้อมูลส่งออกมี transactions');
assert(exported.categories.length >= 1, 'ข้อมูลส่งออกมี categories');

// ทดสอบ import
const testData = {
  transactions: [{ id: 'test_1', type: 'income', amount: 5000, category: 'ทดสอบ', date: '2026-10-26', note: 'ทดสอบ import', createdAt: Date.now() }],
  categories: [],
  settings: { currency: 'THB' }
};
assert(DB.importAll(testData) === true, 'importAll สำเร็จ');
const imported = DB.getTransactions().find(t => t.id === 'test_1');
assert(imported !== undefined, 'รายการที่ import เข้ามาอยู่ในระบบ');

// ---------- Test 13: clearAll() ----------
console.log('\n--- Test 13: clearAll() ---');
DB.clearAll();
assert(DB.getTransactions().length === 0, 'หลังล้างข้อมูล transactions ว่าง');
assert(DB.getCategories('income').length === 0, 'หลังล้างข้อมูล categories ว่าง');

// ---------- สรุป ----------
console.log('\n========================================');
console.log(`ผลการทดสอบ: ${passed} ผ่าน, ${failed} ไม่ผ่าน`);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
