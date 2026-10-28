// utils.js - ฟังก์ชันช่วยสำหรับแอปการเงินส่วนตัว

const Utils = {
  uid() {
    return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  },

  // คืนวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD ตามเวลาท้องถิ่น (ไม่ใช้ toISOString)
  todayStr() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  },

  // คืน month key ในรูปแบบ YYYY-MM สำหรับ grouping รายงานเดือน
  monthKey(dateStr) {
    return dateStr.slice(0, 7);
  },

  // จำนวนเงิน formatted เป็นสตริง THB
  money(amount) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  },

  // Escape HTML เพื่อป้องกัน XSS
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  },

  // Validate วันที่ YYYY-MM-DD
  isValidDate(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d) &&
      d.getFullYear().toString() === dateStr.slice(0, 4);
  }
};
