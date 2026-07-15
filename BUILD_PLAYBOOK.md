# 褶 · Zhe — Build SOP & project retrospective

**What this is:** Standard operating procedure (SOP) for how we built the dumpling house site—and how to build the *next* marketing site with the same discipline. Includes stack/framework choices, craft principles, architecture, UX systems, mistakes, and checklists.

**What this is not:** Full ops (see `OPS_RUNBOOK.md` + `GO_LIVE.md`) or a line-by-line API dump.  
**Kit index:** `README.md` lists every essential doc.

**How to use it**

| Moment | Read |
|--------|------|
| Progress / where we are | `PROGRESS.md` |
| This project brief | `PROJECT_BRIEF.md` |
| Craft / decisions / frozen | this file §3–7, §15–16 |
| AI session | `AGENTS.md` cold start + defaults |
| Multi-agent | `MULTI_AGENT.md` (solo by default) |
| QA | `QA_SCORECARD.md` + §14 |
| Ops / rollback | `OPS_RUNBOOK.md` |
| Live cutover | `GO_LIVE.md` |
| New brand / any stack | `../next project site/` |
| Doc index | `README.md` |
| Gate | `scripts/check-launch.mjs` |

---

## 1. What we actually built

### 1.1 Product

A **concept restaurant marketing site** for an imaginary SF dumpling house:

| Name | Role |
|------|------|
| **褶 · Zhe · The Fold** | Quiet, handmade, bilingual (EN-first; CN ceremonial) |
| Positioning | Wabi-sabi house: imperfect pleats, steam, not perfection / Yelp chrome |
| Audience | In-city diners who want mood + confidence to visit, not a menu PDF dump |

**Business status:** Fiction-safe placeholders (Sample Street, 555 numbers). Site is `noindex` until real NAP + `INDEXABLE`.

### 1.2 Experience shape (four full-viewport panels + footer)

| Panel | Job | Primary interaction |
|-------|-----|---------------------|
| **Hero** | Brand hit, mood, LCP | Still poster + optional muted loop video |
| **Origins (Story)** | Emotional proof — who folds, why | Horizontal chapter carousel (swipe / chevrons / pips) |
| **Menu** | Dish desire + scan | Photo spotlight + rail; optional list view; filters |
| **Visit** | “Can I go, and how?” | Place caption: where · when · Directions / Reserve / Call |
| **Footer** | Quiet close | Tagline + copyright |

**Navigation:** One top nav everywhere (logo, live open chip, Story / Menu / Visit / Reserve). Mobile dock + hamburger sheet were built, then **removed** — same chrome desktop and phone.

### 1.3 What “done” looked like at craft level

- Full-bleed photo panels with shared **veil language** (type readable, photo still alive)
- **Scroll-snap** full-height panels (desktop: document; mobile: fixed shell + `main#top` scrollport)
- **Adaptive type tone** (sample photo luminance under copy; Origins forced dark)
- Menu/Story **gesture parity** (swipe left = next, right = prev; vertical = page)
- Conversion chrome without fake map widgets: open status, Call, Directions, Reserve (Resy or mailto)
- SEO-ready shell: JSON-LD Restaurant + MenuItems, robots gate, sitemap/404/headers
- Launch gate: `node scripts/check-launch.mjs`

### 1.4 Approximate end sizes (order of magnitude)

| File | Role | ~Lines |
|------|------|--------|
| `data.js` | Content SSOT | ~230 |
| `index.html` | Structure + LCP shells | ~490 |
| `script.js` | Hydrate + UX behavior | ~2900 |
| `styles.css` | Design system + panels | ~3800 |

Assets: WebP (+ JPG masters), dish thumbs, local fonts, hero loop mp4, paper texture.

---

## 2. Stack, frameworks & tooling (SOP)

This section is deliberate: **we mostly chose not to use application frameworks.** That is a product decision, not a skill limitation. Document *why* so the next build starts from the same defaults—and only graduates when the work actually needs it.

### 2.1 Default stack (what Zhe ships on)

| Layer | Choice | Why |
|-------|--------|-----|
| **Runtime** | Static files in a folder | Zero server app, trivial deploy, works offline on LAN for phone QA |
| **Markup** | Hand-written `index.html` | Full control of LCP shells, semantics, progressive enhancement |
| **Style** | One `styles.css` (custom properties) | Design system lives in tokens; no utility-class noise for this craft level |
| **Behavior** | Vanilla ES module-less `script.js` (IIFE) | No build step, no bundler, no hydration mismatch; one request after `data.js` |
| **Content / “DB”** | `data.js` → `window.ZHE` | Single source of truth without CMS or API; git is the CMS |
| **Images** | WebP (+ JPG sources), thumbs, `ASSET_V` query | Perf without an image CDN pipeline |
| **Fonts** | Self-hosted woff2 subsets | No Google Fonts runtime dependency; fewer layout shifts |
| **Package manager** | **None** — no `package.json` | Nothing to audit, lock, or break on deploy |
| **Hosting** | Netlify *or* Vercel static (`netlify.toml` / `vercel.json` + `_headers`) | Headers, 404, clean URLs; either host is fine |
| **Local preview** | `python3 -m http.server 8765` | Instant; phone on same Wi‑Fi hits LAN IP |
| **Launch gate** | Node one-shot `scripts/check-launch.mjs` | Only Node usage; not a runtime dependency for visitors |
| **QA assist** | Playwright (agent/tooling), real device for touch | Automation for smoke; **iOS still needs a hand** |

**Visitor-facing dependency count: effectively zero** (no React, no jQuery, no carousel library, no analytics SDK required).

### 2.2 Frameworks & libraries we did *not* use — and why

