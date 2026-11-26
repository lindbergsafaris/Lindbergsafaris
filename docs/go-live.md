# Go-Live & Cutover Runbook (`CMS_SOURCE=supabase`)

**Project:** Lindberg Safaris (`lindbergsafaris.com`)  
**Scope:** Production cutover from Sanity to the custom Supabase CMS, environment variable inventory, rollback plan, and post-flip verification checklist.

---

## 1. Environment Variables Inventory (`next-app`)

Names only — never commit or log values.

### Application Variables (`src/`)

| Variable Name | Required / Optional | Build or Runtime | Browser-Exposed? | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `CMS_SOURCE` | Optional (defaults to Sanity when unset; set `supabase` to flip) | Build & Runtime | **No** (server-only) | Selects `supabase` vs `sanity` in `src/lib/data/index.ts` and `src/middleware.ts`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for `CMS_SOURCE=supabase` and `/admin` | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Supabase project URL for public anon reads and `/admin` auth. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Required for `CMS_SOURCE=supabase` and `/admin` (preferred) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Supabase publishable/anon key (RLS-enforced). Read first by `src/lib/supabase/env.ts`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional (fallback if `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` unset) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Legacy alias for Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional (required only to invite new CMS users) | Runtime | **No — NEVER expose** | Used strictly in `POST /api/admin/users/invite` after verifying an authenticated `admin` Supabase session and role. |
| `CLOUDINARY_CLOUD_NAME` | Optional (required for `/admin` uploads unless `NEXT_PUBLIC_` fallback is set) | Runtime | **No** (server-only env var; signed response returns cloud name to authenticated CMS staff) | Preferred server-side Cloudinary cloud name in `src/app/api/admin/cloudinary-sign/route.ts`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional (fallback if `CLOUDINARY_CLOUD_NAME` unset) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Browser-exposed fallback Cloudinary cloud name in `src/app/api/admin/cloudinary-sign/route.ts`. |
| `CLOUDINARY_API_KEY` | Optional (required for `/admin` direct uploads) | Runtime | **No** (returned only to authenticated CMS staff in signed upload payload) | Cloudinary API key used by `src/app/api/admin/cloudinary-sign/route.ts`. |
| `CLOUDINARY_API_SECRET` | Optional (required for `/admin` direct uploads) | Runtime | **No — NEVER expose** | Signs Cloudinary upload parameters server-side in `src/app/api/admin/cloudinary-sign/route.ts`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional (defaults to `tdpau1kt`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Sanity project ID in `src/lib/sanity.ts` (Sanity mode only). |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional (defaults to `production`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Sanity dataset in `src/lib/sanity.ts` (Sanity mode only). |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional (defaults to `2024-01-01`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Sanity API version in `src/lib/sanity.ts` (Sanity mode only). |
| `SANITY_REVALIDATE_SECRET` | Optional (required only for Sanity webhook revalidation) | Runtime | **No** (server-only) | Authenticates `POST /api/revalidate` calls from Sanity webhooks. |
| `NEXT_PUBLIC_SITE_URL` | Optional (defaults to `https://www.lindbergsafaris.com`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Canonical domain for metadata, JSON-LD, `robots.txt`, and `sitemap.xml` in `src/lib/siteConfig.ts`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional (has fallback in `src/app/layout.tsx`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | Meta Pixel ID in `src/app/layout.tsx`. |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Optional (has fallback in `ContactForm.tsx`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | EmailJS service ID in `src/components/contact/ContactForm.tsx`. |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Optional (has fallback in `ContactForm.tsx`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | EmailJS template ID in `src/components/contact/ContactForm.tsx`. |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Optional (has fallback in `ContactForm.tsx`) | Build & Runtime | **Yes** (`NEXT_PUBLIC_`) | EmailJS public key in `src/components/contact/ContactForm.tsx`. |

### Verification Script Variables (`scripts/url-parity.mjs`)

| Variable Name | Required / Optional | When Needed | Browser-Exposed? | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `HOST` | Optional (defaults `127.0.0.1`) | Local CLI script | **No** | Bind host for local parity script `scripts/url-parity.mjs`. |
| `PORT` | Optional (defaults `3000`) | Local CLI script | **No** | Port for local parity script `scripts/url-parity.mjs`. |

**Variables intentionally NOT used:**
- **`ADMIN_JWT_SECRET`**: Not used anywhere. Admin auth is 100% Supabase-session based (`supabase.auth.signInWithPassword` -> HTTP cookie session -> `getCmsSessionState()` / RLS).
- **`SANITY_API_TOKEN`**: Not required or read in `next-app`. The Sanity client in `src/lib/sanity.ts` reads published content without an auth token (`useCdn: false`).

---

## 2. Pre-Cutover Prerequisites (Strict Order)

1. **Apply SQL migrations `0001` through `0007` manually in the Supabase SQL Editor** (Supabase Dashboard -> SQL Editor -> run in order: `0001_extensions_and_private_schema.sql` through `0007_destination_category_display_order.sql`).
   - Do **not** expect `npm run migrate:commit` to apply SQL schema migrations; `migrate:commit` only loads data and requires `0007` (`display_order`) to already exist.
2. **Load Sanity data into Supabase:** In `cms-migration/`, run `npm run migrate:commit` (requires `0001`–`0007` already applied in step 1).
3. **Verify data parity:** In `next-app/`, run `node scripts/data-parity.mjs` and confirm exit code `0` (`MATCH` across all functions and `[ORDER OK]` across all collections).
4. **Configure Vercel Production environment variables:** Ensure Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and Cloudinary vars are present in Vercel **Production**, with `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` marked **Sensitive**. Keep `CMS_SOURCE` unset (or `sanity`) initially.
5. **Confirm bootstrap admin user:** Ensure at least one `admin` user exists in `auth.users` and `public.profiles`, and public signups are disabled in Supabase Auth.

---

## 3. Cutover / Flip Procedure

1. **Merge `feat/custom-cms` into `main` with `CMS_SOURCE` unset (`sanity` mode).** Confirm the production Vercel deploy succeeds and serves Sanity content as before.
2. **Flip the flag in Vercel:** Project Settings -> Environment Variables -> set `CMS_SOURCE=supabase` for **Production**.
3. **Redeploy Production** (without build cache so static/ISR pages regenerate from Supabase).
4. Wait for the deployment to become **Ready**, then run the Post-Flip Smoke Test below.

---

## 4. Rollback Plan

- **Option A — Instant Rollback (fastest):** Vercel Dashboard -> **Deployments** -> Promote the previous deployment to Production.
- **Option B — Env Var Flip:** Change `CMS_SOURCE` back to `sanity` (or delete it) in Vercel Production Environment Variables and trigger a Redeploy. Sanity data is untouched.

---

## 5. Post-Flip Smoke Test Checklist

1. **Core pages return HTTP 200 with expected Title, H1, canonical, JSON-LD:**
   - `/` (`Explore Our Destinations` renders Kenya first, then Africa..USA/Canada; Destinations header menu matches)
   - `/tours`
   - `/tours/visit-lamu`
   - `/blog/altitude-training-kenya` (both `h5` headings and all article images render)
   - `/accommodation/amboseli-serena-safari-lodge`
   - `/destinations/maasai-mara`
   - `/packages/adventure` (`HIGH ALTITUDE TRAINING PROGRAMME`)
   - `/company`
   - `/gallery`
   - `/services/transport`
2. **SEO & Crawlers:**
   - `/sitemap.xml`: HTTP 200; no `/admin`, no `/api`, no uppercase or `%20` URLs
   - `/robots.txt`: HTTP 200; disallows `/admin/` and `/api/`
   - `/admin/login` and `/admin`: `X-Robots-Tag: noindex, nofollow`
3. **Redirects (`curl -sI` -> single `308`, exactly one `Location` header):**
   - `/tours/6ded3abe-c4b7-4d01-9496-99a994c4d02d` -> `/tours/visit-lamu`
   - `/tours/VISIT%20LAMU` -> `/tours/visit-lamu`
   - `/blog/Altitude%20Training%20Kenya` -> `/blog/altitude-training-kenya`
   - `/destinations/ambosseli-national-park` -> `/destinations/amboseli-national-park`
   - `/accommodation/view/1fb9709e-50fa-4276-9288-83bc367b876f` -> `/accommodation/olare-mara-kempinski`
4. **Admin CMS:** Log in at `/admin/login`, open an item, and confirm edit + save refreshes the corresponding public page.
