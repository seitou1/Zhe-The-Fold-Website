# Owner handoff — non-developer guide

**Who this is for:** Restaurant owner / marketer who should **not** need to be a developer.  
**Who edits code:** Dev only, except the safe list below.

---

## 1. What you own vs what dev owns

| You can change (with care) | Dev only |
|----------------------------|----------|
| Phone, address, hours, email in **`data.js`** | Layout, colors, animations |
| Menu dishes, prices, descriptions in **`data.js`** | Gesture / swipe code |
| Story chapter text in **`data.js`** | CSS / mobile shell |
| Instagram / WeChat / booking URL in **`data.js`** | New pages, new features |
| Social posts, GBP, IG bio | Deploy config, domain DNS |

**Golden rule:** If it is business info, it lives in **`data.js`**. If you can’t find it there, ask dev — don’t invent a second copy in the HTML.

---

## 2. Safe edit recipe (`data.js`)

1. Open `data.js` in a plain text editor (or ask dev for a PR).  
2. Change only values inside quotes for fields you understand.  
3. Keep punctuation: commas between items, quotes around text.  
4. Save → ask dev to deploy, **or** if you have host “deploy on git push,” commit with a clear message.  
5. After deploy: hard-refresh phone; check Visit + open badge + one dish.

### Common fields

| Goal | Where in `data.js` |
|------|---------------------|
| Phone | `SITE.telephone` (E.164 like `+14155551212`) + `telephoneDisplay` |
| Address | `SITE.address.*` + `mapsQuery` |
| Hours | `SITE.hours` (periods + closed weekdays + note) |
| Reserve link | `SITE.booking.url` + `provider` + `label` |
| Instagram | `SITE.social.instagram` |
| Menu item | `MENU_ITEMS` entry: `en`, `cn`, `desc`, `price`, `image` |
| Story text | `STORY_CHAPTERS` entry: `label`, `body`, `image` |
| SEO blurb | `SITE.description` |
| Allow Google | `INDEXABLE: true` only when address/phone are **real** |

### Do not

- Set `INDEXABLE: true` while still using Sample Street / 555  
- Paste a generic `https://resy.com` homepage — use **your** venue URL or leave `url: null` (email fallback)  
- Duplicate the address in Instagram captions that disagree with GBP  

---

## 3. After every content change

- [ ] Visit page: address + hours look right  
- [ ] Open/closed chip matches today’s hours  
- [ ] One menu dish price matches board  
- [ ] Reserve opens the right place (or correct email)  
- [ ] Call dials the right number on a phone  

---

## 4. When to call the developer

- Broken layout, blank page, swipe stuck  
- Need new section, new language, new photos  
- Want reviews / map embed / online ordering  
- Domain, email, HTTPS, “site down”  
- Anything involving `script.js` / `styles.css`  

---

## 5. Contacts & access

| System | Who has access | Notes |
|--------|----------------|-------|
| Domain registrar | | |
| Host (Netlify/Vercel) | | |
| Git repo | | |
| GBP | | |
| Resy / OpenTable | | |
| Staging password | | Rotate after launch |

---

## 6. Honest expectations

| Feature | Reality |
|---------|---------|
| Mailto Reserve | Opens the visitor’s email app — not a booking calendar |
| Hours chip | Based on `SITE.hours` + timezone; not a live POS feed |
| Photos | Need WebP export + path in data; not drag-drop in admin |
| Instant edit | Static site: change → deploy → live (minutes, not zero) |

If you need a full CMS, ask for a **project decision** (playbook §2.5) — it’s a stack change, not a quick toggle.
