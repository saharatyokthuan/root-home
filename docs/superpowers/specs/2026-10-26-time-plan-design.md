# สเปก: Time Plan PWA — แอปวางแผนออกกำลังกายรายวัน

## 1. เป้าหมาย (Goal)

สร้าง Single-page PWA ภาษาไทย ที่ให้ผู้ใช้:
- กำหนดเป้าหมายออกกำลังกายต่อวัน (นาที)
- ดูช่วงเวลาว่างในแต่ละวัน
- จองช่วงเวลาออกกำลังกายก่อนกิจกรรมอื่น
- ทำเครื่องหมายว่าเสร็จแล้ว (done)
- เก็บข้อมูลใน localStorage ติดเครื่อง
- ติดตั้งบนมือถือได้ ใช้งานออฟไลน์ได้

## 2. เทคโนโลยี (Tech Stack)

- HTML5, CSS3, Vanilla JavaScript (ไม่มีเฟรมเวิร์ก, ไม่มี build step, ไม่มี package manager)
- localStorage สำหรับเก็บข้อมูล
- Service Worker + Web App Manifest สำหรับ PWA
- ภาษาไทยสำหรับข้อความที่ผู้ใช้เห็น; ตัวระบุ (identifiers) และคอมเมนต์ผสมไทย-อังกฤษ

## 3. โครงสร้างไฟล์ (File Structure)

```
/root/projects/time-plan/
├── index.html            — หน้าเดียว (single-page) มีทุก section
├── manifest.json         — PWA manifest (standalone, portrait)
├── sw.js                 — Service Worker (cache-first, offline fallback)
├── css/
│   └── style.css         — CSS variables ที่บนสุด, mobile-first
├── js/
│   └── app.js            — ทั้งหมด: data, render, event wiring
└── README.md             — คู่มือการใช้งาน เป็นภาษาไทย
```

## 4. โมเดลข้อมูล (Data Model)

เก็บใน localStorage เดียว คีย์ `timeplan_v1` รูปแบบ JSON:

```json
{
  "targetMinutes": 30,
  "slots": [
    {
      "id": "slot_1730000000000",
      "date": "2026-10-26",
      "startTime": "07:00",
      "endTime": "08:00",
      "label": "วิ่งเช้า",
      "type": "ออกกำลังกาย"
    }
  ],
  "sessions": [
    {
      "id": "sess_1730000000001",
      "slotId": "slot_1730000000000",
      "done": true,
      "doneAt": "2026-10-26T08:00:00"
    }
  ]
}
```

### รายละเอียดฟิลด์

| ฟิลด์ | ชนิด | คำอธิบาย |
|-------|------|----------|
| `targetMinutes` | number | เป้าหมายนาทีต่อวัน ค่าเริ่มต้น 30 |
| `slots[].id` | string | รหัสเฉพาะ เช่น `slot_<timestamp>` |
| `slots[].date` | string | วันที่ `YYYY-MM-DD` (เวลาท้องถิ่น) |
| `slots[].startTime` | string | เวลาเริ่ม `HH:MM` |
| `slots[].endTime` | string | เวลาสิ้นสุด `HH:MM` |
| `slots[].label` | string | ชื่อกิจกรรม เช่น "วิ่งเช้า", "ประชุม" |
| `slots[].type` | string | ประเภท: `"ออกกำลังกาย"` หรือ `"อื่นๆ"` |
| `sessions[].id` | string | รหัสเซสชัน |
| `sessions[].slotId` | string | อ้างอิง slot.id |
| `sessions[].done` | boolean | true = เสร็จแล้ว |
| `sessions[].doneAt` | string | ISO timestamp ตอนทำเครื่องหมายเสร็จ |

## 5. ฟังก์ชันหลัก (Core Functions)

### init()
เรียกเมื่อโหลดหน้า โหลดข้อมูลจาก localStorage, เริ่ม render หน้าแรก (home)

