# De House of Ryker

Premium Accra perfume house — Phase 1 shop. Gold and white. Ready products checkout. Custom, wholesale, and branding jobs go to WhatsApp.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin) with `OWNER_EMAIL` and `OWNER_PASSWORD` from `.env.local`.

Without a Postgres URL, the app keeps the house catalog in code and stores orders in `.data/` (gitignored). To use Supabase, paste `supabase/setup.sql` into the SQL editor, then set `POSTGRES_URL_NON_POOLING` (or `POSTGRES_URL`) on the server. Do not prefix the database URL or the service-role key with `NEXT_PUBLIC_`. The first request fills any missing prices and stock. It does not overwrite a price you have already saved. `npm run db:setup` applies the same SQL when `psql` and `POSTGRES_URL` are available. `npm test` needs that URL too.

## Later (not in this build)

Custom production queue, verified reviews, MoMo Collections production API, extra staff logins.
