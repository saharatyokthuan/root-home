require('./helpers.js');
const { validateTime } = require('../js/app.js');

// Test: validateTime() ต้องยอมรับเฉพาะรูปแบบ HH:MM ที่ถูกต้องเท่านั้น
function testValidateTime() {
  const cases = [
    // [input, expected]
    ['07:00', true],
    ['00:00', true],
    ['23:59', true],
    ['08:30', true],
    ['25:99', false],   // ชั่วโมงเกิน, นาทีเกิน
    ['24:00', false],   // ชั่วโมงเกิน
    ['07:60', false],   // นาทีเกิน
    ['07:0', false],    // นาทีต้อง 2 หลัก
    ['7:00', false],    // ชั่วโมงต้อง 2 หลัก
    ['abc', false],
    ['', false],
    ['07:00:00', false], // มีวินาที
    ['07-00', false],   // คั่นด้วยขีดกลาง
  ];

  for (const [input, expected] of cases) {
    const result = validateTime(input);
    if (result !== expected) {
      throw new Error(`validateTime("${input}") = ${result} คาดหวัง ${expected}`);
    }
  }

  console.log('PASS: validateTime() validates HH:MM correctly');
}

try {
  testValidateTime();
} catch (e) {
  console.error('FAIL (expected — RED phase):', e.message);
}
