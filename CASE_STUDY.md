# Case study — 褶 · Zhe · The Fold (portfolio)

**Type:** Concept restaurant website + delivery system  
**Status:** Demo product (fiction NAP, noindex) — not a live booking venue  
**Stack:** Static HTML/CSS/JS · single content file (`data.js`) · Netlify/Vercel-ready  

---

## Problem

Hospitality brands need sites that feel as intentional as the room — not a template with a stock hero and a broken “Reserve” button. They also need a path from demo → real NAP, hours, and booking without rebuilding.

## What we built

### Guest experience
- Full-viewport journey: **Hero → Origins → Menu → Visit**  
- Bilingual ceremony (EN-first, CN as mark)  
- Photo-led panels (media as the dish; type as caption)  
- Origins & Menu carousels with keyboard, controls, and touch (both directions)  
- Live open/closed chip from structured hours  
- Visit logistics: address, hours, Directions, Reserve, Call  

### Systems (client-ready patterns)
- **Single source of truth** for menu, story, hours, NAP, social, booking  
- **Launch safety:** placeholder NAP cannot accidentally go indexable  
- **Reserve path:** venue booking URL or mailto fallback (same UI)  
- **Owner handoff:** non-devs edit business content in one file  
- **QA + ops:** scorecard, staging/rollback notes, go-live checklist  

### How we work (the second product)
Documented process: brief → research & options → freezes → multi-agent lanes when useful → honesty about risk → demo-complete vs production-complete bars (`PRODUCT.md`).

## Constraints we chose
- No React/npm runtime for this brochure class of site  
- No map iframe or review-widget clutter  
- One nav model on phone and desktop  

## Results (demo)
- Gate: `node scripts/check-launch.mjs` PASS under fiction posture  
- Craft: full journey shippable as **concept demo**  
- Production: swap real NAP + booking URL + photos → go-live checklist  

## For your business
We adapt the same discipline to **your** stack when needed (static, Astro, Next, CMS) — process kit in `next project site/` does not force this stack. Your site gets real data, real booking, and index only when ready.

## Links
- Product definition: `PRODUCT.md`  
- Progress: `PROGRESS.md`  
- Go-live: `GO_LIVE.md`  
