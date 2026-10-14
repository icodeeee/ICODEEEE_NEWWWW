# Launch runbook

Everything that still stands between this repo and a working site, in the order
it has to happen. Written so it can be followed without any prior context.

Current state: **9 commits on `audit-fixes`, working tree clean, nothing pushed.**

---

## 1. Blocker — GitHub push is denied

**What I found:** the Mac keychain has a stored GitHub credential, but it belongs
to a different account:

```
remote: Permission to Igauravvvv/ICODEEE-NEW.git denied to rohittdogra-cmd.
fatal: ... 403
```

Reads work (the repo is public). Writes do not, because `rohittdogra-cmd` has no
write access to `Igauravvvv/ICODEEE-NEW`. Nothing on this machine can fix that
from the terminal — it needs a decision about who owns the write.

**Pick one:**

**a) Grant `rohittdogra-cmd` access** — repo → Settings → Collaborators → add
`rohittdogra-cmd`. Fastest, and uses the credential already on this machine.

**b) Use a token from an account that owns the repo** — create one at
github.com/settings/tokens with `repo` scope, then:

```bash
git remote set-url origin https://<TOKEN>@github.com/Igauravvvv/ICODEEE-NEW.git
git push origin audit-fixes
```

**c) Push it yourself** — `git push` from any account with access.

**Then merge to main.** I would rather this be your call than have me merge a
branch that contains invented pricing into `main`:

```bash
git checkout main
git merge audit-fixes
git push origin main
```

If you want the history rewritten into a single line instead:

```bash
git checkout -B main audit-fixes && git push -f origin main
```

> `origin/main` is still at `f1a1e0b "Initial commit"`, so this is the first
> push of any real work. Nothing to lose.

---

## 2. Blocker — Supabase keys

Project URL is set in `.env.local` and confirmed live. The keys are not, and I
cannot obtain them; they are secrets only the account holder can read.

Dashboard → Project `bsvvwumucjdrmitbvtai` → **Project Settings → API**.

| Variable | Where it is | Safe to share? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | already set | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | API → Project API keys → `anon` `public` | yes, by design |
| `SUPABASE_SERVICE_ROLE_KEY` | API → Project API keys → `service_role` | **no — server only, never in client code or a commit** |

Until `SUPABASE_SERVICE_ROLE_KEY` is set, `POST /api/leads` returns **503** and
every lead — including every estimate-funnel registration — is silently dropped.
The funnel degrades honestly (it still shows the range and tells the visitor we
could not save their details), so it will not *look* broken. That is exactly why
it is easy to miss. Confirm it is really saving:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Check Test","email":"check@example.com","message":"verification of the lead pipeline","company_site":""}'
```

`201` = saved. `503` = key still missing.

---

## 3. Blocker — migrations not applied

The `leads` table exists but is missing columns this code now writes. Both files
are written and ready; neither has been run.

| File | Adds | Needed for |
| --- | --- | --- |
| `002_campaign_attribution.sql` | `utm_*`, `fbclid`, `gclid` | Meta Ads attribution |
| `003_estimate_funnel.sql` | `package_name`, `estimate_range`, `answers`, `demo_requested` | the estimate funnel |

Both are written to degrade gracefully — a lead is still saved if the columns are
missing, you just lose the attribution and the funnel answers.

**Easiest:** Dashboard → **SQL Editor** → New query → paste the file → Run. Do
`002` first, then `003`.

**Or with the CLI** (needs the project ref and the DB password from
Settings → Database):

```bash
npx supabase login
npx supabase link --project-ref bsvvwumucjdrmitbvtai
npx supabase db push
```

---

## 4. Required before launch — real pricing

**`src/lib/services.ts` contains invented numbers** (₹60K–₹6L). This is the one
thing that must change before any of this is public.

It now matters much more than it did. These prices are no longer a quiet
"indicative" line on a page — they are the centrepiece of a form-gated funnel.
A visitor registers expecting a range, and if it does not match reality the
trust damage is worse than showing nothing.

Also editable in the same file and the same spirit:

- `estimateQuestions` factors in `src/lib/estimate.ts` (currently 1.0 / 1.05–1.15
  etc.) — a judgement about relative effort, not data.
- `addOns` prices.

And one promise with no number attached: the funnel's final step says *"We'll
build a one-page demo landing page"* with **no turnaround time**, because I do not
know your capacity. Set one you can actually hit. It is the offer that converts
and the hardest one to keep.

---

## 5. Deploy

No hosting credentials, no deploy CLI (`vercel`, `netlify`, `flyctl`, `wrangler`
all absent), and no stated host — so I have not deployed and will not guess.

Before the first deploy, set:

```
NEXT_PUBLIC_SITE_URL=https://<your-real-domain>
```

If it is wrong, canonicals, Open Graph URLs and the sitemap all point at
localhost, and the build prints a warning saying exactly that.

---

## 6. Meta Ads

Tracking is already built and correctly gated — the pixel and Conversions API
both load only after a visitor accepts analytics, and a conversion is only sent
after a lead is **durably stored**, never on a button click.

Two things are needed:

```
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_TOKEN=
```

Then set `META_CAPI_TEST_EVENT_CODE` while testing in Events Manager so events
show up, and remove it before launch or they will not.

Attribution will not work until `002_campaign_attribution.sql` has been run.

---

## 7. Verify the funnel by hand

I could not click through the four steps. The browser window in this environment
sits at `visibility: hidden` and React never hydrates (`reactRootKeys: 0`), so
synthetic clicks fire against no handler. It is an environment limitation, not a
known code fault — but it is genuinely untested.

Open a service page and walk it: **Package → Details → Questions → Estimate.**
Expect: teaser prices only on step 1, a disabled Continue button until name and
email are valid, a disabled "See my estimate" until all three questions are
answered, and on step 4 the range plus a save confirmation.

The arithmetic behind the range is covered by `npm run check:estimate`.

---

## Summary of what I could not do

| Task | Why |
| --- | --- |
| Push to GitHub | stored credential is `rohittdogra-cmd`, has no write access (403) |
| Read/write Supabase | no API keys; secrets only the account holder can read |
| Apply migrations | no DB password or CLI, so no way to authenticate |
| Deploy | no hosting account or CLI, and no host chosen |
| Click-test the funnel | browser tab never hydrates in this environment |

Everything else is done and committed.