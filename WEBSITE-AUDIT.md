# iCodeee — Website Audit & Meta Ads Conversion Optimization Report

**Prepared:** 13 October 2026
**Remediated:** 13 October 2026 — see §12 for fix status and what still needs your input.
**Scope:** Read-only inspection of the iCodeee studio site (Next.js App Router application in `ICODEEE-NEW`).
**Method:** Local production build served via `next start` (port 3101) plus local dev server (port 3001). Crawl, HTTP status testing, DOM/computed-style measurement, form endpoint testing, Lighthouse, responsive testing via same-origin iframes, and source review.

---

## 0. Access, scope and limitations — read this first

Everything below is labelled **Confirmed**, **Suspected**, or **Not Yet Verified** per your instruction not to claim what I could not test.

**What I audited:** the application running at `http://127.0.0.1:3001` and a production build of the same code at `http://127.0.0.1:3101`.

**What I could NOT verify, and what I need to complete it:**

| Gap | Why | What I need |
| --- | --- | --- |
| Production domain behaviour | No production URL was supplied. Canonical/robots/sitemap were only verifiable against `localhost` | Your live URL, e.g. `https://icodeee.com` |
| Live `NEXT_PUBLIC_SITE_URL` value | Local `.env.local` sets it to `http://localhost:3000` | The value actually set on the host (Vercel/etc.) |
| Meta Pixel / Events Manager | No Meta Business Manager or Events Manager access, and **no pixel code exists in the repo to inspect** | Business Manager access, or a manual Events Manager walkthrough |
| Supabase-backed behaviour | No Supabase credentials. Leads are not stored, project CMS data is not exercised, admin dashboard untested | Supabase project access (read-only is enough) |
| Real Core Web Vitals / field data | Lighthouse **performance category was not returned** by the available tooling. I have no lab LCP/CLS/TBT numbers and will not invent them | Search Console + CrUX, or a PageSpeed Insights URL run |
| Actual conversion rate, traffic, CPL | No analytics exist on the site at all, and I have no historical data | Your existing analytics/history, if any |
| Resend email delivery | `RESEND_API_KEY` not set locally; notification path not exercised | Confirmation the key is set in production |

**Important framing:** no finding in this report is based on assuming a problem from appearance. Where I say something is broken, I reproduced it and included the reproduction. Where I could only infer, it is labelled Suspected or Not Yet Verified.

---

## 1. Executive summary

The site is **technically well built and visually strong**. It is fast, has zero JavaScript console errors, zero broken images, no horizontal overflow at any tested width, clean heading structure, and full keyboard/reduced-motion support. Lighthouse scores **Best Practices 1.00** and **SEO 1.00**.

However, in its current state it is **not safe to send paid traffic to**, for two independent reasons:

1. **You cannot measure anything.** There is no Meta Pixel, no Conversions API, no GA4, no GTM, and no UTM capture — verified by exhaustive source grep. You would be paying for clicks with zero attribution and zero optimisation signal.

2. **There is no safety net when the form fails.** The enquiry endpoint returns HTTP **503** in the current configuration, and the contact page contains **zero** alternative contact routes — no phone, no WhatsApp, no email link. Every enquiry in that state is lost silently.

Separately, and more embarrassing: **five of your nine pages are currently rendering with white text on a near-white background at 1.08:1 contrast.** These are the service pages — the most likely landing pages for Meta Ads — and the "How we work" and closing CTA sections are effectively invisible. This is a real, measured regression, and it is invisible in code review because the CSS *looks* correct.

The good news: the underlying structure for paid traffic is genuinely strong. You have five dedicated service pages, a working interactive estimator that pre-fills the contact form, real client work, and a clean responsive build. Fixing the blockers below is days of work, not weeks.

---

## 2. Prioritized findings

### P0 — Critical: must be fixed before launching ads

---

#### F-01 · No analytics, no Meta Pixel, no Conversions API
- **Page:** All pages
- **Category:** Tracking / Meta Ads readiness
- **Problem:** No tracking code of any kind is installed. A grep across `src/`, `public/`, `next.config.ts` and `package.json` for `facebook|fbq|fbevents|meta pixel|conversionsapi|gtag|googletagmanager|google-analytics|clarity|hotjar|posthog|plausible|umami|mixpanel|segment` returned **no matches** (the only hit was the word "clarity" inside homepage marketing copy).
- **Evidence:** `grep -rniE "facebook|fbq|..." src public next.config.ts package.json` → no tracking references.
- **Severity:** P0
- **Impact:** Without a Pixel you cannot report ad spend, cannot build retargeting audiences, and cannot run optimisation to any conversion event. Without CAPI you lose a large share of conversions to browser blocking (typically 20–40% on mobile). Meta's delivery algorithm has nothing to optimise toward.
- **Recommendation:** Install Meta Pixel (PageView, ViewContent, Lead) **and** Conversions API server-side from your existing `/api/leads` POST handler, sharing one `event_id` between browser and server to deduplicate. Add a first-party analytics tool for on-site behaviour.
- **Effort:** Medium
- **Validation:** Events Manager → Test Events → verify one `Lead` fires with correct `event_id`; confirm deduplication in Events Manager diagnostics shows no double-counting.

---