| Not used | Why we skipped it for Zhe |
|----------|---------------------------|
| **React / Vue / Svelte** | No component tree, no multi-route app state, no team scaling problem. SPA cost (JS weight, hydration, routing) buys nothing for four snap panels. |
| **Next.js / Nuxt / Astro / Eleventy** | Valuable when you need routes, MD collections, or image pipelines at scale. Here one HTML document + client hydrate was enough; Astro *could* be a future upgrade path if pages multiply. |
| **TypeScript** | Small surface; speed of craft over type safety. Revisit if `script.js` grows multi-file or multi-dev. |
| **Tailwind / Bootstrap** | Custom wabi-sabi system (veils, tones, display italic) fights utility-first defaults; one CSS file kept the design language coherent. |
| **jQuery** | Native `querySelector` / events are enough. |
| **GSAP / Framer Motion** | CSS transitions + rAF sweeps were enough; motion is quiet by brand. |
| **Swiper / Embla / Splide** | Carousels are two panels with custom axis-lock + iOS touch rules; a library would fight scroll-snap and our ignore lists. **We own gestures.** |
| **Lenis / locomotive-scroll** | Native scroll-snap + mobile shell; smooth-scroll libs often break snap and iOS. |
| **Map embeds (Google Maps iframe)** | Heavy, ugly, fights full-bleed photo. Directions = maps URL intent. |
| **Reservation widgets in-page** | Reserve → Resy URL or mailto; don’t iframe a booking product into a quiet house. |
| **CMS (Sanity, Contentful, WP)** | One operator, git workflow, fiction → live via `data.js`. CMS when non-devs edit weekly or multi-location. |
| **Backend / DB** | No accounts, no cart, no availability. Hours are data, not live POS. |
| **npm analytics SDKs** | Optional later: Plausible/GA4 via snippet; events already `data-zhe-track` → dataLayer/plausible/gtag hooks. |

### 2.3 Platform APIs we *did* rely on (browser as framework)

These are the “frameworks” that mattered:

| API / feature | Role |
|---------------|------|
| **CSS scroll-snap** | Full-viewport panel paging |
| **CSS custom properties** | Tone tokens, veils, stage pads, shell height |
| **`position: fixed` + visualViewport** | Mobile shell (`--shell-h`) when URL bar resizes |
| **Touch Events (+ Pointer for mouse)** | Carousel axis lock / iOS-safe swipes |
| **`touch-action` / `overscroll-behavior`** | Hand horizontal to JS; keep vertical page |
| **IntersectionObserver** | Story autoplay only in view |
| **Canvas / image decode sampling** | Adaptive type tone under copy |
| **JSON-LD in DOM** | Restaurant + Menu schema from same data |
| **`history` / hash + programmatic scroll** | Section nav without a router |

**SOP:** Prefer **platform primitives** before adding a dependency. Add a library only when you’ve felt the pain twice.

### 2.4 Tooling around the site (not shipped to users)

| Tool | Role | SOP |
|------|------|-----|
| **Editor + AI agent** | Implementation velocity | Keep craft decisions in this doc, not only chat history |
| **Playwright / browser tools** | Desktop smoke, screenshots, synthetic touch | Never sole proof of swipe quality |
| **Real iPhone/Android on LAN** | Gesture + cache + safe-area truth | Required before calling carousels “done” |
| **Node (dev only)** | `check-launch.mjs` | Fine; don’t invent a full build unless needed |
| **Git** | Versioning + deploy source | Content changes to `data.js` are code reviews |

### 2.5 Decision tree — when the *next* build may graduate

Start from **Zhe defaults** (static HTML/CSS/JS + `data.js`). Move up only when a box is true:

```
Need multi-page IA, blog, many templates?
  └─ Yes → consider Astro (or Eleventy) still static-first
  └─ No  → stay single-page or few hand pages

Non-devs must edit menu/hours weekly without git?
  └─ Yes → headless CMS or simple admin → still prefer static export
  └─ No  → keep data.js / JSON in repo

Need auth, cart, realtime inventory, accounts?
  └─ Yes → real app framework + backend (out of this SOP’s sweet spot)
  └─ No  → stay static

Heavy image set, responsive art direction at scale?
  └─ Yes → image CDN or build-time pipeline (Astro assets, Cloudflare Images)
  └─ No  → WebP + ASSET_V is enough

Team >2 engineers on one frontend?
  └─ Yes → TypeScript + components start to pay off
  └─ No  → vanilla remains fastest path to craft
```

**Default for the next quiet brand / restaurant / portfolio site:** same stack as Zhe unless the tree forces a step up.

### 2.6 Explicit anti-defaults (don’t start here for this class of site)

- CRA / Vite+React “just because”  
- Next.js for a four-section brochure  
- Tailwind before a type/veil system exists  
- Swiper before you’ve defined swipe vs scroll ownership  
- WordPress for a single-location concept house  

You can always add complexity later. You rarely remove it cleanly.

### 2.7 SOP “hello world” for the next site

1. Folder: `index.html`, `styles.css`, `data.js`, `script.js`  
2. `data.js` holds `SITE` + content arrays day one  
3. Empty hydrate targets in HTML; LCP images only as needed  
4. No `package.json` until you need a build  
5. `check-launch`-style gate if NAP/index/booking matter  
6. Phone QA on LAN before polish passes  

---

## 3. Creative direction (why it looks this way)

### 3.1 Core metaphor

> **Photo is the dish. Type is the caption.**

Story and Menu already lived this. Visit only felt finished after we **stopped** treating it like a Yelp card (left rail of address | hours | three reviews | equal CTAs) and matched the same **head top · photo middle · spotlight bottom** grammar.

### 3.2 Brand constraints we kept returning to

1. **Quiet over loud** — hairline CTAs, italic display (Cormorant), light UI (Outfit), CN as mark not wall of Chinese UI  
2. **Bilingual ceremony, not bilingual density** — one CN title accent per panel; EN owns prose  
3. **Imperfection is brand** — “uneven pleats,” soft motion, no glassmorphism cards over food  
4. **Classy conversion** — open badge, Reserve, Directions; not review stars or floating chat  
5. **Mobile = desktop craft** — same updates, not a dumbed-down second product  

### 3.3 Type system (source of truth in CSS comments)

| Token | Face | Use |
|-------|------|-----|
| `--font-display` | Cormorant Garamond italic | Titles, leads, CTAs |
| `--font-cn` | Noto Serif SC | Ceremonial marks |
| `--font-ui` | Outfit | Body, meta, chrome |

### 3.4 Shared panel machinery

- **Stage padding** that clears top nav + safe areas  
- **Panel veils** (`--panel-veil*`) — radial open plate + edge hold for type, not a flat slab  
- **`data-tone="dark|light"`** — nav/type tokens flip when photo under copy is bright  
- **Grain / soft shadows** — atmosphere, not UI chrome  

---

## 4. Architecture decisions

### 4.1 Static by choice

**Why:** One restaurant site, no auth, no inventory, max deploy simplicity (Netlify/Vercel folder publish), easy LAN phone testing.

**Tradeoff:** No CMS. Content lives in git. Acceptable for a house of this scale; bad if non-devs edit daily without a pipeline.

### 4.2 Single source of truth (`data.js` → `window.ZHE`)

**Hydrated from data (ops / SEO critical):**

