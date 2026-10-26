require('./helpers.js');
const { db, deleteSlot, toggleSession, addSlot } = require('../js/app.js');

// Test: deleteSlot() และ toggleSession() ต้องยกเลิกการเปลี่ยนแปลงในหน่วยความจำ
// เมื่อ save() ล้มเหลว (Review Focus #4 — consistent rollback)
function testDeleteSlotRollbackOnSaveFailure() {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function () { throw new Error('QuotaExceeded'); };

  const originalAlert = global.alert;
  let alertCalled = false;
  global.alert = function () { alertCalled = true; };

  db.slots = [{ id: 's1', date: '2026-10-26', startTime: '07:00', endTime: '08:00', label: 'ทดสอบ', type: 'ออกกำลังกาย' }];
  db.sessions = [];

  deleteSlot('s1');

  localStorage.setItem = originalSetItem;
  global.alert = originalAlert;

  if (!alertCalled) {
    throw new Error('deleteSlot() ควรแจ้งเตือนเมื่อ save() ล้มเหลว');
  }
  if (db.slots.length !== 1 || db.slots[0].id !== 's1') {
    throw new Error(`deleteSlot() ควรยกเลิกการลบเมื่อ save() ล้มเหลว แต่เหลือ ${db.slots.length} รายการ`);
  }

  console.log('PASS: deleteSlot() rolls back on save failure');
}

function testToggleSessionRollbackOnSaveFailure() {
  const originalSetItem = localStorage.setItem;

  const originalAlert = global.alert;
  let alertCalled = false;
  global.alert = function () { alertCalled = true; };

  // สร้าง slot ก่อน (ขณะ setItem ยังทำงานปกติ)
  const slot = addSlot('2026-10-26', '07:00', '08:00', 'ทดสอบ', 'ออกกำลังกาย');
  db.sessions = [];

  // จากนั้น mock ให้ save() ล้มเหลวสำหรับ toggleSession เท่านั้น
  localStorage.setItem = function () { throw new Error('QuotaExceeded'); };

  toggleSession(slot.id);

  localStorage.setItem = originalSetItem;
  global.alert = originalAlert;

  if (!alertCalled) {
    throw new Error('toggleSession() ควรแจ้งเตือนเมื่อ save() ล้มเหลว');
  }
  const sess = db.sessions.find(s => s.slotId === slot.id);
  if (sess && sess.done) {
    throw new Error('toggleSession() ควรยกเลิกการทำเครื่องหมายเมื่อ save() ล้มเหลว');
  }

  console.log('PASS: toggleSession() rolls back on save failure');
}

try {
  testDeleteSlotRollbackOnSaveFailure();
  testToggleSessionRollbackOnSaveFailure();
} catch (e) {
  console.error('FAIL:', e.message);
}
