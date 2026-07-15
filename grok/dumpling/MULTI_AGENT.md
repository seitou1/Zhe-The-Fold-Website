# Multi-agent divide-and-conquer (Zhe + kit SOP)

**Purpose:** Parallel agents without thrash (dual mobile chrome, dual NAP, fragile patches, endless polish).

**Depends on:** `PROJECT_BRIEF.md` · `BUILD_PLAYBOOK.md` (§15–16) · `PROGRESS.md` · `QA_SCORECARD.md` · gate  

**Default:** **Solo unless parallel is obvious** (`AGENTS.md` operating defaults). Prefer simple agents over a swarm.

**Tooling:** `spawn_subagent` + optional `isolation: "worktree"`.

| Type | Purpose |
|------|---------|
| Built-in `plan` / `explore` | Architecture / research |
| **`site-*` in `.grok/agents/`** | Lanes (below) |
| Merge | Orchestrator only |

| `subagent_type` | Owns (Zhe static) |
|-----------------|-------------------|
| `site-skeleton` | Phase 2 only (already done for Zhe) |
| `site-content` | `data.js` |
| `site-structure` | `index.html` |
| `site-visual` | `styles.css` |
| `site-behavior` | `script.js` |
| `site-launch` | SEO / gate |
| `site-reviewer` | Read-only review |

Also: `AGENTS.md` · `.grok/rules/multi-agent.md` · **`PROGRESS.md`** workstreams table  

**New brand / any stack:** use blank kit `../next project site/` (stack not forced).

---

## 1. Core idea

| Role | Who | Does |
|------|-----|------|
| **Orchestrator** | You + main session | Brief, §15 decisions, freezes, file ownership map, merge, phone QA, scorecard |
| **Specialist agents** | Subagents | One lane only; write to assigned files; report artifact + risks; **no scope expansion** |
| **Reviewer** | Subagent (read-only or review skill) | Diff vs brief + frozen systems + fragile-patch rules |

**Never:** four agents all editing `styles.css` and “making it better.”  
**Always:** clear **lanes**, **contracts**, **merge gates**.

---

## 2. When multi-agent helps vs hurts

| Helps | Hurts |
|-------|--------|
| Parallel research + plan | Open “improve the site” |
| Parallel *implementation* on different files | Two agents on carousel binder / shell |
| Reviewer after merge | Skipping §15 on frozen systems |

**Rule:** After brief + stack locked. **Solo if unsure.**

### Parallel vs solo (Phase 3)

| Parallel | Solo |
|----------|------|
| Content + CSS (different files) | One bug / one file |
| Explore + plan | Gestures, mobile shell, integration |

**Caps:** ≤3 implementers · shared systems serial · merge before next wave.

**Research-first + honesty:** Web research before options; never false-green.

---

## 3. Phases (divide-and-conquer timeline)

```
0  BRIEF          Human (+ optional plan agent) — PROJECT_BRIEF.md
1  ARCHITECTURE   Plan agent — stack, panels, SSOT shape, frozen list for *this* site
2  SKELETON       One implementer — HTML shell + tokens + snap shell only
3  PARALLEL LANES Specialists — content, visual, interaction, SEO (file-owned)
4  INTEGRATION    Orchestrator — merge, wire data.js hydrate, fix seams
5  HARDENING      Gestures/mobile only if needed; single owner
6  QA / SCORE     check-launch + QA_SCORECARD + phone
7  FREEZE / SHIP  GO_LIVE posture
```

Phases 0–2 are **serial**. Phase 3 is **parallel**. 4–7 serial again.

---

## 4. Lane map (recommended roles)

Assign **one owner per lane**. Prefer **file ownership** over “vibe ownership.”

### Lane A — Content / SSOT  
**Agent type:** `general-purpose`  
**Owns:** `data.js` (or `content/*.json`), copy strings for hydrate targets  
**Must not touch:** gesture code, shell CSS  
**Done when:** menu/story/site objects complete; no dual NAP in HTML  
**Handoff:** path to data file + sample render checklist  

### Lane B — Structure / HTML  
**Agent type:** `general-purpose`  
**Owns:** `index.html` structure, empty hydrate IDs, LCP image shells  
**Must not:** invent second nav/dock; hardcode Sample Street  
**Done when:** sections match brief jobs; hooks `data-zhe-*` present  

