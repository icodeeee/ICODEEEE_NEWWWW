# iCodeee — Conversion audit

Date: 12 October 2026. Scope: public marketing pages only. Admin and CMS behaviour unchanged.

Every item below was verified against the code, not assumed. File references point at the current
implementation. Items are ordered by expected revenue impact, not by effort.

---

## Verdict

The site is well designed and structurally sound. It is also, today, **unmeasurable**. There is no
analytics, no structured data, no favicon and no share image anywhere in the codebase. You cannot
optimise a conversion rate you have never instrumented, and you currently cannot prove to anyone that
the site works.

The single most valuable change is not a design change. It is adding measurement, then adding proof.

---

## P0 — Blocking. Nothing below matters until these are done.

### 1. There is no analytics at all

A full-codebase search for `gtag`, `googletagmanager`, `clarity`, `posthog`, `plausible`, `umami`,
`mixpanel` and `fbq` returns zero matches. There is no way to know how many people reach `/contact`,
how many start the form, or how many submit.

This means every "improvement" below is currently a guess. Fix this first.

- Add one analytics tool (Plausible or GA4) in `src/app/layout.tsx`.
- Track at minimum: `page_view`, `cta_click` (every `/contact` link), `form_start` (first field focus),
  `form_submit`, `form_error`, `outbound_click` on client project links.
- The homepage already has 9 links to `/contact`; these need to be distinguishable by placement.

### 2. No favicon, no app icon, no Open Graph image

`src/app/` contains no `icon.*`, `favicon.ico` or `opengraph-image.*`. The layout declares
`twitter: { card: "summary_large_image" }` and an `openGraph` block, but there is no image to show.

This is the highest-leverage item in this document for a studio business. Most inbound for an Indian
design/ecommerce studio arrives from a WhatsApp or LinkedIn link. Right now every one of those shares
renders as a blank card with no brand mark.

- Add `src/app/icon.png` from `public/brand/Blue.png`.
- Add `src/app/opengraph-image.png` (1200×630) and `twitter-image.png`.

### 3. No structured data anywhere

No `application/ld+json` exists in the codebase. For a local service business this is free visibility:

- `ProfessionalService` / `LocalBusiness` on the homepage — name, description, `areaServed`,
  `email`, `sameAs`.
- `BreadcrumbList` on inner pages.
- `WebSite` + `SearchAction` is not useful here (no site search); skip it.

### 4. The contact form is a dead end when Supabase is unconfigured

`src/app/api/leads/route.ts` returns `503 "Contact service is not configured yet."` when the Supabase
service-role key is absent. The visitor sees a generic failure and the lead is lost silently.

`src/components/contact-form.tsx` renders this as a plain `role="alert"` paragraph. Add a fallback
(mailto link, or a WhatsApp deep link) rendered **alongside** the error so the visitor always has a way
to reach you.

---

## P1 — Proof. This is what actually closes deals.

### 5. Every case study is empty

All three projects in `src/lib/site.ts` have `case_study_content: {}`. `src/app/work/[slug]/page.tsx`
renders "The brief", "The build" and "The result" sections only when those keys exist. So every project
page currently shows a cover image, one paragraph, and a "Visit live website" button.

A visitor deciding whether to hire you needs to see the thinking, not the thumbnail. Filling in
`challenge` / `build` / `result` for all three projects is the single biggest content win available.

### 6. No social proof of any kind — and unused assets sitting on disk

The previous audit correctly refused to invent testimonials or metrics. But there is also no *real*
proof. Meanwhile `public/work/` already contains:

- `slugsera-wordmark.webp`
- `rupali-logo.webp`
- `aw-wordmark.png`

These are real client wordmarks and they are not used anywhere in the UI. A "trusted by" strip of real
client logos is the standard, low-risk way to transfer credibility — it asserts nothing that isn't true.

### 7. No founder or team credibility

`src/app/about/page.tsx` is two paragraphs of positioning copy. No names, no roles, no faces, no
LinkedIn. For engagements in the ₹1L–₹8L+ range, buyers are assessing whether they can work with
specific people. This page does not answer that.

### 8. Contact channels are email-only

The header, footer and contact page expose exactly one channel: `hello@icodeee.com`. No phone, no
WhatsApp, no calendar link.

Note that `awaestheticwear.com` — a client — prominently publishes WhatsApp (`+91 9958004007`) and a
phone number in its header, footer and mobile bar. That is a signal about what your market expects.
For this audience, WhatsApp is likely a primary contact channel, not a secondary one.

### 9. `/resources` is an empty page in the main navigation

`src/app/resources/page.tsx` renders "COMING SOON". It is linked from the header nav, the mobile menu
and the footer, and it is in `sitemap.xml`. A dead-end page in primary navigation reads as an
unfinished site and costs credibility on every visit.

Either publish 3–5 real notes or remove it from navigation and the sitemap.

---

## P2 — Offer clarity. Visitors cannot tell if they qualify.

### 10. ~~No pricing signal anywhere~~ — PARTIALLY ADDRESSED

**Done (12 October 2026).** Each of the five services now has its own page at `/services/[slug]` with
a unique description, a "best for" qualifier, a method section, an explicit *not included* list, and
an interactive estimator: three packages plus selectable add-ons that produce a live indicative range.
The estimate carries through to `/contact` and pre-fills the form. Package and add-on pricing lives
in `src/lib/services.ts` and is the only file that needs editing to match real pricing.

