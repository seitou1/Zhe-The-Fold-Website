#!/usr/bin/env node
/**
 * Launch readiness gate for Zhe · The Fold
 * Usage: node scripts/check-launch.mjs
 * Exit 0 = no hard blockers for deploy craft
 * Exit 1 = must fix before indexing / public launch
 *
 * data.js is the single source of truth for NAP / hours / menu / story / booking.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const errors = [];
const warns = [];
const ok = [];

const dataSrc = read("data.js");
const html = read("index.html");
const css = read("styles.css");
const script = read("script.js");

// Live assignment only (ignore comments like "INDEXABLE: true")
const indexMatches = [
  ...dataSrc.matchAll(/^\s*INDEXABLE:\s*(true|false)\s*,/gm),
];
const indexable =
  indexMatches.length > 0
    ? indexMatches[indexMatches.length - 1][1] === "true"
    : false;
const telephone = /telephone:\s*"([^"]+)"/.exec(dataSrc)?.[1] || "";
const street = /streetAddress:\s*"([^"]+)"/.exec(dataSrc)?.[1] || "";
const zip = /postalCode:\s*"([^"]+)"/.exec(dataSrc)?.[1] || "";
const mapsQuery = /mapsQuery:\s*"([^"]+)"/.exec(dataSrc)?.[1] || "";
const assetV = /ASSET_V:\s*"([^"]+)"/.exec(dataSrc)?.[1] || "";
const bookingUrlMatch = /booking:\s*\{[\s\S]*?^\s*url:\s*(null|"[^"]*")/m.exec(
  dataSrc
);
const bookingUrl = bookingUrlMatch?.[1] || "null";

const isPlaceholder =
  /555[-.]?0\d{2}/.test(telephone) ||
  /Sample\s+Street/i.test(street) ||
  zip === "94100" ||
  /Sample/i.test(mapsQuery);

if (isPlaceholder) {
  if (indexable) {
    errors.push(
      "INDEXABLE is true while NAP looks like a placeholder (Sample/555/94100). Replace NAP or set INDEXABLE false."
    );
  } else {
    warns.push(
      "NAP still placeholder (Sample Street / 555 / 94100) — expected pre-launch; blocks real indexing"
    );
  }
} else {
  ok.push("NAP does not match known placeholder patterns");
}

if (!indexable) {
  warns.push("INDEXABLE is false (expected pre-launch)");
} else if (!isPlaceholder) {
  ok.push("INDEXABLE true with non-placeholder NAP");
}

if (/content="noindex/.test(html) && indexable && !isPlaceholder) {
  warns.push(
    'index.html meta robots still says noindex — flip to "index, follow" for crawlers that skip JS'
  );
}

// SSOT: no retired chrome, no dead dual data
if (/id="mobileDock"|id="mobileNav"|id="navToggle"/.test(html)) {
  errors.push("Retired mobile dock/nav/toggle still in index.html — remove");
}
if (/\.mobile-dock\s*\{|\.mobile-nav\s*\{|\.nav-toggle\s*\{/.test(css)) {
  warns.push(
    "Dead mobile-dock/mobile-nav/nav-toggle rules still in styles.css"
  );
}
if (/REVIEWS\s*:/.test(dataSrc)) {
  warns.push("REVIEWS still in data.js but Visit no longer renders reviews");
}
if (/https:\/\/resy\.com["']/.test(html) && bookingUrl === "null") {
  errors.push(
    'index.html hardcodes resy.com while booking.url is null — use mailto shell or set booking.url'
  );
}

// Dual NAP: HTML must not hardcode address/phone shells (hydrate from data.js)
const htmlHasSampleStreet = /Sample\s+Street/i.test(html);
const htmlHas555Tel = /tel:\+?1?555|tel:\+1415555/i.test(html);
if (htmlHasSampleStreet) {
  const msg =
    "Sample Street appears in index.html — dual NAP risk; keep #visitAddress empty (data.js only)";
  if (indexable && !isPlaceholder) errors.push(msg);
  else warns.push(msg);
} else {
  ok.push("No Sample Street hardcode in index.html");
}
// Placeholder tel in HTML is OK only as data-zhe-tel seed matching fiction; flag if live NAP
if (htmlHas555Tel && !isPlaceholder) {
  errors.push(
    "HTML still has 555 tel: while data.js NAP looks real — update or empty tel shells"
  );
}

// Script load order: data.js before script.js
const dataIdx = html.search(/src=["']data\.js[^"']*["']/);
const scriptIdx = html.search(/src=["']script\.js[^"']*["']/);
if (dataIdx === -1 || scriptIdx === -1) {
  errors.push("index.html must load data.js and script.js");
} else if (dataIdx > scriptIdx) {
  errors.push("index.html must load data.js before script.js");
} else {
  ok.push("data.js loads before script.js");
}

// target=_blank without noopener (static HTML; tags may be multiline)
const blankRe = /<a\b[\s\S]*?>/gi;
let blankMatch;
let blankBad = 0;
while ((blankMatch = blankRe.exec(html)) !== null) {
  const tag = blankMatch[0];
  if (tag.length > 2000) continue; // safety
  if (!/\btarget\s*=\s*["']_blank["']/i.test(tag)) continue;
  if (!/\brel\s*=\s*["'][^"']*noopener/i.test(tag)) blankBad += 1;
}
if (blankBad > 0) {
  errors.push(
    `${blankBad} <a target="_blank"> without rel containing noopener — add rel="noopener noreferrer"`
  );
} else {
  ok.push("All target=_blank anchors include noopener");
}

// Hydrators present
if (!/renderVisitDom|renderMenuDom|renderStoryDom/.test(script)) {
  errors.push("script.js missing render*Dom hydrators from data.js");
} else {
  ok.push("script.js hydrates menu/story/visit from data.js");
}

// Maps/tel/reserve hooks exist for conversion
for (const [hook, label] of [
  ["data-zhe-maps", "Directions"],
  ["data-zhe-tel", "Call"],
  ["data-zhe-reserve", "Reserve"],
]) {
  if (!html.includes(hook)) {
    warns.push(`Missing ${hook} in HTML (${label} conversion hook)`);
  }
}

if (assetV) {
  const staleHtml = [...html.matchAll(/\?v=(\d+)/g)]
    .map((m) => m[1])
    .filter((v) => v !== assetV);
  const staleCss = [...css.matchAll(/\?v=(\d+)/g)]
    .map((m) => m[1])
    .filter((v) => v !== assetV);
  if (staleHtml.length || staleCss.length) {
    warns.push(
      `Cache-bust mismatch: ASSET_V=${assetV} but found other ?v= in HTML/CSS (bump all together)`
    );
  } else {
    ok.push(`ASSET_V ${assetV} matches HTML/CSS cache-bust params`);
  }
}

const required = [
  "assets/hero-dumplings.webp",
  "assets/storefront.webp",
  "assets/fonts/fonts.css",
  "robots.txt",
  "sitemap.xml",
  "404.html",
  "netlify.toml",
  "BUILD_PLAYBOOK.md",
  "QA_SCORECARD.md",
  "PROJECT_BRIEF.md",
  "OPS_RUNBOOK.md",
  "OWNER_HANDOFF.md",
  "ASSETS.md",
  "LEGAL_PRIVACY.md",
  "MULTI_AGENT.md",
  "README.md",
  "PROGRESS.md",
  "AGENTS.md",
  "PRODUCT.md",
  "CASE_STUDY.md",
];
for (const f of required) {
  if (existsSync(join(root, f))) ok.push(`exists ${f}`);
  else errors.push(`missing ${f}`);
}

if (bookingUrl === "null") {
  warns.push(
    "No booking.url yet — Reserve uses mailto until Resy/OpenTable venue URL is set"
  );
} else {
  ok.push(`Booking url configured: ${bookingUrl}`);
}

console.log("═══ Zhe · The Fold — launch check ═══\n");
for (const m of ok) console.log("  ✓", m);
for (const m of warns) console.log("  ⚠", m);
for (const m of errors) console.log("  ✗", m);
console.log("");

if (errors.length) {
  console.log(
    `Result: BLOCKED (${errors.length} error(s), ${warns.length} warning(s))`
  );
  console.log("See GO_LIVE.md for the full checklist.\n");
  process.exit(1);
}
console.log(
  `Result: PASS with ${warns.length} warning(s). Safe to proceed when ops tasks are done.\n`
);
process.exit(0);