### load()
อ่านจาก localStorage คีย์ `timeplan_v1` ถ้าไม่มีหรืออ่านไม่ได้ ให้คืนค่า default:
```js
{ targetMinutes: 30, slots: [], sessions: [] }
```
รองรับการอ่านข้อมูลที่เสียหาย (corrupt) โดยไม่ทำให้แอปพัง

### save(db)
เขียน db ลง localStorage คืนค่า `true` ถ้าสำเร็จ `false` ถ้า localStorage เต็มหรือถูกบล็อก

### addSlot(date, startTime, endTime, label, type)
เพิ่ม slot ใหม่เข้า db.slots แล้ว save()

### reserveSlot(date, startTime, endTime, label)
เหมือน addSlot แต่ type = `"ออกกำลังกาย"` และ **ต้องตรวจสอบไม่ทับซ้อน** กับ slot เดิมในวันเดียวกัน ถ้าทับซ้อนให้คืนค่า `false` ไม่เพิ่ม slot

### deleteSlot(id)
ลบ slot ตาม id ออกจาก db.slots แล้ว save() แล้ว re-render

### toggleSession(slotId)
สลับสถานะ done ของ session ที่เชื่อมโยง slot นั้น ถ้ายังไม่มี session ให้สร้างใหม่ แล้ว save()

### getSlotsByDate(date)
คืนค่า slot ทั้งหมดในวันที่นั้น เรียงตามเวลาเริ่ม

### getStreak()
นับ streak วันที่ต่อเนื่องกัน (นับย้อนจากวันนี้) ที่มี exercise session เป็น done อย่างน้อย 1 ครั้ง หยุดที่วันแรกที่ไม่มี

### escapeHTML(str)
แปลงตัวอักษรพิเศษก่อนแทรกลง innerHTML เพื่อป้องกัน XSS

## 6. กฎทางธุรกิจ (Business Rules)

1. **targetMinutes** ค่าเริ่มต้น 30 นาที ปรับได้ระหว่าง 5–180
2. **วันที่** ใช้รูปแบบ `YYYY-MM-DD` เวลาท้องถิ่นเท่านั้น ห้ามใช้ `new Date('YYYY-MM-DD')` หรือ `toISOString()` เพราะจะเบี่ยงวันที่ในเขตเวลาที่ไม่ใช่ UTC
3. **เวลา** ใช้รูปแบบ `HH:MM` 24 ชั่วโมง
4. **การทับซ้อน** slot ใหม่ทับซ้อนกับ slot เดิมเมื่อ `new.start < existing.end && new.end > existing.start` ในวันเดียวกัน ห้ามจองซ้อน
5. **ประเภท slot** `"ออกกำลังกาย"` ต้องจองก่อนกิจกรรมอื่นในวันนั้น (ถ้ามี)
6. **localStorage** ถ้าเต็มหรือถูกบล็อก save() ต้องคืน `false` และไม่ทำให้แอปหยุดทำงาน
7. **วันที่ป้อน** ต้องรับเฉพาะวันที่ถูกต้อง `YYYY-MM-DD` เท่านั้น ไม่ควรพังเมื่อวันที่ว่างหรือรูปแบบผิด

## 7. ข้อกำหนดหน้า UI (UI Requirements)

### หน้า Home (`page-home`)
- บัตร "เป้าหมายวันนี้" แสดง targetMinutes
- บัตร "ช่วงเวลาวันนี้" แสดง slot ของวันนี้
- บัตร "สตรีคต่อเนื่อง" แสดงจำนวนวัน streak
- Empty state เมื่อยังไม่มีข้อมูล
- เป็นหน้าแรกเมื่อเปิดแอป

### หน้าตั้งค่าเป้าหมาย (`page-target`)
- หัวข้อ "เป้าหมายออกกำลังกายต่อวัน"
- Input type=number min=5 max=180 step=5
- ปุ่ม "บันทึก"
- แสดงค่าปัจจุบันเป็นนาที

### หน้าตารางรายวัน (`page-schedule`)
- Date picker type=date เริ่มต้นวันนี้
- ตาราง/รายการช่วงเวลาในวันนั้น แต่ละช่วงแสดง เวลา, ชื่อ, ประเภท, ปุ่มทำเครื่องหมายเสร็จ, ปุ่มลบ
- ปุ่ม "เพิ่มช่วงเวลา" เพื่อเพิ่ม slot ใหม่
- ไม่อนุญาตให้จองทับซ้อน

