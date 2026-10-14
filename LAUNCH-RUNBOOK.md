# Vercel launch checklist

## Repository and production branch

- GitHub repository: `icodeeee/ICODEEEE_NEWWWW`
- Branch to deploy: `audit-fixes`
- Framework: Next.js (Vercel auto-detects this from `package.json`)
- Root directory: repository root

Import this repository in Vercel and select `audit-fixes` as the production
branch. The branch contains the current site, including the quote-request flow.

## Required Vercel environment variables

Set these for **Production** and **Preview**, then redeploy after changing them.

| Variable | Purpose | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin used for canonical metadata and the sitemap. Set it to the Vercel domain first, then update it if a custom domain is connected. | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for portfolio reads and server-side lead storage. | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anon key for published portfolio reads. | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used to store enquiries and administer content. | **Yes** |

The application can render without Supabase, using its bundled portfolio
fallback. Enquiry submissions cannot be stored until `SUPABASE_SERVICE_ROLE_KEY`
is configured. If storage is unavailable, the forms offer a prefilled email
fallback instead of claiming the request was received.

Never commit secret values or paste them into chat. Add secret values directly
in Vercel project settings.

## Supabase database

The base `leads` table already exists. Apply migrations `002_campaign_attribution.sql`
and `003_estimate_funnel.sql` in order in the Supabase SQL Editor. They add
optional attribution and quote-request fields. The app degrades if these optional
columns are missing, but attribution and the full project brief will be lost.

## Optional integrations

- `RESEND_API_KEY`, `LEADS_FROM_EMAIL`, `LEADS_TO_EMAIL`: send lead notifications
  and a receipt email. Without these, submissions can still be stored in
  Supabase, but no email notifications are sent.
- `NEXT_PUBLIC_META_PIXEL_ID` and `META_CAPI_TOKEN`: enable Meta tracking. The
  tracking code is consent-gated and sends server conversions only after the
  lead is stored.
- `META_CAPI_TEST_EVENT_CODE`: use only while testing events; remove it for
  production.
- `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_WHATSAPP`,
  `NEXT_PUBLIC_CONTACT_LOCATION`: optional public contact details. Leave unset
  until verified.

## Pricing and quote requests

No numeric service prices are published. Rates and add-on prices were not
confirmed, so the service pages now collect a project brief and describe pricing
as a custom quote. Add real rates only after the studio confirms them.

## Custom domain

The generated `*.vercel.app` domain can be used for the first deployment. If a
custom domain is connected later, update `NEXT_PUBLIC_SITE_URL` in Vercel and
redeploy so canonical links, Open Graph metadata, and `sitemap.xml` use that
domain.