- `SITE` — NAP, hours, social, booking, description, email  
- `MENU_ITEMS` — dishes, prices, tags, images  
- `STORY_CHAPTERS` — labels, bodies, images, crop positions  
- `ASSET_V` + `asset()` — WebP rewrite + cache-bust  
- `INDEXABLE` + placeholder NAP guard  

**Left in HTML on purpose (brand poetry):**

- Hero eyebrow / title / tagline  
- Section leads (“Each dumpling is a small story”)  
- Menu note, footer tag  

**Why split:** Launch-critical fields must not fork across HTML + JS. Marketing lines change with design, not with phone numbers.

**Hydration map:**

```
data.js
  → renderMenuDom()     rail, list, walls, spotlight
  → renderStoryDom()    dots, SEO chapters, first wall/copy
  → renderVisitDom()    address, hours, access, tel/maps/reserve/social
  → injectRestaurantSchema()
  → applySiteMeta()     description → meta/OG/Twitter
  → applyIndexable()    robots + safety if fake NAP
```

**Shells:** HTML may keep **empty** nodes or LCP image `src`s; copy for menu/story/visit comes from data after load. Avoid dual Sample Street in HTML.

### 4.3 What we deleted (and why)

| Removed | Why it was junk |
|---------|-----------------|
| Guest review wall on Visit | TripAdvisor energy; denser than Story/Menu; photo lost |
| Three equal primary CTAs | Decision fatigue; Reserve already in nav |
| Mobile bottom dock | Duplicated nav; fought snap; “always different on phone” |
| Hamburger + full mobile sheet | Same — top nav works on phone when compact |
| `REVIEWS` in data | Data with no UI after Visit redesign |
| Dual `priceNumber` | Derived from `"$14"` for schema |
| Pointer-only carousel path on iOS | Right-swipe cancelled by browser; touch-first fixed it |

**Lesson:** Retired UI that is `display: none` forever still costs HTML/CSS/JS and confuses future you. Delete, don’t park.

### 4.4 Launch safety (fiction-aware)

- Placeholder NAP detection (`Sample`, `555`, `94100`)  
- `INDEXABLE` true **cannot** index if NAP still fake  
- Reserve: `booking.url` or **mailto**, never bare `https://resy.com`  
- Gate script checks cache-bust parity, dead chrome, dual Resy shells  

---

## 5. UX systems we fought for

### 5.1 Panel grammar (reuse this)

```
┌─────────────────────────────────────┐
│  HEAD: title (+ CN)  |  lead        │  ← identity
│  ─────────────────────────────────  │
│                                     │
│           FULL-BLEED PHOTO          │  ← desire / place
│                                     │
│  SPOTLIGHT (bottom-left caption)    │  ← one scannable job
│  quiet controls                     │
└─────────────────────────────────────┘
```

**Anti-pattern:** Left “info column” packing address + hours + quotes + CTAs + social mid-frame while the photo dies under type.

### 5.2 Visit — job story

**Job:** Answer *where, when, how* without competing with the storefront.

**Final content model:**

1. Head (Visit / 造访 + one line lead)  
2. Spotlight: Find us · Hours (compact lines)  
3. Actions: **Directions** + **Reserve** lead; **Call** quieter  
4. Social icons as whisper, not a dock  

**Hours format:** Day line + times line + closed note (avoids orphan “9:00” wraps).

### 5.3 Menu

- Photo mode: wall + spotlight + thumbnail rail + optional swipe  
- List mode: quiet reading list (forced dark chrome mid-toggle)  
- Filters: All / Classic / Seasonal / Plant from item categories  
- House marks + dietary tags from data  
- Rail: compact vs overflowing (native `pan-x` only when overflowing)  
- Scale lock on wall so photo ↔ list doesn’t jump crop  

### 5.4 Origins (Story)

- Dual-layer **horizontal sweep** (not crossfade) for chapter changes  
- Dir-aware: next parks from right; prev from left  
- Autoplay while section in view; pause on user step  
- Pips + chevrons shared visual language with Menu  
- SEO hidden full chapters for crawlers  

### 5.5 Gestures (hard-won)

**Intent:**

| Gesture | Result |
|---------|--------|
| Swipe left | Next |
| Swipe right | Prev |
| Vertical | Page / snap |
| Tap chrome | Chevrons, dots, rail — not accidental step |

**iOS failure mode we hit:** Pointer Events inside a vertical scroller → `pointercancel` on right-swipe (history / overscroll). Mid-threshold commit helped; **touch-first + document capture + early preventDefault on horizontal lock** fixed both directions.

**Rules to keep:**

- Touch owns phones; Pointer owns mouse only  
- Axis lock after small slop; mild diagonal still horizontal  
- Commit mid-gesture once horizontal threshold met  
- `touch-action: pan-y` on carousels; `overscroll-behavior-x: none` on shell  
- Don’t start right-swipes from the far left edge (system back)  

### 5.6 Mobile shell

Phones:

- `body` fixed; **`main#top`** is the scrollport  
- `--shell-h` tracks visual viewport (URL bar)  
- Panels = 100% of shell; snap y mandatory  
- Stages `overflow: hidden` — **no nested scroll fights**  

Desktop: document scroll + snap.

### 5.7 Nav past-hero

Hysteresis on hero bottom edge → `nav.is-past-hero` (tone / density), not mid-panel guessing. Open-status chip from `SITE.hours` + timezone.

---

## 6. Performance & assets

| Practice | Why |
|----------|-----|
| WebP + optional JPG path rewritten in `asset()` | Smaller paint, one path in data |
| Dish thumbs on rail | Cheap horizontal strip |
| Hero poster eager; video optional loop | LCP without waiting on video |
| Story first wall eager | Origins panel LCP when deep-linked |
| `ASSET_V` on CSS/JS/images | Cache-bust without renames |
| Local font subset woff2 | No layout thrash from Google Fonts CDN |

**Ops habit:** Bump `ASSET_V` and grepping HTML/CSS/`data.js` (or let `check-launch.mjs` yell).

---

## 7. Mistakes that taught the playbook

These are the expensive loops; treat them as rules.

### 7.1 “Mobile is different” without meaning it

We shipped desktop updates while mobile still had old dock/chrome. User experience: *“I don’t see the changes.”*  

**Rule:** One product. If mobile is supposed to match desktop, **hide or delete** the second chrome path, then verify on a real phone URL.

### 7.2 Fixing gestures three times

Axis lock → mid-commit → full touch rewrite. Each step fixed a real phone bug.  

**Rule:** Test swipe **both directions** on device early. Desktop Playwright ≠ iOS cancel behavior.

### 7.3 Visit as a form

