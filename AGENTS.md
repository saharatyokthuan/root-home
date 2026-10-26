# ติดตั้ง docker

# /root — Agent Guide

`/root` is a **home-directory container, not a single application**. The real work lives in independent git repos under `/root/projects/`. Treat each project as its own repo — never assume a shared build, test, or package setup across them.

## Read First

- `AGENST.md` (misspelled) at repo root — Thai house rules: read before writing code, reply in Thai (translate other languages), ask immediately if unsure.
- `projects/Cash-Flow/AGENTS.md` — the canonical per-project guide for Cash-Flow. Follow it instead of guessing for that project.

## Per-Project Quick Reference

| Project | What it is | How to run / verify |
|---|---|---|
| **Cash-Flow** | Static Thai finance SPA (HTML/JS/CSS, localStorage) | `python3 -m http.server 8000` from repo root, or open `index.html`; `node --check script.js` |
| **pos-mobile** | Static Thai POS SPA | open `index.html`; optional Docker backend + nginx (`docker-compose.yml`) |
| **pos-mobile-labs** | POS-MOBILE variant with multi-store backend | `docker-compose up` for full stack; backend uses FastAPI + SQLite + Alembic migrations |
| **shiftmate** | Shift-scheduling SPA; optional Flask+SQLite backend | `python server.py` (port 8000) for local static serve; `backend/` has Flask app + `requirements.txt`; deployed to GitHub Pages |
| **python-lessons** | Python data-analysis course | run individual `.py` files; exercises reference `exercise*_tests.json`; check script at `~/.config/opencode/skills/code-teacher/scripts/check_exercise.py` |
| **budgetctrl** | Static HTML/JS multi-page finance app | open `index.html`; modular JS in `js/` (db.js, nav.js, utils.js, per-page modules) |
| **vender** | Vending stock manager (offline-first) | rename `index.txt` → `index.html`, then open; or `python -m http.server 8000` |
| **j-bunrod**, **saharatyokthuan** | GitHub profile READMEs | minimal code; mostly profile content |
| **Olympus** | Multi-platform bots: Apollo (Telegram/Telegraf) + Artemis (Discord/discord.js) | `cd Apollo/telegram-bot && npm install && npm start` (needs `BOT_TOKEN`); `cd Artemis && npm install && npm start` (needs `DISCORD_TOKEN`) |
| **finance-app** | Unknown — inspect before working | check `README.md` in project root |

## Cross-Cutting Gotchas

- **No shared package manager, lockfile, or CI at `/root`**. Each project manages its own tooling.
- **Most SPA projects store data in `localStorage` and have no backend by default** — don't go hunting for an API that doesn't exist.
- **shiftmate and pos-mobile *do* have optional backends** (Flask/Docker/nginx) — check `backend/` and `docker-compose.yml` before declaring something static-only.
- **`python server.py` in shiftmate serves static files on port 8000 and opens a browser; it is NOT the Flask backend.**
- **pos-mobile-labs backend** is a separate FastAPI application with Alembic migrations (`backend/alembic/versions/`), requires `docker-compose.yml` for full stack.
- **Python projects** use plain `python3` — no virtualenv setup documented; assume system Python or user-managed venv.
- **Thai language** is used in UI copy, comments, and commit messages. Keep new user-facing strings Thai.
- **Conventional Commits** used in some projects (`fix:`, `perf:`, `docs:`) sometimes with Thai subjects.

## Project-Specific Notes

### Cash-Flow (`projects/Cash-Flow/`)
- Single `script.js` holds all logic: data, rendering, charts, import/export, event wiring.
- Global `db` = persisted data; global `ui` = transient view state.
- After mutating `db`, call `save()` then `renderAll()` or specific renderer.
- One localStorage key: `cashflow_v1` (items, wallets, cats, installments, bills).
- No ES modules — inline HTML handlers call global `function` declarations.
- Add new handlers to `Object.assign(window, {...})` block at end of `script.js`.
- Escape user-controlled values in `innerHTML` with `escapeHTML()`.
- Money = plain JS numbers (THB); format only for display with `money()`.
- Dates = local `YYYY-MM-DD` strings; use `todayStr()` / `addMonth()`; `fmtDate()` shows Buddhist-era year.
- Transfer creates two items with category exactly `โอนเงิน`; totals/charts exclude this category.
- Loan page is derived: income category `ยืมเงิน`, expense category `คืนเงินกู้`, grouped by item name.
- Excel import uses SheetJS (global `XLSX`) from CDN with SRI hash.
- Charts are hand-drawn on Canvas (`drawBar`, `drawDonut`); HiDPI scaling in `prepCanvas`.

