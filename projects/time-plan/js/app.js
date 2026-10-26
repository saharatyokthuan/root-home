const STORAGE_KEY = 'timeplan_v1';

const db = {
  targetMinutes: 30,
  slots: [],
  sessions: []
};

function todayStr() {
  return toLocalDateStr(new Date());
}

function toLocalDateStr(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

let currentDate = todayStr();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { targetMinutes: 30, slots: [], sessions: [] };
    const parsed = JSON.parse(raw);
    return {
      targetMinutes: typeof parsed.targetMinutes === 'number' ? parsed.targetMinutes : 30,
      slots: Array.isArray(parsed.slots) ? parsed.slots : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : []
    };
  } catch (e) {
    return { targetMinutes: 30, slots: [], sessions: [] };
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (e) {
    return false;
  }
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function validateTime(timeStr) {
  if (typeof timeStr !== 'string' || timeStr.length !== 5) return false;
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return false;
  const [hh, mm] = timeStr.split(':').map(Number);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}

function addSlot(date, startTime, endTime, label, type) {
  // Business rule: จอง "ออกกำลังกาย" ก่อนกิจกรรมอื่นในวันเดียวกัน
  // ถ้าวันนั้นมี slot type "ออกกำลังกาย" อยู่แล้ว ไม่อนุญาตให้จองประเภทอื่นในวันเดียวกัน
  if (type !== 'ออกกำลังกาย') {
    const hasExerciseSlot = db.slots.some(
      s => s.date === date && s.type === 'ออกกำลังกาย'
    );
    if (hasExerciseSlot) {
      alert('วันนี้มีช่วงเวลาออกกำลังกายจองไว้แล้ว ไม่สามารถจองกิจกรรมอื่นเพิ่มได้');
      return null;
    }
  }

  const slot = {
    id: 'slot_' + Date.now(),
    date,
    startTime,
    endTime,
    label,
    type
  };
  db.slots.push(slot);
  if (!save()) {
    alert('บันทึกไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
    db.slots.pop();
    return null;
  }
  return slot;
}

function reserveSlot(date, startTime, endTime, label) {
  for (const existing of db.slots) {
    if (existing.date !== date) continue;
    if (startTime < existing.endTime && endTime > existing.startTime) {
      return false;
    }
  }
  const slot = addSlot(date, startTime, endTime, label, 'ออกกำลังกาย');
  return slot ? slot : false;
}

function deleteSlot(id) {
  const oldSlots = db.slots;
  const oldSessions = db.sessions;
  db.slots = db.slots.filter(s => s.id !== id);
  db.sessions = db.sessions.filter(s => s.slotId !== id);
  if (!save()) {
    db.slots = oldSlots;
    db.sessions = oldSessions;
    alert('บันทึกไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
  }
}

function toggleSession(slotId) {
  const existing = db.sessions.find(s => s.slotId === slotId);
  let oldDone, oldDoneAt, wasNew, newSess;

  if (existing) {
    oldDone = existing.done;
    oldDoneAt = existing.doneAt;
    existing.done = !existing.done;
    existing.doneAt = existing.done ? toLocalDateStr(new Date()) : null;
  } else {
    newSess = {
      id: 'sess_' + Date.now(),
      slotId,
      done: true,
      doneAt: toLocalDateStr(new Date())
    };
    db.sessions.push(newSess);
    wasNew = true;
  }

  if (!save()) {
    if (existing) {
      existing.done = oldDone;
      existing.doneAt = oldDoneAt;
    } else if (wasNew) {
      db.sessions.pop();
    }
    alert('บันทึกไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
  }
}

function getSlotsByDate(date) {
  return db.slots
    .filter(s => s.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function getStreak() {
  const doneDates = new Set();
  for (const s of db.sessions) {
    if (s.done) {
      const slot = db.slots.find(sl => sl.id === s.slotId);
      if (slot) doneDates.add(slot.date);
    }
  }
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toLocalDateStr(d);
    if (doneDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function init() {
  const loaded = load();
  db.targetMinutes = loaded.targetMinutes;
  db.slots = loaded.slots;
  db.sessions = loaded.sessions;

  const dateInput = document.getElementById('date-picker');
  if (dateInput) dateInput.value = currentDate;

  showPage('page-home');
  renderAll();
}

function showPage(pageId, btnEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  renderAll();
}

function renderAll() {
  renderHome();
  renderTarget();
  renderSchedule();
}

function renderHome() {
  const targetEl = document.getElementById('home-target');
  const slotsEl = document.getElementById('home-slots');
  const streakEl = document.getElementById('home-streak');

  if (targetEl) targetEl.textContent = db.targetMinutes + ' นาที';

  const todaySlots = getSlotsByDate(todayStr());
  if (slotsEl) {
    if (todaySlots.length === 0) {
      slotsEl.innerHTML = '<span class="empty-state">ยังไม่มีช่วงเวลาสำหรับวันนี้</span>';
    } else {
      slotsEl.innerHTML = todaySlots.map(s =>
        `<div><strong>${escapeHTML(s.startTime)}–${escapeHTML(s.endTime)}</strong> ${escapeHTML(s.label)}</div>`
      ).join('');
    }
  }

  if (streakEl) streakEl.textContent = getStreak() + ' วัน';
}

function renderTarget() {
  const input = document.getElementById('target-input');
  const current = document.getElementById('target-current');
  if (input) input.value = db.targetMinutes;
  if (current) current.textContent = 'ค่าปัจจุบัน: ' + db.targetMinutes + ' นาที';
}

function setTarget() {
  const input = document.getElementById('target-input');
  if (!input) return;
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < 5 || val > 180) {
    alert('กรุณาระบุจำนวนนาทีระหว่าง 5–180');
    return;
  }
  db.targetMinutes = val;
  if (!save()) {
    alert('บันทึกไม่สำเร็จ ที่เก็บข้อมูลเต็มหรือถูกบล็อก');
    return;
  }
  renderTarget();
  renderHome();
}

function renderSchedule() {
  const dateInput = document.getElementById('date-picker');
  const listEl = document.getElementById('schedule-list');

  if (dateInput) currentDate = dateInput.value || currentDate;

  const slots = getSlotsByDate(currentDate);
  if (listEl) {
    if (slots.length === 0) {
      listEl.innerHTML = '<span class="empty-state">ยังไม่มีช่วงเวลาสำหรับวันที่นี้</span>';
    } else {
      listEl.innerHTML = slots.map(s => `
        <div style="border-bottom:1px solid var(--c-border); padding:0.5rem 0;">
          <strong>${escapeHTML(s.startTime)}–${escapeHTML(s.endTime)}</strong><br>
          ${escapeHTML(s.label)} <span style="font-size:0.8rem; color:var(--c-muted);">(${s.type})</span>
          <button class="btn-danger" onclick="deleteSlotUI('${escapeHTML(s.id)}')">ลบ</button>
        </div>
      `).join('');
    }
  }
}

function addSlotUI() {
  const dateInput = document.getElementById('date-picker');
  const date = dateInput ? dateInput.value : currentDate;
  if (!date) {
    alert('กรุณาเลือกวันที่');
    return;
  }
  const startTime = prompt('เวลาเริ่มต้น (เช่น 07:00)');
  if (!startTime) return;
  if (!validateTime(startTime)) {
    alert('เวลาเริ่มต้นไม่ถูกต้อง กรุณาระบุในรูปแบบ HH:MM (เช่น 07:00)');
    return;
  }
  const endTime = prompt('เวลาสิ้นสุด (เช่น 08:00)');
  if (!endTime) return;
  if (!validateTime(endTime)) {
    alert('เวลาสิ้นสุดไม่ถูกต้อง กรุณาระบุในรูปแบบ HH:MM (เช่น 08:00)');
    return;
  }
  const label = prompt('ชื่อกิจกรรม (เช่น วิ่งเช้า)');
  if (!label) return;

  const ok = reserveSlot(date, startTime, endTime, label);
  if (!ok) {
    alert('ไม่สามารถจองได้ เนื่องจากช่วงเวลานี้ทับซ้อนกับกิจกรรมเดิมแล้ว');
    return;
  }
  renderSchedule();
  renderHome();
}

function deleteSlotUI(id) {
  if (!confirm('ต้องการลบช่วงเวลานี้หรือไม่?')) return;
  deleteSlot(id);
  renderSchedule();
  renderHome();
}

Object.assign(window, {
  init,
  showPage,
  setTarget,
  addSlotUI,
  deleteSlotUI,
  reserveSlot,
  deleteSlot,
  toggleSession,
  getSlotsByDate,
  getStreak,
  todayStr
});

init();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { db, todayStr, toLocalDateStr, reserveSlot, getStreak, addSlot, deleteSlot, toggleSession, save, load, escapeHTML, getSlotsByDate, validateTime };
}