Packing NAP + three quotes + three CTAs looked “complete” and felt **sloppy**.  

**Rule:** Count jobs per panel (one primary). Cut until the photo can breathe.

### 7.4 Dual sources of truth

Sample address in HTML + `data.js`; Resy homepage href while `booking.url` null.  

**Rule:** Ops fields have **one write location**. HTML shells empty or mailto that matches fallback. Gate script enforces the worst cases.

### 7.5 Dead UI left in the tree

Dock CSS/JS lived long after `display: none !important`.  

**Rule:** Delete retired features in the same PR that retires them.

### 7.6 Complexity as comfort (hero video, etc.)

We explored richer hero motion and pulled back to poster + simple loop.  

**Rule:** Prefer one durable moment over a fragile stack of effects.

---

## 8. Playbook for the next website

Use this as a checklist when starting or reviewing a marketing site.

### 8.1 Before code

1. **Name the jobs** of each full-screen section (one sentence each).  
2. **Photo-first or type-first?** If photo-first, design caption grammar early.  
3. **Conversion list** (max 3): e.g. Reserve, Directions, Call — and where each lives (nav vs panel).  
4. **Content SSOT plan** — what non-devs will change (NAP, hours, menu) vs brand copy.  
5. **Fiction vs live** — if demo NAP, bake `noindex` + guards from day one.

### 8.2 Information architecture

```
Hero     → identity
Story    → belief
Product  → desire (menu / work / rooms)
Visit    → logistics
Footer   → quiet exit
```

Don’t invent a fifth “About” that repeats Story.

### 8.3 Design system minimum

- 3 type roles (display / body / accent language)  
- Shared stage padding + veil tokens  
- Shared CTA language (hairline vs fill — pick one house style)  
- Dark/light over photo strategy  
- Motion: one ease, short durations; honor `prefers-reduced-motion`

### 8.4 Engineering defaults (static site)

See **§2** for full stack SOP. Quick defaults:

| Default | Notes |
|---------|--------|
| **No app framework** until decision tree forces it | HTML + CSS + JS + `data.js` first |
| **No npm** until you need a build | Node only for optional check scripts |
| `data.js` (or JSON) SSOT | Hydrate DOM; empty shells OK |
| Browser APIs before libraries | scroll-snap, touch, IO — not Swiper/Lenis by default |
| Mobile = same nav | Don’t build dock “just in case” |
| Touch-first carousels | Pointer for mouse only |
| Snap panels carefully | One scroll root; no nested pan-y fights |
| Schema from same data | Menu items + hours + NAP |
| Launch script | Placeholder NAP, robots, cache-bust |

### 8.5 Mobile QA ritual (non-negotiable)

1. Real phone on LAN, hard-refresh with `?v=`  
2. Vertical snap through all panels  
3. Horizontal swipe **both ways** on every carousel  
4. Call / Directions / Reserve once each  
5. Open badge matches hours data  
6. Compare screenshot to desktop for “same updates”

### 8.6 Content hygiene

- One string for SEO description (meta + schema)  
- Hours: one structure → badge + Visit + JSON-LD  
- Price: one display string; derive numeric for schema  
- Social: null hides; don’t ship empty icons  
- Booking: null → mailto; never a vendor homepage stub  

### 8.7 When something feels “sloppy”

Ask in order:

1. **Is the photo the hero of this panel?**  
2. **Is there more than one job?**  
3. **Is spacing a symptom of too much content?**  
4. **Does this panel match the head/spotlight grammar of the others?**  
5. **Is mobile running a second product?**  

### 8.8 What *not* to copy blindly

- Full-viewport snap for long editorial blogs (fatigue)  
- Autoplay story for accessibility-heavy clients without pause  
- Adaptive luminance sampling if brand is always dark type  
- Dual-layer image sweep if a simple fade is enough  

Steal the **discipline**, not every effect.

---

## 9. File map (current)

| Path | Responsibility |
|------|----------------|
| `data.js` | Content + launch switches + `asset()` |
| `index.html` | Panels, LCP shells, meta, empty hydrate targets |
| `script.js` | Hydration, snap nav, carousels, open status, tone, tracking hooks |
| `styles.css` | Tokens, panels, mobile shell, reduced motion |
| `scripts/check-launch.mjs` | Deploy gate |
| `GO_LIVE.md` | Operator checklist for real NAP/index |
| `BUILD_PLAYBOOK.md` | This SOP + retrospective (stack, craft, playbook) |
| `QA_SCORECARD.md` | Multi-role 1–5 scorecard + ship rules at freezes |
| `PROJECT_BRIEF.md` | Empty kickoff form — fill before code on each site |
| `MULTI_AGENT.md` | Divide-and-conquer lanes, ownership, spawn prompts |
| `AGENTS.md` | Orchestrator rules loaded for sessions in this tree |
| `.grok/agents/site-*.md` | Spawnable lane agent types |
| `.grok/rules/multi-agent.md` | Short multi-agent project rule |
| `OPS_RUNBOOK.md` | Staging, git, deploy, rollback, monitoring |
| `OWNER_HANDOFF.md` | Non-dev safe edits to `data.js` |
| `ASSETS.md` | Media naming, pipeline, rights |
| `LEGAL_PRIVACY.md` | Privacy/analytics checklist (not legal advice) |
| `README.md` | Kit index — start here |
| `PROGRESS.md` | Phase / session / blockers tracker |
| Decision protocol | `BUILD_PLAYBOOK.md` §15 — options + implications before code |
| Frozen systems | `BUILD_PLAYBOOK.md` §16 — do not reopen without memo |
| `assets/` | WebP/JPG/video/fonts; `_orig/` local masters |
| `netlify.toml` / `vercel.json` / `_headers` / `robots.txt` / `sitemap.xml` / `404.html` | Deploy & crawl |

---

## 10. Narrative arc of the project (condensed)

1. **Foundation** — Bilingual house, full-bleed panels, snap scroll, menu + story carousels  
2. **Atmosphere** — Veils, tone sampling, type hierarchy, hero video then simplify  
3. **Parity** — Force mobile to receive desktop craft; kill dock/hamburger  
4. **Conversion** — Hours chip, Reserve/mailto, Directions, schema, launch gate  
5. **Gesture war** — Axis lock, mid-commit, iOS touch rewrite, both swipe directions  
6. **Visit redesign** — Creative director pass: caption not card  
7. **SSOT cleanup** — Delete junk data/chrome; one write path for ops fields  

---

## 11. Success criteria (how we’d judge a future site)

**Craft**

