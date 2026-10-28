// transactions.js - logique สำหรับหน้ารายการทั้งหมด

function loadCategories() {
  const sel = document.getElementById('txCategory');
  const type = document.getElementById('txType').value;
  const cats = DB.getCategories(type);
  sel.innerHTML = '';
  for (const c of cats) {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    sel.appendChild(opt);
  }
  if (cats.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '(ยังไม่มีหมวดหมู่ — ไปที่หน้าหมวดหมู่เพื่อเพิ่ม)';
    opt.disabled = true;
    sel.appendChild(opt);
  }
}

document.getElementById('txType').addEventListener('change', loadCategories);

// ตั้งค่า date picker เริ่มต้นเป็นวันนี้
document.getElementById('txDate').value = Utils.todayStr();

// ตั้งค่า filter month เริ่มต้นเป็นเดือนนี้
document.getElementById('filterMonth').value = Utils.todayStr().slice(0, 7);

function addTx() {
  const type = document.getElementById('txType').value;
  const amount = parseFloat(document.getElementById('txAmount').value);
  const category = document.getElementById('txCategory').value;
  const date = document.getElementById('txDate').value;
  const note = document.getElementById('txNote').value;

  if (!category) {
    alert('กรุณาเลือกหมวดหมู่');
    return;
  }
  if (!amount || amount <= 0) {
    alert('กรุณาระบุจำนวนเงินที่มากกว่า 0');
    return;
  }
  if (!date || !Utils.isValidDate(date)) {
    alert('กรุณาเลือกวันที่ที่ถูกต้อง');
    return;
  }

  const tx = DB.addTransaction({ type, amount, category, date, note: note || '' });
  if (!tx) {
    alert('บันทึกไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
    return;
  }

  document.getElementById('txAmount').value = '';
  document.getElementById('txNote').value = '';
  renderTable();
}

function renderTable() {
  const filter = document.getElementById('filterMonth').value;
  const txs = DB.getTransactions();
  const body = document.getElementById('txBody');
  const empty = document.getElementById('txEmpty');

  body.innerHTML = '';
  let filtered = txs;
  if (filter) {
    filtered = txs.filter(t => t.date.startsWith(filter));
  }

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  for (const t of filtered) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${Utils.escapeHTML(t.date)}</td>
      <td>${Utils.escapeHTML(t.category)}</td>
      <td class="${t.type === 'income' ? 'type-income' : 'type-expense'}">${t.type === 'income' ? '+' : '−'}${Utils.money(t.amount)}</td>
      <td>${Utils.escapeHTML(t.note || '')}</td>
      <td style="text-align:center;"><button class="btn btn-danger sm" onclick="deleteTx('${Utils.escapeHTML(t.id)}')">ลบ</button></td>
    `;
    body.appendChild(tr);
  }
}

window.deleteTx = function(id) {
  if (!confirm('ต้องการลบรายการนี้หรือไม่?')) return;
  DB.deleteTransaction(id);
  renderTable();
};

document.getElementById('filterMonth').addEventListener('change', renderTable);

// โหลดครั้งแรก
loadCategories();
renderTable();
