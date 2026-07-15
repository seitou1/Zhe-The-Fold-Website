# AGENTS.md — READ THIS FIRST (褶 · Zhe / dumpling)

You are in the **Zhe live project** (`dumpling/`). Process + craft history live here.  
**Generic blank kit** (any stack): `../next project site/` or copy from there for *new* brands.

---

## Cold start (every session)

1. **Read** (if not already this session):
   - `README.md` — kit index  
   - `PROGRESS.md` — current phase / blockers  
   - `PROJECT_BRIEF.md` — product facts  
   - `BUILD_PLAYBOOK.md` §15–16 (decisions, frozen, honesty, research)  
   - `MULTI_AGENT.md` if parallelizing  

2. **State phase** from `PROGRESS.md` (0–7).

3. **One session goal** + **stop condition**. Update `PROGRESS.md` at end of session.

4. **Non-trivial work:** research web → §15 options (fix class, blast radius) → human pick or hybrid defaults → code.

5. **Multi-agent:** discretion — parallel only when lanes are obvious (non-overlapping files).

6. **After changes:** `node scripts/check-launch.mjs` · phone QA if gestures/shell · scorecard at freezes.

---

## What is forced vs not (this project)

| Forced for Zhe | Not for *new* sites in the blank kit |
|----------------|--------------------------------------|
| Static stack (already frozen) | Other stacks OK if brief chooses |
| `data.js` SSOT | CMS etc. OK on new projects |
| Photo-led panels, no dock | Different IA OK on new projects |
| Process: research, options, honesty, freezes | Same process |

Do **not** casually change Zhe's frozen stack. Do **not** assume every future site must be static like Zhe — use `next project site` kit for greenfield.

---

## Doc map

| Need | File |
|------|------|
| Progress | `PROGRESS.md` |
| Product bars (demo vs live) | `PRODUCT.md` |
| Case study | `CASE_STUDY.md` |
| Brief | `PROJECT_BRIEF.md` |
| Craft + decisions | `BUILD_PLAYBOOK.md` |
| Multi-agent | `MULTI_AGENT.md` |
| QA | `QA_SCORECARD.md` |
| Ops / rollback | `OPS_RUNBOOK.md` |
| Live cutover | `GO_LIVE.md` |
| Owner | `OWNER_HANDOFF.md` |
| Assets | `ASSETS.md` |
| Privacy | `LEGAL_PRIVACY.md` |
| Gate | `scripts/check-launch.mjs` |
| Lanes | `.grok/agents/site-*.md` |

---

## Non-negotiable rules

1. Research the web before non-trivial options.  
2. §15 options + fix class + blast radius before non-trivial code.  
3. No fragile patches when a proper fix exists.  
4. Honesty: might-break, works-but-wrong, partial, untested — never false green.  
5. Ops content only in `data.js`.  
6. §16 frozen systems — memo to reopen.  
7. One session goal; update `PROGRESS.md`.  

---

## Operating defaults (locked unless human overrides)

| Topic | Default |
|-------|---------|
| **Orchestrator** | **Hybrid:** drive routine work; **stop for human** on freezes, live NAP/index, and **Global** blast-radius |
| **Stack (Zhe)** | Already chosen: static HTML/CSS/`data.js`/`script.js` — do not swap without §15 + §2.5 |
| **Directed nits** | Just do them |
| **Research depth** | Deep for architecture/gestures/a11y/SEO/Shared-Global; light for directed visual nits |
| **Multi-agent** | **Discretion:** parallel only if ≥2 independent workstreams; else **solo** |
| **Scorecard** | Light mid-build; full at craft freeze and before live |
| **Reserve** | mailto until `booking.url` set — say so (partial conversion) |

### Multi-agent discretion

**Parallel when obvious** (different files, one-line done-when each).  
**Solo when** one bug, shell/gestures, unclear ownership.  
**Caps:** ≤3 implementers · shared systems serial.

### When to stop and ask

- Going live / INDEXABLE / real NAP  
- Fragile patch or Global rewrite  
- Reopening frozen systems  
- Scope not in brief (CMS, full redesign)  

---

## Kickoff prompt

```text
Follow dumpling/AGENTS.md cold start + operating defaults.
Read PROGRESS.md, PROJECT_BRIEF, BUILD_PLAYBOOK §15–16.
Hybrid orchestration. Multi-agent only when lanes are obvious.
Session goal: [one outcome]. Stop when: [criteria].
Research before options. No fragile patches. Honesty on break risk.
Update PROGRESS.md at end.
```
