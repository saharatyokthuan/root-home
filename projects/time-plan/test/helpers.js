// Mock browser environment for testing time-plan app.js
// Runs BEFORE app.js is loaded

// --- localStorage mock ---
const _store = {};
global.localStorage = {
  getItem(key) { return _store[key] || null; },
  setItem(key, val) { _store[key] = String(val); },
  removeItem(key) { delete _store[key]; },
  clear() { Object.keys(_store).forEach(k => delete _store[k]); },
  get length() { return Object.keys(_store).length; },
  key(i) { return Object.keys(_store)[i] || null; }
};

// --- document mock (minimal: enough for app.js init() and renderers) ---
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

// --- window mocks ---
global.window = global;
global.alert = function () {};
global.prompt = function () { return null; };
global.confirm = function () { return false; };
global.Date = Date;
