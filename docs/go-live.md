# Go-Live & Cutover Runbook (`CMS_SOURCE=supabase`)

**Project:** Lindberg Safaris (`lindbergsafaris.com`)  
**Scope:** Production cutover from Sanity to the custom Supabase CMS, environment variable inventory, rollback plan, and post-flip verification checklist.

---

## 1. Environment Variables Inventory (`next-app`)

Names only — never commit or log values.

| Variable Name | Required / Optional | When Needed | Browser-Exposed? | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `CMS_SOURCE` | Optional (defaults to Sanity; set `supabase` to flip) | Build & Runtime | **No** (server-only) | Selects `supabase` vs `sanity` data source in `src/lib/data/index.ts`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for `CMS_SOURCE=supabase` and `/admin` | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Supabase project URL for public anon reads and `/admin` SSR/browser auth. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Required for `CMS_SOURCE=supabase` and `/admin` (or use `ANON_KEY`) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Supabase publishable/anon key (RLS-enforced). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional (fallback if `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` unset) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Legacy alias for Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional (required only to invite new CMS users) | Runtime | **No (NEVER expose)** | Used strictly in `POST /api/admin/users/invite` after server-side admin verification. |
| `CLOUDINARY_CLOUD_NAME` | Optional (required for `/admin` direct uploads; falls back to `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`) | Runtime | No (non-secret) | Cloudinary account cloud name for signed uploads in `/api/admin/cloudinary-sign`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional (fallback for `CLOUDINARY_CLOUD_NAME`) | Runtime | Yes (`NEXT_PUBLIC_`) | Fallback Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Optional (required for `/admin` direct uploads) | Runtime | No (signed response only to CMS staff) | Cloudinary API key used by `/api/admin/cloudinary-sign`. |
| `CLOUDINARY_API_SECRET` | Optional (required for `/admin` direct uploads) | Runtime | **No (NEVER expose)** | Signs Cloudinary upload parameters server-side in `/api/admin/cloudinary-sign`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Sanity project ID used when `CMS_SOURCE` is unset or `sanity`. |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Sanity dataset (`production`). |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Sanity API version. |
| `SANITY_REVALIDATE_SECRET` | Optional (required only for Sanity webhook revalidation) | Runtime | **No** | Authenticates `POST /api/revalidate` calls from Sanity webhooks. |
| `NEXT_PUBLIC_SITE_URL` | Optional (defaults to `https://www.lindbergsafaris.com`) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Canonical domain for metadata, JSON-LD, `robots.txt`, and `sitemap.xml`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | Meta Pixel tracking ID in `src/app/layout.tsx`. |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | EmailJS service ID in `ContactForm.tsx`. |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | EmailJS template ID in `ContactForm.tsx`. |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Optional (has fallback) | Build & Runtime | Yes (`NEXT_PUBLIC_`) | EmailJS public key in `ContactForm.tsx`. |

---

## 2. Pre-Cutover Prerequisites

Before flipping Production to Supabase:
1. Ensure Supabase migrations `0001` through `0007` have been executed on the production Supabase project (including `0007_destination_category_display_order.sql`).
2. Ensure clean migration data is committed (`cms-migration/reset.sql` + `npm run migrate:commit` in `cms-migration/`), and confirm `node scripts/data-parity.mjs` in `next-app/` exits `0` with `[ORDER OK]` on all collections.
3. Verify all required Production environment variables are set in Vercel → **Project Settings → Environment Variables** (scope: **Production**). Mark `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, and `SANITY_REVALIDATE_SECRET` as **Sensitive**.
4. Confirm at least one bootstrap `admin` user exists in `auth.users` and `public.profiles`, and that public signups are disabled in Supabase Auth.

---

## 3. Flip Procedure (Switch Production to Supabase)

1. Open the Vercel dashboard for the `next-app` project → **Settings → Environment Variables**.
2. Set `CMS_SOURCE` = `supabase` for the **Production** environment (confirm `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are also present in Production).
3. Trigger a fresh Production **Redeploy** (without build cache if switching from a cached Sanity build so ISR/SSG pages regenerate from Supabase).
4. Wait for the deployment to reach **Ready** and run the Post-Flip Smoke Test checklist below.

---

## 4. Rollback Procedure

If any regression is detected after cutover, choose either option:

- **Option A — Vercel Instant Rollback (fastest, zero rebuild time):**
  1. In Vercel → **Deployments**, locate the previous Sanity-mode Production deployment.
  2. Click the `...` menu → **Instant Rollback**.
  3. Also reset `CMS_SOURCE` back to `sanity` (or remove it) in Environment Variables so future deploys stay on Sanity until the issue is resolved.

- **Option B — Environment Variable Flip & Redeploy:**
  1. In Vercel → **Settings → Environment Variables**, change `CMS_SOURCE` to `sanity` (or delete `CMS_SOURCE`).
  2. Trigger a **Redeploy** of Production.
  3. Because the public site defaults to Sanity when `CMS_SOURCE` is unset or `sanity`, all pages revert immediately to reading Sanity.

---

## 5. Post-Flip Smoke Test Checklist

Run these checks against `https://www.lindbergsafaris.com` right after cutover:

1. **Core Public Pages (HTTP 200 & Content):**
   - `/` — Hero slides, featured tours, hot deals (if active), partners render correctly.
   - `/tours` and a tour detail page (e.g. `/tours/visit-lamu`, `/tours/high-altitude-training-programme`).
   - `/blog/altitude-training-kenya` — Confirm both `<h5>` headings, all embedded images, `<title>`, canonical, and JSON-LD render cleanly.
   - `/accommodation/lodges` and an accommodation detail page (e.g. `/accommodation/amboseli-serena-safari-lodge`).
   - `/destinations/maasai-mara` and `/regions/kenya` (confirm header Region dropdown order matches expected `display_order`).
   - `/packages/adventure` — Confirm "HIGH ALTITUDE TRAINING PROGRAMME" renders.
   - `/company` — Confirm team members render in expected order.
   - `/gallery` and `/services/transport` — Confirm gallery photos and fleet vehicles render.
2. **Legacy Redirects (Single-Hop 301/308):**
   - `/tours/VISIT%20LAMU` → `/tours/visit-lamu`
   - `/tours/6ded3abe-c4b7-4d01-9496-99a994c4d02d` → `/tours/visit-lamu`
   - `/blog/Altitude%20Training%20Kenya` → `/blog/altitude-training-kenya`
   - `/destinations/ambosseli-national-park` → `/destinations/amboseli-national-park`
   - `/accommodation/view/1fb9709e-50fa-4276-9288-83bc367b876f` → `/accommodation/olare-mara-kempinski`
   - `/services/airticketing` → `/services/flights`
   - `/about` → `/company#about`
3. **SEO & Crawl Controls:**
   - `/sitemap.xml` — HTTP 200, valid XML, contains clean slugs only, no `/admin`, `/api`, `/quiz`, `/gallery`, `/services/hotels`, spaces, capitals, or `%20`.
   - `/robots.txt` — Disallows `/admin/` and `/api/`; allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
   - `/admin/login` and `/admin` — Verify `X-Robots-Tag: noindex, nofollow` header (and `<meta name="robots" content="noindex...">` on `/admin/login`).
4. **Admin & On-Demand Revalidation:**
   - Sign in at `/admin/login` with a staff `admin` account; verify dashboard counts and list views load.
   - Make a minor draft edit or publish test and confirm public page updates immediately after `revalidateTag` / `revalidatePath`.
