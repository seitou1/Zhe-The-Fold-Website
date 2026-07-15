# QA scorecard — static brand / restaurant sites

**Purpose:** Multi-role quality gate so “ship” isn’t only vibes.  
**Companion:** `BUILD_PLAYBOOK.md`, `GO_LIVE.md`, `PROGRESS.md`, `scripts/check-launch.mjs`.

**Cadence (aligned with kit):** mid-build = gate + honesty + touched dimensions. **Full A–J** at craft freeze and before live.

**How to use**

1. Run automated gate: `node scripts/check-launch.mjs` → must be **PASS** (warnings OK if expected, e.g. fiction NAP).  
2. Score each dimension **1–5** (rubrics below).  
3. **Ship craft** only if: auto gate PASS **and** every *required* dimension ≥ **4**, none at **1–2**.  
4. Log date, URL/build (`ASSET_V`), scorer, phone model; update `PROGRESS.md`.  
5. Failures become next session goal — not open “make it better.”

**Scoring key**

| Score | Meaning |
|-------|---------|
| 5 | Excellent; reference quality |
| 4 | Solid; ship |
| 3 | Acceptable with noted debt |
| 2 | Blocks craft ship |
| 1 | Broken / wrong model |

---

## 0. Run metadata

| Field | Value |
|-------|--------|
| Project / site | |
| Date | |
| `ASSET_V` / commit | |
| Desktop browser | |
| Phone (required for D) | |
| Scorer(s) | |
| `check-launch.mjs` | PASS / FAIL — notes: |
| Intended posture | Fiction `noindex` / Live index |

---

## A. Product & IA (founder / PM)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| A1 | Each full-viewport section has **one written job** | | |
| A2 | Primary conversion is obvious within ~10s | | |
| A3 | Out-of-scope held (no dock/CMS/map iframe/etc. unless planned) | | |
| A4 | Freeze phase matches reality (not polishing IA mid-ship) | | |

**Dimension score (min of rows or gut average):** __ / 5  
**Required for ship:** ≥ 4

---

## B. Art direction & visual craft (creative director)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| B1 | **Photo/product is the dish**; type is caption | | |
| B2 | Type hierarchy calm (≤2 competing display sizes) | | |
| B3 | Veil/contrast: type readable without mudding plate | | |
| B4 | Chrome is quiet (hairlines/icons, not widget soup) | | |
| B5 | Motion explains state (or none); reduced-motion OK | | |
| B6 | Desktop vs mobile = **same decisions** (parity of craft) | | |

**Dimension:** __ / 5 · **Required:** ≥ 4

---

## C. Copy & voice (copywriter)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| C1 | Voice matches brand (specific, calm; no empty superlatives) | | |
| C2 | EN owns prose; CN ceremonial not noisy | | |
| C3 | Ops strings scannable (hours/address don’t market-babble) | | |
| C4 | CTAs: clear verbs; one primary per zone | | |
| C5 | No fiction NAP presented as live fact in prose | | |

**Dimension:** __ / 5 · **Required:** ≥ 4

---

## D. UX & interaction (designer + engineer)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| D1 | Vertical snap/scroll feels intentional, not fighty | | |
| D2 | Carousels: **swipe both directions** on real phone | | |
| D3 | Tap targets don’t steal swipes (chevrons/rail OK) | | |
| D4 | Nav works; no second hidden mobile product | | |
| D5 | Call / Directions / Reserve do the right thing from data | | |
| D6 | Open/hours chip matches `SITE.hours` | | |

**Dimension:** __ / 5 · **Required:** ≥ 4 (D2 is **blocking** if carousels exist)

---

## E. Engineering & code etiquette (dev)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| E1 | Stack matches playbook §2 (or documented exception) | | |
| E2 | **SSOT:** ops content only in `data.js` (no dual NAP/HTML) | | |
| E3 | No dead UI left (`display:none` forever = fail) | | |
| E4 | Naming clear; no drive-by refactors mixed with features | | |
| E5 | `ASSET_V` consistent HTML/CSS/data | | |
| E6 | Errors handled quietly (mailto fallback, missing social hide) | | |

**Dimension:** __ / 5 · **Required:** ≥ 4

**Code etiquette (binary — all must be YES for E to ship):**

| Rule | Y/N |
|------|-----|
| Diff matches the session goal (no unrelated rewrites) | |
| Comments explain *why*, not narration | | |
| New dependency justified by playbook §2.5 | |
| Secrets/API keys never in repo | |
| `check-launch.mjs` run this milestone | |

---

## F. Security & privacy (static-site appropriate)

Static brochure sites are not banks — **don’t theater AppSec**. Do cover real risks:

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| F1 | No secrets in client JS/HTML | | |
| F2 | External links `rel` sensible (`noopener` on `target=_blank`) | | |
| F3 | User content not injected unsafely (if any); `esc()` for hydrated HTML | | |
| F4 | Headers: sensible referrer/XSS where host allows (`_headers`) | | |
| F5 | Forms: if mailto only, OK; if POST later, CSRF/provider plan | | |
| F6 | Analytics/third parties: none required at first paint; consent if region needs | | |

