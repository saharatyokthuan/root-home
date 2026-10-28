// index.js - logique สำหรับหน้าแรก (สรุปยอดเดือน)
function renderIndex() {
  const monthKey = DB.currentMonthKey();
  const summary = DB.monthlySummary(monthKey);
  const txs = DB.getTransactions();

  // ยอดคงเหลือทั้งหมด (ทั้งหมด ไม่ใช่แค่เดือนนี้)
  const all = DB.getTransactions();
  let totalBalance = 0;
  for (const t of all) {
    totalBalance += t.type === 'income' ? t.amount : -t.amount;
  }

  document.getElementById('balanceAmt').textContent = Utils.money(totalBalance);
  document.getElementById('txCount').textContent = all.length + ' รายการ';
  document.getElementById('mIncome').textContent = Utils.money(summary.income);
  document.getElementById('mExpense').textContent = Utils.money(summary.expense);

  // รายการล่าสุด 5 รายการ
  const recentList = document.getElementById('recentList');
  recentList.innerHTML = '';
  const recent = txs.slice(0, 5);
  if (recent.length === 0) {
    recentList.innerHTML = '<div class="empty">ยังไม่มีรายการ</div>';
  } else {
    for (const t of recent) {
      const div = document.createElement('div');
      div.style.padding = '0.75rem 0';
      div.style.borderBottom = '1px solid var(--c-border)';
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:0.95rem;">
          <span>${Utils.escapeHTML(t.date)}</span>
          <span class="${t.type === 'income' ? 'type-income' : 'type-expense'}">${t.type === 'income' ? '+' : '−'}${Utils.money(t.amount)}</span>
        </div>
        <div style="font-size:0.85rem; color:var(--c-muted);">${Utils.escapeHTML(t.category)} ${t.note ? '— ' + Utils.escapeHTML(t.note) : ''}</div>
      `;
      recentList.appendChild(div);
    }
  }
}

renderIndex();
