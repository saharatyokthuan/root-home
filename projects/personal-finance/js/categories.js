// categories.js - logique สำหรับหน้าหมวดหมู่

function renderCats() {
  const incomeCats = document.getElementById('incomeCats');
  const expenseCats = document.getElementById('expenseCats');
  incomeCats.innerHTML = '';
  expenseCats.innerHTML = '';

  const inc = DB.getCategories('income');
  const exp = DB.getCategories('expense');

  function catList(cats, container) {
    if (cats.length === 0) {
      container.innerHTML = '<div class="empty">ยังไม่มีหมวดหมู่</div>';
      return;
    }
    const ul = document.createElement('ul');
    for (const c of cats) {
      const li = document.createElement('li');
      li.style.padding = '0.5rem 0';
      li.style.borderBottom = '1px solid var(--c-border)';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.innerHTML = `
        <span>${Utils.escapeHTML(c.name)}</span>
        <button class="btn btn-danger sm" onclick="deleteCat('${Utils.escapeHTML(c.id)}')">ลบ</button>
      `;
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }

  catList(inc, incomeCats);
  catList(exp, expenseCats);
}

window.deleteCat = function(id) {
  if (!confirm('ต้องการลบหมวดหมู่นี้หรือไม่?')) return;
  // ตรวจสอบว่ามีรายการใช้หมวดหมู่นี้หรือไม่
  const txs = DB.getTransactions();
  const cat = [...DB.getCategories('income'), ...DB.getCategories('expense')].find(c => c.id === id);
  if (cat && txs.some(t => t.category === cat.name)) {
    alert('ไม่สามารถลบได้ เนื่องจากมีรายการที่ใช้หมวดหมู่นี้อยู่');
    return;
  }
  DB.deleteCategory(id);
  renderCats();
};

function addCat() {
  const name = document.getElementById('catName').value.trim();
  const type = document.getElementById('catType').value;

  if (!name) {
    alert('กรุณาระบุชื่อหมวดหมู่');
    return;
  }
  if (DB.getCategories(type).some(c => c.name === name)) {
    alert('มีหมวดหมู่นี้อยู่แล้ว');
    return;
  }

  DB.addCategory(name, type);
  document.getElementById('catName').value = '';
  renderCats();
}

renderCats();
