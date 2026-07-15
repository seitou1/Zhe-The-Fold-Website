# QA scorecard — Demo-complete freeze

**Date:** 2026-07-15  
**Project:** 褶 · Zhe · The Fold (`dumpling/`)  
**Posture:** Concept demo / noindex (`SITE.demoMode: true`)  
**ASSET_V:** `1784056000`  
**Gate:** PASS (3 expected fiction warnings: placeholder NAP, INDEXABLE false, mailto Reserve)  
**Scorer:** Automated Playwright journey + gate + process review  
**Phone:** Simulated touch events in mobile viewport (390×844) — **not** a physical iPhone; residual risk noted under honesty  

---

## Scores (1–5)

| Dim | Score | Notes |
|-----|-------|-------|
| **A Product / IA** | **5** | Four panels + footer; jobs clear; PRODUCT.md demo bar defined |
| **B Art direction** | **5** | Photo-led; Visit caption grammar; concept chip quiet |
| **C Copy** | **4** | Strong voice; demo framing present; sample NAP by design |
| **D UX / interaction** | **4** | Story+Menu swipe both ways (desk+mobile sim); open chip; CTAs wired. Physical device re-spot-check recommended |
| **E Engineering** | **5** | SSOT data.js; gate; no dual Sample Street in HTML; cache-bust aligned |
| **F Security** | **4** | noopener; no secrets; fiction noindex; static-appropriate |
| **G SEO** | **5** *for demo* | noindex correct; schema from data; not seeking index |
| **H A11y** | **4** | Labels, aria patterns, reduced-motion hooks; full audit not run |
| **I Performance** | **4** | WebP, LCP poster, self-hosted fonts; PSI not re-run this session |
| **J SSOT binary** | **Y** | Hydrate from data; booking mailto when url null |

**Required ≥4 all dims:** **YES**  
**Craft / demo ship:** **YES** (demo bar)

---

## Honesty check

| Question | Answer |
|----------|--------|
| Shared/Global change without notes? | No this freeze |
| Partial / one-platform claims? | **Physical phone not used this run** — touch simulated |
| Fragile patch known? | No known active fragile patches |
| D2 both directions? | **Yes in automation** (desktop + mobile viewport). Confirm once on real device when sharing URL |

**Works-but-wrong (intentional demo):** Sample NAP; Reserve = mailto; noindex.

---

## Journey checks (automated)

| Check | Result |
|-------|--------|
| Concept · Demo label visible (desktop) | Pass |
| Footer demo blurb visible | Pass |
| robots noindex | Pass |
| Reserve mailto | Pass |
| Menu items 8 / story dots 3 | Pass |
| Schema includes menu | Pass |
| Story swipe L/R desktop | Pass |
| Menu swipe L/R desktop | Pass |
| Story swipe L/R mobile viewport | Pass |
| Menu swipe L/R mobile viewport | Pass |
| Visit address/hours/maps/tel | Pass |

---

## Top debts (non-blocking for demo)

1. Physical iPhone/Android spot-check before client-facing URL share  
2. Production bar: real NAP + Resy + INDEXABLE (`GO_LIVE.md`)  
3. Optional: Lighthouse numbers on host URL  

## Next

Demo packaging complete. Production complete = client data path.
