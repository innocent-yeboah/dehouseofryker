-- Shop information architecture.
-- `kind` stays the operational shelf type. Department and section are the menu.
-- The existing products_kind_check (oil, spray, format, empty_bottle, packaging, wellness)
-- is unchanged.

alter table public.products
  add column if not exists department text,
  add column if not exists section text,
  add column if not exists brand text,
  add column if not exists size_label text,
  add column if not exists best_seller boolean not null default false,
  add column if not exists added_rank integer;

alter table public.products drop constraint if exists products_department_check;
alter table public.products
  add constraint products_department_check
  check (
    department is null
    or department in ('fragrance', 'skincare', 'wellness', 'resellers')
  );

alter table public.products drop constraint if exists products_section_check;
alter table public.products
  add constraint products_section_check
  check (
    section is null
    or section in (
      'perfumes',
      'perfume_oils',
      'gift_sets',
      'face',
      'lips_eyes',
      'body',
      'supplements',
      'empty_bottles',
      'packaging'
    )
  );

comment on column public.products.kind is
  'Operational kind. Check stays oil, spray, format, empty_bottle, packaging, wellness.';
comment on column public.products.department is
  'Menu department: fragrance, skincare, wellness, resellers.';
comment on column public.products.section is
  'One section inside the department. Gift sets, empty bottles, and packaging may be empty.';
comment on column public.products.best_seller is
  'Owner-chosen best seller. None are flagged until the owner picks them.';
