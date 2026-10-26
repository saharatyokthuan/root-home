require('./helpers.js');
const { db, addSlot } = require('../js/app.js');

// Test: reserveSlot() / addSlot() ต้องบังคับกฎ "จองออกกำลังกายก่อนกิจกรรมอื่น"
// ถ้าวันนั้นมี slot type "ออกกำลังกาย" อยู่แล้ว ไม่อนุญาตให้จองประเภทอื่นในวันเดียวกัน
function testExerciseSlotPriority() {
  db.slots = [];
  db.sessions = [];

  const date = '2026-10-26';

  // จอง slot "ออกกำลังกาย" ก่อน
  const exerciseSlot = addSlot(date, '07:00', '08:00', 'วิ่งเช้า', 'ออกกำลังกาย');
  if (!exerciseSlot) {
    throw new Error('addSlot("ออกกำลังกาย") ควรสำเร็จเป็นครั้งแรก');
  }

  // พยายามจองประเภทอื่นในวันเดียวกัน ควรถูกปฏิเสธ
  const otherSlot = addSlot(date, '09:00', '10:00', 'ประชุม', 'อื่นๆ');
  if (otherSlot !== null) {
    throw new Error(`addSlot("อื่นๆ") ในวันที่มี "ออกกำลังกาย" อยู่แล้ว ควรคืน null แต่ได้ ${otherSlot ? otherSlot.id : otherSlot}`);
  }

  // ในวันที่ต่างกัน ควรจองประเภทอื่นได้
  const otherDate = '2026-10-27';
  const otherSlot2 = addSlot(otherDate, '09:00', '10:00', 'ประชุม', 'อื่นๆ');
  if (!otherSlot2) {
    throw new Error('addSlot("อื่นๆ") ในวันที่ต่างกัน ควรสำเร็จ');
  }

  console.log('PASS: exercise slot priority rule enforced');
}

try {
  testExerciseSlotPriority();
} catch (e) {
  console.error('FAIL (expected — RED phase):', e.message);
}
