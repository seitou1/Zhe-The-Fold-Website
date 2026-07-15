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

### Conflict rule

Orchestrator resolves frozen systems (`BUILD_PLAYBOOK` §16). Lane redoes local work if needed.

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
