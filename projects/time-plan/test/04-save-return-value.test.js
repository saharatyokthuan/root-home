require('./helpers.js');
const { save, addSlot } = require('../js/app.js');

// Test 1: save() ต้องคืน false เมื่อ localStorage setItem โยนข้อผิดพลาด
function testSaveReturnsFalseOnFailure() {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function () { throw new Error('QuotaExceeded'); };

  try {
    const result = save();
    if (result !== false) {
      throw new Error(`save() ควรคืน false เมื่อ localStorage ล้มเหลว แต่ได้ ${result}`);
    }
    console.log('PASS: save() returns false on localStorage failure');
  } finally {
    localStorage.setItem = originalSetItem;
  }
}

// Test 2: addSlot() ต้องจัดการเมื่อ save() ล้มเหลว (ไม่พัง แจ้งผู้ใช้ผ่าน alert)
let alertCalled = false;
const originalAlert = global.alert;
global.alert = function (msg) { alertCalled = true; console.log('alert:', msg); };

function testAddSlotHandlesSaveFailure() {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function () { throw new Error('QuotaExceeded'); };

  alertCalled = false;

  try {
    addSlot('2026-10-26', '07:00', '08:00', 'ทดสอบ', 'ออกกำลังกาย');
    if (!alertCalled) {
      throw new Error('addSlot() ควรแจ้งผู้ใช้ (ผ่าน alert) เมื่อ save() ล้มเหลว');
    }
    console.log('PASS: addSlot() alerts when save() fails');
  } finally {
    localStorage.setItem = originalSetItem;
    global.alert = originalAlert;
    alertCalled = false;
  }
}

try {
  testSaveReturnsFalseOnFailure();
  testAddSlotHandlesSaveFailure();
} catch (e) {
  console.error('FAIL (expected — RED phase):', e.message);
}
