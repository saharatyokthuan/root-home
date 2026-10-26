require('./helpers.js');
const { db, reserveSlot } = require('../js/app.js');

// Test: reserveSlot() ต้องปฏิเสธช่วงเวลาทับซ้อนกับช่วงเดิม (Review Focus #2)
function testReserveSlotRejectsOverlap() {
  // Reset slots
  db.slots = [];
  db.sessions = [];

  const date = '2026-10-26';

  // จองช่วงแรก 07:00-08:00
  const first = reserveSlot(date, '07:00', '08:00', 'วิ่งเช้า', 'ออกกำลังกาย');
  if (!first) {
    throw new Error('reserveSlot() ควรจองช่วงแรกสำเร็จ แต่คืน false');
  }
  if (db.slots.length !== 1) {
    throw new Error(`db.slots ควรมี 1 รายการ หลังจองช่วงแรก แต่มี ${db.slots.length}`);
  }

  // พยายามจองทับซ้อน 07:30-08:30
  const overlap = reserveSlot(date, '07:30', '08:30', 'ทับซ้อน', 'ออกกำลังกาย');
  if (overlap !== false) {
    throw new Error(`reserveSlot() ควรคืน false เมื่อช่วงเวลาทับซ้อน แต่คืน ${overlap}`);
  }
  if (db.slots.length !== 1) {
    throw new Error(`db.slots ควรยังมี 1 รายการ หลังปฏิเสธช่วงทับซ้อน แต่มี ${db.slots.length}`);
  }

  // ช่วงที่ไม่ทับกัน 08:00-09:00 ควรจองได้
  const next = reserveSlot(date, '08:00', '09:00', 'ว่ายน้ำ', 'ออกกำลังกาย');
  if (!next) {
    throw new Error('reserveSlot() ควรจองช่วงที่ไม่ทับกันสำเร็จ แต่คืน false');
  }
  if (db.slots.length !== 2) {
    throw new Error(`db.slots ควรมี 2 รายการ หลังจองช่วงที่สอง แต่มี ${db.slots.length}`);
  }

  console.log('PASS: reserveSlot() rejects overlapping slots and accepts non-overlapping ones');
}

try {
  testReserveSlotRejectsOverlap();
} catch (e) {
  console.error('FAIL:', e.message);
}
