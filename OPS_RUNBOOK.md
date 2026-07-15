# Ops runbook — staging, git, deploy, rollback, monitoring

**Purpose:** Codify essential *operations* that craft SOPs skip.  
**Research basis:** Common pre-launch practice for marketing sites — staging + access control, `noindex` until ready, documented rollback before DNS cutover, short post-launch watch window.  
**Not:** A full DevOps platform. Right-sized for static Netlify/Vercel deploys.

**Related:** `GO_LIVE.md` (business cutover) · `MULTI_AGENT.md` (lanes) · `scripts/check-launch.mjs`

---

## 1. Environments

| Env | URL pattern | Index? | Who | Data posture |
|-----|-------------|--------|-----|----------------|
| **Local** | `http://127.0.0.1:8765` / LAN IP | N/A | Dev | Fiction or real |
| **Staging / preview** | `*.netlify.app` / Vercel preview / `staging.` subdomain | **`noindex`** always until cutover | Team + client | Prefer real NAP only when private |
| **Production** | Apex + `www` | `INDEXABLE` + real NAP only | Public | Live |

**Rules:**

1. Never set `INDEXABLE: true` with placeholder NAP (gate enforces).  
2. Staging must not be findable: host password / Basic Auth **or** strong secret URL + `noindex` + `robots.txt` Disallow (belt and suspenders).  
3. Production deploy only from a known git commit / tag.  

### Host password (staging)

| Host | Typical approach |
|------|------------------|
| Netlify | Site settings → Access control / password protection (or visitor password) |
| Vercel | Deployment Protection / password on preview |
| Cloudflare | Access policy on `staging.` hostname |

Record: who has the password, where it’s stored (1Password), rotate after launch.

---

## 2. Fiction → live switch (single checklist)

Do **in this order**:

1. Real NAP + hours + booking URL in **`data.js` only**  
2. `node scripts/check-launch.mjs` → PASS, **zero** placeholder warnings  
3. `INDEXABLE: true` + meta robots `index, follow` (gate + `applyIndexable`)  
4. `ANALYTICS.debug: false` if analytics on  
5. Deploy production from tagged commit  
6. Remove staging password or decommission staging if temporary  
7. Search Console + sitemap submit  
8. GBP = same NAP  

---

## 3. Git workflow (solo + multi-agent)

### Branch names

| Branch | Use |
|--------|-----|
| `main` | Production-ready only |
| `staging` (optional) | Always deployed to staging host |
| `feat/<lane>-<short>` | e.g. `feat/content-menu`, `feat/visual-panels` |
| `fix/<issue>` | Surgical fixes |

### Multi-agent / worktree

1. Orchestrator creates or assigns branches per lane.  
2. Parallel implementers: `isolation: "worktree"` **or** separate branches — not two writers on the same branch.  
3. **Merge order (default):**  
   `content (data.js)` → `structure (html)` → `visual (css)` → `behavior (js)` → `launch (gate/meta)`  
4. After each merge: `node scripts/check-launch.mjs` + smoke scroll.  
5. Gestures / mobile shell / shared binder: **only on main integration**, one agent.  
6. Tag releases: `v0.1.0-craft`, `v1.0.0-live`.  

### Commit messages

- Prefer: `feat(menu): hydrate rail from data.js`  
- Avoid: `stuff`, `fix`, `wip` on `main`  

### How often to push (locked habit)

| When | Action |
|------|--------|
| End of a real work session | `git add` → `commit` → **`push`** |
| After anything you’d hate to redo | Push soon (don’t batch days) |
| Tiny mid-flow typo | Can wait for next real commit |
| Before risky experiments | Commit first (or a branch) |

After push, GitHub Pages rebuilds in ~1–2 minutes. Hard-refresh the live URL.

**This project:** work in `/Users/kenneth/Desktop/Code/Zhe-The-Fold-Website` (git remote = origin).

### Conflict rule

Orchestrator resolves frozen systems (`BUILD_PLAYBOOK` §16). Lane redoes local work if needed.

---

## 3b. Fork vs branch vs new repo (when to split)

### Quick definitions

| Thing | What it is | Typical use |
|-------|------------|-------------|
| **Clone** | Your local copy of a repo | Daily work (you already do this) |
| **Branch** | Parallel line of history *inside the same repo* | Experiments, features, multi-agent lanes |
| **Fork** | *Your copy of someone else’s (or a published) repo under another account/org* on GitHub | Client ownership, open-source contribute, independent product line |
| **New empty repo** | Fresh history, optional copy of files | Clean client delivery with no demo baggage |

