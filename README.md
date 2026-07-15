# 褶 · Zhe — complete **demo product** + process kit

**What this is:** A portfolio-ready **concept restaurant website** that showcases how we plan, build, and hand off sites for businesses — plus the full operating system (brief → decisions → multi-agent → QA → ops).

**Product bars:** see **`PRODUCT.md`**  
- **Demo-complete** (current aim): full journey, concept framing, process docs, noindex  
- **Production-complete**: real NAP + booking + index (client engagement)

**Case study:** `CASE_STUDY.md`  
**Blank kit for the next client (any stack):** `../next project site/`

## Will the AI find this?

Open the session **in `dumpling/`** so `AGENTS.md` + `.grok/` load.

```text
Follow AGENTS.md cold start + operating defaults.
Read PROGRESS.md, PROJECT_BRIEF, BUILD_PLAYBOOK §15–16.
Session goal: [one outcome]. Update PROGRESS.md at end.
```

## Start here

| Order | Doc | When |
|-------|-----|------|
| 0 | **`PRODUCT.md`** | What “complete demo” means |
| 0b | **`PROGRESS.md`** | Where we are right now |
| 1 | **`PROJECT_BRIEF.md`** | Product facts (filled for Zhe) |
| — | **`CASE_STUDY.md`** | Portfolio one-pager |
| 2 | **`BUILD_PLAYBOOK.md`** | Craft, stack history, §15 decisions, §16 frozen |
| 3 | **`MULTI_AGENT.md`** + **`AGENTS.md`** + **`.grok/agents/`** | Parallel build (discretion) |
| 4 | **`QA_SCORECARD.md`** | Craft ship bar |
| 5 | **`OPS_RUNBOOK.md`** | Staging, git, rollback, monitoring |
| 6 | **`GO_LIVE.md`** | Real NAP + index cutover |
| 7 | **`OWNER_HANDOFF.md`** | Non-dev `data.js` edits |
| 8 | **`ASSETS.md`** / **`LEGAL_PRIVACY.md`** | Media + privacy triggers |

## Commands

```bash
cd dumpling
python3 -m http.server 8765
node scripts/check-launch.mjs
```

## Free hosting (GitHub Pages)

**Live:** https://seitou1.github.io/Zhe-The-Fold-Website/  
**Repo:** https://github.com/seitou1/Zhe-The-Fold-Website  

See **`GITHUB_PAGES.md`** for setup details. Keep `demoMode: true` and noindex for the concept demo.

### Update GitHub from local (habit)

After every real work session (or any change you’d hate to lose):

```bash
cd /Users/kenneth/Desktop/Code/Zhe-The-Fold-Website
git add .
git commit -m "Short description of what changed"
git push
```

Then hard-refresh the live site (~1–2 min after push).

## Non-negotiable rules

1. Research web before non-trivial options  
2. Options + fix class + blast radius (§15)  
3. No fragile patches when a proper fix exists  
4. Honesty: break risk / works-but-wrong / untested  
5. Ops content only in `data.js`  
6. Update **`PROGRESS.md`** every session  

## Status (honest)

| Area | Status |
|------|--------|
| **Demo product** | **COMPLETE** (2026-07-15) — `PRODUCT.md` §7 |
| Scorecard | `QA_SCORECARD_DEMO_2026-07-15.md` PASS |
| Craft journey | Hero → Origins → Menu → Visit |
| Concept framing | `SITE.demoMode` — “Concept · Demo” + footer |
| NAP / index | Sample + noindex **by design** |
| Reserve | mailto (demo-honest partial) |
| Process kit | Full |
| Production bar | Not started — `GO_LIVE.md` when client has real data |
| Physical phone | Spot-check once before sending URL to a prospect |

## New site?

Use **`next project site`** blank kit — do not assume this static stack.  
Or copy process docs + adapt; fill a new brief including stack choice.
