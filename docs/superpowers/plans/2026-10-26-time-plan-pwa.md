# Time Plan PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page PWA in Thai that lets the user set a daily exercise target, see free time slots in a day, reserve an exercise slot before anything else, and mark it done — all stored in localStorage, installable on a phone, usable offline.

**Architecture:** One HTML file (index.html) with embedded sections, one CSS file (css/style.css) using CSS variables for theming, one JS file (js/app.js) with global functions for data, rendering, and event wiring — mirroring Cash-Flow conventions. manifest.json and sw.js make it a PWA installable on mobile and cache assets for offline use.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (no framework, no build step), localStorage for persistence, Service Worker + Web App Manifest for PWA.

**Spec:** `/root/docs/superpowers/specs/2026-10-26-time-plan-design.md` (approved design doc).

## Global Constraints

- Language: Thai for all user-facing strings; code identifiers and comments mix Thai and English
- Platform: static HTML/CSS/JS, no framework, no build step, no package manager
- Persistence: single localStorage key, tolerates missing keys, migrate on read
- PWA: manifest.json (display standalone, portrait orientation) + sw.js (cache-first for same-origin assets)
- Dates: local YYYY-MM-DD strings only
- Commit style: Conventional Commits (feat:, docs:, fix:, etc.), Thai subjects acceptable
- Branch: main
- Deployment: static hosting (GitHub Pages etc.)

## Review Focus

1. **Missing exercise target** — User can set daily exercise minutes; default should exist and persist
2. **Overlapping slots** — Reserving an exercise slot must not overlap an already-reserved slot
3. **Offline install** — Opening in mobile browser should offer "Add to Home Screen"; cached assets must load offline
4. **localStorage full/blocked** — save() must return false gracefully and not crash the app
5. **Invalid date input** — Date picker must only accept valid YYYY-MM-DD; no crashes on empty or malformed dates

---

### Task 1: Project scaffold and PWA shell

**Files:**
- Create: `/root/projects/time-plan/index.html`
- Create: `/root/projects/time-plan/manifest.json`
- Create: `/root/projects/time-plan/sw.js`
- Create: `/root/projects/time-plan/css/style.css`
- Create: `/root/projects/time-plan/js/app.js`
- Create: `/root/projects/time-plan/README.md`

**Interfaces:**
- Consumes: Approved design doc (intent, goals, constraints)
- Produces: Empty app shell that loads in browser, registers service worker, shows "ยังไม่มีข้อมูล" state

- [ ] **Step 1: Write failing test — verify index.html loads and registers SW**

Run: Open `/root/projects/time-plan/index.html` in a browser; check console for no errors and service worker registered
Expected: No console errors; "Service Worker registered" logged

- [ ] **Step 2: Create index.html with app shell**

Create file with `<html lang="th">`, viewport meta, link to css/style.css, sections for (a) home/dashboard, (b) set exercise target, (c) daily schedule view, link manifest.json, inline script tag loading js/app.js at end
Expected: File exists with all required sections and meta tags

- [ ] **Step 3: Create manifest.json**

Name "แผนเวลา", short_name "TimePlan", description in Thai, start_url "/index.html", display "standalone", orientation "portrait", background_color/theme_color, icons array (placeholder 192x192 and 512x512)
Expected: Valid JSON manifest with Thai name and standalone display

- [ ] **Step 4: Create sw.js**

Cache name "timeplan-v1", ASSETS list of index.html, css/style.css, js/app.js, manifest.json; install/activate/fetch listeners mirroring budgetctrl/sw.js (cache-first, offline fallback to index.html)
Expected: Service worker caches all listed assets on install

- [ ] **Step 5: Create css/style.css**

CSS variables at top for theming (Thai convention), mobile-first responsive layout, sidebar + main structure, card styling, button styling, empty states
Expected: CSS loads without parse errors; variables defined

- [ ] **Step 6: Create js/app.js skeleton**

Global functions: init(), save(), renderHome(), showPage(); window object assignment block at end for inline HTML handlers
Expected: `node --check js/app.js` passes; init() runs without error

- [ ] **Step 7: Commit scaffold**

Run: `git add index.html manifest.json sw.js css/style.css js/app.js README.md && git commit -m "feat: add PWA project scaffold"`
Expected: Commit created on main branch

---