### Lane C — Visual system / CSS  
**Agent type:** `general-purpose`  
**Owns:** `styles.css` (or split `styles/*.css` if you choose that in arch)  
**Must not:** change scroll root or JS contracts without orchestrator  
**Done when:** tokens, stage, panel grammar, desktop+mobile layout  

### Lane D — Behavior / JS  
**Agent type:** `general-purpose`  
**Owns:** `script.js` hydrate + interaction  
**Must not:** put ops content literals that belong in data  
**Done when:** render*Dom, CTAs, open chip, carousels if in scope  

### Lane E — SEO / launch / gate  
**Agent type:** `general-purpose` or script-focused  
**Owns:** meta, robots, schema injection, `check-launch.mjs`, `GO_LIVE` notes  
**Done when:** gate PASS for intended posture  

### Lane F — Explore / research (read-only)  
**Agent type:** `explore`  
**Owns:** nothing on disk required; outputs notes  
**Use for:** refs, “how did Zhe do X?”, asset inventory  

### Lane G — Plan  
**Agent type:** `plan`  
**Owns:** plan doc only  
**Use for:** Phase 1 architecture; PR-sized implementation plan  

### Lane H — Review  
**Agent type:** `explore` or review skill  
**Owns:** review markdown  
**Checks:** brief compliance, §15/§16, fragile patches, dual SSOT, mobile second product  

---

## 5. File ownership matrix (prevent collisions)

Example for a Zhe-like site (adjust per project):

| Path | Primary lane | Secondary (read only unless orchestrator says) |
|------|--------------|-----------------------------------------------|
| `PROJECT_BRIEF.md` | Human / orchestrator | All |
| `data.js` | A Content | D may read; not write prices in HTML |
| `index.html` | B Structure | C class names agreed; D IDs agreed |
| `styles.css` | C Visual | D may add class hooks only via memo |
| `script.js` | D Behavior | E schema hooks coordinated |
| `scripts/check-launch.mjs` | E Launch | Orchestrator |
| `assets/*` | Human or A | Paths only in data |

**Parallel rule:** If two lanes need the same file, **serialize** or split the file in Phase 1 (e.g. `styles/tokens.css` + `styles/panels.css`).

**Worktrees:** When two implementers run at once, use `isolation: "worktree"` and merge via orchestrator (not both on main tree).

---

## 6. Handoff contract (every subagent return)

Each child must return a short artifact (chat summary + optional file):

```markdown
## Handoff: [Lane X]

**Goal:** …
**Status:** done / blocked / partial
**Files touched:** …
**Fix class of approach:** Surgical / Proper / Fragile (never silent Fragile)
**Blast radius:** Local / Shared / Global
**What can break:** … (be specific; do not understate)
**Works but wrong?:** no / yes — explain residual design debt
**Verified on:** desktop / phone / both directions / untested
**Not done / out of scope honored:** …
**Regression notes for orchestrator:** …
**Needs decision (§15)?** no / yes — question: …
```

Orchestrator **rejects** handoffs that changed frozen systems without a prior decision memo.

---

## 7. Orchestrator checklist (your job)

### Start of project
- [ ] Fill `PROJECT_BRIEF.md` + start `PROGRESS.md`  
- [ ] Plan → approve stack/IA  
- [ ] Skeleton once  
- [ ] Freeze skeleton before any parallel wave  

### Build wave
- [ ] Solo by default; parallel only if ownership is obvious  
- [ ] Lane prompts: **file list + must not + done when**  
- [ ] Track in-flight lanes in `PROGRESS.md`  

### Integration
- [ ] Merge one lane at a time  
- [ ] `node scripts/check-launch.mjs`  
- [ ] Smoke desktop + phone  
- [ ] `site-reviewer` on diff  

### Close
- [ ] Scorecard at freeze  
- [ ] Update `PROGRESS.md` (phase, next goal, debts)  
- [ ] Update frozen table if needed  

---

## 8. Prompt templates

### 8.1 Plan agent (Phase 1)