- [ ] Every full-bleed section has one clear job  
- [ ] Photo or product is never a wallpaper behind a dense form  
- [ ] Mobile screenshot would not embarrass the desktop one  

**System**

- [ ] NAP / hours / menu / booking editable in one file  
- [ ] No second “mobile product” path  
- [ ] Launch cannot index fake NAP by accident  

**Feel**

- [ ] Quiet confidence over feature density  
- [ ] Conversion present without shouting  
- [ ] Motion supports the story; doesn’t star in it  

---

## 12. One-line summary

We built a **static, photo-led, bilingual restaurant site**—**no React/CMS/npm runtime**—with **one content brain (`data.js`)**, **one chrome language across viewports**, and **panel grammar that treats logistics as caption**—then deleted everything that fought that model (dock, review wall, dual NAP, pointer-only swipes).

**Carry forward:** start stack-simple (§2), job-per-panel, photo-as-dish, SSOT for ops data, real-device gesture QA, delete retired UI, graduate frameworks only when the decision tree says so, **freeze when §11 + §13.9 + `QA_SCORECARD.md` are green**.

---

## 13. Multi-role operating system (how to improve & run the playbook)

The first build burned time because **roles blurred**: craft, copy, engineering, and “make it better” all ran in one endless loop. An SOP that only documents *what Zhe became* still fails if it doesn’t document **who decides what, when to stop, and how to brief the next session**.

This section is the upgrade path for the playbook itself—and the contract for the next site.

### 13.1 What’s still weak in this playbook (honest gaps)

| Gap | Why it hurts | Fix direction |
|-----|--------------|---------------|
| No **project brief template** | Each chat re-derives brand + jobs | §13.2 one-pager before code |
| No **voice / copy system** | EN/CN quality is tribal knowledge | §13.3 |
| No **a11y / SEO / perf budgets** as gates | Easy to polish visuals and ship brittle a11y | §13.4–13.6 |
| No **definition of done / freeze** | Open-ended polish = token sink | §13.9 |
| No **AI session contract** | Model re-explores stack and Visit layout | §13.8 |
| Light on **measurement** | “Feels better” only | §13.7 |
| No **asset pipeline SOP** | Photos, WebP, thumbs, naming ad hoc | §13.5 |
| No **risk register** | iOS swipe, snap, dual NAP known risks | §13.10 |

### 13.2 Product / founder (before any pixels)

**Job:** Decide what success is, and what is *out of scope*.

**One-pager (fill before build):**

1. **Audience** — who, in one sentence  
2. **Promise** — what they should believe after 30 seconds  
3. **Jobs of the site** — max 5 (identity, belief, desire, logistics, exit)  
4. **Primary conversion** — one (e.g. Reserve) + two secondary  
5. **Constraints** — static? fiction NAP? bilingual? budget of polish passes  
6. **Out of scope** — e.g. no CMS, no dock, no review wall, no map iframe  
7. **Freeze date / freeze criteria** — link to §13.9  

**Founder anti-patterns:** “Make it world-class” with no freeze; adding features mid-polish; comparing to apps with different jobs (Uber Eats vs mood house).

### 13.3 Copywriter / content

**Job:** Voice, hierarchy, bilingual ceremony, ops strings that don’t fight layout.

**Voice (Zhe-like houses):**

| Do | Don’t |
|----|--------|
| Short, sensory, specific | Feature lists, “best in SF,” star ratings |
| EN owns prose; CN as mark | Full dual paragraphs everywhere |
| One idea per lead line | Leads that repeat the title |
| Hours/address scannable | Marketing fluff inside NAP blocks |

**Copy inventory (SSOT in `data.js` where ops; HTML where poetry):**

| String | Owner | Notes |
|--------|--------|------|
| Meta / schema description | `SITE.description` | One string |
| Menu dish EN/CN/desc/price | `MENU_ITEMS` | No HTML duplicates |
| Story chapters | `STORY_CHAPTERS` | |
| Hero / section leads | HTML (or future `COPY`) | Freeze early |
| Visit kickers (“Find us”) | HTML OK | Not NAP |
| CTA labels | booking.label + fixed Call/Directions | |

**Copywriter checklist**

- [ ] Each panel has a **title job** and a **lead job** (not two titles)  
- [ ] No quote wall unless product asks for social proof *and* photo still wins  
- [ ] CTAs: max one primary verb per zone  
- [ ] Placeholder NAP never appears in marketing sentences as if real  
- [ ] Read aloud on mobile width — no orphan wraps on hours  

### 13.4 Creative director / design

**Job:** Hierarchy, restraint, photo-as-dish, stop before decoration.

**Rubric (score 1–5; ship only if all ≥ 4):**

| Criterion | Question |
|-----------|----------|
| Job clarity | Can you name the panel’s job in five words? |
| Photo primacy | If type vanished, would the frame still sell? |
| Type calm | Are there ≤2 display sizes competing? |
| Chrome weight | Would removing a control improve silence? |
| Desktop/mobile parity | Same *decisions*, not necessarily same pixels |
| Motion | Does motion explain state change, or just flex? |

**CD anti-patterns:** Solving hierarchy with more type; “classy” = more gold lines; mobile redesign as a second brand.

**Art direction SOP (assets):**

- Master photos in `_orig/`; ship WebP (+ thumbs for strips)  
- Name by role: `dish-*`, `story-*`, `hero-*`, `storefront`  
- Crop positions for story live in data (`position`), not magic CSS per plate  
- One hero still that works if video fails  

### 13.5 Software engineer

**Job:** Boring reliability under craft constraints.

**Non-negotiables**

- [ ] Stack matches §2 unless decision tree documented  
- [ ] Ops fields only in `data.js`; shells empty or mailto-safe  
- [ ] One scroll root; no nested `overflow: auto` fights with snap  
- [ ] Touch-first carousels; both directions tested on device  
- [ ] `prefers-reduced-motion` respected  
- [ ] Delete retired UI in the same change that kills it  
- [ ] `ASSET_V` bumped with asset/CSS/JS ship  
- [ ] Launch gate green for intended posture (fiction vs live)  

**Perf budgets (targets, not religion)**

| Metric | Target (marketing SPA-less) |
|--------|-----------------------------|
| LCP (hero) | &lt; 2.5s on mid phone, Wi‑Fi |
| JS payload | Prefer &lt; ~50KB gzipped for brochure craft; Zhe is larger because of interaction—justify growth |
| Fonts | Subset woff2 only; no render-blocking unused faces |
| Third parties | Zero required at first paint |

**A11y minimum**

