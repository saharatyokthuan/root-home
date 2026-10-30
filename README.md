# 🏠 root-home — คลังรวมโปรเจกต์ของ home directory

รีโพนี้เป็น **container ของ home directory** ไม่ใช่แอปเดี่ยว ๆ ใช้เก็บกฎการทำงาน เอกสารแผน/สเปก และโปรเจกต์ย่อยไว้ในที่เดียว

---

## ✨ สิ่งที่อยู่ในรีโพ

| ส่วน | รายละเอียด |
|:---|:---|
| 📜 **AGENTS.md** | คู่มือสำหรับ AI agent: ภาพรวม home directory, ตารางโปรเจกต์, ข้อควรระวัง |
| 🇹🇭 **AGENST.md** | กฎการทำงาน (ภาษาไทย): อ่านและทำความเข้าใจก่อนเขียนโค้ด, พูดกับผู้ใช้เป็นภาษาไทย, ไม่แน่ใจให้ถามทันที (ชื่อไฟล์สะกดแบบนี้ในรีโพ) |
| 📝 **docs/superpowers/** | แผนงาน (`plans/`) และสเปก (`specs/`) |
| 📦 **projects/** | โปรเจกต์ย่อย 3 โปรเจกต์ (ดูด้านล่าง) |

---

## 📁 โครงสร้างไฟล์

```
root-home/
├── AGENTS.md                      # คู่มือสำหรับ AI agent
├── AGENST.md                      # กฎการทำงานภาษาไทย
├── .gitignore                     # กันไฟล์ระบบ/editor/cache ออกจากรีโพ
├── docs/
│   └── superpowers/
│       ├── plans/
│       │   ├── 2026-10-25-project-skills-repo.md
│       │   └── 2026-10-26-time-plan-pwa.md
│       └── specs/
│           └── 2026-10-26-time-plan-design.md
└── projects/
    ├── Olympus/                   # มีเฉพาะ README.md
    │   └── README.md
    ├── personal-finance/          # แอปบันทึกรายรับ-รายจ่าย (PWA)
    │   ├── index.html, transactions.html, categories.html, settings.html
    │   ├── css/  js/  icons/  test/
    │   ├── manifest.json
    │   ├── sw.js
    │   └── README.md
    └── time-plan/                 # แอปวางแผนออกกำลังกายรายวัน (PWA)
        ├── index.html
        ├── css/  js/  icons/  test/
        ├── manifest.json
        ├── sw.js
        └── README.md
```

---

## 📦 โปรเจกต์ใน `projects/`

| โปรเจกต์ | สรุป | README |
|:---|:---|:---|
| **Olympus** | โปรเจกต์บอทหลายแพลตฟอร์ม (Apollo = Telegram bot ด้วย Telegraf, Artemis = Discord bot ด้วย discord.js v14) | [projects/Olympus/README.md](projects/Olympus/README.md) |
| **personal-finance** | แอปบันทึกรายรับ-รายจ่ายส่วนตัว ดูสรุปยอดรายเดือน จัดการหมวดหมู่ สำรอง/กู้คืนข้อมูลเป็น JSON เก็บข้อมูลใน `localStorage` | [projects/personal-finance/README.md](projects/personal-finance/README.md) |
| **time-plan** | แอปวางแผนออกกำลังกายรายวัน ตั้งเป้าหมายเป็นนาที จองช่วงเวลา กันเวลาทับซ้อน นับสตรีค เก็บข้อมูลใน `localStorage` | [projects/time-plan/README.md](projects/time-plan/README.md) |

> ⚠️ **Olympus:** README ของ Olympus กล่าวถึงโฟลเดอร์ `Apollo/` และ `Artemis/` แต่โฟลเดอร์เหล่านั้น **ยังไม่ได้อยู่ในรีโพนี้** ตอนนี้มีเพียง `projects/Olympus/README.md` เท่านั้น จึงยังรันบอทจากรีโพนี้ไม่ได้

---

## 🚀 วิธีใช้งาน

1. อ่าน `AGENST.md` และ `AGENTS.md` ที่ root ก่อนเริ่มทำงาน
2. เข้าไปที่โปรเจกต์ที่สนใจใน `projects/` แล้วอ่าน README ของโปรเจกต์นั้น
3. รันเว็บแอปแบบ static (personal-finance, time-plan) ด้วยการเปิด `index.html` ในเบราว์เซอร์ หรือผ่าน local server:
   ```bash
   cd projects/time-plan   # หรือ projects/personal-finance
   python3 -m http.server 8000
   ```
   แล้วเปิด http://localhost:8000
4. รันชุดทดสอบของ time-plan:
   ```bash
   cd projects/time-plan
   node test/run.js
   ```

> หมายเหตุ: `.gitignore` ที่ root ตั้งค่า `projects/*/` ให้ถูก ignore (ยกเว้นโปรเจกต์ที่ถูก track อยู่แล้ว) และ `AGENTS.md` ยังอ้างถึงโปรเจกต์อื่น (เช่น Cash-Flow, pos-mobile) ที่ไม่ได้อยู่ใน `projects/` ของรีโพนี้
