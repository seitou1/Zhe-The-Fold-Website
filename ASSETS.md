# Assets — naming, pipeline, rights, cache-bust

**Purpose:** Essential media SOP so photos don’t become a second dual-source mess.  
**Related:** `data.js` `ASSET_V` + `asset()` · `BUILD_PLAYBOOK` performance notes

---

## 1. Folder layout

```
assets/
  _orig/           # masters (local only; gitignored — not deployed)
  fonts/           # self-hosted woff2 + fonts.css
                   # CN: noto-serif-sc-*.woff2 is a *site glyph subset*
                   # If new Chinese characters are added in copy, re-subset from
                   # Noto Serif SC (Source Han Serif SC) and bump ASSET_V
  dish-*.webp      # full plate
  dish-*-thumb.webp
  story-*.webp
  hero-*.webp
  hero-loop.mp4    # optional
  storefront.webp
  paper-texture.webp
```

**Data paths** in `MENU_ITEMS` / `STORY_CHAPTERS` often point at `.jpg`; `asset()` rewrites to `.webp?v=ASSET_V`. Prefer keeping that convention.

---

## 2. Naming

| Role | Pattern | Example |
|------|---------|---------|
| Dish hero | `dish-{id}.webp` | `dish-pork.webp` |
| Dish thumb | `dish-{id}-thumb.webp` | `dish-pork-thumb.webp` |
| Story | `story-{slug}.webp` | `story-village.webp` |
| Hero still | `hero-{slug}.webp` | `hero-dumplings.webp` |
| Place | `storefront.webp` | |

IDs in `data.js` must match filenames.

---

## 3. Technical targets (right-sized)

| Asset | Guidance |
|-------|----------|
| Full panel photo | Long edge ~1600–2400px; WebP quality ~75–85 |
| Thumbs | ~200–400px edge |
| Hero LCP | Eager load; still works if video fails |
| Video | Short muted loop; poster = still; respect reduced-motion |
| Fonts | Subset woff2 only; no unused weights |

---

## 4. Cache-bust

1. Change image bytes.  
2. Bump `ASSET_V` in `data.js`.  
3. Grep/replace `?v=` in `index.html`, `styles.css`, `404.html` (or run gate — it warns on mismatch).  
4. Deploy.  

Hard-refresh phones after deploy.

---

## 5. Rights & honesty (non-legal summary)

| Source | Do |
|--------|-----|
| Client-owned photos | Written permission; keep masters |
| Stock | License covers web commercial use; keep receipt |
| AI-generated | Disclose to client if required; check host/provider terms |
| Other restaurants / people | No scraped faces/brands without rights |

**Record in this table per project:**

| File | Source | License / permission | Date |
|------|--------|----------------------|------|
| | | | |

Fiction/demo sites: still avoid presenting stock as “our real SF storefront” in marketing copy if that becomes misleading when live.

---

## 6. Crop / framing

- Story `position` in data controls object-position for chapter plates.  
- Visit storefront: keep signage readable above bottom caption.  
- Don’t rely on CSS scale hacks that jump between list/photo modes (Zhe locked wall scale for a reason).  

---

## 7. Checklist before ship

- [ ] Every `data.js` image path resolves to a real file  
- [ ] Thumbs exist for rail if used  
- [ ] `ASSET_V` consistent  
- [ ] Hero poster paints without video  
- [ ] Rights table filled for production assets  