- [ ] Keyboard: nav links, filters, carousels (arrows where promised)  
- [ ] Focus visible on controls  
- [ ] `aria` on tabs/rails/open state  
- [ ] Don’t trap scroll in a sheet you don’t need  
- [ ] Toast/live regions only when needed  

### 13.6 SEO / local marketing

**Job:** Same NAP everywhere; don’t index fiction.

- [ ] `SITE` NAP = future GBP = footer/visit  
- [ ] Hours structure → badge + Visit + schema  
- [ ] `INDEXABLE` + placeholder guard  
- [ ] Meta description = `SITE.description`  
- [ ] Sitemap/robots/canonical consistent  
- [ ] No thin duplicate “menu page” unless real IA needs it  

### 13.7 Analytics / growth (light)

**Job:** Know if conversion chrome works—without turning the site into a dashboard.

**Events already patterned:** `click_call`, `click_directions`, `click_reserve`, `click_social`, section nav.

**SOP:** Ship `data-zhe-track` hooks first; wire Plausible/GA4 once live. In fiction mode, `ANALYTICS.debug` console is enough.

**Do not:** optimize for bounce rate on a snap storytelling site the same way as a blog.

### 13.8 AI / agent session contract (token discipline)

Brief every build session like this (copy-paste):

```text
SOP: dumpling/BUILD_PLAYBOOK.md (stack §2, grammar §5, freeze §13.9, decisions §15).
Stack: static HTML/CSS/data.js/script.js — no React, npm, Swiper, CMS, dock, hamburger.
Content: ops fields only in data.js; empty hydrate shells.
Product: [one sentence]. Panels: [list jobs].
Out of scope: [list].
This session goal: [one outcome]. Stop when: [freeze criteria].
Non-trivial work: research the web FIRST, then options + implications + recommendation BEFORE code (§15).
Do not re-litigate Visit-as-card, dual mobile chrome, or pointer-only swipes.
```

**Rules for the human**

1. One **session goal** (e.g. “Menu rail + filters,” not “improve the site”).  
2. Prefer **checklists green** over “vibes.”  
3. After a system works on phone, **freeze it**—new work is new session.  
4. Point at the playbook path; don’t re-paste the whole history.  
5. When presented options, answer with **A/B/C**, **go with recommendation**, or **defer** — not “just make it better.”

**Rules for the agent**

1. Read SOP sections relevant to the goal before inventing stack.  
2. No new dependency without §2.5 tree.  
3. No second mobile product path.  
4. Prefer delete over `display: none` forever.  
5. When stuck 2× on the same bug, write the failure into §7 / §13.10.  
6. **§15:** non-trivial decisions → **web research first**, then options table + implications + stop condition **before** files change; smallest option always listed.  
7. **§15.1a:** tag Fix class + Blast radius; never recommend a **fragile patch** when a surgical/proper fix exists; say what Shared/Global changes can break.  
8. Do not propose stack/UX/iOS/SEO solutions from memory alone when the web can be checked.  
9. **Honesty:** never lie about break risk or “works but wrong”; untested ≠ done.

### 13.9 Definition of done & freeze (stop the endless pass)

**Phase freezes** (next project):

| Phase | Done means | Unfreeze only if |
|-------|------------|------------------|
| **A. Structure** | 4 panels exist, snap works desktop+mobile, nav real | IA change |
| **B. Content SSOT** | Menu/story/visit hydrate from data; gate passes | Data model change |
| **C. Craft v1** | CD rubric all ≥ 4; type system set | Brand pivot |
| **D. Interaction** | Carousels both directions on real phone | New gesture requirement |
| **E. Conversion** | Call/Maps/Reserve/open chip correct from data | Booking provider change |
| **F. Ship posture** | `GO_LIVE` / gate matches fiction or live | Going live |

**Polish budget:** agree **N** craft passes (e.g. 2) after Phase C. Further “make it classier” requires a new written goal.

### 13.10 Known risk register (start here next time)

| Risk | Symptom | Mitigation |
|------|---------|------------|
| iOS right-swipe die | Only next works | Touch-first; mid-commit; don’t use pointer-only |
| Dual scroll roots | Snap fight, “jank” | One scrollport; stages overflow hidden |
| Dual NAP | Wrong address in HTML | Empty shells; data only |
| Mobile second product | “I don’t see changes” | Same nav; delete dock |
| Visit density | Sloppy, bunched | Caption grammar; one note max |
| Cache lies | Old JS on phone | `ASSET_V` + hard refresh |
| Fake index | Sample Street on Google | Placeholder guard + noindex |

### 13.11 Suggested playbook file split (if this doc grows)

| File | Owner role |
|------|------------|
| `BUILD_PLAYBOOK.md` | Whole team SOP (this file) |
| `GO_LIVE.md` | Ops / launch |
| Optional later: `COPY.md` | Voice & string inventory |
| Optional later: `DESIGN_TOKENS.md` | If CSS tokens need non-dev explanation |

Don’t split early—**only when two roles fight over the same doc**.

### 13.12 How *this* playbook should evolve

After each project, spend 20 minutes:

1. Add one **mistake** to §7 if you paid for it twice  
2. Update **risk register** §13.10  
3. Adjust **stack defaults** §2 only if the decision tree fired  
4. Never expand the playbook mid-panic polish—expand in the retro  

---

*SOP + retrospective for 褶 · Zhe. Update when stack defaults or product model change; keep `GO_LIVE.md` for day-of-launch ops only.*

## 14. QA, scoring & quality system (yes — but lean)

### 14.1 Should we have this?

**Yes.** Without it, the only feedback loop is “does it feel better?” — which is how the first build burned hours and tokens.

**No** to a heavyweight process (weekly design councils, 40-metric dashboards, AppSec theater on a static brochure).

**Three layers only:**

| Layer | What | When |
|-------|------|------|
| **1. Automated gate** | `scripts/check-launch.mjs` | Every milestone / deploy |
| **2. Human scorecard** | `QA_SCORECARD.md` (1–5 by dimension) | At freezes (§13.9), not every commit |
| **3. Phase freeze** | §13.9 A–F | Stops open-ended polish |

If layer 1 fails → don’t score craft.  
If layer 2 has any **required** dimension ≤ 2 → don’t ship.  
If layer 3 phase isn’t done → don’t start the next phase’s polish.

### 14.2 Dimensions (who owns the score)