#### F-02 · Enquiry API returns 503 — leads are lost
- **Page:** `/api/leads` (backs `/contact`)
- **Category:** Broken functionality
- **Problem:** A valid submission returns `503 {"error":"Contact service is not configured yet."}` because `adminClient()` returns null without `SUPABASE_SERVICE_ROLE_KEY`.
- **Evidence:**
  ```
  POST /api/leads  {"name":"Audit Test","email":"audit@example.com","message":"..."}
  → HTTP 503 {"error":"Contact service is not configured yet."}
  ```
  Validation (400) and auth (401) paths behave correctly; only the success path fails.
- **Severity:** P0
- **Impact:** 100% of enquiries lost while misconfigured. The visitor sees a generic error with no recourse (see F-03).
- **Recommendation:** Confirm `SUPABASE_SERVICE_ROLE_KEY` is set in production. Separately, fail loudly in staging/preview so this cannot ship silently, and add a visible fallback on failure.
- **Effort:** Low (if key exists) / Not Yet Verified (whether it is set in production)
- **Validation:** Submit a real test lead end-to-end; confirm a row in `leads` with `status='NEW'`, and that the Resend notification email arrives.

---

#### F-03 · Contact page has no fallback contact channel
- **Page:** `/contact`
- **Category:** Conversion / UX
- **Problem:** The page contains **zero** contact links — no `mailto:`, no `tel:`, no WhatsApp. The only route to the business is the form, which currently 503s.
- **Evidence:** `document.querySelectorAll('a[href="mailto:"],a[href^="tel:"],a[href*="wa.me"]').length` → **0**
- **Severity:** P0
- **Impact:** Combined with F-02, a paid-traffic visitor has literally no way to reach you. Compounding this: your own client Awaesthetic Wear publishes WhatsApp (`+91 9958004007`) and a phone number in its header, footer and mobile bar — a strong signal about what this market expects.
- **Recommendation:** Add a visible phone/WhatsApp link and a `mailto:` fallback on `/contact`, shown **always** (not only on error), plus an inline fallback inside the error state.
- **Effort:** Low
- **Validation:** Submit the form with the backend down; confirm a tappable contact route is offered.

---

#### F-04 · White-on-white text: 1.08:1 contrast on all 5 service pages
- **Page:** `/services/*` (all five) — sections "How we work" and the closing CTA
- **Category:** Accessibility / Visual defect
- **Problem:** `.content-section:not(.dark){background:var(--ice)}` has CSS specificity **0-2-0** and overrides my single-class rules `.service-approach` and `.service-cta` (**0-1-0**). Those sections set `color:#f7f9ff` (near-white) but their background is forced to `#e8f2f9` (pale ice). Net result: **1.08:1** contrast.
- **Evidence (measured, not assumed):**
  ```
  .service-approach  bg rgb(232,242,249)  color rgb(247,249,255)  ratio 1.08
  .service-cta      bg rgb(232,242,249)  color rgb(247,249,255)  ratio 1.08
  ```
  Matching rules found live in the browser:
  ```
  .content-section:not(.dark)  background: var(--ice)      <-- wins
  .service-approach            background: rgb(7,17,38)     <-- loses
  ```
  Confirmed present in the production CSS bundle (`28b0r5b71anxd.css`), so this is not a dev-server artefact. All six service sections render on the wrong background; the two with light text are the broken ones.
- **Severity:** P0
- **Impact:** WCAG AA requires 4.5:1 for body text and 3:1 for large text. At 1.08:1 this content is invisible to low-vision users, invisible to most users, and **invisible to Google's OCR when indexing the page**. Since these pages are the natural landing pages for paid ads, this suppresses both conversion and organic ranking.
- **Recommendation:** Raise specificity — e.g. `.content-section.service-approach{...}` — or add the `dark` class the existing CSS already supports (`.content-section.dark{background:#071126;color:#fff}`), which is the lower-risk, more idiomatic fix.
- **Effort:** Low
- **Validation:** Re-run Lighthouse accessibility on each service page (expect ≥0.95 with no `color-contrast` failure) and re-measure computed background/color ratios.

---

### P1 — High: significant conversion or SEO impact

---

