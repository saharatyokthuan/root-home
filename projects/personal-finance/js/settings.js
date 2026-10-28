// settings.js - logique สำหรับหน้าตั้งค่า

function exportData() {
  const data = DB.exportAll();
  if (!data) {
    alert('ไม่มีข้อมูลให้สำรอง');
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'finance_backup_' + Utils.todayStr() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.getElementById('importFile');
  if (!input.files || input.files.length === 0) {
    alert('กรุณาเลือกไฟล์ก่อน');
    return;
  }
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object') throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
      if (!DB.importAll(data)) {
        alert('กู้คืนไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
        return;
      }
      alert('กู้คืนข้อมูลสำเร็จ');
      input.value = '';
    } catch (err) {
      alert('อ่านไฟล์ไม่สำเร็จ: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('คุณแน่ใจหรือไม่? ข้อมูลทั้งหมดจะถูกลบถาวรและกู้คืนไม่ได้')) return;
  if (!DB.clearAll()) {
    alert('ล้างข้อมูลไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
    return;
  }
  alert('ล้างข้อมูลทั้งหมดแล้ว');
}