### การนำทาง (Navigation)
- Sidebar มีปุ่มสลับหน้า (home, target, schedule)
- showPage() ซ่อน section อื่น แสดง section ที่เลือก
- ปุ่ม sidebar เน้นหน้าเดียวกับที่เปิดอยู่

## 8. ข้อกำหนด PWA (PWA Requirements)

### manifest.json
- name: "แผนเวลา", short_name: "TimePlan"
- description เป็นภาษาไทย
- start_url: "/index.html"
- display: "standalone"
- orientation: "portrait"
- background_color, theme_color กำหนดสี
- icons array มี 192×192 และ 512×512 (placeholder)

### sw.js
- ชื่อ cache: `timeplan-v1`
- รายการไฟล์ที่แคช: index.html, css/style.css, js/app.js, manifest.json
- ตัวแยก install / activate / fetch แบบ cache-first
- เมื่อออฟไลน์ ให้ fallback ไปที่ index.html

## 9. ข้อจำกัด (Constraints)

- ไม่ใช้ ES modules — ใช้ฟังก์ชันส่วนกลางและ `Object.assign(window, {...})`
- ใช้ escapeHTML() ทุกครั้งที่แทรกข้อความผู้ใช้ลง innerHTML
- ฟอร์แมตวันที่ `YYYY-MM-DD` เสมอ
- Commit ข้อความแบบ Conventional Commits (`feat:`, `fix:`, `docs:`) ใช้ภาษาไทยได้
- สาขาหลักคือ `main`
- ติดตั้งบน static hosting (GitHub Pages ฯลฯ)

## 10. เกณฑ์การยอมรับ (Acceptance Criteria)

| # | เงื่อนไข | วิธีทดสอบ |
|---|----------|------------|
| 1 | เปิด index.html แล้วไม่มีข้อผิดพลาดในคอนโซล | เปิดในเบราว์เซอร์ ดูคอนโซล |
| 2 | Service Worker ลงทะเบียนสำเร็จ | ดูคอนโซลมีข้อความ "Service Worker registered" |
| 3 | load() คืนค่า default เมื่อ localStorage ว่าง | เรียก load() ในคอนโซล ตรวจสอบคืน `{targetMinutes:30, slots:[], sessions:[]}` |
| 4 | save() คืน false เมื่อ localStorage เต็ม | จำลอง quota เกิน แล้วเรียก save() ตรวจสอบคืน false ไม่พัง |
| 5 | เป้าหมายเริ่มต้นคือ 30 นาที | ตรวจสอบ db.targetMinutes เท่ากับ 30 |
| 6 | reserveSlot ปฏิเสธ slot ที่ทับซ้อน | สร้าง slot แล้วพยายามจองทับ ตรวจสอบไม่สำเร็จ |
| 7 | streak คืนค่า 0 เมื่อไม่มีข้อมูล | เรียก getStreak() ตรวจสอบคืน 0 |
| 8 | ข้อมูลคงอยู่หลังรีเฟรชหน้า | เพิ่ม slot แล้วรีเฟรช ข้อมูลยังอยู่ |
| 9 | PWA ติดตั้งบนมือถือได้ | เปิดผ่าน localhost ในมือถือ ดูปุ่ม "เพิ่มไปยังหน้าจอหลัก" |
| 10 | ใช้งานออฟไลน์ได้ | ปิดเครือข่าย รีโหลด แอปยังโหลดจาก cache |

## 11. อ้างอิง

- แผนงาน: `/root/docs/superpowers/plans/2026-10-26-time-plan-pwa.md`
- โครงการอ้างอิง: `/root/projects/Cash-Flow/` (รูปแบบ single-page, script.js รวมทุกอย่าง)
- โครงการอ้างอิง: `/root/projects/budgetctrl/` (PWA: manifest.json + sw.js)