**Still open:** the *contact page* and *services index* are now price-aware, but there is no
engagement-shape or lead-time statement for bespoke work, and no "what happens after you enquire"
content beyond the response-window line added to the form.

### 11. Nothing sets expectations after submitting

The success state in `src/components/contact-form.tsx` reads "We'll review it and reply soon."
Vague. Add a concrete expectation: response window, what happens on the call, whether there is a paid
discovery step.

### 12. No availability or lead-time signal

Neither the header nor the footer communicates current booking status. Studios that are fully booked
convert *better* than studios that appear available, because scarcity filters intent. One line —
"Taking on 2 new projects this quarter" — is cheap and effective.

---

## P3 — Form friction

### 13. Eight fields, five of them optional

The form collects name, email, phone, company, website, project_type, budget, and a 20-character-min
message. Phone, company, website, project_type and budget are all optional. Each optional field still
costs perceived effort and some visitors abandon rather than skip.

Recommended:
- Keep required: name, email, message.
- Move budget and project_type to the *first reply*, not the first form.
- Consider a two-step form: intent → details.

The honeypot (`company_site`) and the server-side duplicate check are good and should stay.

### 14. `minLength={20}` on the message with no live counter

A 20-character minimum enforced only at submit is a late failure. Users discover the rule after writing.
Show remaining characters as they type.

---

## P4 — Performance and Core Web Vitals

Next.js logged these during development and they are real:

- **`/work/slugsera-campaign.webp` detected as LCP** — it sits in the homepage hero collage
  (`src/components/conversion-home.tsx`, `collage-slugsera`). It carries a non-standard `preload` prop
  rather than `priority`/`loading="eager"`. LCP directly tracks conversion on a slow connection.
- **`scroll-behavior: smooth`** on `<html>` without `data-scroll-behavior="smooth"` — causes a visible
  jump on route transitions, which is exactly when a visitor is deciding whether to keep clicking.
- **`fill` images reporting height 0** for `slugsera-campaign.webp` and `rupali-villa.jpg` — the collage
  parent has no resolved height at some breakpoints, so images can collapse and then pop in.
- **Logo images modified on one axis only** (`White_full.png`, `Blue_Full.png`) without `width:auto`,
  which can distort the mark on high-DPI screens — a brand-credibility problem.

### 15. The entire homepage is a client component

`src/components/conversion-home.tsx` begins with `"use client"` and the whole page is inside it. A
marketing homepage — the page that must rank and convert — is therefore client-rendered, with its
content dependent on hydration.

This is the biggest architectural issue on the list. It constrains TTFB, makes the DOM arrive late, and
means the H1 and hero copy are not reliably in the initial server payload for crawlers.

Next.js 16 supports Server Components well. The Framer Motion sections can be split into small client
islands (the scroll-linked collage, the reveals, the marquee) while headings, copy, links and images stay
on the server. This is a meaningful refactor, not a quick fix.

---

## P5 — SEO details

- No `alternates.canonical` anywhere.
- `openGraph` in `src/app/layout.tsx` has no `url` and no `images`.
- `sitemap.ts` sets `lastModified: new Date()` on every URL on every request, which tells crawlers every
  page changes constantly. This degrades crawl trust. Use real modified dates, or omit the field.
- Project pages are `force-dynamic` (`src/app/work/[slug]/page.tsx`) even when backed by static fallback
  data, so they never get prerendered.
- No `hreflang`, no blog, and no content strategy for inbound. `/resources` is the natural home for it.

---

## P6 — Polish

- The hero footer shows a hardcoded `01 — 08` section counter (`src/components/conversion-home.tsx`).
  It is already correct, but it will silently drift as sections are added.
- The "Motion on/off" control is a distinctive accessibility feature, but it is currently the first
  element in the bottom-right corner and reads as ambient UI. It is also disabled when the OS requests
  reduced motion, which leaves a permanently dead control on screen for those users.
- No 404 page content review — `src/app/not-found.tsx` exists but is not part of the conversion path.

---

## Suggested order

**Week 1 — measurement and foundation**
1. Analytics + funnel events (1)
2. Favicon and OG image (2)
3. Structured data (3)
4. Form failure fallback (4)

**Week 2–3 — proof**
5. Fill in all three case studies (5)
6. Client wordmark strip using the unused assets (6)
7. WhatsApp / phone / calendar channels (8)
8. Resolve or remove `/resources` (9)

**Week 4+ — offer and architecture**
9. Engagement shape, expectations (11), availability (12)
10. Form reduction (13, 14) — note the estimator now pre-fills `project_type` and `message`, so both
    of those fields are already done for estimator traffic; what remains is trimming phone/company/website
    from the first step.
11. Core Web Vitals fixes (14)
12. Homepage Server Component split (15)
13. SEO details (P5) — service pages are now in `sitemap.xml` with canonicals; `/work/[slug]` still
    returns a soft 200 for unknown slugs and needs a real 404.

---

## What is already working — do not regress these

The existing audit's decisions were sound and should be preserved:

- Zero third-party iframes on the homepage. Previews load only on explicit click, one at a time. This
  protects performance and is the right call.
- Full keyboard and reduced-motion support on the mobile menu.
- `overflow-x: clip` rather than `hidden`, which keeps sticky positioning working.
- No fabricated testimonials or invented metrics. Keep this standard. Real proof only — which is why
  item 6 favours real client wordmarks over invented quotes.
- Zod validation, a honeypot, and duplicate-submit protection on the lead endpoint.