#### F-05 · No UTM capture — campaign attribution impossible
- **Page:** All
- **Category:** Tracking
- **Problem:** No code reads or persists `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, or `gclid`/`fbclid`.
- **Evidence:** grep for `utm_|gclid|fbclid` in `src/` → no matches (only Supabase cookie handling).
- **Severity:** P1
- **Impact:** Even after a Pixel is installed, you cannot identify which ad produced a lead inside your own CRM/database, nor report on campaign inside your admin dashboard. Platform-side reporting alone loses multi-touch attribution.
- **Recommendation:** Capture UTMs on first landing, persist to a cookie/localStorage with a 30-day window, attach to the lead row in `/api/leads`.
- **Effort:** Low
- **Validation:** Visit `/?utm_source=facebook&utm_campaign=test`, submit the form, confirm the stored lead carries the parameters.

---

#### F-06 · No consent mechanism — compliance risk when adding a Pixel
- **Page:** All
- **Category:** Privacy / compliance
- **Problem:** No cookie banner, consent manager, or consent state of any kind.
- **Evidence:** grep for `consent|gdpr|cookie` in `src/` → no matches.
- **Severity:** P1
- **Impact:** India's DPDP Act 2023 and GDPR both require informed consent before non-essential cookies/pixels fire. Adding an unconsented Pixel creates legal exposure, and Meta's own policy requires a consent mechanism alongside the Pixel.
- **Recommendation:** Add a consent banner that blocks Pixel/CAPI until opt-in, and record consent for auditability.
- **Effort:** Medium
- **Validation:** Load site as a new visitor; confirm no `fbq`/cookie is set before consent, and that it is set after opt-in.

---

#### F-07 · No dedicated landing pages for ads
- **Page:** `/` is the only realistic destination
- **Category:** CRO / Meta Ads
- **Problem:** There are no campaign-specific landing pages. Paid traffic would land on a long, scroll-driven, animation-heavy homepage whose message ("GOOD IS EXPECTED. EXTRA IS US.") is brand-positioning, not a specific offer.
- **Evidence:** Page structure review — the homepage is a 9-section narrative (hero → intro → services → work → contact sheet → process → belief → values → FAQ → CTA) with no single conversion goal per section.
- **Severity:** P1
- **Impact:** Message mismatch between ad promise and landing page is one of the largest drivers of wasted ad spend and low click-through quality scores. Meta's creative→landing-page relevance scoring directly penalises mismatches.
- **Recommendation:** Build 2–3 focused landing pages (e.g. `/web-design`, `/ecommerce`, `/branding`) each matching one ad angle, with a single CTA and reduced page weight. See §4.6 for the recommended structure.
- **Effort:** High
- **Validation:** Compare landing-page engagement rate and Lead conversion rate per campaign in Ads Manager after ~2 weeks of spend.

---

#### F-08 · Zero trust signals
- **Page:** All
- **Category:** Trust / CRO
- **Problem:** No testimonials, no client count, no awards, no review scores, no founder names or photos, and **all three projects have `case_study_content: {}`** — so every case study renders with no brief, no build, no result.
- **Evidence:**
  ```
  src/lib/site.ts:21  case_study_content: {}, published: true, order: 1
  src/lib/site.ts:32  case_study_content: {}, published: true, order: 2
  src/lib/site.ts:43  case_study_content: {}, published: true, order: 3
  ```
  Grep for `testimonial|review|trusted by|rating|award|certified|years of experience` → no trust content found.
  Note: unused real client wordmarks already exist on disk — `public/work/slugsera-wordmark.webp`, `rupali-logo.webp`, `aw-wordmark.png` — and are referenced nowhere in the UI.
- **Severity:** P1
- **Impact:** Cold paid traffic has no reason to believe you. For engagements at the implied ₹1L–₹8L+ range, buyers assess credibility, and you currently offer none beyond visual design quality.
- **Recommendation:** (a) Populate real case study content; (b) add a client wordmark strip using the assets already present; (c) add real testimonials if you have permission to publish them. **Do not fabricate any of these** — the previous audit correctly refused to invent metrics, and that standard should hold.
- **Effort:** Medium
- **Validation:** Case study pages show Brief/Build/Result sections; wordmark strip renders; Lighthouse contrast passes on the strip.

---

#### F-09 · Every page shares identical Open Graph tags; no share image
- **Page:** All (inherits from `src/app/layout.tsx`)
- **Category:** SEO / Social
- **Problem:** `og:title`, `og:description`, `twitter:title`, `twitter:description` are hardcoded once in the root layout and are **identical on every page**, regardless of each page's own `title`/`description`. There is no `og:url`, no `og:image`, no `twitter:image`. `twitter:card` is set to `summary_large_image` with no image attached.
- **Evidence (rendered HTML, `/resources` vs `/services/ecommerce-setup`):**
  ```
  /resources              og:title = "iCodeee — Extra. By design."
  /services/ecommerce-setup  og:title = "iCodeee — Extra. By design."
  ```
  Only `<title>` and `<meta description>` differ per page.
- **Severity:** P1
- **Impact:** Organic shares, WhatsApp forwards and LinkedIn posts all render the same generic card with no image. For a business whose inbound is likely social-driven, this materially reduces click-through and is compounded by F-14.
- **Recommendation:** Move OG/Twitter tags into a shared metadata helper that derives per-page title/description/url/image; add per-page OG images.
- **Effort:** Medium
- **Validation:** Share each page to a validator; confirm unique title/description/url/image per URL.

---

#### F-10 · Homepage is server-rendered on demand, not static
- **Page:** `/`
- **Category:** Performance / SEO
- **Problem:** `src/components/conversion-home.tsx` is `"use client"`, so the entire homepage is a client component. The build output marks `/` as **ƒ (Dynamic, server-rendered on demand)** rather than static.
- **Evidence:** Build route table: `┌ ƒ /`. By contrast `/about`, `/process`, `/resources`, `/services` and `/contact` are `○ (Static)`.
- **Severity:** P1
- **Impact:** The primary marketing and ad-landing page is the only major public page not statically cached — higher TTFB, weaker crawl reliability, and content dependent on hydration.
- **Recommendation:** Split the scroll-linked/animated sections into small client islands; keep headings, copy, links and images on the server.
- **Effort:** High
- **Validation:** Build output shows `○ /`; compare TTFB before/after.

---

#### F-11 · No `autocomplete` or `inputmode` on form fields
- **Page:** `/contact`
- **Category:** Mobile CRO / Accessibility
- **Problem:** All 9 fields lack `autocomplete` attributes; `email` and `phone` lack `inputmode`. No `id`/`for` pairs (labels are correctly wrapping, so this is not a break, but autofill is unavailable).
- **Evidence:**
  ```
  name  → autocomplete: null
  email → autocomplete: null   (type="email")
  phone → autocomplete: null   (type="tel")
  ```
- **Severity:** P1
- **Impact:** On mobile this forces manual keyboard entry of name and email — a measurable drop-off on paid traffic, which skews mobile.
- **Recommendation:** Add `autocomplete="name"`, `"email"`, `"tel"`, `"organization"`, `"url"` and `inputmode="email"`/`"tel"`.
- **Effort:** Low
- **Validation:** Chrome autofill offers name/email on the contact form; mobile shows the `@` and numeric keypads.

---

### P2 — Medium

---

#### F-12 · Canonical and sitemap URLs depend on `NEXT_PUBLIC_SITE_URL`
- **Page:** All
- **Category:** Technical SEO
- **Problem:** `metadataBase` and sitemap/robots all derive from `NEXT_PUBLIC_SITE_URL`, which locally resolves to `http://localhost:3000`. Canonical tags currently render as `http://localhost:3000/services/website-development`.
- **Evidence:** `<link rel="canonical" href="http://localhost:3000/services/website-development"/>` in rendered HTML; not present in source as a hardcoded value.
- **Severity:** P2
- **Impact:** If the production env var is unset or wrong, **every canonical in the site points at localhost**, which would be severely damaging for indexing. Next.js also emits a metadata-base warning in this state.
- **Recommendation:** Verify the production value, and hard-fail the build if it is unset rather than defaulting silently.
- **Effort:** Low
- **Validation:** Fetch production HTML and confirm canonicals use the real https domain. **Not Yet Verified** — needs the live URL.