**Fork is a GitHub relationship** (upstream ↔ your fork). It is **not** required for normal edits to **your own** `seitou1/Zhe-The-Fold-Website` — use **branches + push to main**.

### Decision table — should we fork?

| Situation | Do this | Why |
|-----------|---------|-----|
| Day-to-day Zhe demo improvements | **Branch or commit on this repo** | You own it; fork adds noise |
| Risky experiment (new nav, redesign) | **`feat/...` branch** on this repo | Easy PR/compare; merge or drop |
| Multi-agent parallel files | **Branches or worktrees** on this repo | Same project, temporary split |
| Open-source: contribute to *another* project | **Fork *their* repo** | Standard GH contribute model |
| **Client wants the site under *their* GitHub** | **Fork *or* transfer *or* new repo** (see below) | Ownership + permissions |
| Client production vs your portfolio demo | **Keep demo repo; new repo or fork for client** | Don’t mix Sample Street demo with real NAP forever |
| Someone outside the team customizes without write access | **They fork; open PRs back** | Safe collaboration |
| Start a totally different product (not Zhe) | **New repo from blank kit** (`next project site`) | Not a fork of Zhe |

### Client handoff options (pick with the client)

| Option | When | Pros | Cons |
|--------|------|------|------|
| **A. Transfer repo** to client org | They own 100% of Zhe-derived site | Clean ownership | You lose admin unless added back |
| **B. Fork under client org** from your demo | They start from your code, separate history of issues | Clear “based on” link | Two remotes to manage if you keep syncing |
| **C. New repo + copy files** (no fork link) | Clean break; strip demo/docs they don’t need | Simplest mental model | No automatic “Sync fork” |
| **D. You keep hosting; client never has git** | Retainers / you deploy forever | Easy for them | You’re the bottleneck |

**Recommendation for showcase → real venue:**

1. **Keep** `seitou1/Zhe-The-Fold-Website` as the **portfolio demo** (`demoMode: true`, noindex).  
2. For a paying client: **C (new repo)** or **B (fork into their org)** with **their** NAP, `demoMode: false`, production `GO_LIVE`.  
3. Do **not** turn the public demo into the only production copy without a deliberate decision (you lose the clean pitch piece).

### When *not* to fork

- “Just to try a CSS tweak” → **branch**  
- “Backup” → **push to origin** (you already have remote backup)  
- “Multi-agent” → **worktrees/branches**, not forks  
- “New unrelated website” → **blank kit + new repo**, not fork of Zhe  

### How to fork (when you need it)

**On GitHub**

1. Open the source repo (e.g. this one).  
2. **Fork** (top right) → choose account/org (yours or client’s).  
3. Clone **the fork**:
   ```bash
   git clone https://github.com/CLIENT_OR_YOU/FORK_NAME.git
   cd FORK_NAME
   ```
4. Optional: keep a link to upstream for pulling demo improvements:
   ```bash
   git remote add upstream https://github.com/seitou1/Zhe-The-Fold-Website.git
   git fetch upstream
   # merge selectively — never blind-merge production NAP with demo
   ```
5. Enable **Pages** on the **fork** (Settings → Pages) if they need a live URL.  
6. Set client data in **their** `data.js`; `demoMode: false` when real.

**Honesty:** Merging upstream demo into a live client repo can reintroduce Sample Street or concept chrome — review every sync.

### How this fits multi-agent

| Parallel work | Prefer |
|---------------|--------|
| Same product, same owner | Branches / worktrees |
| Different owner (client vs portfolio) | Separate repo (fork or new) |
| Lane agents | Never each on a personal fork of the same app |

### Zhe defaults (this repo)

| Question | Answer |
|----------|--------|
| Daily work | **No fork** — push `main` (or short-lived `feat/*`) |
| Experiment | **Branch** |
| Client production from this demo | **New repo or client-org fork** + production bar |
| New non-Zhe site | **`next project site` kit** → new repo |

---

## 4. Deploy

```bash
cd <site-root>
node scripts/check-launch.mjs   # must PASS for intended posture
# Publish directory = site root (static)
```