```text
Read PROJECT_BRIEF.md and BUILD_PLAYBOOK.md §2, §15, §16.
RESEARCH FIRST: web search current best practices and real examples
(restaurant/brand marketing sites, static vs framework tradeoffs, mobile nav,
scroll-snap pitfalls, reservation UX). Summarize sources before options.
Produce an architecture plan only (no code):
- Research notes (sources + takeaways)
- Stack choice vs §2.5 decision tree
- Panel list + jobs (from brief)
- data.js shape (SITE + content arrays)
- File ownership matrix for parallel lanes
- What is frozen from day one
- Risks (mobile shell, gestures, SSOT)
- Implementation order (serial then parallel)
Use §15 options table if stack or IA has alternatives.
Do not implement.
```

### 8.2 Spawn examples (prefer custom types)

```text
# Phase 1
subagent_type: plan
prompt: (see 8.1)

# Phase 2
subagent_type: site-skeleton
isolation: none
prompt: Brief PROJECT_BRIEF.md. Plan: [path]. Phase 2 only. Handoff MULTI_AGENT §6.

# Phase 3 parallel (worktrees)
subagent_type: site-content   | isolation: worktree | Own data.js only…
subagent_type: site-structure | isolation: worktree | Own index.html only…
subagent_type: site-visual    | isolation: worktree | Own styles.css only…
subagent_type: site-behavior  | isolation: worktree | Own script.js only… (or serial after CSS)
subagent_type: site-launch    | isolation: none     | Gate + meta only…

# After merge
subagent_type: site-reviewer
capability_mode: read-only   # agent is already plan/read-only
prompt: Review vs brief + §15–16. Output verdict file if path given.
```

Lane system prompts already live in `.grok/agents/site-*.md` — spawn prompt only needs **session goal, paths, stop condition**.

---

## 9. Orchestration (default locked)

| Mode | How |
|------|-----|
| **Hybrid (default)** | Agent drives routine work; human on stack freezes, live NAP/index, Global blast radius |
| Solo vs parallel | Solo unless lanes are obvious (`AGENTS.md`) |
| Full auto swarm | **Not used** |

---

## 10. Isolation & merge (Grok)

| Mode | Use |
|------|-----|
| `isolation: "none"` | Single writer; explore/plan/review |
| `isolation: "worktree"` | Parallel implementers on different lanes |
| Serial on main | Integration, gestures, shell |

**Merge order (typical):** Content → HTML structure → CSS → JS → Launch gate → Review.

Conflict rule: **orchestrator wins** on frozen systems; lane redoes local work.

**Full git branch names, tags, rollback, staging:** see **`OPS_RUNBOOK.md`** §§3–6. Do not invent a second merge protocol.

---

## 11. Token / cost discipline

| Do | Don’t |
|----|--------|
| Short lane prompts with file lists | Paste full Zhe history into every child |
| Point children at SOP sections | Re-derive stack in every agent |
| One goal per spawn | “Improve the whole site” |
| Kill/cancel runaway children | Let polish spirals run in parallel |
| Reviewer once per integration | Five opinion agents rewriting CSS |

---

## 12. Success criteria for multi-agent process

- [ ] Brief filled before any implementer  
- [ ] Parallel lanes had **non-overlapping** write sets  
- [ ] No frozen system edited without §15  
- [ ] `check-launch` PASS at integration  
- [ ] Phone QA once after merge (not per lane unless lane owns gestures)  
- [ ] Scorecard once at craft freeze  
- [ ] Less rework than Zhe v1 on dock/Visit/SSOT-class mistakes  

---

## 13. First multi-agent dry run (optional on Zhe)

Before a brand-new site, practice on a **tiny** parallel task:

1. Explore: list dual sources of truth remaining  
2. Plan: one improvement with §15 options  
3. You pick  
4. One implementer  
5. Reviewer  

If that feels calm, scale to a full site.

---

## 14. Kickoff

```text
Follow dumpling/AGENTS.md cold start + operating defaults.
Read PROGRESS.md. Solo unless parallel lanes are obvious.
Session goal: [one]. Stop when: [criteria]. Update PROGRESS.md at end.
```

cwd must be `dumpling/`. Children get lane prompt + paths; agent files supply contracts.

*Also load PROJECT_BRIEF + BUILD_PLAYBOOK §15–16 for non-trivial work.*
