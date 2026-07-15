/* 褶 · Zhe — single source of truth for everything the UI hydrates.
 *
 * Edit SITE / MENU_ITEMS / STORY_CHAPTERS here only.
 * index.html shells are FOUC/LCP placeholders; script.js overwrites from this file.
 * Bump ASSET_V when shipping new images or cache-busted assets.
 */
window.ZHE = {
  ASSET_V: "1784125300",

  /**
   * ── LAUNCH SWITCH ─────────────────────────────────────────────────
   * See GO_LIVE.md. script.js will NOT index if NAP still looks like a
   * placeholder (Sample Street / 555 / 94100), even when INDEXABLE is true.
   *
   * 1. Real telephone, address, mapsQuery, optional geo
   * 2. booking.url = Resy venue page; social.xiaohongshu when ready
   * 3. INDEXABLE: true + index.html meta robots → index, follow
   * 4. Deploy → Search Console + Google Business Profile
   * 5. ANALYTICS.debug → false; optional Plausible/GA4
   * 6. Bump ASSET_V if shipping new images
   * 7. node scripts/check-launch.mjs
   */
  INDEXABLE: false,
  ANALYTICS: {
    debug: true,
  },

  SITE: {
    name: "Zhe · The Fold",
    alternateName: ["褶", "Zhe The Fold"],
    url: "https://zhethefold.com/",
    /**
     * Portfolio / concept demo (not a live booking venue).
     * Set false for a real client; hide chrome via renderDemoChrome().
     */
    demoMode: true,
    demoLabel: "Concept · Demo",
    demoBlurb:
      "Concept house for portfolio — sample address; not a live reservation venue.",
    /** Meta + JSON-LD description (one string for SEO + schema) */
    description:
      "Handmade Chinese dumplings in San Francisco. Every fold holds the mark of a hand. Concept demo.",
    email: "hello@zhethefold.com",
    reserveSubject: "Reservation · Zhe (concept demo)",
    /* ⚠ Placeholders — replace before INDEXABLE true / demoMode false */
    telephone: "+14155550100",
    telephoneDisplay: "(415) 555-0100",
    address: {
      streetAddress: "100 Sample Street, Suite A",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94100",
      addressCountry: "US",
    },
    mapsQuery: "100 Sample Street San Francisco CA",
    geo: null, // { latitude: 37.77, longitude: -122.42 }
    /**
     * Open badge + Visit hours + Restaurant schema.
     * Days: Sun Mon Tue Wed Thu Fri Sat (en-US short from Intl).
     */
    hours: {
      timeZone: "America/Los_Angeles",
      closedWeekdays: ["Mon"],
      note: "Closed Mondays",
      periods: [
        {
          days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          open: "11:30",
          close: "14:30",
        },
        {
          days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          open: "17:00",
          close: "21:00",
        },
      ],
    },
    social: {
      instagram: "https://instagram.com/zhe.thefold",
      xiaohongshu: null,
      wechatId: "褶Zhe · The Fold",
    },
    /** Short access line under address (transit / walk-in — fiction-safe) */
    access: "Walk-ins welcome · California St",
    /** Reserve CTA → Resy (or OT/Tock). null url falls back to mailto. */
    booking: {
      provider: "resy", // "resy" | "opentable" | "tock" | "mailto" | "other"
      url: null, // e.g. "https://resy.com/cities/sf/…/zhe-the-fold"
      label: "Reserve",
    },
  },

  /**
   * Prefer paths without extension quirks — asset() rewrites .jpg → .webp + ?v=
   * tags: dietary marks on spotlight · popular: house mark
   */
  MENU_ITEMS: [
    {
      id: "pork",
      category: "classic",
      catLabel: "Classic",
      image: "assets/dish-pork.jpg",
      en: "Pork & Napa Cabbage Fold",
      rail: "Pork & Cabbage",
      cn: "猪肉白菜褶",
      desc: "The house classic—soft pork, sweet cabbage, a fold as familiar as home.",
      price: "$14",
      popular: true,
      tags: ["pork"],
    },
    {
      id: "beef",
      category: "classic",
      catLabel: "Classic",
      image: "assets/dish-beef.jpg",
      en: "Beef & Scallion Fold",
      rail: "Beef & Scallion",
      cn: "牛肉大葱褶",
      desc: "Northern heartiness in a thin skin: beef, bright scallion, a quiet depth of soy.",
      price: "$16",
      tags: ["beef"],
    },
    {
      id: "shrimp",
      category: "classic",
      catLabel: "Classic",
      image: "assets/dish-shrimp.jpg",
      en: "Shrimp & Chive Fold",
      rail: "Shrimp & Chive",
      cn: "虾仁韭菜褶",
      desc: "Sweet shrimp and fragrant chive, sealed with a few honest, uneven creases.",
      price: "$18",
      popular: true,
      tags: ["shellfish"],
    },
    {
      id: "bamboo",
      category: "seasonal",
      catLabel: "Seasonal",
      image: "assets/dish-bamboo.jpg",
      en: "Bamboo Shoot & Pork Fold",
      rail: "Bamboo & Pork",
      cn: "春笋鲜肉褶",
      desc: "Crisp spring bamboo meeting slow-cooked pork—season held lightly in the dough.",
      price: "$17",
      tags: ["pork", "seasonal"],
    },
    {
      id: "crab",
      category: "seasonal",
      catLabel: "Seasonal",
      image: "assets/dish-crab.jpg",
      en: "Crab Roe Little Fold",
      rail: "Crab Roe",
      cn: "蟹粉小笼褶",
      desc: "Delicate crab roe and broth that warms the palm before it warms the table.",
      price: "$22",
      tags: ["shellfish", "seasonal"],
    },
    {
      id: "chestnut",
      category: "seasonal",
      catLabel: "Seasonal",
      image: "assets/dish-chestnut.jpg",
      en: "Chestnut & Chicken Fold",
      rail: "Chestnut & Chicken",
      cn: "栗子鸡肉褶",
      desc: "Autumn chestnuts and tender chicken—earth and steam in one soft bite.",
      price: "$16",
      tags: ["poultry", "seasonal"],
    },
    {
      id: "mushroom",
      category: "plant",
      catLabel: "Plant",
      image: "assets/dish-mushroom.jpg",
      en: "Mushroom & Greens Fold",
      rail: "Mushroom & Greens",
      cn: "香菇青菜褶",
      desc: "Wood-ear depth and garden greens, folded without hurry.",
      price: "$13",
      popular: true,
      tags: ["plant"],
    },
    {
      id: "tofu",
      category: "plant",
      catLabel: "Plant",
      image: "assets/dish-tofu.jpg",
      en: "Tofu & Daikon Fold",
      rail: "Tofu & Daikon",
      cn: "豆腐萝卜褶",
      desc: "Silken tofu and mild daikon—clean, quiet, and wholly itself.",
      price: "$12",
      tags: ["plant"],
    },
  ],

  STORY_CHAPTERS: [
    {
      label: "One · Village",
      short: "Village",
      body:
        "Lin Meihua grew up outside Harbin—third-generation dumpling maker. At the stove she learned more than ratios: her grandmother’s unhurried rhythm of the pleat.",
      image: "assets/story-village.jpg",
      position: "42% 48%",
    },
    {
      label: "Two · City",
      short: "City",
      body:
        "San Francisco’s fog met her flour. A quiet shop in the city, where the same hands fold for strangers as they once folded for family.",
      image: "assets/story-city.jpg",
      position: "42% 40%",
    },
    {
      label: "Three · Fold",
      short: "Fold",
      body:
        "Each dumpling keeps a small imperfection—the mark of the hand that made it. That is the fold. That is 褶.",
      image: "assets/story-fold.jpg",
      position: "50% 42%",
    },
  ],

  /** WebP + cache-bust; thumb for dish rail */
  asset(path, { thumb = false } = {}) {
    let clean = (path.startsWith("assets/") ? path : `assets/${path}`).split("?")[0];
    if (thumb && /dish-[^/]+\.jpe?g$/i.test(clean)) {
      clean = clean.replace(/\.jpe?g$/i, "-thumb.webp");
    } else if (/\.jpe?g$/i.test(clean)) {
      clean = clean.replace(/\.jpe?g$/i, ".webp");
    }
    return `${clean}?v=${this.ASSET_V}`;
  },
};
