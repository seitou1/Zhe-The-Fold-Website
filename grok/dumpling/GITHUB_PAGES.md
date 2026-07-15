# Host for free on GitHub Pages

The Zhe site is static files — GitHub Pages is free for **public** repos (and free for private on many plans; public is the usual free portfolio path).

**Demo posture stays correct:** keep `INDEXABLE: false` and `demoMode: true` so Google doesn’t treat Sample Street as a real venue.

---

## 1. Two URL styles (pick one)

| Type | Repo name | Live URL |
|------|-----------|----------|
| **A. User/org site** | `yourname.github.io` | `https://yourname.github.io/` |
| **B. Project site** | any name, e.g. `zhe-the-fold` | `https://yourname.github.io/zhe-the-fold/` |

- **A:** Put **contents of `dumpling/`** at the **root** of the repo (not nested in a subfolder).  
- **B:** Same (site files at repo root), **or** use a `/docs` folder / Actions publish — simplest is still **site files at repo root**.

This project already uses **relative** asset paths in `index.html`. `404.html` uses relative CSS too (for project sites).

---

## 2. Create the repo and push

### If this folder is not a git repo yet

```bash
cd /Users/kenneth/Desktop/Code/grok/dumpling

git init
git add .
git commit -m "Demo: Zhe concept site for GitHub Pages"

# Create empty public repo on GitHub (website or gh), then:
git branch -M main
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
# or: https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

### Important

- Push the **contents** of `dumpling/` (where `index.html` lives), not necessarily the whole `Code/grok` monorepo — unless you configure Pages to serve a subfolder (harder).  
- Easiest: **new repo** whose root *is* the site.

---

## 3. Turn on Pages

1. GitHub → your repo → **Settings** → **Pages**  
2. **Build and deployment** → Source: **Deploy from a branch**  
3. Branch: **`main`** · folder: **`/ (root)`**  
4. Save  

Wait 1–2 minutes. Site URL appears on the same Pages settings screen.

Classic path: `https://YOUR_USER.github.io/YOUR_REPO/`

---

## 4. Optional: custom domain (not free)

Pages → Custom domain → add `www.yoursite.com` + DNS records GitHub shows.  
HTTPS is free via GitHub once DNS is correct.

---

## 5. After deploy — quick checks

Open the live URL and verify:

- [ ] Hero loads (image/video)  
- [ ] Story / Menu swipe both ways (phone)  
- [ ] Visit shows address + **Concept · Demo** footer  
- [ ] Reserve opens mail  
- [ ] View source / DevTools: robots still **noindex**  

Hard-refresh if CSS looks old (`?v=` is already on assets).

---

## 6. Demo vs production (don’t skip)

| Keep for demo | Only for real venue |
|---------------|---------------------|
| `demoMode: true` | `demoMode: false` |
| Sample NAP | Real NAP in `data.js` |
| `INDEXABLE: false` | `INDEXABLE: true` after real NAP |
| Gate may warn about placeholders | Gate clean |

Going live on Pages **does not** mean you should index fiction NAP.

---

## 7. Updating the site later

```bash
cd /path/to/site-repo
# edit files
git add .
git commit -m "Update demo"
git push
```

Pages rebuilds from `main` automatically.

---

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| 404 on CSS under `/repo/` | Use relative paths (already fixed for main site + 404) |
| Blank repo root | `index.html` must be at repo root for root Pages |
| Private repo | Free Pages for private depends on plan; public is simplest free |
| Build “failed” | For static branch deploy there is no build — check branch/folder |
| Old cache | Hard refresh; bump `ASSET_V` in `data.js` if needed |

---

## 9. Free alternatives (same site files)

| Host | Notes |
|------|--------|
| **Cloudflare Pages** | Free, git connect, good CDN |
| **Netlify** | Free tier; you already have `netlify.toml` |
| **Vercel** | Free tier; you have `vercel.json` |

GitHub Pages is fine for a portfolio demo. Netlify/Vercel are equally free for this static folder if you prefer their UI.

---

*After first successful deploy, paste the URL into `PROGRESS.md` preview field.*
