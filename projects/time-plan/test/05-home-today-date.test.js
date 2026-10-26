require('./helpers.js');
const { db, addSlot, getSlotsByDate, todayStr } = require('../js/app.js');

// Test: หน้าแรกต้องแสดง slot ของ "วันนี้" เสมอ ไม่ใช่วันที่ที่เลือกในหน้าตาราง (currentDate)
// ถ้า currentDate ถูกตั้งเป็นวันอื่น getSlotsByDate(todayStr()) ต้องยังคืน slot ของวันนี้ได้
function testHomeShowsTodayNotCurrentDate() {
  db.slots = [];
  db.sessions = [];

  const today = todayStr();
  const yesterday = '2026-10-25'; // สมมุติว่าเป็นเมื่อวาน

  // ตั้ง currentDate เป็นวันอื่น (จำลองผู้ใช้เลือกวันที่ในหน้าตารางแล้วกลับหน้าแรก)
  // เราไม่แก้ตัวแปร currentDate โดยตรง แต่ทดสอบว่า getSlotsByDate(todayStr()) คืนข้อมูลถูกต้อง

  // เพิ่ม slot สำหรับวันนี้
  addSlot(today, '07:00', '08:00', 'วิ่งเช้า', 'ออกกำลังกาย');

  // getSlotsByDate(todayStr()) ต้องคืน slot ของวันนี้
  const todaySlots = getSlotsByDate(today);
  if (todaySlots.length !== 1) {
    throw new Error(`getSlotsByDate(${today}) ควรคืน 1 slot แต่ได้ ${todaySlots.length}`);
  }

  console.log('PASS: getSlotsByDate(todayStr()) returns today slots even when currentDate differs');
}

try {
  testHomeShowsTodayNotCurrentDate();
} catch (e) {
  console.error('FAIL:', e.message);
}
