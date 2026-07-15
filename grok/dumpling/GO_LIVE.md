# Go-live scorecard — 褶 · Zhe

Gate: `node scripts/check-launch.mjs` (exit 0).  

| Doc | Use |
|-----|-----|
| `PROJECT_BRIEF.md` | Kickoff |
| `BUILD_PLAYBOOK.md` | Craft + decisions |
| `QA_SCORECARD.md` | Craft ship bar |
| `OPS_RUNBOOK.md` | Staging, git, rollback, monitoring |
| `OWNER_HANDOFF.md` | Non-dev edits |
| `ASSETS.md` | Media rights + pipeline |
| `LEGAL_PRIVACY.md` | Privacy / analytics triggers |
| `MULTI_AGENT.md` | Parallel build (solo by default) |
| `PROGRESS.md` | Current phase / blockers |
| `AGENTS.md` | Session cold start |

---

## Current posture (Zhe)

| Area | Status |
|------|--------|
| Site craft / UX | Ready (craft) |
| NAP | Demo placeholders (`Sample` / `555`) |
| Indexing | `noindex` until real NAP (`INDEXABLE` + safety guard) |
| Reserve | mailto if `booking.url` null; set real Resy/OT URL before treating as booked |
| Hours | `SITE.hours` → badge + Visit + schema |
| Staging | Use host password + noindex if public URL exists (`OPS_RUNBOOK`) |

---

## Checklist

### A. Business data (`data.js` only)
- [ ] Real `telephone` + `telephoneDisplay`
- [ ] Real `address` + `mapsQuery` (+ optional `geo`)
- [ ] Confirm `SITE.hours` + timezone
- [ ] Monitored `email`
- [ ] Social URLs (IG; XHS when ready)
- [ ] `SITE.description` accurate for SEO

### B. Booking
```js
booking: {
  provider: "resy", // or opentable | tock
  url: "https://…/your-venue", // not the marketing homepage alone
  label: "Reserve",
}
```
- [ ] Venue URL set and tested on **phone**
- [ ] Honesty: until set, Reserve = **email**, not a calendar

### C. Index & SEO
- [ ] Gate PASS with **no** placeholder warnings
- [ ] `INDEXABLE: true` in `data.js`
- [ ] Meta robots `index, follow` (JS + static meta aligned)
- [ ] Deploy HTTPS + Search Console + sitemap
- [ ] Rich Results Test + PSI mobile on **live** URL
- [ ] Canonical / OG URLs point at production

### D. Local marketing (outside repo)
- [ ] Google Business Profile = **same NAP** as `data.js`
- [ ] IG bio → production URL
- [ ] No second public site with conflicting address

### E. Analytics (optional — see `LEGAL_PRIVACY.md`)
- [ ] Tool chosen; privacy policy if required
- [ ] Events: `click_call`, `click_directions`, `click_reserve`
- [ ] `ANALYTICS.debug: false` in production

### F. Deploy & cutover (see `OPS_RUNBOOK.md`)
```bash
cd dumpling && node scripts/check-launch.mjs
# Netlify/Vercel: publish = site root
```
- [ ] Staging protected while fiction/public-preview
- [ ] Production deploy from **git tag**
- [ ] Rollback path written **before** DNS flip
- [ ] Domain + HTTPS + 404
- [ ] Safari/phone: snap, nav, Call, Maps, Reserve
- [ ] DNS TTL plan if changing hosts

### G. Assets & legal-adjacent
- [ ] `ASSETS.md` rights table filled for production photos
- [ ] `LEGAL_PRIVACY.md` triggers reviewed
- [ ] Owner has `OWNER_HANDOFF.md`

### H. Post-launch (week 1)
- [ ] Daily CTA smoke + uptime glance (`OPS_RUNBOOK` §7)
- [ ] Search Console coverage clean enough to sleep
- [ ] Incident contact known

---

## File map (ops)

| Concern | File |
|---------|------|
| NAP, hours, booking, INDEXABLE | `data.js` |
| Safety, schema, hydrate, analytics hooks | `script.js` |
| Meta robots | `index.html` + `applyIndexable` |
| Headers / 404 | `netlify.toml`, `vercel.json`, `_headers` |
| Gate | `scripts/check-launch.mjs` |
| Staging / rollback / monitor | `OPS_RUNBOOK.md` |