**Dimension:** __ / 5 · **Required:** ≥ 4 for live; ≥ 3 for private fiction preview  

**Out of scope unless you add a backend:** auth hardening, rate limits, WAF tuning, dependency CVE farms (you have no npm runtime).

---

## G. SEO & local (marketing eng)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| G1 | Title + meta description accurate (`SITE.description`) | | |
| G2 | Robots match posture (`noindex` if fiction/placeholder) | | |
| G3 | JSON-LD matches visible NAP/hours/menu source | | |
| G4 | Canonical / OG basics sane | | |
| G5 | Sitemap + robots agree with index intent | | |
| G6 | NAP will match GBP when live (process, not code) | | |

**Dimension:** __ / 5 · **Required:** ≥ 4 for live index; fiction may score G2=5 with noindex  

---

## H. Accessibility (everyone)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| H1 | Keyboard reaches primary actions | | |
| H2 | Focus visible on controls | | |
| H3 | Images: meaningful alt or empty alt if decorative | | |
| H4 | Contrast adequate on real photos (not only design file) | | |
| H5 | `prefers-reduced-motion` doesn’t strand content | | |
| H6 | ARIA only where it helps (tabs/rails/live open) | | |

**Dimension:** __ / 5 · **Required:** ≥ 4  

---

## I. Performance (eng)

| # | Check | Score 1–5 | Notes |
|---|--------|-----------|-------|
| I1 | LCP hero acceptable on mid phone Wi‑Fi | | |
| I2 | Images modern format (WebP) + sensible dimensions | | |
| I3 | Fonts subset/self-hosted; no font flash disaster | | |
| I4 | No required third-party JS at first paint | | |
| I5 | Lazy below-fold where it doesn’t break LCP panels | | |

**Dimension:** __ / 5 · **Required:** ≥ 3 craft preview; ≥ 4 live  

**Optional numeric log:** LCP __ s · page weight __ MB · JS __ KB  

---

## J. Content integrity (SSOT audit)

| # | Check | Y/N | Notes |
|---|--------|-----|-------|
| J1 | Change a dish price in `data.js` only → UI + schema follow | | |
| J2 | Change hours in `data.js` only → chip + Visit follow | | |
| J3 | `booking.url` null → mailto, not vendor homepage | | |
| J4 | No Sample Street left in HTML shells | | |
| J5 | Social null hides icon | | |

**All J must be Y for ship.**

---

## Summary

| Dimension | Score | Required | Pass? |
|-----------|-------|----------|-------|
| A Product / IA | | ≥4 | |
| B Art direction | | ≥4 | |
| C Copy | | ≥4 | |
| D UX / interaction | | ≥4 (+ D2) | |
| E Engineering | | ≥4 + etiquette Y | |
| F Security | | ≥4 live / ≥3 fiction | |
| G SEO | | ≥4 live | |
| H A11y | | ≥4 | |
| I Performance | | ≥3 / ≥4 live | |
| J SSOT binary | all Y | all Y | |
| Auto `check-launch` | PASS | PASS | |

**Overall craft ship:** YES / NO  

**Top 3 debts (if any):**

1.  
2.  
3.  

**Next session goal (one line):**  

**Honesty check (required):**

| Question | Y/N |
|----------|-----|
| Any Shared/Global change without regression notes? | |
| Anything marked done that is only partial / one-platform / one swipe direction? | |
| Any known fragile patch still in tree? | |
| Scorer actually exercised D2 (both swipe directions on phone) if carousels exist? | |

If any honesty row is a problem, overall craft ship is **NO** until stated as debt or fixed.

---

## Cadence (don’t over-process)

| When | What |
|------|------|
| Every milestone | Auto gate + D (if interaction touched) + E/J |
| Before calling craft “done” | Full A–J scorecard once |
| Going live | Full scorecard + `GO_LIVE.md` + gate with real NAP |
| After launch | Don’t re-score weekly; only on material redesign |

**Anti-pattern:** Scoring every micro-PR. **Pattern:** Score at freezes (playbook §13.9 phases).

---

## Mapping to automation (what to script later)

| Scorecard | Today | Later automation |
|-----------|--------|------------------|
| Launch / NAP / robots / ASSET_V | `check-launch.mjs` | Keep extending |
| SSOT dual Sample Street | partial warn | HTML must not contain street string |
| Security headers | host config | `curl -I` in gate |
| Lighthouse perf/a11y/SEO | manual | CI Lighthouse CI optional |
| Swipe both ways | **human phone** | Hard to automate well — keep human |
| Art direction / copy | **human** | Never fully automate |

---

*Copy this file per project (`QA_SCORECARD-<site>.md`) or fill a fresh section per release; don’t rewrite history—attach date + ASSET_V.*
