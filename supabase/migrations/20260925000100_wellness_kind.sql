-- Allow the wellness shelf on databases that already applied the initial catalog migration.

do $$
declare
  constraint_name text;
begin
  select con.conname into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'products'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%kind%';

  if constraint_name is not null then
    execute format('alter table public.products drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.products
  add constraint products_kind_check
  check (kind in ('oil', 'spray', 'format', 'empty_bottle', 'packaging', 'wellness'));
