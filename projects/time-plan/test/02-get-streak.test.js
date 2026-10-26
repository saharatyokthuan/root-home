require('./helpers.js');
const { db, addSlot, toggleSession, getStreak, todayStr } = require('../js/app.js');

// Test: getStreak() ต้องนับสตรีคจากวันที่ท้องถิ่น (ไม่ใช่ UTC)
// ถ้าเขียน session สำหรับวันนี้ streak ต้องไม่น้อยกว่า 1
function testGetStreakWithTodaySession() {
  // Reset db
  db.slots = [];
  db.sessions = [];
  db.targetMinutes = 30;

  const today = todayStr();

  // เพิ่ม slot สำหรับวันนี้แล้วทำเครื่องหมายเสร็จ
  const slot = addSlot(today, '07:00', '08:00', 'วิ่งเช้า', 'ออกกำลังกาย');
  toggleSession(slot.id);

  const streak = getStreak();
  if (streak < 1) {
    throw new Error(`getStreak() ควร >= 1 เมื่อมี session เสร็จสำหรับวันนี้ (${today}) แต่ได้ ${streak}` +
      ' — อาจเกิดจาก toISOString() คืนวันที่ UTC เบี่ยงจากวันท้องถิ่น');
  }

  console.log('PASS: getStreak() =', streak, 'สำหรับวันนี้:', today);
}

try {
  testGetStreakWithTodaySession();
} catch (e) {
  console.error('FAIL (expected — RED phase):', e.message);
}