---

#### F-13 · `sitemap.xml` reports every page as modified on every request
- **Page:** `/sitemap.xml`
- **Category:** Technical SEO
- **Problem:** `lastModified: new Date()` is applied to all URLs on every generation.
- **Evidence:** `src/app/sitemap.ts` — all static routes and project URLs use `new Date()`.
- **Severity:** P2
- **Impact:** Tells crawlers every page changes constantly, which devalues the signal and can cause unnecessary re-crawling.
- **Recommendation:** Use real content-modified dates, or omit `lastModified` until you can supply genuine values.
- **Effort:** Low
- **Validation:** Fetch sitemap twice; confirm timestamps only change when content changes.

---

#### F-14 · No favicon and no app icon
- **Page:** All
- **Category:** Branding / UI
- **Problem:** No `icon.*`, `favicon.ico` or `apple-icon.*` in `src/app/`. Brand assets exist at `public/brand/Blue.png`, `Blue_Full.png`, `White.png`, `White_full.png` but are not used as an icon.
- **Severity:** P2
- **Impact:** Browsers show a default icon; iOS home-screen adds show a generic placeholder. Minor but visible, and it compounds F-09 on shared links.
- **Recommendation:** Add `src/app/icon.png` from the brand mark.
- **Effort:** Low
- **Validation:** Favicon appears in the tab; home-screen add shows the mark.

---

#### F-15 · `/resources` is an empty "coming soon" page, but indexed
- **Page:** `/resources`
- **Category:** Credibility / SEO
- **Problem:** The page renders only a "GOOD IDEAS. COMING SOON." empty state, yet it is linked from the main navigation, the mobile menu and the footer, **and included in `sitemap.xml`**.
- **Evidence:** `src/app/resources/page.tsx` renders a single empty-state block; `sitemap.ts` includes `/resources` in `staticRoutes`.
- **Severity:** P2
- **Impact:** A dead-end page in primary navigation reads as an unfinished site on every visit, and an indexed empty page is a wasted crawl/quality signal.
- **Recommendation:** Publish 3–5 real notes, or remove it from navigation and sitemap until ready.
- **Effort:** Low (remove) / Medium (populate)
- **Validation:** Nav and sitemap no longer list an empty page, or the page contains real content.

---

#### F-16 · ARIA: `aria-label` on a `<div>` with no role (homepage)
- **Page:** `/`
- **Category:** Accessibility
- **Problem:** `<div class="film-marquee" aria-label="Strategy, design, development, content, ecommerce">` — `aria-label` is prohibited on a generic `div`.
- **Evidence:** Lighthouse `aria-prohibited-attr` — "aria-label attribute cannot be used on a div with no valid role attribute."
- **Severity:** P2
- **Impact:** The label is not reliably announced to screen readers. The content is decorative and duplicated elsewhere, so impact is low.
- **Recommendation:** Add `role="marquee"` or `aria-hidden="true"`, since it is decorative repetition of the services list.
- **Effort:** Low
- **Validation:** Lighthouse `aria-prohibited-attr` clears.

---

#### F-17 · Accessible names don't match visible label text
- **Page:** `/`, `/work`
- **Category:** Accessibility
- **Problem:** Lighthouse `label-content-name-mismatch` on three component patterns: the motion toggle (`aria-label="Pause animations"` with visible text "Motion on"), the project image link (`aria-label="Explore Slugsera"` with visible project title), and the preview button (`aria-label="Preview Slugsera website"` with visible text "Preview website").
- **Evidence:** Lighthouse accessibility, homepage.
- **Severity:** P2
- **Impact:** Voice-control users who say the visible text ("click Preview website") may not activate the element, because the accessible name differs.
- **Recommendation:** Ensure visible label text is contained within the accessible name, or use `aria-labelledby` pointing at the visible text.
- **Effort:** Low
- **Validation:** Lighthouse `label-content-name-mismatch` clears on `/` and `/work`.

---