| Code | Dimension | Primary owner | Auto? |
|------|-----------|---------------|-------|
| A | Product / IA | Founder / PM | No |
| B | Art direction | Creative director | No |
| C | Copy / voice | Copywriter | No |
| D | UX / interaction | Design + eng | Phone human |
| E | Engineering / etiquette | Engineer | Partial |
| F | Security / privacy | Engineer | Partial |
| G | SEO / local | SEO + eng | Partial |
| H | Accessibility | Eng + design | Partial later |
| I | Performance | Engineer | Lighthouse optional |
| J | Content SSOT | Engineer | Partial |

Full rubrics and ship rules: **`QA_SCORECARD.md`**.

### 14.3 Code etiquette (engineering contract)

Not style-nazi — **change hygiene**:

1. Diff matches the **session goal** (one outcome).  
2. Ops content only in `data.js`.  
3. No new dependency without §2.5 tree.  
4. Delete dead UI; don’t `display: none` forever.  
5. Comments = why, not play-by-play.  
6. No secrets in repo.  
7. Run launch gate when touching NAP/index/booking/assets.  
8. Prefer smallest fix that meets the freeze — not rewrite for taste mid-session.

### 14.4 Security (right-sized for static sites)

**In scope:** XSS via careless `innerHTML`, open redirects, `target=_blank` without `noopener`, leaked keys, sketchy third parties, indexing fiction, dependency surface if you add npm later.

**Out of scope until you have a backend:** auth, rate limits, penetration test theater, SOC2 checklists.

**Minimum:** escape hydrated strings; noopener on new tabs; no secrets; headers on host; analytics optional and deferred.

### 14.5 Art direction & SEO in the same system

- **Art** is scored (B), not automated — use the rubric so “classy” is comparable across sessions.  
- **SEO** is scored (G) + gate (robots/NAP) — same NAP as future GBP.  
- Never let SEO demand a dense Visit card that fails B.

### 14.6 What *not* to build yet

| Idea | Why wait |
|------|----------|
| Full CI Lighthouse on every push | Optional after second site; manual is fine once per freeze |
| Design-tool automated visual diff | Expensive; screenshots at freeze enough |
| Separate QA team workflow | Solo/small team: scorecard at freeze is enough |
| Security scanner SaaS | No npm runtime; revisit if you add a backend |

### 14.7 Agent prompt add-on

```text
Also: score against dumpling/QA_SCORECARD.md for dimensions touched this session.
Do not claim ship-ready unless check-launch PASS and required scores ≥ 4.
List top debts if any dimension is 3.
Follow §15: options + implications before non-trivial modifications.
```

---

## 15. Decision protocol (options before modifications)

**Problem this solves:** We sometimes get carried away — implement the first plausible fix, then polish, then rewrite — without checking whether the change still serves **project goals**. We also risk **patch fixes that “work” locally but break snap, gestures, other panels, or mobile**.

**Rule:** For any non-trivial decision, the agent **frames options and implications first**, and **labels each option by fix class + blast radius**. Implement only after you pick an option (or say “go with your recommendation”).

**Hard rule:** Do **not** recommend or silently ship a **fragile patch** (see §15.1a) when a contained proper fix exists. If the only quick path is a fragile patch, say so explicitly and prefer **defer** or a **proper fix** unless you accept the risk in writing.

**Research-first rule (overall):** Before proposing options or solutions, **check the internet and do thorough research**. Do **not** rely only on model memory. Look for:

- Real-world examples (sites, patterns, case studies)  
- Current platform docs (iOS Safari, scroll-snap, touch, schema, host headers)  
- Known pitfalls and post-mortems (gesture bugs, a11y, Core Web Vitals)  
- What peer brands / restaurants / craft sites actually ship  

Cite or summarize sources in the decision memo (§15.4). If research is blocked (offline), say so and mark confidence as low.

**Honesty rule (overall — non-negotiable):** Never mislead about quality, risk, or “done.”

| Situation | Required language |
|-----------|-------------------|
| Change **might break** other features | Say so **before** implementing. Name what (snap, swipe both ways, nav, SSOT, mobile shell, CTAs). Use blast radius Shared/Global. |
| Something **appears to work** but is wrong | Call it out: e.g. “works on desktop only,” “only left-swipe,” “hides the bug,” “fragile patch,” “fights shared system.” |
| Not verified | Say **untested** (phone / Safari / both directions / live NAP). Do not imply ship-ready. |
| Partial success | “Partial — remaining: …” not “fixed” / “all good.” |
| Regression introduced | Admit it immediately; don’t bury in polish notes. |
| Unknown | “I don’t know yet” + how you’ll check. |

**Forbidden:** claiming “should be fine,” “won’t affect anything,” or “fully working” without basis; soft-pedaling fragile patches; marking green on scorecard dimensions you didn’t exercise.

**Prefer:** over-communicate risk. The human chooses whether to accept it — they can’t if risk is hidden.

### 15.1a Fix class & blast radius (required on every option)

Every option in the memo must be tagged:

| Fix class | Meaning | Default stance |
|-----------|---------|----------------|
| **Surgical** | Touches the real cause; scope limited; existing systems stay coherent | Prefer |
| **Proper / structural** | Slightly larger change; fixes root; may touch shared helper once | Prefer when surgical isn’t enough |
| **Fragile patch** | Hides symptom; special-cases one panel/device; fights shared systems | **Avoid** — flag in bold |
| **Rewrite** | Replaces a whole subsystem | Only with clear stop condition + regression plan |

| Blast radius | Meaning |
|--------------|---------|
| **Local** | One component / few lines; other panels unaffected |
| **Shared** | Shared CSS tokens, `bindCarouselGestures`, scroll shell, nav, `data.js` shape |
| **Global** | Can break desktop+mobile, all carousels, snap, or LCP |

**Fragile patch red flags** (call these out by name if present):

- `!important` / one-off overrides to “win” over shared stage/veil/nav rules  
- Duplicating a second gesture or scroll path for “just this panel”  
- `setTimeout` / race hacks instead of correct lifecycle  
- Pointer-only or preventDefault games that fix one swipe and kill the other  
- Hardcoding content in HTML that `data.js` already owns  
- `display: none` / dead code left “in case”  
- Changing a shared primitive (shell, snap, tone, carousel binder) to fix one visual without listing regression checks  

**Regression checklist** (required when blast radius is Shared or Global):

- [ ] Desktop: all panels snap / scroll  
- [ ] Mobile shell: same  
- [ ] Story + Menu: swipe **both** directions (if carousels touched)  
- [ ] Nav + open chip + Reserve/Call/Directions  
- [ ] No dual SSOT introduced  

### 15.1 Project goals (Zhe-class — decision filter)

Rank options against these, in order:

