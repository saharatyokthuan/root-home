require('./helpers.js');
const { load } = require('../js/app.js');

// Test: load() คืนค่า targetMinutes เริ่มต้น 30 นาที เมื่อ localStorage ว่าง (Review Focus #1)
function testLoadReturnsDefaultTargetMinutes() {
  // localStorage mock เริ่มต้นว่างอยู่แล้ว (helpers.js สร้าง _store ใหม่ทุกครั้งที่โหลด)
  const data = load();

  if (data.targetMinutes !== 30) {
    throw new Error(`load() targetMinutes ควรเป็น 30 เริ่มต้น แต่ได้ ${data.targetMinutes}`);
  }
  if (!Array.isArray(data.slots)) {
    throw new Error('load() slots ควรเป็นอาเรย์ว่างเริ่มต้น');
  }
  if (!Array.isArray(data.sessions)) {
    throw new Error('load() sessions ควรเป็นอาเรย์ว่างเริ่มต้น');
  }

  console.log('PASS: load() returns default targetMinutes = 30');
}

try {
  testLoadReturnsDefaultTargetMinutes();
} catch (e) {
  console.error('FAIL:', e.message);
}
