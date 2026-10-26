// Test runner สำหรับแอปแผนเวลา
// รันทดสอบทุกไฟล์ใน test/ ยกเว้นไฟล์นี้ แล้วออกด้วยรหัสไม่ใช่ศูนย์ถ้าใดๆ ล้มเหลว
const fs = require('fs');
const path = require('path');

const errors = [];
const originalError = console.error;
console.error = (msg) => {
  errors.push(String(msg));
  originalError.apply(console, arguments);
};

const dir = path.join(__dirname);
const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.test.js'))
  .sort();

for (const f of files) {
  require(path.join(dir, f));
}

console.error = originalError;

if (errors.length > 0) {
  console.error(`\nTOTAL: ${errors.length} test(s) FAILED`);
  process.exit(1);
} else {
  console.log(`\nAll ${files.length} test file(s) passed`);
  process.exit(0);
}