| Check | Done |
|-------|------|
| HTTPS works | |
| Custom domain + `www` redirect decision documented | |
| 404 page returns 404 | |
| Headers from `_headers` / host config present | |
| `ASSET_V` matches shipped assets | |
| Call / Directions / Reserve tested **on production URL** | |

---

## 5. Rollback (document *before* cutover)

Research consensus: treat launch as a window, keep prior artifact ~72h, know DNS rollback before you flip.

### Before DNS / go-live — **fill before live (Zhe: still empty = not ready)**

| Item | Record here |
|------|-------------|
| Host (Netlify / Vercel / other) | |
| Production site URL | |
| Staging URL + password location | |
| Prior / last-good **deploy ID** | |
| Prior git **tag or SHA** | |
| Current DNS records (export/screenshot) | |
| DNS TTL lowered? (e.g. 300s) Y/N | |
| Who can click rollback | |
| Emergency contact | |
| Practiced rollback on staging once? Y/N | |

**Honest status:** Until this table is filled and a last-good deploy/tag exists, rollback is **procedure-only**, not guaranteed under stress.

### Rollback procedure (static)

1. In host UI: **Promote previous deploy** / redeploy last good tag.  
2. If DNS was the change: restore prior records; wait TTL.  
3. Confirm `noindex` if rolling back to fiction build.  
4. Notify stakeholders; open incident note.  
5. Do **not** “hotfix blind” on production without a branch.  

**Done when:** primary conversion works again (Reserve or phone).

---

## 6. Pre-launch public exposure

| Risk | Mitigation |
|------|------------|
| Google indexes Sample Street | `noindex` + placeholder guard + staging password |
| Client shares preview link | Password or expiring preview |
| Staging has `INDEXABLE: true` | Gate error; never |
| Old production still live | Plan cutover time; avoid two conflicting NAP sites |

---

## 7. Monitoring (post-launch, light)

Week 1 (check daily), then weekly:

| Check | How |
|-------|-----|
| Site up / HTTPS | Open URL; optional free uptime (UptimeRobot, Better Stack free tier) |
| CTAs | Call, Directions, Reserve once on phone |
| Open badge | Matches real hours |
| Search Console | Coverage errors, NAP spam |
| 404 spikes | Host analytics |
| Core Web Vitals | PSI mobile on live URL |

**Do not** require a full APM stack for a brochure site.

---

## 8. Conversion failure modes

| CTA | Can fail if | Mitigate |
|-----|-------------|----------|
| **Reserve** | `booking.url` null → mailto; user has no mail client | Prefer real Resy/OT URL; test on iPhone |
| **Call** | Wrong `tel:` or desktop-only test | Real number; test on device |
| **Directions** | Bad `mapsQuery` | Open Maps once from production |
| **Open chip** | Wrong timezone / hours shape | `SITE.hours` single source |

Honesty: mailto is **partial conversion**, not equal to Resy. Say so until URL is set.

---

## 9. Multi-agent token / cost budget

| Limit | Default | Why |
|-------|---------|-----|
| Parallel implementers | ≤ 3 | Merge chaos |
| Max spawn retries on same task | 2 | Then human + §15 |
| “Improve whole site” spawns | 0 | Forbidden |
| Reviewer | 1 per integration | Enough |
| Research plan agent | 1 at Phase 1 | Required |

If a child expands scope or reopens frozen systems: **kill**, don’t continue.

---

## 10. Secrets & access

| Secret | Store | Never |
|--------|-------|-------|
| Staging password | Password manager | Repo, chat logs long-term |
| Host API tokens | Host UI / CI secrets | `data.js`, client JS |
| Analytics IDs | Env or late snippet | If fiction public |

Static sites: almost no secrets in the repo. Keep it that way.

---

## 11. Incident note template

```markdown
## Incident
Date/time:
Symptom:
User impact:
Suspected change (commit/tag):
Rollback performed? Y/N — to:
Root cause:
Follow-up:
Honesty: what we claimed vs what was true
```

---

## 12. Ops scorecard (binary)

| Item | Y/N |
|------|-----|
| Staging protected or private | |
| Rollback path written before live DNS | |
| Production deploy tagged | |
| Gate PASS with real NAP if indexed | |
| CTAs tested on production phone | |
| GBP NAP matches `data.js` | |
| Monitoring owner assigned (even if “me, Mondays”) | |

All Y before calling launch “done.”
