# NAYRO — Premium Fashion E-commerce

Premium Moroccan fashion brand — Minimal, editorial, European-inspired.

**Stack:** Next.js 16 (App Router) • TypeScript • Tailwind CSS v4 • Supabase • Vercel

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill Supabase credentials
npm run dev
```

## Supabase Setup

1. Create Supabase project at https://supabase.com
2. Run migrations:
   ```bash
   # via Supabase CLI
   supabase link --project-ref <ref>
   supabase db push
   # or manually run SQL from supabase/migrations/*.sql in SQL editor
   ```
3. Set env vars:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. Storage: buckets `products` and `categories` are created via migration `004_storage.sql`

5. Auth: Enable Email auth in Supabase dashboard → Authentication → Providers

## Features

- Homepage editorial + new arrivals / best sellers
- PLP with filters/sorting, 4-col grid, hover images
- PDP with gallery, variants, WhatsApp, sticky mobile bar
- Cart drawer + /cart page (localStorage + Supabase sync)
- Checkout COD optimized for Morocco (phone validation, cities)
- Order confirmation + order API
- Search, wishlist (local + Supabase), account
- Admin dashboard: products, orders, categories, settings, storage
- SEO: metadata, JSON-LD Product, sitemap, robots

## Deploy to Vercel

1. Push to GitHub:
   ```bash
   git remote add origin https://github.com/<user>/nayro-store.git
   git push -u origin main
   ```
2. Import in Vercel → Framework: Next.js, Branch: main
3. Add Environment Variables (same as .env.local)
4. Update Supabase Auth → URL Configuration → add production URL to Allowed Redirects
5. Deploy

## Build

```bash
npm run lint
npm run build
```

## Structure

- `src/app` — App Router pages
- `src/components` — UI, layout, product, shop
- `src/lib` — supabase, mock-data, cart/wishlist contexts, products, settings
- `supabase/migrations` — SQL schema, RLS, seed, storage

## Admin

Access `/admin` — requires Supabase `profiles.role = 'admin'`. Create admin via SQL:

```sql
update profiles set role='admin' where email='your@email.com';
```

Without Supabase, admin shows mock data and demo mode.

## License

Private — NAYRO brand.
