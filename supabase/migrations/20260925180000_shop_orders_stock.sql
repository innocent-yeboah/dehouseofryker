-- De House of Ryker: orders, stock, and price.
--
-- Paste this whole file into the Supabase SQL editor and press Run.
-- You can run it again later. It will not delete orders or stock you already saved.
-- The first time the shop connects, it fills any missing prices and quantities
-- from the current catalog. It does not overwrite a price you have already changed.
--
-- De House of Ryker: orders, stock, and price.
-- Replaces the unused draft catalog migrations.
-- Safe to run more than once. It does not delete orders or stock that are already stored.
-- The anon key cannot read or write these tables.

-- Draft catalog tables from the unused migrations. Product text stays in the app.
drop table if exists public.products cascade;
drop table if exists public.variants cascade;

-- The unused draft used a numeric order id. Replace that empty shape only.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'id'
      and data_type = 'bigint'
  ) then
    drop table if exists public.order_items cascade;
    drop table if exists public.walk_in_sales cascade;
    drop table if exists public.orders cascade;
  end if;
end $$;

create table if not exists public.variant_stock (
  variant_id integer primary key,
  price_ghs numeric(12, 2) not null check (price_ghs >= 0),
  stock_on_hand integer not null check (stock_on_hand >= 0),
  stock_reserved integer not null default 0 check (stock_reserved >= 0),
  updated_at timestamptz not null default now(),
  constraint variant_stock_reserved_within_hand check (stock_reserved <= stock_on_hand)
);

create table if not exists public.orders (
  id text primary key,
  code text not null unique,
  view_token text not null,
  customer_name text not null,
  phone text not null,
  email text,
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  delivery_address text,
  payment text not null check (payment in ('momo', 'cash_pickup', 'merchant_reference')),
  status text not null check (status in (
    'awaiting_momo',
    'reserved_pay_at_shop',
    'paid_awaiting_ready',
    'paid_waiting_delivery_agree',
    'ready_for_pickup',
    'picked_up',
    'delivery_agreed',
    'dispatched',
    'refunded',
    'cancelled_released'
  )),
  goods_total_ghs numeric(12, 2) not null check (goods_total_ghs >= 0),
  delivery_fee_ghs numeric(12, 2),
  delivery_agreed_at timestamptz,
  momo_ref text,
  momo_number_masked text,
  momo_request_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_code_shape check (
    code ~ '^DH-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$'
    or code ~ '^DH-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{12}$'
  ),
  constraint orders_view_token_length check (char_length(view_token) >= 16)
);

create index if not exists orders_phone_idx on public.orders (phone);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders (id) on delete cascade,
  variant_id integer not null,
  product_name text not null,
  sku text not null,
  size_label text not null,
  qty integer not null check (qty > 0),
  unit_price_ghs numeric(12, 2) not null check (unit_price_ghs >= 0),
  availability_snapshot text not null check (availability_snapshot in ('on_shelf', 'blend'))
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create table if not exists public.walk_in_sales (
  id text primary key,
  variant_id integer not null,
  qty integer not null check (qty > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id bigint generated always as identity primary key,
  variant_id integer not null,
  kind text not null check (kind in (
    'sale',
    'walk_in',
    'manual_adjustment',
    'restock',
    'reservation',
    'release'
  )),
  qty_delta integer not null,
  reserved_delta integer not null default 0,
  price_ghs numeric(12, 2),
  note text,
  order_id text,
  created_at timestamptz not null default now()
);

create index if not exists stock_movements_created_at_idx on public.stock_movements (created_at desc);

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

alter table public.variant_stock enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.walk_in_sales enable row level security;
alter table public.stock_movements enable row level security;

revoke all on table public.variant_stock from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.order_items from anon, authenticated;
revoke all on table public.walk_in_sales from anon, authenticated;
revoke all on table public.stock_movements from anon, authenticated;

do $$
begin
  if to_regclass('public.order_items_id_seq') is not null then
    execute 'revoke all on sequence public.order_items_id_seq from anon, authenticated';
  end if;
  if to_regclass('public.stock_movements_id_seq') is not null then
    execute 'revoke all on sequence public.stock_movements_id_seq from anon, authenticated';
  end if;
end $$;