1. **Job of the panel / page** — one clear job  
2. **Photo/product as dish; type as caption**  
3. **Quiet conversion** — Call / Directions / Reserve without chrome noise  
4. **One product desktop + mobile**  
5. **SSOT for ops data** (`data.js`)  
6. **Stack simplicity** (§2) unless §2.5 forces graduation  
7. **Ship / freeze** — smallest change that unblocks the current phase  

A “cool” option that fails 1–3 is wrong for this project even if it’s good engineering elsewhere.

### 15.2 When a full options memo is required

| Trigger | Examples |
|---------|----------|
| Architecture | New library, CMS, build step, second scroll root |
| UX model change | Dock, Visit layout rewrite, new carousel model |
| Scope expansion | Reviews wall, maps embed, blog, extra pages |
| Open “make it better” | Polish with no freeze criterion |
| Reversing a prior decision | Re-adding hamburger, pointer-only gestures |
| Broad change | Touches more than one of HTML/CSS/JS/data or a whole panel |

### 15.3 When it’s OK to act without a full memo

| OK | Examples |
|----|----------|
| Obvious single-fix bug | Typo, broken selector, data-driven `href` wrong |
| Explicit instruction | “Delete X”, “Implement option B” |
| Trivial alignment to existing SOP | Match an established pattern |
| Tiny directed tweak | “Make that gap 8px” |

Still mention a one-line tradeoff if the fix has a known downside (e.g. iOS).

### 15.4 Decision memo template

```markdown
## Decision: [short name]

**Goal this serves:** [panel job / phase / user ask]
**Constraint:** [SOP section, freeze phase, out of scope]

### Research (required before options)
- Sources checked: [URLs / docs / examples]
- What the wild does well: …
- What fails in practice: …
- Relevance to our goals: …

### Options

| Option | What | Fix class | Blast radius | Pros | Cons / what it can break | Cost | Fits goals? |
|--------|------|-----------|--------------|------|--------------------------|------|-------------|
| A | | Surgical / Proper / **Fragile patch** / Rewrite | Local / Shared / Global | | | L/M/H | Y/N/Partial |
| B | | | | | | | |
| C Do nothing / defer | | — | — | | | | |

**Fragile patches in the table must be labeled `Fragile patch` in the Fix class column — never buried in “cons” only.**

### Recommendation
**Pick:** [A/B/C] because [goals 1–7 + fix class + research].
**Rejected fragile path:** [if any — one line why we won’t ship it].

### Implications if we proceed
- Product/UX: …
- Eng/maintenance: …
- **What this can break:** … (panels, gestures, snap, SSOT, mobile)
- Regression checks: [list from §15.1a if Shared/Global]
- Explicitly not doing: …

### Stop condition
Done when [testable check]. Will not expand into [temptation].
```

### 15.5 Anti-patterns (carried-away + patch modes)

| Mode | Looks like | Counter |
|------|------------|---------|
| First idea ships | Code before options | Memo first |
| **Memory-only advice** | Options from vibes, no web/docs check | Research-first rule |
| Polish spiral | Third “classy” pass on same panel | Freeze + scorecard |
| Framework itch | Swiper/React mid-brochure | §2.5 |
| Second mobile product | Special phone chrome | One product |
| Silent scope | Reviews/maps/dock sneak in | Always include “do nothing” |
| Fix-by-rewrite | Full rewrite without a small option | Always include surgical option |
| **Heroic patch** | One-line hack that “fixes” swipe/Visit but fights shared shell | Label **Fragile patch**; prefer proper/shared fix |
| **Cross-fire fix** | Change global CSS/JS to fix one panel; other panels regress | Blast radius **Global/Shared** + regression list |
| **Symptom theater** | Hide bug with timeout/opacity/z-index | Root cause option required |
| **False green** | “Works” / “won’t break anything” without test or while wrong-by-design | Honesty rule — name residual risk |
| **Works-but-wrong** | Ship a demo-path that violates SSOT/grammar/gestures | Label as technical debt or refuse as fragile |

### 15.6 How you can answer

| You say | Agent does |
|---------|------------|
| **Go with recommendation** | Implement pick only; stop at stop condition |
| **Option B** | Implement B only |
| **Defer** | No code |
| **More options** | Expand memo; still no code |
| **Just fix the bug** | Smallest **surgical** fix; no craft expansion; still flag if only fragile patches exist |
| **No fragile patches** | Drop any Fragile-class options from recommendation |

### 15.7 Standing agent prompt

```text
Decision protocol (BUILD_PLAYBOOK §15):
Before options/solutions: research the web (docs, examples, post-mortems).
Do not rely only on model knowledge. Summarize sources in the memo.
Then present options + implications + recommendation before modifying files.
Tag each option: Fix class (Surgical / Proper / Fragile patch / Rewrite)
+ Blast radius (Local / Shared / Global). Never hide a fragile patch.
Prefer surgical/proper over patches that break snap, gestures, other panels,
or SSOT. List what can break. Do not expand scope.
Call out when a request fights project goals 1–7.
Honesty: if a change might break features, say so before coding.
If something works but the wrong way, say so — never false green.
Untested = say untested. Partial = say partial.
```

---

## 16. Frozen systems (do not reopen casually)

These were paid for in hours/tokens. **Do not change them** without a §15 decision memo (options + fix class + blast radius) and a clear regression plan.

| System | Where | Frozen because | Reopen only if |
|--------|--------|----------------|----------------|
| **Stack default** | §2 | No npm/React for brochure craft | Decision tree §2.5 fires |
| **Content SSOT** | `data.js` + `render*Dom` | Dual NAP/booking bugs | Multi-site CMS needed |
| **Mobile = desktop nav** | No dock/hamburger | Second product thrash | Proven need + memo |
| **Visit caption grammar** | head + bottom spotlight | Yelp-card density | Product asks for social proof model |
| **Carousel gestures** | `bindCarouselGestures` touch-first | iOS right-swipe death | Real device bug + memo |
| **Mobile scroll shell** | `main#top` + `--shell-h` | Dual scroll-root jank | New IA not full-bleed snap |
| **Panel veil / tone tokens** | CSS + optional sampling | Shared atmosphere | Brand pivot |
| **Reserve fallback** | mailto if `booking.url` null | Never bare resy.com | Real venue URL set |
| **Launch gate posture** | `INDEXABLE` + placeholder NAP | Accidental index of fiction | Going live with real NAP |

**Session rule:** If a request would touch a frozen system, the agent must say so up front and run §15 before code — not “quick patch” the binder or shell.

**After a freeze unlock:** update this table (date + why) so the next session inherits the decision.

---