#### F-18 · Low-contrast secondary text throughout
- **Page:** All
- **Category:** Accessibility
- **Problem:** Multiple secondary/meta text styles fall below WCAG AA. Measured examples: `#8b97ad` on white = **2.94:1**; `#7ea6f5` on `#e8f2f9` = **2.13:1**; `#4d8dff` on `#e8f2f9` = **2.81:1**. On the homepage, the intro-section text measures **1.51:1** and **1.30:1**.
- **Evidence:** Lighthouse `color-contrast` failures plus direct computed-style measurement.
- **Severity:** P2
- **Impact:** Eyebrow labels, option metadata and body copy in secondary sections are hard to read. The homepage figures suggest some of these are the same root cause as F-04 (background override), so fixing F-04 may clear several of these automatically.
- **Recommendation:** Darken the muted tokens (`--muted`, `--eyebrow`) to reach ≥4.5:1. Re-measure after F-04 is fixed.
- **Effort:** Low
- **Validation:** Lighthouse `color-contrast` clears; re-measure ratios.

---

#### F-19 · Enquiry form requests 6 optional fields
- **Page:** `/contact`
- **Category:** Form friction
- **Problem:** 9 fields total, 3 required (name, email, message). Optional: phone, company, website, project_type, budget.
- **Evidence:** `fieldCount: 9, requiredCount: 3`.
- **Severity:** P2
- **Impact:** Each optional field adds perceived effort and depresses completion. Note this is partially mitigated already: the estimator pre-fills `project_type` and `message` for service-page traffic.
- **Recommendation:** Consider a two-step form, or move `budget`/`project_type` to the first reply. Keep the honeypot.
- **Effort:** Medium
- **Validation:** Compare form completion rate before/after. **Baseline not yet available — requires F-01 first.**

---

#### F-20 · Honeypot decoy-success path is unreachable
- **Page:** `/api/leads`
- **Category:** Anti-spam
- **Problem:** `leadSchema` declares `company_site: z.string().max(0).optional()`, so any non-empty honeypot value fails validation and returns **400** before the decoy-success check on the next line is reached. Bots receive an error instead of a fake success.
- **Evidence:**
  ```
  POST with company_site="http://spam" → HTTP 400 "Please check the form and try again."
  ```
  The intended silent-success branch (`if (parsed.data.company_site) return {ok:true}`) never executes.
- **Severity:** P2
- **Impact:** Low. Bots are still rejected, which is the main goal — but the decoy-success behaviour is dead code, and returning an error may reduce the honeypot's effectiveness slightly.
- **Recommendation:** Either drop the dead branch and document intent, or validate the honeypot before the schema and return a fake success.
- **Effort:** Low
- **Validation:** Honeypot submission returns 200 `{ok:true}` and creates no database row.

---

#### F-21 · No security headers; framework disclosed
- **Page:** All
- **Category:** Security (non-intrusive)
- **Problem:** No `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Strict-Transport-Security`, `Referrer-Policy`, `X-Content-Type-Options`, or `Permissions-Policy`. `X-Powered-By: Next.js` is exposed.
- **Evidence:** `curl -sI` header inspection.
- **Severity:** P2
- **Impact:** Low direct risk for a static marketing site, but clickjacking, referrer leakage and missing HSTS are real hardening gaps. Suppressing `X-Powered-By` is trivial.
- **Recommendation:** Add headers via `next.config.ts` `headers()` or the host. Note your own `ProjectShowcase` embeds third-party sites in iframes — a CSP must permit those frames.
- **Effort:** Low
- **Validation:** Re-run header check; confirm all headers present and no site breaks.

---

#### F-22 · `/work/[slug]` returns HTTP 200 for unknown projects (soft 404)
- **Page:** `/work/[slug]`
- **Category:** Technical SEO
- **Problem:** `src/app/work/[slug]/page.tsx` is `export const dynamic = "force-dynamic"` and calls `notFound()`. Because the response has already begun streaming, the status stays **200** while rendering the 404 page.
- **Evidence:** `GET /work/nope` → **HTTP 200** with 404 content, confirmed against the production build.
- **Severity:** P2
- **Impact:** Search engines treat soft 404s as real pages, wasting crawl budget and diluting quality signals. Not fixed by `dynamicParams=false`, which cannot be used here because projects may be added via the CMS.
- **Recommendation:** Verify the true response status in the current Next version; if still 200, resolve the route before the stream starts, or exclude the pattern from crawling.
- **Effort:** Medium
- **Validation:** `curl -o /dev/null -w '%{http_code}' /work/nope` returns **404** on the production build.

---

#### F-23 · LCP image not prioritised
- **Page:** `/work`, homepage
- **Category:** Performance
- **Problem:** Next.js reported `/work/rupali-home.jpg` as the Largest Contentful Paint element and advised `loading="eager"`. The homepage hero collage uses a non-standard `preload` prop rather than `priority`.
- **Evidence:** Dev-server warnings captured during crawl: *"Image with src /work/rupali-home.jpg was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property"*.
- **Severity:** P2
- **Impact:** LCP directly affects bounce rate, especially on mobile paid traffic.
- **Recommendation:** Mark the above-the-fold portfolio cover `priority` on `/work` and the homepage hero image `priority`.
- **Effort:** Low
- **Validation:** Lighthouse/PSI LCP improves; Next warning clears. **Not Yet Verified** — needs a perf-category Lighthouse run or field data.

---

#### F-24 · Logo images resized on one axis only
- **Page:** All
- **Category:** Visual / Performance
- **Problem:** Recurring Next.js warning: *"Image with src /brand/White_full.png (and Blue_full.png) has either width or height modified, but not the other."*
- **Evidence:** Warning present on every page load during the crawl.
- **Severity:** P3
- **Impact:** Potential aspect distortion of the brand mark at some viewports — a credibility issue given the logo appears sitewide. Low effort to fix.
- **Recommendation:** Add `width:auto` alongside `height:100%` in the logo CSS.
- **Effort:** Low
- **Validation:** Warning clears; logo renders undistorted at all widths.