### pos-mobile / pos-mobile-labs (`projects/pos-mobile/`, `projects/pos-mobile-labs/`)
- Single-page app: `index.html` + `style-pos.css` + `script-pos.js`.
- Optional `master-products.js` (not in repo) for central product list — app hides related UI if missing.
- CDN deps with SRI: SheetJS 0.18.5, Chart.js 4.4.0.
- Barcode scanning requires `https://` or `localhost`.
- **pos-mobile-labs** adds multi-store backend (FastAPI, SQLite, Alembic, WebSocket sync).
- Backend tests in `backend/tests/` (pytest); run with `pytest` from `backend/`.

### shiftmate (`projects/shiftmate/`)
- Files: `index.html`, `style.css`, `app.js`, `server.py`, `backend/`, `tools/`.
- Backend (optional): Flask + SQLite at `backend/app.py`, `backend/database.py`.
- Tools: `tools/backup.py` (export/import via API), `tools/convert.py` (JSON ↔ CSV).
- Seed data: 8 shifts (M, A, N, T08, T10, T13, MGR, OFF) — editable in UI.
- Business rules: 1 employee = 1 shift/day; OT flag per shift; OFF is a normal shift; cross-day shifts supported.
- Export formats: JSON (full), CSV (row per employee×day×shift), XLSX (3 sheets).
- CSS variables at top of `style.css` for theming.

### python-lessons (`projects/python-lessons/`)
- 5 lessons, each with `.md` docs and multiple `.py` examples.
- Final project: `exercise1.py` with `exercise1_tests.json`.
- Verification script: `~/.config/opencode/skills/code-teacher/scripts/check_exercise.py`.
- Learning rule: **predict output before running**, type code manually, read last line of error first.

### budgetctrl (`projects/budgetctrl/`)
- Multi-page: `index.html`, `dashboard.html`, `transactions.html`, `budget.html`, `debts.html`, `goals.html`, `recurring.html`, `settings.html`.
- Modular JS: `js/db.js` (data layer), `js/nav.js` (navigation), `js/utils.js`, plus per-page modules.
- Uses `manifest.json` + `sw.js` for PWA/offline support.

### vender (`projects/vender/`)
- Single file originally named `index.txt` — must rename to `index.html`.
- Offline-first, no dependencies, mobile-first (max-width 520px).
- Features: CRUD products, categories, stock alerts, summary, JSON backup/restore.

### Olympus (`projects/Olympus/`)
- **Apollo**: Telegram bot (Telegraf 4.15.3) in `Apollo/telegram-bot/` — needs `BOT_TOKEN` in `.env`.
- **Artemis**: Discord bot (discord.js 14.14.1) in `Artemis/` — needs `DISCORD_TOKEN` in `.env`.
- Both use `dotenv` 16.3.1.
- Run with `npm install && npm start` in each bot's directory.

## Git / Release Conventions

- Default branch is typically `main`.
- Deployment: static hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages) for SPAs.
- No CI or pre-commit hooks at root level; check individual projects.
- Conventional Commit prefixes used in Cash-Flow; other projects may vary.

## When Working in a Project

1. **Read the project's README.md first** — it's the authoritative user/developer guide.
2. **Check for project-specific AGENTS.md** (only Cash-Flow has one currently).
3. **Look for `backend/`, `docker-compose.yml`, `requirements.txt`, `package.json`** to detect optional backends.
4. **Never assume shared tooling** — each project is isolated.
5. **Reply in Thai** per AGENST.md house rules.
