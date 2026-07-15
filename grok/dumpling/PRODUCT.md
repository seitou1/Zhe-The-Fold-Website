# Product definition — 褶 · Zhe as a **complete demo**

**Positioning:** Zhe is not “half a restaurant site.” It is a **portfolio product**: a full visitor journey + the **process kit** that shows how we plan, build, and hand off sites for real businesses.

**Audience for the demo:** prospective clients (restaurants, hospitality, brand houses) and partners evaluating whether we can deliver craft + systems, not just a pretty mock.

---

## 1. What “complete product” means here

Two bars — do not confuse them.

| Bar | Definition | Index Google? | Real NAP? |
|-----|------------|---------------|-----------|
| **A. Demo-complete** | Anyone can walk the full experience; conversion paths work in *demo mode*; process docs explain how we’d ship for a real client | **No** (`noindex`) | No — clearly **concept / sample** data |
| **B. Production-complete** | Same craft + **real** NAP, booking, GBP match, indexable, rollback filled, owner trained | **Yes** | Yes |

**Default goal for this repo right now: A — Demo-complete.**  
**B** is a client engagement with real venue data.

---

## 2. Product surfaces (what we ship as the demo)

| Surface | Role in the pitch |
|---------|-------------------|
| **Live site** (`index.html` …) | The guest experience: Hero → Origins → Menu → Visit → Footer |
| **Process kit** (README, brief, playbook, multi-agent, QA, ops, handoff) | “How we work” — decisions, freezes, SSOT, launch safety |
| **Gate** (`check-launch.mjs`) | Engineering discipline clients can trust |
| **Owner handoff** | Shows non-dev can update hours/menu without breaking the site |

---

## 3. Demo-complete acceptance criteria

### 3.1 Guest journey (must all be true)

- [x] Four full panels + footer, coherent brand  
- [x] Desktop + mobile one product (no dead dock/hamburger)  
- [x] Origins: chapters, chevrons/pips, swipe both directions (automation 2026-07-15)  
- [x] Menu: filters, photo + list, rail, swipe both directions (same)  
- [x] Visit: where / when / Directions / Reserve / Call  
- [x] Open/closed chip from hours data  
- [x] Hero LCP still works if video fails  
- [x] **Concept framing** — `SITE.demoMode` nav chip + footer blurb  
- [x] Full scorecard: `QA_SCORECARD_DEMO_2026-07-15.md`  


### 3.2 Conversion (demo mode — honest)

| CTA | Demo-complete behavior | Production later |
|-----|------------------------|------------------|
| **Directions** | Opens Maps for sample address | Real mapsQuery |
| **Call** | `tel:` to sample number (works on phone) | Real telephone |
| **Reserve** | mailto to concept email **or** labeled demo | Real Resy/OT venue URL |
| **Open chip** | Matches sample hours + TZ | Real hours |

Honesty required in pitch: *“Reserve is email until a venue’s booking URL is wired — same code path as production.”*

### 3.3 Content & SSOT

- [x] Menu, story, hours, NAP, social, booking from `data.js`  
- [x] No dual Sample Street hardcode in HTML shells  
- [x] Schema JSON-LD builds from data  
- [x] `INDEXABLE: false` + noindex while sample NAP  

### 3.4 Process product (part of the demo)

- [x] Brief, playbook, multi-agent, QA, ops, handoff, legal/assets docs  
- [x] Gate green for fiction posture  
- [x] `PROGRESS.md` reflects demo vs live honestly  
- [x] One-page **case study** (`CASE_STUDY.md`)  

### 3.5 What demo-complete explicitly does **not** require

- Real street address or phone  
- Google indexing  
- Real Resy contract  
- GBP  
- Paid analytics  
- Physical-device certification (recommended once before prospect URL)  

---

## 4. Production-complete (client handoff bar)

See `GO_LIVE.md` + `OPS_RUNBOOK.md`. Extra vs demo:

- Real NAP + booking URL + gate **zero** placeholder warnings  
- `demoMode: false`  
- `INDEXABLE: true`  
- Rollback table filled + tagged deploy  
- Owner walkthrough with `OWNER_HANDOFF.md`  
- Optional privacy if analytics added  
- Asset rights table for *their* photos  

---

## 5. Concept framing — **shipped**

`SITE.demoMode` + label/blurb → desktop nav chip + footer (all viewports).  
Set `demoMode: false` for a real venue.

---

## 6. Pitch narrative (30 seconds)

1. **Guest site** — bilingual, photo-led, full path to visit.  
2. **Systems** — one content brain (`data.js`), launch safety so sample data can’t index by accident.  
3. **Process** — brief → decisions → freezes → multi-agent when useful → demo vs production bars.  
4. **For your business** — real NAP + booking + photos; same product; `GO_LIVE.md`.  

---

## 7. Demo freeze checklist

| # | Action | Status |
|---|--------|--------|
| 1 | Concept framing (`demoMode`) | **Done** |
| 2 | Full scorecard recorded | **Done** — `QA_SCORECARD_DEMO_2026-07-15.md` |
| 3 | Journey + both swipe directions | **Done** (Playwright desk + mobile). Physical phone once before client share |
| 4 | Gate PASS (fiction warnings only) | **Done** |
| 5 | `CASE_STUDY.md` | **Done** |
| 6 | Portfolio URL / share rules | **You** |
| 7 | Git tag | **Skipped** — no git repo at project root |

### Demo-complete declaration

**As of 2026-07-15: demo product is complete** for portfolio showcase under fiction posture.  
**Not** production-complete. Residual: physical-device spot-check before sending a URL to a prospect.

---

## 8. How this relates to the blank kit

| Repo path | Role |
|-----------|------|
| `dumpling/` | **Finished-ish product demo** (Zhe) + full process |
| `next project site/` | Blank process kit for the *next* client (any stack) |

The demo proves ability; the blank kit proves repeatability.