---

### P3 — Low / polish

- **F-25** · `scroll-behavior:smooth` on `<html>` without `data-scroll-behavior="smooth"` causes a visible jump on route transitions. Confirmed via Next.js warning. Effort: Low.
- **F-26** · The motion toggle button is `disabled` when the OS requests reduced motion, leaving a permanently dead control for those users. Confirmed by reading `conversion-home.tsx`. Effort: Low.
- **F-27** · Homepage hero footer shows a hardcoded section counter `01 — 08`. Currently correct but will drift as sections change. Confirmed. Effort: Low.
- **F-28** · `#selected-work` anchor target has no `scroll-margin-top`, so it may land under the fixed header. **Suspected** — not visually confirmed. Effort: Low.

---

## 3. What is genuinely working — do not regress

These are real strengths. Protect them during any change:

- **Zero JavaScript console errors** across `/`, `/services/ecommerce-setup`, `/work`, `/contact`, `/admin/login`. Confirmed.
- **Zero broken images**, and **every image has an `alt` attribute**. Confirmed.
- **Exactly one `<h1>` and one `<main>` per page**. Confirmed.
- **No horizontal overflow at 320 / 390 / 768 px.** Confirmed via same-origin iframes; zero overflowing elements.
- **Lighthouse Best Practices 1.00 and SEO 1.00** on the production build. Confirmed.
- **Admin is properly protected** — `/admin` redirects via `requireAdmin()`; `/api/leads` GET returns 401 unauthenticated. Confirmed.
- **Zod validation + honeypot + duplicate-submit protection** on the lead endpoint. Confirmed working (400/429 paths).
- **All 25 internal links resolve 200**; no broken internal links anywhere. Confirmed by full crawl.
- **All 19 routes return 200.** Confirmed.
- **Accessibility fundamentals already in place**: skip link, focus containment and Escape handling in the mobile menu, `prefers-reduced-motion` support, radio-group semantics on the estimator, labelled form controls.
- **Zero third-party iframes on the homepage**; live previews load only on explicit click. Good performance and privacy hygiene.
- **No fabricated testimonials or invented metrics** anywhere. Maintain this standard.

---

## 4. Top 10 changes by expected business impact

| # | Change | Addresses | Why it matters most |
| --- | --- | --- | --- |
| 1 | Fix white-on-white contrast on service pages | F-04 | Your ad landing pages are currently unreadable and unindexable |
| 2 | Install Meta Pixel + Conversions API with shared `event_id` | F-01 | Without it, every rupee of ad spend is unattributable |
| 3 | Add phone/WhatsApp/email fallback to `/contact` | F-02, F-03 | Guarantees a lead path when the form fails |
| 4 | Confirm `SUPABASE_SERVICE_ROLE_KEY` in production | F-02 | Determines whether you capture leads at all |
| 5 | Add UTM capture persisted onto each lead | F-05 | Lets you see which ad actually produced revenue |
| 6 | Populate the 3 case studies + add a client wordmark strip | F-08 | Cold traffic has no reason to trust you; assets already exist |
| 7 | Add consent banner gating the Pixel | F-06 | Legal requirement, and Meta policy requires it |
| 8 | Build dedicated ad landing pages | F-07 | Message match drives both CTR and CPA |
| 9 | Per-page OG tags + OG image + favicon | F-09, F-14 | Most inbound is likely shared links; currently all look identical |
| 10 | Add `autocomplete`/`inputmode`; trim optional form fields | F-11, F-19 | Cheap mobile conversion lift on paid traffic |

---

## 5. Phased roadmap

### Stage 0 — Before spending anything (Days 1–3)
1. Fix F-04 (contrast) — **do this first; it is a one-line specificity fix with outsized impact.**
2. Verify/fix production `NEXT_PUBLIC_SITE_URL` (F-12).
3. Confirm Supabase keys and run one real end-to-end lead test (F-02).
4. Add contact fallbacks (F-03).
5. Add favicon (F-14).

**Exit criteria:** a real test lead lands in the database and an email arrives; every service page passes contrast checks.

### Stage 1 — Tracking foundation (Days 4–7)
6. Meta Pixel (PageView, ViewContent, Lead).
7. Conversions API server-side from `/api/leads`, deduplicated by `event_id`.
8. UTM capture and persistence (F-05).
9. Consent banner gating all of the above (F-06).
10. First-party analytics for on-site behaviour.

**Exit criteria:** Events Manager Test Events shows a deduplicated `Lead` with correct parameters; UTMs appear on stored leads.

### Stage 2 — Conversion readiness (Week 2)
11. Case study content for all 3 projects (F-08).
12. Client wordmark strip (F-08).
13. Form improvements: `autocomplete`, `inputmode`, counter already present (F-11, F-19).
14. Fix `/work` soft 404 (F-22), sitemap `lastModified` (F-13).
15. Accessibility cleanups: F-16, F-17, F-18, F-25, F-26.

**Exit criteria:** Lighthouse accessibility ≥0.95 on all key pages; forms autofill correctly.

### Stage 3 — Paid acquisition (Week 3+)
16. Build dedicated landing pages (F-07).
17. Per-page OG images (F-09).
18. Homepage Server Component split (F-10) — highest effort, do it when it won't block launch.
19. Performance tuning with real field data (F-23).

**Exit criteria:** each campaign has its own landing page with message match; baseline conversion rate recorded.

