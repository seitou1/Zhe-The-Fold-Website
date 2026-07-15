# Legal & privacy checklist (essential, not legal advice)

**This is not a lawyer.** It’s a **process checklist** so we don’t forget categories that marketing sites often skip. For production, confirm with counsel for your jurisdiction.

**Research note:** Privacy policy / cookie banners matter mainly when you collect personal data or use non-essential trackers (analytics, ads, marketing pixels). A pure static brochure with mailto/tel/maps links needs less. Adding Plausible/GA4 or forms changes the picture.

---

## 1. When you likely need more than “nothing”

| You add… | Consider |
|----------|----------|
| Analytics (GA4, etc.) | Privacy policy; cookie/consent if required in your markets |
| Marketing pixels | Consent + policy |
| Newsletter / contact forms that store data | Privacy policy; form processor DPA |
| EU/UK/CA visitors as a material audience | Local privacy rules; may need consent UX |
| User accounts / checkout | Full product legal stack (out of this kit’s default) |

**Zhe default:** no required third-party JS at first paint. Keep it that way until intentional.

---

## 2. Minimum content pages (live restaurant)

| Page / block | Why |
|--------------|-----|
| Accurate NAP + hours | Consumer protection / trust; match GBP |
| Contact path | Phone/email/Reserve that works |
| Privacy policy | If analytics or forms |
| (Optional) Accessibility statement | Good practice; not always required |

---

## 3. Analytics SOP (if enabled)

1. Decide tool (privacy-friendly Plausible vs GA4).  
2. Add privacy policy link in footer.  
3. Set `ANALYTICS.debug: false` in production.  
4. Prefer deferred load; never block LCP.  
5. Document events: `click_call`, `click_directions`, `click_reserve`.  
6. Honesty: fiction mode can log to console only.  

---

## 4. Fiction / demo honesty

| Do | Don’t |
|----|--------|
| `noindex` while Sample Street / 555 | Present fiction as a bookable real restaurant in ads |
| Label concept house if showing publicly | Collect emails for a fake venue without disclosure |

---

## 5. Accessibility (legal-adjacent)

Ship with `QA_SCORECARD` H ≥ 4: keyboard, focus, contrast on real photos, reduced-motion.  
Full WCAG audit: budget separately for live public venues if risk-sensitive.

---

## 6. Pre-live legal checklist (owner + dev)

- [ ] NAP matches legal business registration / GBP (owner)  
- [ ] Booking provider terms accepted (Resy/OT)  
- [ ] Photo rights cleared (`ASSETS.md`)  
- [ ] Privacy policy if analytics/forms  
- [ ] Domain WHOIS / contact email monitored  
- [ ] No scraped competitor content  

---

## 7. What this kit does **not** replace

- Trademark clearance for brand name  
- Alcohol / health claims compliance  
- Employment / hiring pages  
- Full GDPR DPIA processes  

Escalate to professionals when real money, real guests, and real data are involved.
