require('./helpers.js');

// โหลด app.js หลังจาก mock browser environment แล้ว
require('../js/app.js');

// Act & Assert: todayStr() ต้องคืนวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD ตามเขตเวลาท้องถิ่น
function testTodayStrReturnsLocalDate() {
  const result = todayStr();

  // ต้องเป็นสตริงรูปแบบ YYYY-MM-DD
  if (typeof result !== 'string') {
    throw new Error(`todayStr() คืนค่าไม่ใช่สตริง: ได้ ${typeof result}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result)) {
    throw new Error(`todayStr() คืนรูปวันที่ไม่ถูกต้อง: "${result}" (คาดหวัง YYYY-MM-DD)`);
  }

  // ต้องไม่ใช่วันที่จาก UTC (toISOString) — ตรวจสอบว่าไม่เบี่ยงในเขตเวลาไทย
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const expected = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  if (result !== expected) {
    throw new Error(`todayStr()="${result}" ไม่ตรงกับวันที่ท้องถิ่นคาดหวัง="${expected}"`);
  }

  console.log('PASS: todayStr() returns local date:', result);
}

try {
  testTodayStrReturnsLocalDate();
} catch (e) {
  console.error('FAIL:', e.message);
}