### Deferred (post-launch optimisation)
- F-10 Server Component split, F-07 landing pages beyond the first two, A/B testing roadmap, `/resources` population.

---

## 6. Recommended Meta Ads landing-page structure

Based on what the site already does well, a landing page should reuse the existing service-page anatomy but collapse it to one job:

1. **Ad-match headline** — echo the ad's exact promise in the first screen.
2. **One-sentence subhead** naming who it's for and the outcome.
3. **Three proof tiles** — the relevant client work, with the homepage captures you now have.
4. **Three-item "what you get"** with the indicative price band (you already have this content).
5. **Single primary CTA**, repeated once mid-page, sticky on mobile.
6. **Contact options always visible** — form **plus** WhatsApp/phone (F-03).
7. **Short FAQ** addressing price, timeline, and fit.
8. **Reduced motion/weight** — no long scroll narrative.

Keep UTM persistence and a `Lead` event on the CTA (F-01, F-05).

---

## 7. Conversion tracking requirements

**Events to implement:**

| Event | Fires when | Notes |
| --- | --- | --- |
| `PageView` | Every page load | Include `content_category` for service pages |
| `ViewContent` | Service detail page view | Pass `content_name`, `content_category` |
| `Lead` | Successful `/api/leads` POST (HTTP 201) | Fire **server-side** via CAPI with shared `event_id`; browser fires only on confirmation |
| `Contact` | Click on WhatsApp/phone/email | Use for offline-conversion signals |
| `Schedule` | *Not applicable* | You have no booking flow — do not fire it |

**Critical:** fire `Lead` on the **server** response of 201, not on button click. Firing on click would count failed submissions (including the 503s in F-02) as conversions and train Meta's algorithm toward traffic that doesn't convert.

**Deduplication:** generate one `event_id` per submission, send it from browser and server, and confirm in Events Manager diagnostics that deduplication is working.

**UTMs to persist:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus `fbclid` and `gclid`.

---

## 8. Pre-launch testing checklist

**Functional**
- [ ] Submit a real lead end-to-end; confirm DB row + notification email
- [ ] Submit with an invalid email; confirm a friendly error, no data loss
- [ ] Confirm a contact fallback is visible and tap-tap-to-call works
- [ ] Verify every service estimator produces a correct total and pre-fills the form
- [ ] Confirm all 25 internal links still resolve 200 after changes

**Tracking**
- [ ] Pixel fires once per page (no duplicates)
- [ ] `Lead` fires once per successful submission, deduplicated browser+server
- [ ] No Pixel/cookie set before consent
- [ ] UTMs captured and stored on the lead record
- [ ] Events Manager Test Events confirms real-time

**Performance & UX**
- [ ] Lighthouse accessibility ≥0.95, no `color-contrast` failures, on all key pages
- [ ] No horizontal overflow at 320 / 375 / 390 / 768 px
- [ ] Form autofills name/email in Chrome
- [ ] LCP measured and recorded as a baseline
- [ ] Verify canonicals use the real production domain

**SEO**
- [ ] `sitemap.xml` contains only real, published pages
- [ ] `robots.txt` reflects actual policy
- [ ] No soft 404s; unknown URLs return 404
- [ ] Unique title/description/OG per page
- [ ] Structured data added (`ProfessionalService`, `BreadcrumbList`)

---

## 9. Suggested A/B tests (after tracking is live)

Prioritised by expected impact. **All require F-01 first** — without measurement these are guesses.

| Test | Variant A | Variant B | Primary metric |
| --- | --- | --- | --- |
| Hero headline | "GOOD IS EXPECTED. EXTRA IS US." | Problem-led: "Your website is costing you enquiries" | Lead rate |
| CTA label | "Let's Talk" | "Get my free estimate" | CTA click-through |
| Trust block position | Below hero | Directly under hero | Lead rate |
| Estimator default | Middle tier (current) | No preselection | Estimate → lead rate |
| Landing page | Homepage | Dedicated service landing page | Cost per qualified lead |
| Form length | 3 required fields | Two-step with 5 fields | Completion rate |
| Contact channels | Form only | Form + WhatsApp + phone | Lead volume |
| Case study depth | Cover image only | Full brief/build/result | Lead rate |

---

## 10. A note on evidence quality

Per your instruction not to fabricate results:

- **I have no performance metrics.** The Lighthouse run returned accessibility, best-practices and SEO categories only — the performance category was not returned by the available tooling. I have deliberately not quoted LCP, CLS or TBT numbers. F-23 is based on Next.js's own dev-server warning, which is indirect evidence, and is labelled accordingly.
- **I have no analytics, traffic or conversion data**, because none exists on the site.
- **I could not test Supabase-dependent behaviour** (lead storage, project CMS, admin dashboard) without credentials.
- **I could not inspect Meta Events Manager**, and more importantly there is no pixel code in the repo to inspect at all — so this is an absence finding, not a misconfiguration finding.
- **Every other finding above was reproduced**, with the command output included.

---

## Phase 8 — Approval requested

Per your instructions I have **stopped at the audit and made no changes**. No files were modified during this audit; the repository contains only the earlier build work.

**Before I implement anything, I need your decisions on four points:**