### Task 2: Data model and persistence (localStorage)

**Files:**
- Modify: `/root/projects/time-plan/js/app.js`

**Interfaces:**
- Consumes: js/app.js from Task 1 (init, save skeleton)
- Produces: Data functions for exercise target, daily slots, exercise sessions; save/load from localStorage key `timeplan_v1`

- [ ] **Step 1: Write failing test — verify load() returns empty default state**

Run: In browser console, call `load()` and inspect result
Expected: Returns `{ targetMinutes: 30, slots: [], sessions: [] }` or equivalent empty structure

- [ ] **Step 2: Implement data functions in js/app.js**

Define `db` object with `targetMinutes` (number), `slots` (array of {id, date, startTime, endTime, label, type}), `sessions` (array of {id, slotId, done, doneAt}); `save()` writes to localStorage key `timeplan_v1`; `load()` reads and tolerates missing/corrupt data, migrating on read
Expected: save() and load() round-trip correctly; load() returns defaults when localStorage empty

- [ ] **Step 3: Add addSlot() and toggleSession() functions**

`addSlot(date, startTime, endTime, label, type)` pushes to slots and saves; `toggleSession(slotId)` marks done/undone and saves
Expected: New slot appears in slots array; toggle flips done status

- [ ] **Step 4: Verify save() returns false when localStorage unavailable**

Run: Simulate localStorage quota exceeded; call save()
Expected: Returns false, app does not throw

- [ ] **Step 5: Commit data layer**

Run: `git add js/app.js && git commit -m "feat: add data model and localStorage persistence"`
Expected: Commit created

---

### Task 3: Set daily exercise target

**Files:**
- Modify: `/root/projects/time-plan/index.html` (add target-setting section/form)
- Modify: `/root/projects/time-plan/js/app.js` (add renderTarget, setTarget handlers)

**Interfaces:**
- Consumes: db.targetMinutes from Task 2
- Produces: UI to view and change daily exercise target in minutes; persisted to localStorage

- [ ] **Step 1: Write failing test — verify default target is 30 minutes**

Run: Check `db.targetMinutes` on fresh load
Expected: Equals 30

- [ ] **Step 2: Add target UI to index.html**

Section with heading "เป้าหมายออกกำลังกายต่อวัน", input number (min 5, max 180, step 5), button "บันทึก", display current value in minutes
Expected: Section renders with default 30 shown

- [ ] **Step 3: Implement setTarget() in js/app.js**

Reads input value, validates 5–180, sets db.targetMinutes, save(), re-renders target display
Expected: Changing value and clicking save updates db.targetMinutes and persists

- [ ] **Step 4: Wire showPage navigation between home and target page**

showPage('page-target') hides other sections, shows target section; navigation buttons in sidebar
Expected: Clicking target menu switches view correctly

- [ ] **Step 5: Commit target feature**

Run: `git add index.html js/app.js && git commit -m "feat: add daily exercise target setting"`
Expected: Commit created

---

### Task 4: Daily schedule view and slot reservation

**Files:**
- Modify: `/root/projects/time-plan/index.html` (add schedule section)
- Modify: `/root/projects/time-plan/js/app.js` (add renderSchedule, reserveSlot, deleteSlot)

**Interfaces:**
- Consumes: db.slots from Task 2, date navigation
- Produces: View for a selected date showing time slots; reserve exercise slot (type "ออกกำลังกาย") before other activities; detect overlaps

- [ ] **Step 1: Write failing test — verify reserveSlot rejects overlapping slots**

Run: Call `reserveSlot(date, start, end, "ออกกำลังกาย")` when an overlapping slot exists
Expected: Returns false or throws, does not add slot

- [ ] **Step 2: Add schedule UI to index.html**

Date picker (type=date), grid/list of time slots for the day, each slot shows time, label, type, done toggle, delete button; button "เพิ่มช่วงเวลา" to add new slot
Expected: Schedule renders for today's date by default

- [ ] **Step 3: Implement reserveSlot() with overlap check**

Parses new slot time range, compares against existing slots for same date, rejects if any overlap (start < existing.end && end > existing.start), otherwise adds and saves
Expected: Non-overlapping slot added; overlapping slot rejected

- [ ] **Step 4: Implement deleteSlot() and toggleSession() UI wiring**

