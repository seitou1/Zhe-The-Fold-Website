/* 褶 · Zhe — interactions (content from data.js → window.ZHE) */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const Z = window.ZHE;
  if (!Z || !Z.MENU_ITEMS || !Z.STORY_CHAPTERS) {
    console.error("ZHE data.js missing — load data.js before script.js");
    return;
  }
  const asset = (path, opts) => Z.asset(path, opts);
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const siteBase = () => (Z.SITE.url || "/").replace(/\/?$/, "/");
  const mapsUrl = () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      (Z.SITE.mapsQuery || "").replace(/\+/g, " ")
    )}`;

  /** Vendor-agnostic conversion tracking (dataLayer / plausible / gtag / debug) */
  const track = (name, props = {}) => {
    if (!name) return;
    const payload = { event: name, ...props, ts: Date.now() };
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (_) {
      /* ignore */
    }
    try {
      window.dispatchEvent(new CustomEvent("zhe:track", { detail: payload }));
    } catch (_) {
      /* ignore */
    }
    if (typeof window.plausible === "function") {
      try {
        window.plausible(name, { props });
      } catch (_) {
        /* ignore */
      }
    }
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", name, props);
      } catch (_) {
        /* ignore */
      }
    }
    const host = location.hostname;
    const local =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]";
    if (local || Z.ANALYTICS?.debug) {
      console.debug("[zhe]", name, props);
    }
  };
  window.ZHE.track = track;

  /* Dietary / house marks — short labels for spotlight + list */
  const TAG_LABELS = {
    plant: "Plant",
    shellfish: "Shellfish",
    pork: "Pork",
    beef: "Beef",
    poultry: "Poultry",
    seasonal: "Seasonal",
  };

  const marksHtml = (item) => {
    if (!item) return "";
    const bits = [];
    if (item.popular) {
      bits.push(`<span class="dish-mark dish-mark--house">House</span>`);
    }
    (item.tags || []).forEach((t) => {
      const label = TAG_LABELS[t] || t;
      bits.push(
        `<span class="dish-mark dish-mark--${esc(t)}">${esc(label)}</span>`
      );
    });
    return bits.join("");
  };

  const paintFeaturedMarks = (itemOrDataset) => {
    const el = $("#featuredMarks");
    if (!el) return;
    let popular = false;
    let tags = [];
    if (itemOrDataset && itemOrDataset.dataset) {
      popular = itemOrDataset.dataset.popular === "true";
      tags = (itemOrDataset.dataset.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (itemOrDataset) {
      popular = Boolean(itemOrDataset.popular);
      tags = itemOrDataset.tags || [];
    }
    const html = marksHtml({ popular, tags });
    el.innerHTML = html;
    el.hidden = !html;
  };

  /* ── Render menu + story + schema from single data source ── */
  const renderMenuDom = () => {
    const rail = $("#menuList");
    const list = $("#menuListView");
    if (!rail || !list) return;
    rail.innerHTML = Z.MENU_ITEMS.map((item, i) => {
      const active = i === 0 ? " is-active" : "";
      const sel = i === 0 ? "true" : "false";
      const thumb = asset(item.image, { thumb: true });
      const full = asset(item.image);
      const tags = (item.tags || []).join(",");
      const popular = item.popular ? "true" : "false";
      const pos = item.position || "center center";
      const posM = item.positionMobile || pos;
      /* Short rail name for SR; spotlight carries full name + price visually */
      const label = `${item.rail || item.en}${item.price ? ` · ${item.price}` : ""}`;
      return `<li role="option" class="menu-rail-item${active}" tabindex="0"
        data-id="${esc(item.id)}"
        data-category="${esc(item.category)}" data-image="${esc(full)}"
        data-position="${esc(pos)}"
        data-position-mobile="${esc(posM)}"
        data-cn="${esc(item.cn)}" data-en="${esc(item.en)}"
        data-desc="${esc(item.desc)}" data-price="${esc(item.price)}"
        data-cat-label="${esc(item.catLabel)}" data-tags="${esc(tags)}"
        data-popular="${popular}" aria-selected="${sel}"
        aria-label="${esc(label)}">
        <img src="${esc(thumb)}" alt="" width="120" height="120" loading="lazy" decoding="async" />
      </li>`;
    }).join("");
    list.innerHTML = Z.MENU_ITEMS.map((item, i) => {
      const src = asset(item.image);
      const active = i === 0 ? " is-active" : "";
      const sel = i === 0 ? "true" : "false";
      const tags = (item.tags || []).join(",");
      const popular = item.popular ? "true" : "false";
      const markBits = marksHtml(item);
      const pos = item.position || "center center";
      const posM = item.positionMobile || pos;
      return `<li class="menu-list-item${active}" role="option" tabindex="0"
        data-id="${esc(item.id)}"
        data-category="${esc(item.category)}" data-image="${esc(src)}"
        data-position="${esc(pos)}"
        data-position-mobile="${esc(posM)}"
        data-cn="${esc(item.cn)}" data-en="${esc(item.en)}"
        data-desc="${esc(item.desc)}" data-price="${esc(item.price)}"
        data-cat-label="${esc(item.catLabel)}" data-tags="${esc(tags)}"
        data-popular="${popular}" aria-selected="${sel}">
        <span class="list-en">${esc(item.en)}</span>
        <span class="list-cn" lang="zh-Hans">${esc(item.cn)}</span>
        <span class="list-price">${esc(item.price)}</span>
        <span class="list-desc">${esc(item.desc)}</span>
        ${markBits ? `<span class="list-marks">${markBits}</span>` : ""}
      </li>`;
    }).join("");
    // seed walls + spotlight from first dish
    const first = Z.MENU_ITEMS[0];
    if (first) {
      const src = asset(first.image);
      const a = $("#wallImgA");
      const b = $("#wallImgB");
      if (a) a.src = src;
      if (b) b.src = src;
      // Framing applied after menu runtime mounts (frameMenuWall)
      const set = (id, v) => {
        const el = $(id);
        if (el) el.textContent = v;
      };
      set("#featuredCat", first.catLabel);
      set("#featuredEn", first.en);
      set("#featuredCn", first.cn);
      set("#featuredDesc", first.desc);
      set("#featuredPrice", first.price);
      paintFeaturedMarks(first);
      // Stash seed focal for first selectDish / setWall
      window.__zheMenuSeed = {
        image: src,
        position: first.position || "center center",
        positionMobile:
          first.positionMobile || first.position || "center center",
      };
    }
  };

  const renderStoryDom = () => {
    const seo = $("#seoStoryChapters");
    const dots = $("#storyDots");
    if (seo) {
      seo.innerHTML = Z.STORY_CHAPTERS.map(
        (c) =>
          `<article><h3>${esc(c.label)}</h3><p>${esc(c.body)}</p></article>`
      ).join("");
    }
    if (dots) {
      dots.innerHTML = Z.STORY_CHAPTERS.map(
        (c, i) =>
          `<button type="button" class="story-dot${i === 0 ? " is-active" : ""}" role="tab" aria-selected="${i === 0}" data-story="${i}" aria-label="${esc(c.label)}"><span class="story-dot-label">${esc(c.short || c.label)}</span></button>`
      ).join("");
    }
    const first = Z.STORY_CHAPTERS[0];
    if (first) {
      const src = asset(first.image);
      const abs = new URL(src, location.href).href;
      const a = $("#storyWallA");
      const b = $("#storyWallB");
      // Only set src when it actually changes — reassignment can flash a blank/washed decode
      if (a) {
        if (a.src !== abs) a.src = src;
        a.style.objectPosition = first.position || "center center";
      }
      if (b && b.src !== abs) b.src = src;
      const lab = $("#storyLabel");
      const body = $("#storyBody");
      if (lab) lab.textContent = first.label;
      if (body) body.textContent = first.body;
    }
  };

  /** Detect demo NAP so we never index Sample Street / 555 by mistake */
  const isPlaceholderNap = (site = Z.SITE) => {
    if (!site) return true;
    const tel = String(site.telephone || "");
    const street = String(site.address?.streetAddress || "");
    const zip = String(site.address?.postalCode || "");
    const maps = String(site.mapsQuery || "");
    return (
      /555[-.]?0\d{2}/.test(tel) ||
      /Sample\s+Street/i.test(street) ||
      zip === "94100" ||
      /Sample/i.test(maps) ||
      /55501\d{2}/.test(tel.replace(/\D/g, ""))
    );
  };

  /** True only when operator asked to index AND NAP is real */
  const canIndex = () => Boolean(Z.INDEXABLE) && !isPlaceholderNap();

  /** Keep meta robots + data-indexable in sync (with placeholder safety) */
  const applyIndexable = () => {
    const allow = canIndex();
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      robots.setAttribute(
        "content",
        allow ? "index, follow" : "noindex, nofollow"
      );
    }
    document.documentElement.dataset.indexable = allow ? "true" : "false";
    document.documentElement.dataset.placeholderNap = isPlaceholderNap()
      ? "true"
      : "false";
    if (Z.INDEXABLE && isPlaceholderNap()) {
      console.warn(
        "[zhe] INDEXABLE is true but NAP looks like a placeholder — forcing noindex. Replace SITE telephone/address first."
      );
    }
  };

  /** Sync SEO description meta from SITE.description (one string) */
  const applySiteMeta = () => {
    const desc = Z.SITE?.description;
    if (!desc) return;
    const set = (sel, attr = "content") => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, desc);
    };
    set('meta[name="description"]');
    set('meta[property="og:description"]');
    set('meta[name="twitter:description"]');
  };

  /* ── Hours helpers (from Z.SITE.hours) ── */
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const parseHM = (hm) => {
    const [h, m] = String(hm || "0:0")
      .split(":")
      .map((n) => Number(n));
    return (h || 0) * 60 + (m || 0);
  };

  const formatTimeEn = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h >= 12 ? "pm" : "am";
    const h12 = h % 12 || 12;
    return m === 0
      ? `${h12}${period}`
      : `${h12}:${String(m).padStart(2, "0")}${period}`;
  };

  /** @param {boolean} [compact] shorter “11:30” for Visit line (AM/PM implied by hours) */
  const formatTimeDisplay = (hm, compact = false) => {
    const mins = parseHM(hm);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const clock =
      m === 0 ? `${h12}:00` : `${h12}:${String(m).padStart(2, "0")}`;
    return compact ? clock : `${clock} ${period}`;
  };

  const getHoursConfig = () => {
    const h = Z.SITE.hours || {};
    return {
      timeZone: h.timeZone || "America/Los_Angeles",
      closedWeekdays: h.closedWeekdays || ["Mon"],
      note: h.note || "",
      periods: Array.isArray(h.periods) ? h.periods : [],
    };
  };

  const schemaOpeningHours = () => {
    const { periods } = getHoursConfig();
    const dayMap = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    };
    return periods.map((p) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: (p.days || []).map((d) => dayMap[d] || d),
      opens: p.open,
      closes: p.close,
    }));
  };

  const hoursDisplayHtml = () => {
    const { periods, note, closedWeekdays } = getHoursConfig();
    if (!periods.length) {
      return note ? `<p class="visit-hours-note">${esc(note)}</p>` : "";
    }
    const days = periods[0].days || [];
    const dayLine =
      days.length === 7
        ? "Daily"
        : days.length
          ? `${days[0]}–${days[days.length - 1]}`
          : "";
    // Quiet caption lines — day, times, closed note (same type as address)
    const timeBits = periods.map(
      (p) => `${formatTimeDisplay(p.open, true)}–${formatTimeDisplay(p.close, true)}`
    );
    const times = timeBits.join(" · ");
    const closedNote =
      note ||
      (closedWeekdays?.length
        ? `Closed ${closedWeekdays.join(", ")}`
        : "");
    return `${dayLine ? `<p class="visit-hours-days">${esc(dayLine)}</p>` : ""}${
      times ? `<p class="visit-hours-times">${esc(times)}</p>` : ""
    }${closedNote ? `<p class="visit-hours-note">${esc(closedNote)}</p>` : ""}`;
  };

  const collectSameAs = () => {
    const site = Z.SITE;
    const social = site.social || {};
    const urls = [
      social.instagram,
      social.xiaohongshu,
      ...(Array.isArray(site.sameAs) ? site.sameAs : []),
    ].filter((u) => typeof u === "string" && /^https?:\/\//i.test(u));
    return [...new Set(urls)];
  };

  const injectRestaurantSchema = () => {
    const el = $("#restaurantJsonLd");
    if (!el) return;
    const site = Z.SITE;
    const base = siteBase();
    const payload = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: site.name,
      alternateName: site.alternateName,
      description:
        site.description ||
        "Handmade Chinese dumplings in San Francisco. Every fold holds the mark of a hand.",
      url: site.url,
      image: [
        `${base}assets/storefront.webp`,
        `${base}assets/hero-dumplings.webp`,
      ],
      telephone: site.telephone,
      email: site.email,
      servesCuisine: ["Chinese", "Dumplings"],
      priceRange: "$$",
      menu: `${base}#menu`,
      hasMap: mapsUrl(),
      acceptsReservations: true,
      sameAs: collectSameAs(),
      address: { "@type": "PostalAddress", ...site.address },
      areaServed: { "@type": "City", name: "San Francisco" },
      openingHoursSpecification: schemaOpeningHours(),
      hasMenu: {
        "@type": "Menu",
        name: "The Menu",
        hasMenuSection: {
          "@type": "MenuSection",
          name: "Handmade Dumplings",
          hasMenuItem: Z.MENU_ITEMS.map((item) => {
            const rel = asset(item.image).split("?")[0];
            return {
              "@type": "MenuItem",
              name: item.en,
              alternateName: item.cn,
              description: item.desc,
              image: `${base}${rel.replace(/^\//, "")}`,
              offers: {
                "@type": "Offer",
                // Derive schema price from display "$14" — no second price field
                price: String(item.price || "")
                  .replace(/[^0-9.]/g, "") || "0",
                priceCurrency: "USD",
              },
            };
          }),
        },
      },
    };
    if (
      site.geo &&
      typeof site.geo.latitude === "number" &&
      typeof site.geo.longitude === "number"
    ) {
      payload.geo = {
        "@type": "GeoCoordinates",
        latitude: site.geo.latitude,
        longitude: site.geo.longitude,
      };
    }
    const bookUrl = site.booking?.url;
    if (typeof bookUrl === "string" && /^https?:\/\//i.test(bookUrl.trim())) {
      payload.potentialAction = {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: bookUrl.trim(),
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "Table reservation",
        },
      };
    }
    el.textContent = JSON.stringify(payload);
  };

  const renderVisitDom = () => {
    const site = Z.SITE;
    const social = site.social || {};
    const booking = site.booking || {};
    const addr = $("#visitAddress");
    if (addr) {
      const a = site.address;
      // Two quiet lines — street (keep suite on same line), then city
      addr.innerHTML = `${esc(a.streetAddress)}<br />${esc(a.addressLocality)}, ${esc(a.addressRegion)} ${esc(a.postalCode)}`;
    }
    const hoursEl = $("#visitHours");
    if (hoursEl) hoursEl.innerHTML = hoursDisplayHtml();

    const accessEl = $("#visitAccess");
    if (accessEl) {
      if (site.access) {
        accessEl.textContent = site.access;
        accessEl.hidden = false;
      } else {
        accessEl.textContent = "";
        accessEl.hidden = true;
      }
    }

    $$("[data-zhe-tel]").forEach((el) => {
      el.setAttribute("href", `tel:${site.telephone}`);
      if (site.telephoneDisplay) {
        el.setAttribute("title", site.telephoneDisplay);
        el.setAttribute(
          "aria-label",
          `Call ${site.telephoneDisplay}`
        );
      }
    });
    $$("[data-zhe-maps]").forEach((el) => {
      el.setAttribute("href", mapsUrl());
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    const bookingUrl =
      typeof booking.url === "string" && /^https?:\/\//i.test(booking.url.trim())
        ? booking.url.trim()
        : null;
    const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
      site.reserveSubject || "Reservation · Zhe"
    )}`;
    const reserveLabel = booking.label || "Reserve";
    const provider = bookingUrl ? booking.provider || "other" : "mailto";

    $$("[data-zhe-reserve]").forEach((el) => {
      const labelEl = el.querySelector(".en") || el;
      if (labelEl !== el || el.querySelector(".en")) {
        const span = el.querySelector(".en");
        if (span) span.textContent = reserveLabel;
      } else if (!el.querySelector("*")) {
        el.textContent = reserveLabel;
      }
      el.setAttribute("data-zhe-track", "click_reserve");
      el.setAttribute("data-zhe-provider", provider);
      if (bookingUrl) {
        el.setAttribute("href", bookingUrl);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.removeAttribute("data-zhe-mail");
        const pretty =
          provider === "resy"
            ? "Resy"
            : provider === "opentable"
              ? "OpenTable"
              : provider === "tock"
                ? "Tock"
                : "booking site";
        el.setAttribute(
          "aria-label",
          `${reserveLabel} on ${pretty} (opens in a new tab)`
        );
      } else {
        el.setAttribute("href", mailHref);
        el.removeAttribute("target");
        el.removeAttribute("rel");
        el.setAttribute("data-zhe-mail", "");
        el.setAttribute("aria-label", `${reserveLabel} by email`);
      }
    });

    $$("[data-zhe-ig]").forEach((el) => {
      if (social.instagram) {
        el.setAttribute("href", social.instagram);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.hidden = false;
        el.removeAttribute("hidden");
      } else {
        el.hidden = true;
        el.setAttribute("hidden", "");
      }
    });
    $$("[data-zhe-xhs]").forEach((el) => {
      if (social.xiaohongshu) {
        el.setAttribute("href", social.xiaohongshu);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.hidden = false;
        el.removeAttribute("hidden");
      } else {
        el.hidden = true;
        el.setAttribute("hidden", "");
      }
    });
    const toast = $("#toast");
    if (toast) {
      toast.textContent = social.wechatId
        ? `Search WeChat for: ${social.wechatId}`
        : "";
    }
  };

  /** Click / keyboard conversion tracking via data-zhe-track */
  const bindConversionTracking = () => {
    document.addEventListener(
      "click",
      (e) => {
        const el = e.target.closest("[data-zhe-track]");
        if (!el) return;
        const name = el.getAttribute("data-zhe-track");
        if (!name) return;
        const props = {};
        const meta = el.getAttribute("data-zhe-track-meta");
        if (meta) props.source = meta;
        if (name === "click_social") {
          props.network =
            el.getAttribute("data-zhe-network") ||
            el.getAttribute("title") ||
            "social";
        }
        if (name === "click_reserve") {
          props.provider =
            el.getAttribute("data-zhe-provider") ||
            Z.SITE?.booking?.provider ||
            "mailto";
        }
        track(name, props);
      },
      true
    );
  };

  applyIndexable();
  applySiteMeta();
  renderMenuDom();
  renderStoryDom();
  renderVisitDom();
  injectRestaurantSchema();
  bindConversionTracking();
  // Expose readiness for ops / check-launch tooling
  window.ZHE.isPlaceholderNap = isPlaceholderNap;
  window.ZHE.canIndex = canIndex;

  /**
   * Shared carousel gestures (Story + Menu).
   *
   *   swipe left  → next · swipe right → prev
   *   vertical    → page scroll
   *   tap         → no step (chevrons / dots / rail own taps)
   *
   * Phones (esp. iOS): Pointer Events inside a vertical scroller often get
   * pointercancel on right-swipe (history / overscroll). Touch Events with
   * preventDefault after axis lock are more reliable. Mouse stays on Pointer.
   * Document-level move/end so a finger leaving the panel still completes.
   * Commit mid-gesture once horizontal travel clears the threshold.
   */
  const bindCarouselGestures = (
    root,
    { onPrev, onNext, isEnabled = () => true, ignore = "", shouldIgnore: customIgnore }
  ) => {
    if (!root || typeof onPrev !== "function" || typeof onNext !== "function") {
      return;
    }

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startT = 0;
    let tracking = false;
    let committed = false;
    let pointerId = null;
    /** @type {null | "h" | "v"} */
    let axis = null;
    let ending = false;
    /** @type {"touch" | "mouse" | null} */
    let mode = null;
    let docBound = false;

    const SLOP = 8;
    const SWIPE = 28;
    const FLICK_DX = 18;
    const FLICK_V = 0.35; // px/ms
    const H_RATIO = 1.0; // mild diagonal still counts as horizontal

    const shouldIgnore = (t) => {
      if (!t) return true;
      if (typeof customIgnore === "function") return customIgnore(t);
      if (typeof ignore === "string" && ignore && t.closest) {
        return Boolean(t.closest(ignore));
      }
      return false;
    };

    const unbindDoc = () => {
      if (!docBound) return;
      docBound = false;
      document.removeEventListener("touchmove", onDocTouchMove, true);
      document.removeEventListener("touchend", onDocTouchEnd, true);
      document.removeEventListener("touchcancel", onDocTouchEnd, true);
      document.removeEventListener("pointermove", onDocPointerMove, true);
      document.removeEventListener("pointerup", onDocPointerUp, true);
      document.removeEventListener("pointercancel", onDocPointerUp, true);
    };

    const reset = () => {
      unbindDoc();
      tracking = false;
      committed = false;
      pointerId = null;
      axis = null;
      ending = false;
      mode = null;
    };

    const fire = (dir) => {
      if (committed || !isEnabled()) return;
      committed = true;
      if (dir > 0) onNext();
      else onPrev();
    };

    const maybeLockAxis = () => {
      if (axis) return axis;
      const adx = Math.abs(lastX - startX);
      const ady = Math.abs(lastY - startY);
      if (adx < SLOP && ady < SLOP) return null;

      // Prefer horizontal when travel is at least as large as vertical —
      // right-swipe on phones often has a few px of vertical noise.
      if (adx >= ady && adx >= SLOP) {
        axis = "h";
      } else if (ady > adx) {
        axis = "v";
        tracking = false;
        unbindDoc();
      }
      return axis;
    };

    /** Mid-gesture commit (both directions) — beat iOS cancel. */
    const maybeCommit = (forceFlick = false) => {
      if (!tracking || committed || axis !== "h" || !isEnabled()) return false;
      const dx = lastX - startX;
      const adx = Math.abs(dx);
      if (adx >= SWIPE) {
        fire(dx < 0 ? 1 : -1);
        return true;
      }
      if (forceFlick && adx >= FLICK_DX) {
        const dt = Math.max(1, performance.now() - startT);
        if (adx / dt >= FLICK_V) {
          fire(dx < 0 ? 1 : -1);
          return true;
        }
      }
      return false;
    };

    const endGesture = (clientX, clientY) => {
      if (ending) return;
      ending = true;
      if (clientX != null) lastX = clientX;
      if (clientY != null) lastY = clientY;

      if (tracking && !committed && isEnabled()) {
        if (!axis) maybeLockAxis();
        if (axis === "h") {
          if (!maybeCommit(true)) {
            // Short drag that locked horizontal — still step if clearly sideways
            const dx = lastX - startX;
            if (Math.abs(dx) >= SWIPE * 0.75) fire(dx < 0 ? 1 : -1);
          }
        }
      }
      reset();
    };

    const onDown = (clientX, clientY, id, target, nextMode) => {
      if (!isEnabled()) return false;
      if (shouldIgnore(target)) return false;
      // Don't start a second gesture while one is live
      if (tracking && mode && mode !== nextMode) return false;
      tracking = true;
      committed = false;
      axis = null;
      ending = false;
      mode = nextMode;
      pointerId = id;
      startX = lastX = clientX;
      startY = lastY = clientY;
      startT = performance.now();
      return true;
    };

    const onMove = (clientX, clientY, cancelable, prevent) => {
      if (!tracking || committed) return;
      lastX = clientX;
      lastY = clientY;
      if (axis === "v") return;
      if (!axis) {
        const locked = maybeLockAxis();
        if (locked !== "h") return;
      }
      if (axis === "h") {
        // Claim the gesture so iOS doesn't steal right-swipe for back/overscroll
        if (cancelable && prevent) prevent();
        maybeCommit(false);
      }
    };

    /* ── Touch path (phones) — document listeners after start ── */
    const onDocTouchMove = (e) => {
      if (!tracking || mode !== "touch" || !e.changedTouches?.length) return;
      const t =
        [...e.changedTouches].find((x) => x.identifier === pointerId) ||
        e.touches?.[0] ||
        e.changedTouches[0];
      if (!t) return;
      onMove(t.clientX, t.clientY, e.cancelable, () => e.preventDefault());
    };

    const onDocTouchEnd = (e) => {
      if (!tracking || mode !== "touch") return;
      const t = e.changedTouches
        ? [...e.changedTouches].find((x) => x.identifier === pointerId)
        : null;
      if (!t && pointerId != null && e.type === "touchend") return;
      endGesture(t?.clientX, t?.clientY);
    };

    root.addEventListener(
      "touchstart",
      (e) => {
        if (!e.changedTouches?.length) return;
        // Single-finger only
        if (e.touches && e.touches.length > 1) return;
        const t = e.changedTouches[0];
        if (!onDown(t.clientX, t.clientY, t.identifier, e.target, "touch")) {
          return;
        }
        if (!docBound) {
          docBound = true;
          document.addEventListener("touchmove", onDocTouchMove, {
            capture: true,
            passive: false,
          });
          document.addEventListener("touchend", onDocTouchEnd, {
            capture: true,
            passive: true,
          });
          document.addEventListener("touchcancel", onDocTouchEnd, {
            capture: true,
            passive: true,
          });
        }
      },
      { passive: true, capture: true }
    );

    /* ── Mouse path (desktop) — pointer events, mouse only ── */
    const onDocPointerMove = (e) => {
      if (!tracking || mode !== "mouse") return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      onMove(e.clientX, e.clientY, e.cancelable, () => e.preventDefault());
    };

    const onDocPointerUp = (e) => {
      if (!tracking || mode !== "mouse") return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      endGesture(e.clientX, e.clientY);
    };

    const prefersTouchPath =
      "ontouchstart" in window ||
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);

    if (typeof window.PointerEvent === "function") {
      root.addEventListener(
        "pointerdown",
        (e) => {
          // On phones, touch* owns the gesture (iOS pointercancel on right-swipe).
          // Desktop mouse still uses Pointer Events.
          if (prefersTouchPath && e.pointerType !== "mouse") return;
          if (e.button !== 0) return;
          if (!onDown(e.clientX, e.clientY, e.pointerId, e.target, "mouse")) {
            return;
          }
          if (!docBound) {
            docBound = true;
            document.addEventListener("pointermove", onDocPointerMove, {
              capture: true,
              passive: false,
            });
            document.addEventListener("pointerup", onDocPointerUp, {
              capture: true,
              passive: true,
            });
            document.addEventListener("pointercancel", onDocPointerUp, {
              capture: true,
              passive: true,
            });
          }
        },
        { passive: true, capture: true }
      );
    }

    // Also listen on the section itself (capture) so preventDefault runs
    // before the vertical scroller claims the touch on iOS.
    root.addEventListener("touchmove", onDocTouchMove, {
      capture: true,
      passive: false,
    });
    root.addEventListener("touchend", onDocTouchEnd, {
      capture: true,
      passive: true,
    });
    root.addEventListener("touchcancel", onDocTouchEnd, {
      capture: true,
      passive: true,
    });
  };

  // Prevent browser restoring a mid-page scroll before our snap nav is ready
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  /* ── Year ── */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobileChrome = () =>
    Boolean(window.matchMedia && window.matchMedia("(max-width: 768px)").matches);

  /**
   * Mobile: scroll lives on main#top inside a fixed body shell.
   * Desktop: document scroll as usual.
   */
  const siteMain = $("#top");
  const getScrollRoot = () => {
    if (isMobileChrome() && siteMain) return siteMain;
    return document.scrollingElement || document.documentElement;
  };
  const isDocScroll = (root) =>
    root === document.scrollingElement ||
    root === document.documentElement ||
    root === document.body;

  const getScrollY = () => {
    const root = getScrollRoot();
    return isDocScroll(root) ? window.scrollY || root.scrollTop || 0 : root.scrollTop || 0;
  };
  const scrollRootTo = (y, behavior = "auto") => {
    const root = getScrollRoot();
    const top = Math.max(0, Math.round(y));
    if (isDocScroll(root)) {
      window.scrollTo({ top, behavior });
    } else if (typeof root.scrollTo === "function") {
      root.scrollTo({ top, behavior });
    } else {
      root.scrollTop = top;
    }
  };

  /**
   * Reliable section navigation under CSS scroll-snap.
   * Snap is toggled only via .js-snap-off on the active scroll root.
   */
  let navGen = 0;
  let navSettleTimer = 0;
  let navInFlight = false;
  let snapSafetyTimer = 0;

  const SNAP_OFF = "js-snap-off";
  /** Toggle snap on the active root: html (desktop) and/or main (mobile shell). */
  const snapTargets = () => {
    const nodes = [document.documentElement];
    if (isMobileChrome() && siteMain) nodes.push(siteMain);
    return nodes;
  };
  const snapOff = () => {
    snapTargets().forEach((n) => n.classList.add(SNAP_OFF));
    if (snapSafetyTimer) clearTimeout(snapSafetyTimer);
    // Never leave free-scroll more than a beat (interrupted nav / race)
    snapSafetyTimer = window.setTimeout(() => {
      snapOn();
      navInFlight = false;
    }, 900);
  };
  const snapOn = () => {
    if (snapSafetyTimer) {
      clearTimeout(snapSafetyTimer);
      snapSafetyTimer = 0;
    }
    document.documentElement.classList.remove(SNAP_OFF);
    siteMain?.classList.remove(SNAP_OFF);
    document.documentElement.style.scrollSnapType = "";
    document.documentElement.style.scrollBehavior = "";
  };

  const sectionScrollY = (el) => {
    const root = getScrollRoot();
    if (isDocScroll(root)) {
      return Math.max(
        0,
        Math.round(el.getBoundingClientRect().top + (window.pageYOffset || window.scrollY))
      );
    }
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return Math.max(0, Math.round(root.scrollTop + (elRect.top - rootRect.top)));
  };

  /** Nested scrollers make section landings feel "wrong" — always reset on enter */
  const resetNestedScroll = (root) => {
    if (!root) return;
    const nodes = root.querySelectorAll(
      ".stage, .visit-spotlight, .menu-list-view, .menu-rail"
    );
    nodes.forEach((el) => {
      if (el.scrollTop) el.scrollTop = 0;
      if (el.scrollLeft) el.scrollLeft = 0;
    });
    if (root.scrollTop) root.scrollTop = 0;
  };

  const scrollToSection = (target, { smooth = true, updateHash = true } = {}) => {
    if (!target) return;
    const useSmooth = smooth && !reducedMotion && !isMobileChrome();
    const gen = ++navGen;
    navInFlight = true;

    if (navSettleTimer) {
      clearTimeout(navSettleTimer);
      navSettleTimer = 0;
    }

    snapOff();

    // Cancel any in-flight smooth scroll by pinning to current Y first
    scrollRootTo(getScrollY(), "auto");

    // Start from a clean content position inside the target panel
    resetNestedScroll(target);

    const top = sectionScrollY(target);
    scrollRootTo(top, useSmooth ? "smooth" : "auto");

    const settle = () => {
      if (gen !== navGen) return;
      resetNestedScroll(target);
      const y = sectionScrollY(target);
      scrollRootTo(y, "auto");
      requestAnimationFrame(() => {
        if (gen !== navGen) return;
        scrollRootTo(sectionScrollY(target), "auto");
        requestAnimationFrame(() => {
          if (gen !== navGen) return;
          snapOn();
          const drift = Math.abs(sectionScrollY(target) - getScrollY());
          if (drift > 2) {
            scrollRootTo(sectionScrollY(target), "auto");
          }
          if (gen === navGen) navInFlight = false;
        });
      });
    };

    if (!useSmooth) {
      settle();
    } else {
      let lastY = getScrollY();
      let stableFrames = 0;
      const start = performance.now();
      const tick = () => {
        if (gen !== navGen) return;
        const y = getScrollY();
        if (Math.abs(y - lastY) < 0.5) stableFrames += 1;
        else stableFrames = 0;
        lastY = y;
        if (stableFrames >= 4 || performance.now() - start > 700) settle();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      navSettleTimer = window.setTimeout(settle, 750);
    }

    if (updateHash && target.id) {
      const next = `#${target.id}`;
      if (target.id === "hero" || target.id === "top") {
        if (location.hash) {
          history.replaceState(null, "", location.pathname + location.search);
        }
      } else if (location.hash !== next) {
        history.replaceState(null, "", next);
      }
    }
  };

  // User starts scrolling while snap is off → restore immediately
  const abortProgNavIfNeeded = () => {
    const snapIsOff =
      document.documentElement.classList.contains(SNAP_OFF) ||
      siteMain?.classList.contains(SNAP_OFF);
    if (!navInFlight && !snapIsOff) return;
    navGen += 1;
    navInFlight = false;
    if (navSettleTimer) {
      clearTimeout(navSettleTimer);
      navSettleTimer = 0;
    }
    snapOn();
  };
  window.addEventListener("touchstart", abortProgNavIfNeeded, {
    passive: true,
    capture: true,
  });
  window.addEventListener("wheel", abortProgNavIfNeeded, {
    passive: true,
    capture: true,
  });
  // Desktop trackpad / mouse free-scroll mid-nav
  window.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button === 0 && navInFlight) {
      // Don’t abort pure nav link clicks — only when interacting with the page body
      const t = e.target;
      if (t && t.closest && t.closest("a, button, .nav")) {
        return;
      }
      abortProgNavIfNeeded();
    }
  }, { passive: true, capture: true });

  /* ── Scroll progress (top hairline — desktop + mobile) ── */
  const progressTrack = $("#scrollProgress");
  const progressBar =
    $("#scrollProgressBar") || progressTrack?.querySelector?.(".scroll-progress-bar");
  let progressShown = -1;

  const updateProgress = () => {
    const el = progressBar || progressTrack;
    if (!el) return;
    const root = getScrollRoot();
    const y = getScrollY();
    const vh = isDocScroll(root)
      ? (window.visualViewport && window.visualViewport.height) ||
        window.innerHeight ||
        1
      : root.clientHeight || 1;
    const max = Math.max((root.scrollHeight || 0) - vh, 1);
    const t = Math.min(1, Math.max(0, y / max));
    if (Math.abs(t - progressShown) < 0.0008) return;
    progressShown = t;
    el.style.transform = `scale3d(${t}, 1, 1)`;
  };

  /* ── Nav: full links always; past-hero style after leaving hero ── */
  const nav = $("#nav");
  const navLinksEl = $("#navLinks");
  const heroEl = $("#hero");
  const navLinkAnchors = $$(".nav-links a");

  /**
   * Active snap panel — mid-line containment, else nearest center.
   */
  const getActivePanel = () => {
    const panels = $$(".panel");
    if (!panels.length) return null;
    const mid =
      ((window.visualViewport && window.visualViewport.height) ||
        window.innerHeight ||
        0) * 0.45;
    let best = panels[0];
    let bestDist = Infinity;
    for (const p of panels) {
      const r = p.getBoundingClientRect();
      if (r.height < 8) continue;
      if (r.top <= mid && r.bottom > mid) return p;
      const c = (r.top + r.bottom) / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    return best;
  };

  /**
   * Mobile shell height — prefer the *larger* of visual viewport and
   * layout/inner height so photo panels stay edge-to-edge under iOS
   * chrome (status bar / home indicator / collapsing URL bar).
   * Short vv-only sizing left amber “banners” above/below the media.
   */
  let lastShellH = 0;
  let scrollActive = false;
  let scrollSettleTimer = 0;

  const syncMobileShell = () => {
    if (!isMobileChrome()) {
      if (lastShellH !== 0) {
        document.documentElement.style.removeProperty("--shell-h");
        lastShellH = 0;
      }
      return;
    }
    const vv = window.visualViewport;
    const vvH = (vv && vv.height) || 0;
    const layoutH =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      0;
    /* Use the larger measure so we never undersize into letterbox bands */
    const h = Math.round(Math.max(vvH, layoutH));
    if (h < 80) return;
    if (Math.abs(h - lastShellH) < 1) return;
    lastShellH = h;
    document.documentElement.style.setProperty("--shell-h", `${h}px`);
  };

  const onScrollSettled = () => {
    scrollActive = false;
    updateNav();
  };

  const noteScrollActivity = () => {
    scrollActive = true;
    if (scrollSettleTimer) clearTimeout(scrollSettleTimer);
    scrollSettleTimer = window.setTimeout(onScrollSettled, 140);
  };

  let pastHeroLatch = false;
  const updateNav = () => {
    if (!nav) return;

    // Hysteresis on hero bottom — avoids thrash during snap settle
    const root = getScrollRoot();
    const vh = isDocScroll(root)
      ? lastShellH ||
        (window.visualViewport && window.visualViewport.height) ||
        window.innerHeight ||
        1
      : root.clientHeight || 1;
    if (heroEl) {
      const hb = heroEl.getBoundingClientRect().bottom;
      if (!pastHeroLatch && hb < vh * 0.38) pastHeroLatch = true;
      else if (pastHeroLatch && hb > vh * 0.78) pastHeroLatch = false;
    } else {
      pastHeroLatch = getScrollY() > vh * 0.5;
    }

    nav.classList.toggle("is-past-hero", pastHeroLatch);

    if (navLinksEl) {
      navLinksEl.setAttribute("aria-hidden", "false");
      if ("inert" in navLinksEl) navLinksEl.inert = false;
    }
  };

  let scrollTicking = false;
  const onScroll = () => {
    noteScrollActivity();
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateNav();
      scrollTicking = false;
    });
  };

  // Desktop: window scroll. Mobile shell: main#top scroll.
  window.addEventListener("scroll", onScroll, { passive: true });
  siteMain?.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener(
    "resize",
    () => {
      syncMobileShell();
      updateProgress();
      updateNav();
    },
    { passive: true }
  );

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncMobileShell, {
      passive: true,
    });
    window.visualViewport.addEventListener("scroll", syncMobileShell, {
      passive: true,
    });
  }
  window.addEventListener("orientationchange", () => {
    window.setTimeout(() => {
      syncMobileShell();
      updateNav();
      updateProgress();
    }, 180);
  });

  // Initial paint — size the mobile shell once
  syncMobileShell();
  updateProgress();
  updateNav();

  /* ── Kitchen status from SITE.hours (nav — editorial, not a LED pill) ── */
  const getSFParts = (date = new Date()) => {
    const { timeZone } = getHoursConfig();
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    });
    const parts = Object.fromEntries(
      fmt.formatToParts(date).map((p) => [p.type, p.value])
    );
    return {
      weekday: parts.weekday,
      minutes: Number(parts.hour) * 60 + Number(parts.minute),
    };
  };

  /** Active period if open now, else null */
  const getOpenPeriod = (weekday, minutes) => {
    const { closedWeekdays, periods } = getHoursConfig();
    if (closedWeekdays.includes(weekday)) return null;
    for (const p of periods) {
      if (!(p.days || []).includes(weekday)) continue;
      const start = parseHM(p.open);
      const end = parseHM(p.close);
      if (minutes >= start && minutes < end) {
        return { start, end };
      }
    }
    return null;
  };

  /**
   * Next service after a closed moment.
   * One useful line only — no “Resting” label (felt busy in the nav).
   */
  const getNextService = ({ weekday, minutes }) => {
    const { closedWeekdays, periods, note } = getHoursConfig();
    if (!periods.length) {
      return {
        state: note ? String(note) : "see Visit",
        meta: "",
      };
    }
    const dayIdx = WEEKDAYS.indexOf(weekday);
    const safeIdx = dayIdx >= 0 ? dayIdx : 0;

    for (let offset = 0; offset < 8; offset++) {
      const idx = (safeIdx + offset) % 7;
      const day = WEEKDAYS[idx];
      if (closedWeekdays.includes(day)) continue;
      const dayPeriods = periods
        .filter((p) => (p.days || []).includes(day))
        .map((p) => ({ start: parseHM(p.open), end: parseHM(p.close) }))
        .sort((a, b) => a.start - b.start);
      if (!dayPeriods.length) continue;

      if (offset === 0) {
        for (const per of dayPeriods) {
          if (minutes < per.start) {
            // Later today — just the open time
            return {
              state: `opens ${formatTimeEn(per.start)}`,
              meta: "",
            };
          }
        }
        continue;
      }

      // Another day — day + open time
      return {
        state: `opens ${day} ${formatTimeEn(dayPeriods[0].start)}`,
        meta: "",
      };
    }
    return {
      state: note ? String(note) : "see Visit",
      meta: "",
    };
  };

  const updateVisitLive = () => {
    const parts = getSFParts();
    const period = getOpenPeriod(parts.weekday, parts.minutes);
    const open = Boolean(period);
    // Open: state + until. Closed: single "opens …" line (no Resting).
    const status = open
      ? {
          state: "Open",
          meta: `until ${formatTimeEn(period.end)}`,
        }
      : getNextService(parts);
    const title = open
      ? `Kitchen open until ${formatTimeEn(period.end)} (SF time)`
      : `Kitchen ${status.state} (SF time)`;

    $$("[data-zhe-open-chip]").forEach((chip) => {
      chip.classList.toggle("is-open", open);
      chip.classList.toggle("is-closed", !open);
      chip.hidden = false;
      chip.removeAttribute("hidden");
      chip.setAttribute("title", title);
      chip.setAttribute("aria-label", title);
    });

    $$("[data-zhe-open-state]").forEach((el) => {
      el.textContent = status.state;
      el.hidden = !status.state;
    });
    $$("[data-zhe-open-meta]").forEach((el) => {
      const meta = (status.meta || "").trim();
      el.textContent = meta;
      el.hidden = !meta;
      if (!meta) el.setAttribute("hidden", "");
      else el.removeAttribute("hidden");
    });
  };

  updateVisitLive();
  window.setInterval(updateVisitLive, 60 * 1000);

  /* ── Scroll reveals ── */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
  } else {
    // Hero: staggered on load
    $$(".hero .reveal").forEach((el) => {
      const delay = Number(el.dataset.delay || 0) * 140 + 200;
      setTimeout(() => el.classList.add("is-visible"), delay);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    $$(".reveal").forEach((el) => {
      if (!el.closest(".hero")) observer.observe(el);
    });
  }

  /* ── Story carousel — 3 chapters, same gesture as Menu ── */
  (() => {
    const storySection = $("#story");
    const wallA = $("#storyWallA");
    const wallB = $("#storyWallB");
    const storyLabel = $("#storyLabel");
    const storyBody = $("#storyBody");
    const storySpotlight = $("#storySpotlight");
    const storyPrev = $("#storyPrev");
    const storyNext = $("#storyNext");
    const storyDots = $$(".story-dot");
    if (!storySection || !wallA || !wallB) return;

    const chapters = Z.STORY_CHAPTERS.map((c) => ({
      ...c,
      image: asset(c.image),
    }));

    let activeLayer = wallA;
    let idleLayer = wallB;
    let currentSrc = wallA.getAttribute("src") || chapters[0].image;
    let previewGen = 0;
    let index = 0;
    let fading = false;
    let fadeGen = 0;
    let fadeTimer = 0;
    const reduced = reducedMotion;

    /* Autoplay — slower than menu (chapter copy needs time to read) */
    const STORY_AUTO_MS = 5600;
    const STORY_USER_PAUSE_MS = 12000;
    let storyAutoTimer = 0;
    let storyInView = false;
    let storyUserPausedUntil = 0;

    const stopStoryAuto = () => {
      if (storyAutoTimer) {
        clearInterval(storyAutoTimer);
        storyAutoTimer = 0;
      }
    };

    const canStoryAuto = () =>
      storyInView && !reduced && !document.hidden && chapters.length > 1;

    const startStoryAuto = () => {
      stopStoryAuto();
      if (!canStoryAuto()) return;
      storyAutoTimer = window.setInterval(() => {
        if (!canStoryAuto()) return;
        if (Date.now() < storyUserPausedUntil) return;
        step(1, { fromAuto: true });
      }, STORY_AUTO_MS);
    };

    const pauseStoryAuto = () => {
      storyUserPausedUntil = Date.now() + STORY_USER_PAUSE_MS;
    };

    const preloadCache = new Map();
    const preload = (src) => {
      if (!src || preloadCache.has(src)) return preloadCache.get(src);
      const p = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src);
        img.src = src;
      });
      preloadCache.set(src, p);
      return p;
    };
    // Warm current chapter only; others load on first visit
    if (chapters[0]?.image) preload(chapters[0].image);

    const frameStoryImg = (img, position) => {
      if (!img) return;
      img.style.objectPosition = position || "center center";
    };

    const SWEEP_MS = 650;
    let sweepTimer = 0;
    let sweepRaf = 0;
    const clearSweepClasses = (el) => {
      el?.classList.remove(
        "is-active",
        "is-park-left",
        "is-park-right",
        "is-leave-left",
        "is-leave-right"
      );
    };

    /**
     * dir > 0: next — new image sweeps in from right, old exits left
     * dir < 0: prev — new image sweeps in from left, old exits right
     * Simultaneous translate (not opacity crossfade).
     */
    const setStoryWall = async (src, position, dir = 1, animate = true) => {
      if (!src || !activeLayer || !idleLayer) return;
      if (src === currentSrc) {
        frameStoryImg(activeLayer, position);
        if (typeof window.__zheUpdateStoryTone === "function") {
          window.__zheUpdateStoryTone();
        }
        return;
      }
      const gen = ++previewGen;
      await preload(src);
      if (gen !== previewGen) return;

      const goForward = dir >= 0;

      if (sweepTimer) {
        clearTimeout(sweepTimer);
        sweepTimer = 0;
      }
      if (sweepRaf) {
        cancelAnimationFrame(sweepRaf);
        sweepRaf = 0;
      }

      if (!animate || reduced) {
        clearSweepClasses(idleLayer);
        clearSweepClasses(activeLayer);
        idleLayer.src = src;
        frameStoryImg(idleLayer, position);
        idleLayer.classList.add("is-active");
        activeLayer.classList.add("is-park-right");
        const tmp = activeLayer;
        activeLayer = idleLayer;
        idleLayer = tmp;
        currentSrc = src;
        if (typeof window.__zheUpdateStoryTone === "function") {
          requestAnimationFrame(() => window.__zheUpdateStoryTone());
        }
        return;
      }

      // 1) Park incoming layer off-screen on the entry side (transition:none)
      clearSweepClasses(idleLayer);
      idleLayer.classList.add(goForward ? "is-park-right" : "is-park-left");
      idleLayer.src = src;
      frameStoryImg(idleLayer, position);
      void idleLayer.offsetWidth;

      const leaving = activeLayer;
      const entering = idleLayer;

      // Swap pointers immediately so rapid steps use the correct layers
      activeLayer = entering;
      idleLayer = leaving;
      currentSrc = src;

      // 2) Double-rAF: commit park paint, then animate both layers together
      sweepRaf = requestAnimationFrame(() => {
        sweepRaf = requestAnimationFrame(() => {
          sweepRaf = 0;
          if (gen !== previewGen) return;

          // Leave: keep is-active briefly so transform starts from 0; leave class wins
          leaving.classList.remove(
            "is-park-left",
            "is-park-right",
            "is-leave-left",
            "is-leave-right"
          );
          leaving.classList.add(goForward ? "is-leave-left" : "is-leave-right");
          leaving.classList.remove("is-active");

          entering.classList.remove("is-park-left", "is-park-right");
          entering.classList.add("is-active");

          sweepTimer = window.setTimeout(() => {
            sweepTimer = 0;
            if (leaving !== idleLayer) return;
            leaving.classList.remove("is-leave-left", "is-leave-right");
            leaving.classList.add(goForward ? "is-park-left" : "is-park-right");
          }, SWEEP_MS);

          if (typeof window.__zheUpdateStoryTone === "function") {
            window.__zheUpdateStoryTone();
          }
        });
      });
    };

    const applyChapter = (i, { animate = true, dir } = {}) => {
      if (!chapters[i]) return;
      const from = index;
      index = i;
      const gen = ++fadeGen;

      // Prefer explicit dir (swipe/auto); else shortest path for dots
      let sweepDir = dir;
      if (sweepDir == null && i !== from) {
        const n = chapters.length;
        const forward = (i - from + n) % n;
        const backward = (from - i + n) % n;
        sweepDir = forward <= backward ? 1 : -1;
      }
      if (sweepDir == null) sweepDir = 1;

      storyDots.forEach((dot) => {
        const on = Number(dot.dataset.story) === i;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", String(on));
      });

      const paintLatest = () => {
        const chapter = chapters[index];
        if (!chapter) return;
        if (storyLabel) storyLabel.textContent = chapter.label;
        if (storyBody) storyBody.textContent = chapter.body;
        setStoryWall(chapter.image, chapter.position, sweepDir, animate);
      };

      if (!animate || reduced || !storySpotlight) {
        if (fadeTimer) {
          clearTimeout(fadeTimer);
          fadeTimer = 0;
        }
        fading = false;
        paintLatest();
        storySpotlight?.classList.remove("is-fading");
        return;
      }

      // Copy still soft-fades; photo sweeps underneath
      if (fadeTimer) {
        clearTimeout(fadeTimer);
        fadeTimer = 0;
      }
      fading = true;
      storySpotlight.classList.add("is-fading");
      // Start wall sweep immediately (parallel with copy fade)
      const chapter = chapters[index];
      if (chapter) {
        setStoryWall(chapter.image, chapter.position, sweepDir, true);
      }
      fadeTimer = window.setTimeout(() => {
        fadeTimer = 0;
        if (gen !== fadeGen) return;
        if (storyLabel) storyLabel.textContent = chapters[index].label;
        if (storyBody) storyBody.textContent = chapters[index].body;
        requestAnimationFrame(() => {
          if (gen !== fadeGen) return;
          storySpotlight.classList.remove("is-fading");
          fading = false;
        });
      }, 220);
    };

    const step = (dir, { fromAuto = false } = {}) => {
      const next = (index + dir + chapters.length) % chapters.length;
      applyChapter(next, { dir });
      if (!fromAuto) pauseStoryAuto();
    };

    storyPrev?.addEventListener("click", () => step(-1));
    storyNext?.addEventListener("click", () => step(1));
    storyDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.story);
        if (!Number.isNaN(i) && i !== index) {
          applyChapter(i);
          pauseStoryAuto();
        }
      });
    });

    // Section capture — same hit model as Menu (photo + copy continuous).
    // Ignore chrome only; chevrons/pips own explicit taps.
    bindCarouselGestures(storySection, {
      onPrev: () => step(-1),
      onNext: () => step(1),
      shouldIgnore: (t) =>
        Boolean(
          t.closest?.(
            "button, a, .nav, .story-carousel, input, select, textarea"
          )
        ),
    });

    // Shared keyboard router (one handler for story + menu)
    window.__zheStoryCarouselStep = step;

    // Autoplay only while Origins is on screen
    let storyObs = null;
    const bindStoryObserver = () => {
      if (!("IntersectionObserver" in window)) {
        storyInView = true;
        startStoryAuto();
        return;
      }
      storyObs?.disconnect();
      storyObs = new IntersectionObserver(
        ([entry]) => {
          storyInView =
            entry.isIntersecting && entry.intersectionRatio > 0.25;
          if (storyInView) startStoryAuto();
          else stopStoryAuto();
        },
        {
          root: isMobileChrome() && siteMain ? siteMain : null,
          threshold: [0, 0.25, 0.5, 0.75],
        }
      );
      storyObs.observe(storySection);
    };
    window.__zheBindStoryObserver = bindStoryObserver;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopStoryAuto();
      else if (canStoryAuto()) startStoryAuto();
    });

    applyChapter(0, { animate: false });
    bindStoryObserver();
  })();

  /* ── Menu carousel (fits locked panel height) ── */
  const filterBtns = $$(".filter-btn");
  let railItems = $$(".menu-rail-item");
  const wallA = $("#wallImgA");
  const wallB = $("#wallImgB");
  const featuredCat = $("#featuredCat");
  const featuredCn = $("#featuredCn");
  const featuredEn = $("#featuredEn");
  const featuredDesc = $("#featuredDesc");
  const featuredPrice = $("#featuredPrice");
  const menuFeatured = $("#menuFeatured");
  const menuSection = $("#menu");
  const menuViewBtns = $$(".menu-view-btn");
  const menuListView = $(".menu-list-view");

  let activeLayer = wallA;
  let idleLayer = wallB;
  let currentSrc = wallA?.getAttribute("src") || "";
  let previewGen = 0;
  let category = "all";
  let index = 0;
  let menuInView = false;
  let autoTimer = null;
  let userPausedUntil = 0;
  let listViewOn = Boolean(menuSection?.classList.contains("is-list-view"));
  let toneBeforeList = null;
  const AUTO_MS = 3800;
  const USER_PAUSE_MS = 9000;
  const preloadCache = new Map();

  const preload = (src) => {
    if (!src || preloadCache.has(src)) return preloadCache.get(src);
    const p = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src);
      img.src = src;
    });
    preloadCache.set(src, p);
    return p;
  };

  const refreshRailItems = () => {
    railItems = $$(".menu-rail-item");
    // Only warm the first dish — full preload of every plate crushed mobile LCP
    const first = railItems[0];
    if (first?.dataset.image) preload(first.dataset.image);
  };
  refreshRailItems();

  const visibleItems = () =>
    category === "all"
      ? railItems.slice()
      : railItems.filter((item) => item.dataset.category === category);

  /** Announce dish only after deliberate user pick — not auto-rotate */
  const announceFeatured = () => {
    if (!menuFeatured) return;
    menuFeatured.setAttribute("aria-live", "polite");
    window.clearTimeout(announceFeatured._t);
    announceFeatured._t = window.setTimeout(() => {
      menuFeatured.removeAttribute("aria-live");
    }, 1500);
  };

  /**
   * Wall geometry (scale / origin) is CSS-only and identical in photo + list.
   * JS only sets object-position per dish — never transform, or List/Photos jumps.
   */
  const menuMobileMq = window.matchMedia("(max-width: 768px)");
  const isMenuMobile = () => menuMobileMq.matches;

  const frameMenuWall = (img, { position, positionMobile } = {}) => {
    if (!img) return;
    const mobile = isMenuMobile();
    const pos =
      (mobile && positionMobile) || position || "center center";
    img.style.objectPosition = pos;
    /* Guard: never leave transform-based crops (List/Photos must not jump) */
    img.style.removeProperty("transform");
    img.style.removeProperty("transform-origin");
  };

  const setWall = async (src, framing = {}) => {
    if (!src || !activeLayer || !idleLayer) return;
    const frame =
      typeof framing === "string"
        ? { position: framing }
        : framing || {};
    if (src === currentSrc) {
      frameMenuWall(activeLayer, frame);
      frameMenuWall(idleLayer, frame);
      // List mode keeps forced dark chrome — don't re-sample luminance thrash
      if (!listViewOn && typeof window.__zheUpdateMenuTone === "function") {
        window.__zheUpdateMenuTone();
      }
      return;
    }
    const gen = ++previewGen;
    await preload(src);
    if (gen !== previewGen) return;

    /* Frame BOTH layers to the same crop BEFORE crossfade — no size flip */
    idleLayer.src = src;
    frameMenuWall(idleLayer, frame);
    frameMenuWall(activeLayer, frame);
    void idleLayer.offsetWidth;
    idleLayer.classList.add("is-active");
    activeLayer.classList.remove("is-active");
    const tmp = activeLayer;
    activeLayer = idleLayer;
    idleLayer = tmp;
    currentSrc = src;
    if (listViewOn) {
      // Quiet list crossfade: hold dark reading chrome (no light/dark flip mid-list)
      menuSection?.setAttribute("data-tone", "dark");
    } else if (typeof window.__zheUpdateMenuTone === "function") {
      // Wait a frame so the active layer is painted
      requestAnimationFrame(() => window.__zheUpdateMenuTone());
    }
  };

  const framingFromEl = (el) => ({
    position: el?.dataset?.position || "center center",
    positionMobile:
      el?.dataset?.positionMobile || el?.dataset?.position || "center center",
  });

  const menuRail = $("#menuList");
  let railProgrammatic = false;

  /** Center a rail item; flags programmatic scroll so snap-sync doesn't re-fire */
  const scrollRailToItem = (item) => {
    const rail = item?.closest(".menu-rail") || menuRail;
    if (!rail || !item) return;
    railProgrammatic = true;
    const railRect = rail.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const delta =
      itemRect.left + itemRect.width / 2 - (railRect.left + railRect.width / 2);
    rail.scrollBy({
      left: delta,
      behavior: reduced ? "auto" : "smooth",
    });
    window.setTimeout(() => {
      railProgrammatic = false;
    }, reduced ? 50 : 420);
  };

  const selectDish = (item, { scrollRail = true } = {}) => {
    if (!item) return;
    const pool = visibleItems();
    index = Math.max(0, pool.indexOf(item));

    railItems.forEach((el) => {
      const on = el === item;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-selected", String(on));
    });

    // Sync list-view active state if present
    if (menuListView) {
      $$(".menu-list-item", menuListView).forEach((el) => {
        const match =
          el.dataset.cn === item.dataset.cn ||
          el.dataset.image === item.dataset.image ||
          el.dataset.en === item.dataset.en;
        el.classList.toggle("is-active", match);
        el.setAttribute("aria-selected", String(match));
      });
    }

    if (featuredCat) featuredCat.textContent = item.dataset.catLabel || "";
    if (featuredEn) featuredEn.textContent = item.dataset.en || "";
    if (featuredCn) featuredCn.textContent = item.dataset.cn || "";
    if (featuredDesc) featuredDesc.textContent = item.dataset.desc || "";
    if (featuredPrice) featuredPrice.textContent = item.dataset.price || "";
    paintFeaturedMarks(item);

    if (menuFeatured) {
      const en = item.dataset.en || "";
      const cn = item.dataset.cn || "";
      const price = item.dataset.price || "";
      const parts = [en, cn, price].filter(Boolean);
      menuFeatured.setAttribute("aria-label", parts.join(" · "));
    }

    // Collapse expanded description when switching dishes
    featuredDesc?.closest(".menu-spotlight-copy")?.classList.remove("is-expanded");

    // Always update wall; list mode uses a slow CSS crossfade (no Ken Burns)
    setWall(item.dataset.image, framingFromEl(item));
    // Only scroll the horizontal rail in photo mode — never the page
    if (!listViewOn && scrollRail && menuInView) scrollRailToItem(item);
  };

  const selectDishUser = (item, opts) => {
    selectDish(item, opts);
    announceFeatured();
  };

  const stopAutoRotate = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const canAutoRotate = () =>
    category === "all" && menuInView && !reduced && !listViewOn;

  const startAutoRotate = () => {
    stopAutoRotate();
    if (!canAutoRotate()) return;

    autoTimer = window.setInterval(() => {
      if (!canAutoRotate()) return;
      if (Date.now() < userPausedUntil) return;
      step(1, { fromAuto: true });
    }, AUTO_MS);
  };

  const pauseAutoBriefly = () => {
    userPausedUntil = Date.now() + USER_PAUSE_MS;
  };

  const syncListToggleUi = () => {
    menuViewBtns.forEach((btn) => {
      const isList = btn.dataset.view === "list";
      const active = isList ? listViewOn : !listViewOn;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  };

  const setListView = (on) => {
    if (!menuSection) return;
    const next = Boolean(on);
    if (next === listViewOn) {
      syncListToggleUi();
      return;
    }
    listViewOn = next;
    menuSection.classList.toggle("is-list-view", listViewOn);
    if (menuListView) {
      if (listViewOn) menuListView.removeAttribute("hidden");
      else menuListView.setAttribute("hidden", "");
    }
    syncListToggleUi();
    track("toggle_list_view", { mode: listViewOn ? "list" : "photos" });
    if (listViewOn) {
      stopAutoRotate();
      // Reading mode: force dark chrome — do NOT reframe/reload wall
      toneBeforeList = menuSection.getAttribute("data-tone");
      menuSection.setAttribute("data-tone", "dark");
    } else {
      if (toneBeforeList) menuSection.setAttribute("data-tone", toneBeforeList);
      else if (typeof window.__zheUpdateMenuTone === "function") {
        requestAnimationFrame(() => window.__zheUpdateMenuTone());
      }
      toneBeforeList = null;
      if (category === "all") startAutoRotate();
    }
  };

  /**
   * Size the dish strip to the visible thumbs:
   *  · few items → compact centered row (no empty stretch / scroll)
   *  · many items → full width + horizontal scroll
   */
  const menuCarousel = $("#menuCarousel");
  let railLayoutRaf = 0;
  const syncMenuRailLayout = () => {
    if (!menuCarousel || !menuRail) return;
    if (railLayoutRaf) cancelAnimationFrame(railLayoutRaf);
    railLayoutRaf = requestAnimationFrame(() => {
      railLayoutRaf = 0;
      const visible = railItems.filter(
        (el) => !el.classList.contains("is-hidden")
      );
      const n = visible.length;
      menuCarousel.dataset.items = String(n);

      // Show chevrons before measuring so their width is real (n>1)
      const showChev = n > 1;
      if (menuPrev) menuPrev.hidden = !showChev;
      if (menuNext) menuNext.hidden = !showChev;
      void menuCarousel.offsetWidth;

      // Measure real laid-out thumbs (never parseFloat("5.35rem"))
      const sample = visible[0];
      const thumbW = sample?.getBoundingClientRect().width || 116;
      const railStyles = getComputedStyle(menuRail);
      const gap = parseFloat(railStyles.columnGap || railStyles.gap) || 8;
      const padL = parseFloat(railStyles.paddingLeft) || 0;
      const padR = parseFloat(railStyles.paddingRight) || 0;
      const contentW =
        n > 0 ? n * thumbW + Math.max(0, n - 1) * gap + padL + padR : 0;

      const chevW =
        (showChev &&
          (menuPrev?.getBoundingClientRect().width ||
            menuNext?.getBoundingClientRect().width)) ||
        38;
      const colGap = parseFloat(getComputedStyle(menuCarousel).columnGap) || 4;
      const chromeW = showChev ? chevW * 2 + colGap * 2 : 0;
      const stage = menuCarousel.parentElement;
      const stageW = stage?.clientWidth || menuCarousel.clientWidth || 0;
      const maxInner = Math.max(0, stageW - chromeW - 4);

      const overflows = n > 1 && contentW > maxInner + 1;
      menuCarousel.classList.toggle("is-overflowing", overflows);
      menuCarousel.classList.toggle("is-compact", !overflows && n > 0);
    });
  };

  const applyCategory = (key, { selectFirst = true } = {}) => {
    category = key;
    filterBtns.forEach((btn) => {
      const active = btn.dataset.filter === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    railItems.forEach((item) => {
      const show = key === "all" || item.dataset.category === key;
      item.classList.toggle("is-hidden", !show);
    });

    // Keep list-view filters in sync with the rail
    if (menuListView) {
      $$(".menu-list-item", menuListView).forEach((item) => {
        const show = key === "all" || item.dataset.category === key;
        item.classList.toggle("is-hidden", !show);
      });
    }

    if (selectFirst) {
      const pool = visibleItems();
      index = 0;
      // Avoid rail.scrollIntoView-style page jumps when menu is off-screen
      if (pool[0]) selectDish(pool[0], { scrollRail: menuInView });
    }

    if (key === "all" && !listViewOn) startAutoRotate();
    else stopAutoRotate();

    syncMenuRailLayout();
  };

  const step = (dir, { fromAuto = false } = {}) => {
    const pool = visibleItems();
    if (!pool.length) return;
    index = (index + dir + pool.length) % pool.length;
    selectDish(pool[index], { scrollRail: true });
    if (!fromAuto) {
      pauseAutoBriefly();
      announceFeatured();
    }
  };

  /* ── Carousel: prev/next, rail snap-select, swipe on photo ── */
  const menuPrev = $("#menuPrev");
  const menuNext = $("#menuNext");

  menuPrev?.addEventListener("click", () => {
    pauseAutoBriefly();
    step(-1);
  });
  menuNext?.addEventListener("click", () => {
    pauseAutoBriefly();
    step(1);
  });

  // After a free swipe on the thumbnail strip, select the dish nearest center
  let railScrollTimer = 0;
  menuRail?.addEventListener(
    "scroll",
    () => {
      if (railProgrammatic || listViewOn || !menuInView) return;
      clearTimeout(railScrollTimer);
      railScrollTimer = window.setTimeout(() => {
        const railRect = menuRail.getBoundingClientRect();
        const center = railRect.left + railRect.width / 2;
        let best = null;
        let bestDist = Infinity;
        visibleItems().forEach((item) => {
          const r = item.getBoundingClientRect();
          const c = r.left + r.width / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) {
            bestDist = d;
            best = item;
          }
        });
        if (best && !best.classList.contains("is-active")) {
          pauseAutoBriefly();
          selectDish(best, { scrollRail: false });
        }
      }, 90);
    },
    { passive: true }
  );

  // Same section-level capture as Origins so swipe works across the plate.
  // Only ignore real controls; overflowing rail keeps native pan-x (see below).
  bindCarouselGestures(menuSection, {
    onPrev: () => {
      pauseAutoBriefly();
      step(-1);
    },
    onNext: () => {
      pauseAutoBriefly();
      step(1);
    },
    isEnabled: () => !listViewOn,
    shouldIgnore: (t) => {
      if (
        t.closest?.(
          "button, a, .nav, .menu-list-view, .filter-btn, .menu-view-btn, .menu-carousel-btn, input, select, textarea"
        )
      ) {
        return true;
      }
      // Long overflowing strip: let the user scrub thumbs without stepping the wall
      if (
        t.closest?.(".menu-rail-wrap") &&
        menuCarousel?.classList.contains("is-overflowing")
      ) {
        return true;
      }
      return false;
    },
  });

  // Trackpad / mouse wheel: horizontal intent over menu carousel
  menuRail?.addEventListener(
    "wheel",
    (e) => {
      if (listViewOn) return;
      const mostlyHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (mostlyHorizontal) {
        // native horizontal scroll handles the rail
        pauseAutoBriefly();
        return;
      }
      // Shift+wheel or strong vertical on rail → convert to dish step when over rail edge
      if (e.shiftKey && Math.abs(e.deltaY) > 8) {
        e.preventDefault();
        pauseAutoBriefly();
        step(e.deltaY > 0 ? 1 : -1);
      }
    },
    { passive: false }
  );

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pauseAutoBriefly();
      const cat = btn.dataset.filter;
      applyCategory(cat);
      track("filter_menu", { category: cat || "all" });
      // Drop focus from the whole tablist so mobile sticky :focus/:hover can't linger
      filterBtns.forEach((b) => b.blur());
    });
  });

  const pickRailDish = (item) => {
    if (category !== "all" && item.dataset.category !== category) {
      applyCategory("all", { selectFirst: false });
    }
    pauseAutoBriefly();
    selectDishUser(item);
    if (item.dataset.id) track("select_dish", { id: item.dataset.id, view: "rail" });
  };

  // Event delegation — works after DOM render from data.js
  menuRail?.addEventListener("click", (e) => {
    const item = e.target.closest(".menu-rail-item[data-image]");
    if (!item || !menuRail.contains(item)) return;
    pickRailDish(item);
  });
  menuRail?.addEventListener("keydown", (e) => {
    const item = e.target.closest(".menu-rail-item[data-image]");
    if (!item || !menuRail.contains(item)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pickRailDish(item);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  });

  if (menuListView) {
    const pickListDish = (item) => {
      if (
        category !== "all" &&
        item.dataset.category &&
        item.dataset.category !== category
      ) {
        applyCategory("all", { selectFirst: false });
      }
      pauseAutoBriefly();
      refreshRailItems();
      const railMatch =
        railItems.find(
          (r) =>
            r.dataset.image === item.dataset.image ||
            (item.dataset.cn && r.dataset.cn === item.dataset.cn)
        ) || item;
      selectDishUser(railMatch);
      if (item.dataset.id) {
        track("select_dish", { id: item.dataset.id, view: "list" });
      }
    };

    menuListView.addEventListener("click", (e) => {
      const item = e.target.closest(".menu-list-item[data-image]");
      if (!item) return;
      pickListDish(item);
    });
    menuListView.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const item = e.target.closest(".menu-list-item[data-image]");
      if (!item) return;
      e.preventDefault();
      pickListDish(item);
    });
  }

  // Photo view | List view segment
  menuViewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setListView(btn.dataset.view === "list");
    });
  });
  // Sync list hidden with initial class state
  if (menuListView) {
    if (listViewOn) menuListView.removeAttribute("hidden");
    else menuListView.setAttribute("hidden", "");
  }
  syncListToggleUi();

  // Apply focal framing for the current dish (seed + mobile/desktop switch)
  const reframeActiveDish = () => {
    const pool = visibleItems();
    const current = pool[index] || pool[0] || railItems[0];
    if (current?.dataset.image) {
      setWall(current.dataset.image, framingFromEl(current));
      return;
    }
    const seed = window.__zheMenuSeed;
    if (seed?.image) {
      setWall(seed.image, {
        position: seed.position,
        positionMobile: seed.positionMobile,
      });
    }
  };
  reframeActiveDish();
  /* Breakpoint change only — never on List/Photos toggle */
  if (typeof menuMobileMq.addEventListener === "function") {
    menuMobileMq.addEventListener("change", reframeActiveDish);
  } else if (typeof menuMobileMq.addListener === "function") {
    menuMobileMq.addListener(reframeActiveDish);
  }

  // Expand description (mobile clamp only — desktop shows full copy)
  const expandTarget = featuredDesc?.closest(".menu-spotlight-copy");
  expandTarget?.addEventListener("click", () => {
    if (!window.matchMedia || !window.matchMedia("(max-width: 768px)").matches) {
      return;
    }
    expandTarget.classList.toggle("is-expanded");
  });

  // One keyboard router for Story + Menu carousels (no double-step mid-snap)
  window.__zheMenuCarouselStep = step;
  window.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    const active = getActivePanel();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    if (active?.id === "story" && typeof window.__zheStoryCarouselStep === "function") {
      e.preventDefault();
      window.__zheStoryCarouselStep(dir);
      return;
    }
    if (
      active?.id === "menu" &&
      !listViewOn &&
      typeof window.__zheMenuCarouselStep === "function"
    ) {
      e.preventDefault();
      window.__zheMenuCarouselStep(dir);
    }
  });

  // Auto-rotate only while menu is on screen (rebind on breakpoint change)
  let menuObs = null;
  const bindMenuObserver = () => {
    if (!menuSection || !("IntersectionObserver" in window)) {
      menuInView = true;
      return;
    }
    menuObs?.disconnect();
    menuObs = new IntersectionObserver(
      ([entry]) => {
        menuInView = entry.isIntersecting && entry.intersectionRatio > 0.25;
        if (menuInView && canAutoRotate()) startAutoRotate();
        else stopAutoRotate();
      },
      {
        root: isMobileChrome() && siteMain ? siteMain : null,
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );
    menuObs.observe(menuSection);
  };
  bindMenuObserver();

  // Pause when tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoRotate();
    else if (canAutoRotate()) startAutoRotate();
  });

  // Init menu without scrolling the page
  applyCategory("all");
  // After layout / images, remeasure rail fit (filters already call this)
  window.addEventListener(
    "resize",
    () => {
      syncMenuRailLayout();
    },
    { passive: true }
  );
  // Second pass once thumbs have laid out
  requestAnimationFrame(() => syncMenuRailLayout());

  /* ── In-page section navigation (nav links, logo, hash) ── */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      // External-ish hashes only for real section ids
      let target = null;
      if (id === "#top") target = $("#hero") || $("#top");
      else target = $(id);
      if (!target) return;
      e.preventDefault();
      scrollToSection(target, { smooth: !reducedMotion, updateHash: true });
    });
  });

  /*
   * Landing position
   * - Shared deep links (#menu, #visit, …) still work on a fresh open
   * - Reload always returns to hero (stale #story from “Our Story” was
   *   making mobile reloads feel stuck on Origins)
   * - Pin top with snap briefly off so mobile address-bar / 100dvh
   *   resizes don’t mandatory-snap into the next panel
   */
  const navEntry =
    performance.getEntriesByType &&
    performance.getEntriesByType("navigation")[0];
  const isReload =
    (navEntry && navEntry.type === "reload") ||
    (performance.navigation && performance.navigation.type === 1);

  const pinToHero = () => {
    snapOff();
    scrollRootTo(0, "auto");
    requestAnimationFrame(() => {
      scrollRootTo(0, "auto");
      snapOn();
    });
  };

  const hashId = location.hash && location.hash.length > 1 ? location.hash : "";
  const deepTarget = hashId ? $(hashId) : null;
  const honorDeepLink = Boolean(deepTarget && !isReload);

  if (isReload && hashId) {
    // Drop leftover section hash so refresh = home
    history.replaceState(null, "", location.pathname + location.search);
  }

  if (honorDeepLink) {
    requestAnimationFrame(() => {
      scrollToSection(deepTarget, { smooth: false, updateHash: false });
    });
  } else {
    pinToHero();
    // One short re-pin for layout settle — cancel if the user interacts
    let allowHeroPin = true;
    const cancelHeroPin = () => {
      allowHeroPin = false;
    };
    window.addEventListener("pointerdown", cancelHeroPin, {
      once: true,
      passive: true,
    });
    window.addEventListener("wheel", cancelHeroPin, { once: true, passive: true });
    window.addEventListener("touchstart", cancelHeroPin, {
      once: true,
      passive: true,
    });
    window.setTimeout(() => {
      if (!allowHeroPin) return;
      if (location.hash && location.hash.length > 1) return;
      // Only correct tiny layout drift near the top — never yank a real swipe
      if (getScrollY() > 2 && getScrollY() < 48) pinToHero();
    }, 120);
  }

  // Back-forward cache restore
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    if (location.hash && location.hash.length > 1) {
      const t = $(location.hash);
      if (t) scrollToSection(t, { smooth: false, updateHash: false });
    } else {
      pinToHero();
    }
  });

  /* ── Muted section loops (Hero + Visit) ── */
  const bindMutedSectionVideo = (video, section) => {
    if (!video || video.tagName !== "VIDEO" || !section) return;

    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      video.removeAttribute("autoplay");
      try {
        video.pause();
      } catch (_) {
        /* ignore */
      }
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    let inView = false;
    const tryPlay = () => {
      if (!inView || reduced) return;
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* autoplay blocked — poster stays */
        });
      }
    };

    const markReady = () => {
      video.classList.add("is-ready");
      tryPlay();
    };

    if (video.readyState >= 2) markReady();
    else {
      video.addEventListener("loadeddata", markReady, { once: true });
      video.addEventListener("canplay", markReady, { once: true });
    }

    try {
      video.load();
    } catch (_) {
      /* ignore */
    }

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView = entry.isIntersecting && entry.intersectionRatio > 0.2;
            if (inView) tryPlay();
            else {
              try {
                video.pause();
              } catch (_) {
                /* ignore */
              }
            }
          });
        },
        { threshold: [0, 0.2, 0.5] }
      );
      io.observe(section);
    } else {
      inView = true;
      tryPlay();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        try {
          video.pause();
        } catch (_) {
          /* ignore */
        }
      } else if (inView) tryPlay();
    });
  };

  bindMutedSectionVideo($("#heroImg"), $("#hero"));
  bindMutedSectionVideo($("#visitVideo"), $("#visit"));

  /* ── Active nav link by section ── */
  const sectionIds = ["hero", "story", "menu", "visit"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  let sectionObs = null;
  const bindSectionObserver = () => {
    if (!sectionIds.length || !("IntersectionObserver" in window)) return;
    sectionObs?.disconnect();
    sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinkAnchors.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle(
              "is-active",
              href === `#${id}` ||
                (id === "hero" && (href === "#hero" || href === "#top"))
            );
          });
        });
      },
      {
        root: isMobileChrome() && siteMain ? siteMain : null,
        rootMargin: "-40% 0px -45% 0px",
        threshold: 0,
      }
    );
    sectionIds.forEach((s) => sectionObs.observe(s));
  };
  bindSectionObserver();

  // Rebind scroll-root-aware observers when crossing mobile/desktop
  if (window.matchMedia) {
    const mq = window.matchMedia("(max-width: 768px)");
    const onBreak = () => {
      syncMobileShell();
      bindMenuObserver();
      if (typeof window.__zheBindStoryObserver === "function") {
        window.__zheBindStoryObserver();
      }
      bindSectionObserver();
      updateNav();
      updateProgress();
    };
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onBreak);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(onBreak);
    }
  }

  // Back/forward hash changes
  window.addEventListener("popstate", () => {
    const id = location.hash;
    if (!id || id === "#") {
      scrollToSection($("#hero") || $("#top"), { smooth: false, updateHash: false });
      return;
    }
    const target = $(id);
    if (target) scrollToSection(target, { smooth: false, updateHash: false });
  });

  /* ── WeChat toast ── */
  const wechat = $("#wechatLink");
  const toast = $("#toast");
  let toastTimer;

  wechat?.addEventListener("click", (e) => {
    e.preventDefault();
    /* click_social tracked via data-zhe-track on the link */
    if (!toast) return;
    toast.hidden = false;
    // reflow
    void toast.offsetWidth;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.hidden = true;
      }, 350);
    }, 2800);
  });

  /* ── Adaptive type contrast over photo panels ──
     Sample the *photo pixels that sit under live text boxes*:
     1) measure each copy element’s screen rect
     2) map that rect through object-fit:cover onto the image
     3) average Rec.709 luminance → data-tone="light"|"dark"
  */
  (() => {
    const LUMA_LIGHT = 0.58; // ≥ → light photo under type → dark type
    const LUMA_DARK = 0.48; // hysteresis: stay light until clearly dark
    const PAD = 6; // px around glyphs so edges of letters count
    const OUT_W = 32; // per-region sample raster
    const OUT_H = 32;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });
    if (!ctx) return;

    const parseObjectPosition = (value) => {
      const map = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 };
      const parts = String(value || "50% 50%")
        .trim()
        .split(/\s+/);
      const one = (token, fallback) => {
        if (token == null) return fallback;
        if (map[token] != null) return map[token];
        if (String(token).endsWith("%")) return parseFloat(token) / 100;
        const n = parseFloat(token);
        return Number.isFinite(n) ? n : fallback;
      };
      return {
        x: one(parts[0], 0.5),
        y: one(parts[1] != null ? parts[1] : parts[0], 0.5),
      };
    };

    /** object-fit: cover placement of natural image inside a display box */
    const coverLayout = (img, boxW, boxH, pos) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih || boxW <= 0 || boxH <= 0) return null;
      const scale = Math.max(boxW / iw, boxH / ih);
      const drawnW = iw * scale;
      const drawnH = ih * scale;
      const offsetX = (boxW - drawnW) * pos.x;
      const offsetY = (boxH - drawnH) * pos.y;
      return { iw, ih, scale, drawnW, drawnH, offsetX, offsetY, boxW, boxH };
    };

    /**
     * Map a screen-space rect (relative to the photo’s display box)
     * into natural image pixel rects, clamped to the image.
     */
    const displayRectToImage = (layout, left, top, right, bottom) => {
      const sx = (left - layout.offsetX) / layout.scale;
      const sy = (top - layout.offsetY) / layout.scale;
      const ex = (right - layout.offsetX) / layout.scale;
      const ey = (bottom - layout.offsetY) / layout.scale;
      const x0 = Math.max(0, Math.min(layout.iw, Math.floor(Math.min(sx, ex))));
      const y0 = Math.max(0, Math.min(layout.ih, Math.floor(Math.min(sy, ey))));
      const x1 = Math.max(0, Math.min(layout.iw, Math.ceil(Math.max(sx, ex))));
      const y1 = Math.max(0, Math.min(layout.ih, Math.ceil(Math.max(sy, ey))));
      const sw = x1 - x0;
      const sh = y1 - y0;
      if (sw < 1 || sh < 1) return null;
      return { sx: x0, sy: y0, sw, sh };
    };

    const regionLuma = (img, src) => {
      try {
        ctx.clearRect(0, 0, OUT_W, OUT_H);
        ctx.drawImage(img, src.sx, src.sy, src.sw, src.sh, 0, 0, OUT_W, OUT_H);
        const data = ctx.getImageData(0, 0, OUT_W, OUT_H).data;
        let total = 0;
        let n = 0;
        // stride 4 pixels for speed
        for (let i = 0; i < data.length; i += 16) {
          total +=
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255;
          n += 1;
        }
        return n ? total / n : null;
      } catch {
        return null; // CORS / tainted
      }
    };

    /**
     * Ink-tight boxes for glyphs (not full block width of a heading).
     * Falls back to the element box for icon-only / empty nodes.
     */
    const inkRectsFor = (el) => {
      const rects = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue || !node.nodeValue.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const list = range.getClientRects();
        for (let i = 0; i < list.length; i += 1) {
          const r = list[i];
          if (r.width >= 2 && r.height >= 2) rects.push(r);
        }
      }
      if (!rects.length) {
        const r = el.getBoundingClientRect();
        if (r.width >= 2 && r.height >= 2) rects.push(r);
      }
      return rects;
    };

    /**
     * Average luminance of photo pixels under live type.
     * Uses ink rects of each copy element, mapped through object-fit:cover
     * onto the natural image, weighted by on-screen area.
     */
    const sampleUnderText = (img, photoEl, textEls) => {
      if (!img || !photoEl || !textEls?.length) return null;
      const photoRect = photoEl.getBoundingClientRect();
      if (photoRect.width < 2 || photoRect.height < 2) return null;

      const style = getComputedStyle(img);
      const pos = parseObjectPosition(style.objectPosition);
      // Prefer the photo element's painted box (full-bleed wall/bg)
      const layout = coverLayout(img, photoRect.width, photoRect.height, pos);
      if (!layout) return null;

      let weighted = 0;
      let weightSum = 0;

      textEls.forEach((el) => {
        if (!el) return;
        inkRectsFor(el).forEach((tr) => {
          // Expand slightly around glyphs; clamp to photo bounds
          const left = Math.max(photoRect.left, tr.left - PAD);
          const top = Math.max(photoRect.top, tr.top - PAD);
          const right = Math.min(photoRect.right, tr.right + PAD);
          const bottom = Math.min(photoRect.bottom, tr.bottom + PAD);
          const w = right - left;
          const h = bottom - top;
          if (w < 2 || h < 2) return; // no overlap with photo

          // coords relative to photo display box
          const relL = left - photoRect.left;
          const relT = top - photoRect.top;
          const relR = right - photoRect.left;
          const relB = bottom - photoRect.top;

          const src = displayRectToImage(layout, relL, relT, relR, relB);
          if (!src) return;
          const luma = regionLuma(img, src);
          if (luma == null) return;

          const area = w * h;
          weighted += luma * area;
          weightSum += area;
        });
      });

      return weightSum > 0 ? weighted / weightSum : null;
    };

    const ensureImage = (img) =>
      new Promise((resolve) => {
        if (!img) {
          resolve(null);
          return;
        }
        const finish = async () => {
          if (!img.naturalWidth) {
            resolve(null);
            return;
          }
          // Wait for full decode — sampling mid-decode reads pale incomplete frames
          try {
            if (typeof img.decode === "function") await img.decode();
          } catch (_) {
            /* decode can reject if src changes; still resolve if pixels exist */
          }
          resolve(img.naturalWidth ? img : null);
        };
        if (img.complete && img.naturalWidth) {
          finish();
          return;
        }
        img.addEventListener("load", () => finish(), { once: true });
        img.addEventListener("error", () => resolve(null), { once: true });
      });

    const applyTone = (panel, luma) => {
      if (!panel || luma == null) return;
      // Origins keeps dark chrome — pale flour/wood + cream light-veil reads washed
      if (panel.id === "story") {
        if (panel.dataset.tone !== "dark") panel.dataset.tone = "dark";
        return;
      }
      const cur = panel.dataset.tone || "dark";
      let tone = cur;
      if (cur === "dark" && luma >= LUMA_LIGHT) tone = "light";
      else if (cur === "light" && luma <= LUMA_DARK) tone = "dark";
      // mid-band: keep current (avoids flicker near threshold)
      if (panel.dataset.tone !== tone) {
        panel.dataset.tone = tone;
      }
    };

    const visibleCopy = (root, selectors) => {
      const nodes = [];
      selectors.forEach((sel) => {
        root.querySelectorAll(sel).forEach((el) => {
          const st = getComputedStyle(el);
          if (st.display === "none" || st.visibility === "hidden") return;
          if (Number(st.opacity) === 0) return;
          nodes.push(el);
        });
      });
      return nodes;
    };

    const updateHeroTone = async () => {
      const panel = $("#hero");
      // Prefer still poster for luminance sampling (video has no naturalWidth early)
      const img = $("#heroPoster") || $(".hero-poster") || $("#heroImg");
      const photoBox = $(".hero-bg") || panel;
      const ready = await ensureImage(img);
      if (!panel || !ready || !photoBox) return;
      // Discrete type blocks (not the full-width content shell) so
      // we sample the photo under each glyph cluster’s real box
      const texts = visibleCopy(panel, [
        ".hero-eyebrow",
        ".hero-title",
        ".hero-tagline",
        ".hero-scroll",
      ]);
      applyTone(panel, sampleUnderText(ready, photoBox, texts));
    };

    const updateMenuTone = async () => {
      const panel = $("#menu");
      // List mode keeps forced dark chrome — don't re-sample photo luminance
      if (panel?.classList.contains("is-list-view")) return;
      const img =
        panel?.querySelector(".menu-wall-img.is-active") ||
        $("#wallImgA") ||
        $(".menu-wall-img");
      const photoBox = $("#menuWall") || panel;
      const ready = await ensureImage(img);
      if (!panel || !ready || !photoBox) return;
      const texts = visibleCopy(panel, [
        ".menu-head-title",
        ".menu-filters",
        ".menu-tools",
        ".menu-spotlight-copy",
        ".menu-note",
      ]);
      applyTone(panel, sampleUnderText(ready, photoBox, texts));
    };

    const updateVisitTone = async () => {
      const panel = $("#visit");
      const img =
        $("#visitPoster") ||
        $(".visit-wall-poster") ||
        $(".visit-wall-img");
      const photoBox = $(".visit-wall") || panel;
      const ready = await ensureImage(img);
      if (!panel || !ready || !photoBox) return;
      const texts = visibleCopy(panel, [
        ".visit-head-title",
        ".visit-head-lead",
        ".visit-spotlight",
      ]);
      applyTone(panel, sampleUnderText(ready, photoBox, texts));
    };

    const updateStoryTone = async () => {
      const panel = $("#story");
      if (!panel) return;
      // Always dark chrome on Origins (see applyTone). Still wait for decode so
      // first paint isn’t an incomplete pale WebP frame under the veil.
      const img =
        panel.querySelector(".story-wall-img.is-active") ||
        $("#storyWallA") ||
        $(".story-wall-img");
      await ensureImage(img);
      applyTone(panel, 0); // force dark path
    };

    const updateAllTones = () => {
      updateHeroTone();
      updateStoryTone();
      updateMenuTone();
      updateVisitTone();
    };

    // Exposed for wall swaps
    window.__zheUpdateMenuTone = updateMenuTone;
    window.__zheUpdateStoryTone = updateStoryTone;

    // Defaults before first sample
    ["hero", "story", "menu", "visit"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && !el.dataset.tone) el.dataset.tone = "dark";
    });

    const boot = () => {
      // Wait a frame so layout + object-fit settle, then fonts
      requestAnimationFrame(() => {
        updateAllTones();
        if (document.fonts?.ready) {
          document.fonts.ready.then(updateAllTones).catch(() => {});
        }
      });
    };

    if (document.readyState === "complete") boot();
    else window.addEventListener("load", boot, { once: true });

    // Images may decode after load — bind every matching node (not just the first)
    [
      ["#heroPoster, .hero-poster", updateHeroTone],
      [".story-wall-img", updateStoryTone],
      [".visit-wall-poster, #visitPoster", updateVisitTone],
      ["#wallImgA, #wallImgB, .menu-wall-img", updateMenuTone],
    ].forEach(([sel, fn]) => {
      $$(sel).forEach((img) => {
        img.addEventListener("load", () => fn(), { passive: true });
      });
    });

    let resizeTimer = 0;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateAllTones, 180);
      },
      { passive: true }
    );

    // Re-sample after section nav settles (layout may shift mobile dock / nav)
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateAllTones, 220);
      },
      { passive: true }
    );
  })();

})();