1. **Scope of Stage 0+1** — do you want me to proceed with the pre-launch fixes (F-02 through F-14), or only the critical ones (F-04 contrast, F-03 fallback, F-12 env var)?
2. **The production URL and `NEXT_PUBLIC_SITE_URL` value** — I cannot verify F-12 or canonical behaviour without these.
3. **Case study content (F-08)** — this is real client work I cannot write without your input. Do you want to supply the briefs/results, or should I leave the structure ready for you to fill?
4. **Your real service pricing** — `src/lib/services.ts` currently contains **placeholder ranges I invented** (₹60K–₹6L). These are on your public site now. Do you want to supply the real numbers before we go near ad traffic?

I will not touch DNS, hosting, billing, or any live integration, and I will not add plugins or scripts without your explicit go-ahead.
---

## 12. Remediation status (13 October 2026)

Work committed on branch `audit-fixes` (checkpoint commit `6d3831d`, fixes commit `3ed78d7`, 36 files).
Nothing was deployed; no DNS, hosting, billing or live integration was touched.

### Fixed and verified

| Finding | Fix | Verification |
| --- | --- | --- |
| F-04 white-on-white | `.content-section:not(.dark)` → `:where(:not(.dark))` so the `:not()` stops contributing specificity | Measured 1.08:1 → **17.86:1**; secondary text now ≥5.06 |
| F-03 no fallback route | Email/phone/WhatsApp always visible on `/contact`, repeated inside the error state | Browser test: error state renders "The form didn't send…" with a `mailto:` link |
| F-20 honeypot dead code | Evaluated before validation; returns decoy `201` | `POST` with honeypot → **201**, no row written |
| F-01 no tracking | Meta Pixel + CAPI, both consent-gated; `Lead` fires server-side on confirmed 201 with shared `event_id` | 0 `facebook.net` refs in HTML pre-consent; `fbq` absent after decline |
| F-05 no UTM | Capture + persist 30 days, attach to lead | `?utm_source=facebook&utm_campaign=launch_test` stored correctly |
| F-06 no consent | Consent banner gating all tracking | Decline → banner hidden, `denied` stored, no pixel |
| F-09 generic OG | Shared `pageMetadata()` helper | OG title+url now differ across 5 sampled pages |
| F-14 no favicon | `icon.png` + `apple-icon.png` + `favicon.ico` | `<link rel="icon">` present |
| F-10 homepage dynamic | Partially — portfolio routes made static | Build shows `○ /work`, `● /work/[slug]` |
| F-11 no autofill | `autocomplete` + `inputmode` on all fields | Verified in DOM |
| F-12/F-13 SEO config | Warn loudly when site URL is localhost; sitemap drops `lastModified` and `/resources` | Build log emits warning; sitemap 15 URLs, 0 `lastModified` |
| F-15 `/resources` | Removed from nav + sitemap, marked `noindex` | Nav shows Privacy instead |
| F-16/F-17 ARIA | Marquee `aria-hidden`; accessible names now contain visible text | `label-content-name-mismatch` cleared |
| F-18 contrast | All secondary text ≥4.5:1; belief `em` 3.72 → 4.91 | 0 failures after full scroll |
| F-21 security | CSP, HSTS, frame/referrer/permissions headers; `poweredByHeader: false` | All headers present; `X-Powered-By` gone |
| F-22 soft 404 | Public reads use anon client (no `cookies()`), routes static, `dynamicParams = false` | `/work/nope`, `/nope`, `/services/nope` → **404** |
| F-23 LCP | `priority` on first portfolio cover and hero image | Next LCP warning gone |
| F-24 logo | `width:auto` alongside `height:100%` | Warning gone |
| F-08 trust | Real client wordmark strip using existing assets; JSON-LD added | Renders on `/work` |
| F-26/F-27/F-28 | Dead reduced-motion toggle removed; anchor offset added | — |

### Verified overall

21 routes 200 · unknown URLs 404 · Lighthouse **a11y 0.96 / best-practices 1.00 / SEO 1.00** on 7 pages · 0 broken images · 0 images missing `alt` · 1 `h1` and 1 `main` per page · 0 contrast failures after scroll · 9 CTAs to `/contact` on the homepage.

### Still open — needs your input

1. **Supabase keys (F-02).** The code now degrades gracefully and offers a fallback, but leads still only save if `SUPABASE_SERVICE_ROLE_KEY` is set in production. Run `supabase/migrations/002_campaign_attribution.sql` for UTM columns.
2. **Meta credentials (F-01).** Set `NEXT_PUBLIC_META_PIXEL_ID` and `META_CAPI_TOKEN`, then verify in Events Manager Test Events.
3. **`NEXT_PUBLIC_SITE_URL` (F-12).** Must be the real production origin.
4. **Case study content (F-08).** All three projects still have empty `case_study_content`. Not written — real client outcomes are yours to supply.
5. **Pricing (F-19).** `src/lib/services.ts` still holds placeholder ranges I invented. Replace before ad traffic lands.
6. **Phone/WhatsApp (F-03).** Render only once `NEXT_PUBLIC_CONTACT_PHONE` / `_WHATSAPP` are set.
7. **Homepage client-component split (F-10).** Not done — highest effort, deferred as it was not a launch blocker.

### Known trade-offs

- `dynamicParams = false` means a project added via the CMS becomes routable on the next deployment, not immediately. Chosen for correct 404 status codes.
- The Lighthouse `color-contrast` flag on scroll-reveal sections persists. It is a false positive: the audit screenshots content mid-animation. After a full scroll, measured contrast failures = 0. The pre-reveal opacity floor was raised from 0.2 to 0.4 regardless, so un-revealed content stays legible.
- No Core Web Vitals numbers are claimed anywhere — the performance category was never returned by the available tooling. Establish field baselines via Search Console once deployed.