Delete removes slot from db.slots and saves; done toggle updates sessions and saves; re-render after each change
Expected: Slot disappears after delete; done state persists

- [ ] **Step 5: Commit schedule feature**

Run: `git add index.html js/app.js && git commit -m "feat: add daily schedule and slot reservation"`
Expected: Commit created

---

### Task 5: Home dashboard and done-streak

**Files:**
- Modify: `/root/projects/time-plan/index.html` (home section)
- Modify: `/root/projects/time-plan/js/app.js` (add renderHome, streak calculation)

**Interfaces:**
- Consumes: db.sessions from Task 2, db.targetMinutes from Task 3
- Produces: Home view showing today's plan, exercise target, streak count (consecutive days with exercise done)

- [ ] **Step 1: Write failing test — verify streak returns 0 on empty data**

Run: Call streak function with no sessions
Expected: Returns 0

- [ ] **Step 2: Add home UI to index.html**

Cards: "เป้าหมายวันนี้" (target minutes), "ช่วงเวลาวันนี้" (slots for today), "สตรีคต่อเนื่อง" (streak days), empty state when no data
Expected: Home section renders with zeros/empty on fresh load

- [ ] **Step 3: Implement streak calculation**

Count consecutive days (from today backward) where at least one exercise session is done; stop at first day without done exercise
Expected: Correct streak count for given session data

- [ ] **Step 4: Wire home as default page**

showPage('page-home') on init; sidebar highlights active page
Expected: App opens on home by default

- [ ] **Step 5: Commit dashboard feature**

Run: `git add index.html js/app.js && git commit -m "feat: add home dashboard and exercise streak"`
Expected: Commit created

---

### Task 6: Polish, offline verification, and final commit

**Files:**
- Modify: `/root/projects/time-plan/js/app.js` (escapeHTML for user strings)
- Modify: `/root/projects/time-plan/README.md` (usage instructions in Thai)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Finished PWA ready to test on mobile; README in Thai

- [ ] **Step 1: Add escapeHTML and use in all innerHTML rendering**

Apply escapeHTML() to slot labels, dates, and any user-entered text before inserting into DOM
Expected: No raw user strings in innerHTML; XSS-safe rendering

- [ ] **Step 2: Verify PWA installability**

Run: Open index.html via `python3 -m http.server 8000` on localhost; open in mobile browser or Chrome DevTools mobile emulation; check "Add to Home Screen" available; reload offline and confirm app still loads
Expected: Install prompt appears; app loads offline from cache

- [ ] **Step 3: Verify localStorage persistence across reload**

Run: Add a slot and target, refresh page, confirm data still present
Expected: Data survives page reload

- [ ] **Step 4: Write README.md in Thai**

How to open, how to install on phone, how to set exercise target, how to reserve slots, data stored locally
Expected: README exists with Thai instructions

- [ ] **Step 5: Final commit**

Run: `git add -A && git commit -m "feat: complete PWA time plan with offline support"`
Expected: All files committed on main

---

## Self-Review Checklist

- [x] Spec coverage: exercise target, free slots, reserve-before-others, done tracking, PWA offline, localStorage — all mapped to tasks
- [x] Step scan: each step has one unambiguous action with a checkable result
- [x] Type consistency: db.slots, db.sessions, db.targetMinutes names consistent across Tasks 2–5
- [x] Review Focus: all 5 failure modes have tests pinned to owning tasks (overlap in Task 4, SW in Task 6, localStorage in Task 2/6, invalid dates in Task 4, missing target default in Task 3)
- [x] Proportion: plan is concise, uses signatures and assertions, no implementation transcripts

---

**Plan complete and saved to `docs/superpowers/plans/2026-10-26-time-plan-pwa.md`.**

ผมจะลงมือทำทุกงานด้วยตัวเองในเซสชันนี้ (execution แบบ Native) แล้วมีผู้ตรวจสอบอีกครั้งตอนจบ เนื่องจากงานแต่ละอย่างพึ่งพา interface ของงานก่อนหน้า และมีไม่มากนัก ข้อผิดพลาดที่ส่งออกไปมีต้นทุนต่ำเพราะเป็นแอป static เครื่องเดียว

แผนนี้ตรงกับที่คุณต้องการไหมครับ? ถ้าถูกต้อง ผมจะเริ่มลงมือทำ Task 1 ได้เลยครับ
