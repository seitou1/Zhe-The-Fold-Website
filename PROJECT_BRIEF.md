# Project brief — 褶 · Zhe · The Fold

Filled for the live `dumpling/` project.  
**SOP:** `BUILD_PLAYBOOK.md` · **Progress:** `PROGRESS.md` · **QA:** `QA_SCORECARD.md` · **Launch:** `GO_LIVE.md`

---

## 1. Identity

| Field | Answer |
|-------|--------|
| Working title | 褶 · Zhe · The Fold |
| One-line promise | Northern folds in SF; folded by hand, served without hurry |
| Audience | SF diners seeking a quiet, craft-led house (not loud Yelp chrome) |
| Tone | Quiet, wabi-sabi, warm, bilingual ceremony |
| Languages | EN-first prose; CN ceremonial marks |

---

## 2. Jobs of the site

| # | Section | Job | Primary content |
|---|---------|-----|-----------------|
| 1 | Hero | Brand hit | Still + optional loop video |
| 2 | Origins | Belief / story | Chapter carousel |
| 3 | Menu | Desire | Dish spotlight + rail / list |
| 4 | Visit | Logistics | Address, hours, CTAs |
| 5 | Footer | Quiet exit | Tagline + © |

---

## 3. Conversion

| Priority | Action | Where |
|----------|--------|--------|
| **Primary** | Reserve | Nav + Visit (`booking.url` or mailto) |
| Secondary | Directions | Visit |
| Tertiary | Call | Visit |

Booking: Resy preferred · **url currently null** → mailto fallback (honest partial).

---

## 4. Stack & constraints (**chosen for Zhe**)

| Choice | This project |
|--------|----------------|
| Stack | Static HTML + CSS + `data.js` + `script.js`, no npm runtime |
| CMS | No |
| Map | Maps URL only (no heavy iframe) |
| Mobile chrome | Same top nav as desktop (no dock/hamburger) |
| Pre-index | `noindex` while placeholder NAP |
| Host | Netlify and/or Vercel static |

**Out of scope (unless §15 + freeze unlock):** React/CMS, map embed, review wall, second mobile chrome, Swiper.

**Note:** New unrelated sites should use `next project site` kit and may pick a **different** stack in their brief.

---

## 5. Content SSOT

| Content | Owner |
|---------|--------|
| NAP, hours, phone, booking, social | `data.js` → `SITE` |
| Menu | `data.js` → `MENU_ITEMS` |
| Story | `data.js` → `STORY_CHAPTERS` |
| SEO description | `SITE.description` |
| Brand poetry (hero leads) | `index.html` |

---

## 6. Freeze & polish

| Phase | Status |
|-------|--------|
| A–E craft/build | Done (see `PROGRESS.md`) |
| F Ship live | Blocked on real NAP + booking URL |

Polish: no open-ended “classier” passes without a written goal.

---

## 7. Session tracking

Use **`PROGRESS.md`** (not this file) for ongoing status.

---

## 8. Decision log (high level)

| Date | Decision | Why |
|------|----------|-----|
| 2026 | Static stack | Brochure craft, zero visitor deps |
| 2026 | No dock / hamburger | One product desktop+mobile |
| 2026 | Visit = caption not Yelp card | Photo-as-dish |
| 2026 | Touch-first carousels | iOS right-swipe reliability |
| 2026 | data.js SSOT | Dual NAP/booking bugs |
| 2026 | Mailto if no Resy URL | CTA always works; honest partial |

---

## 9. Links

| Doc | Path |
|-----|------|
| Progress | `PROGRESS.md` |
| Playbook | `BUILD_PLAYBOOK.md` |
| Multi-agent | `MULTI_AGENT.md` |
| Ops / rollback | `OPS_RUNBOOK.md` |
| Gate | `node scripts/check-launch.mjs` |
| Blank kit (any stack) | `../next project site/` |
