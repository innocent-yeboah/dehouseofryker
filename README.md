# De House of Ryker

Premium Accra perfume house — Phase 1 shop. Gold and white. Ready products checkout. Custom, wholesale, and branding jobs go to WhatsApp.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin) with `OWNER_EMAIL` and `OWNER_PASSWORD` from `.env.local`.

Without Supabase, the app uses a house seed catalog and stores orders in `.data/` (gitignored). Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` later, then apply `supabase/migrations/`.

## Later (not in this build)

Custom production queue, verified reviews, MoMo Collections production API, extra staff logins.
