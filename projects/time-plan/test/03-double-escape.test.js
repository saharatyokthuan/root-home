require('./helpers.js');
const { db, addSlot, escapeHTML } = require('../js/app.js');

// Test: addSlot() ต้องเก็บ label ดิบ (raw) ลง db ไม่ escape ล่วงหน้า
// การ escape ต้องเกิดครั้งเดียวตอน render เท่านั้น
function testAddSlotStoresRawLabel() {
  // Reset slots
  db.slots = [];

  const rawLabel = 'วิ่งเช้า & ฟิตเนส';
  const slot = addSlot('2026-10-26', '07:00', '08:00', rawLabel, 'ออกกำลังกาย');

  // label ใน db ต้องเป็นข้อความดิบ ไม่ escape
  if (slot.label !== rawLabel) {
    throw new Error(`addSlot() เก็บ label ที่ escape แล้ว: "${slot.label}" คาดหวังดิบ: "${rawLabel}"`);
  }

  // escapeHTML ต้องใช้ได้เมื่อ render (เรียกแยกต่างหาก)
  const escaped = escapeHTML(rawLabel);
  if (escaped !== 'วิ่งเช้า &amp; ฟิตเนส') {
    throw new Error(`escapeHTML("${rawLabel}") = "${escaped}" คาดหวัง "วิ่งเช้า &amp; ฟิตเนส"`);
  }

  console.log('PASS: addSlot stores raw label, escapeHTML works separately');
}

try {
  testAddSlotStoresRawLabel();
} catch (e) {
  console.error('FAIL (expected — RED phase):', e.message);
}
