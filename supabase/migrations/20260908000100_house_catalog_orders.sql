-- Initial catalog and orders schema for De House of Ryker.
-- Apply when a dedicated Supabase project is ready. Until then the app uses .data/.

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  kind text not null check (kind in ('oil', 'spray', 'format', 'empty_bottle', 'packaging')),
  images text[] not null default '{}',
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  size_ml integer,
  sku text not null unique,
  price_ghs numeric(12, 2) not null check (price_ghs >= 0),
  stock_on_hand integer not null default 0 check (stock_on_hand >= 0),
  stock_reserved integer not null default 0 check (stock_reserved >= 0),
  blend_when_zero boolean not null default false,
  max_retail_qty integer not null default 6 check (max_retail_qty >= 1),
  created_at timestamptz not null default now()
);

create index if not exists variants_product_id_idx on public.variants (product_id);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  code text not null unique,
  view_token text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  delivery_address text,
  payment text not null check (payment in ('momo', 'cash_pickup', 'merchant_reference')),
  status text not null,
  goods_total_ghs numeric(12, 2) not null,
  delivery_fee_ghs numeric(12, 2),
  delivery_agreed_at timestamptz,
  momo_ref text,
  momo_number_masked text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_phone_code_idx on public.orders (phone, code);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  variant_id bigint not null references public.variants (id),
  qty integer not null check (qty > 0),
  unit_price_ghs numeric(12, 2) not null,
  availability_snapshot text not null check (availability_snapshot in ('on_shelf', 'blend'))
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create table if not exists public.walk_in_sales (
  id bigint generated always as identity primary key,
  variant_id bigint not null references public.variants (id),
  qty integer not null check (qty > 0),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.walk_in_sales enable row level security;

create policy products_public_read
  on public.products
  for select
  to anon, authenticated
  using (active = true);

create policy variants_public_read
  on public.variants
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products p
      where p.id = variants.product_id
        and p.active = true
    )
  );

grant select on public.products to anon, authenticated;
grant select on public.variants to anon, authenticated;

-- Orders and walk-ins: service role only (no anon policies).
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
revoke all on public.walk_in_sales from anon, authenticated;
