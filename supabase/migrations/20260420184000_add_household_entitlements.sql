create table if not exists public.household_entitlements (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  status text not null default 'active',
  platform text,
  store_product_id text,
  source_transaction_id text,
  source_original_transaction_id text,
  granted_at timestamptz,
  revoked_at timestamptz,
  verification_checked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (household_id),
  constraint household_entitlements_status_check check (status in ('active', 'revoked')),
  constraint household_entitlements_platform_check check (platform is null or platform in ('ios', 'android', 'web'))
);

create table if not exists public.purchase_events (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  platform text not null,
  event_type text not null,
  store_product_id text,
  source_transaction_id text,
  source_original_transaction_id text,
  amount_minor integer,
  currency text,
  raw_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  unique (platform, event_type, source_transaction_id),
  constraint purchase_events_platform_check check (platform in ('ios', 'android', 'web'))
);

drop trigger if exists household_entitlements_set_updated_at on public.household_entitlements;
create trigger household_entitlements_set_updated_at
before update on public.household_entitlements
for each row execute procedure public.set_updated_at();

alter table public.household_entitlements enable row level security;
alter table public.purchase_events enable row level security;

create policy "household members can view entitlements"
on public.household_entitlements
for select
using (public.is_household_member(household_id));

create policy "household members can manage entitlements"
on public.household_entitlements
for all
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "household members can view purchase events"
on public.purchase_events
for select
using (public.is_household_member(household_id));

create policy "household members can insert purchase events"
on public.purchase_events
for insert
with check (public.is_household_member(household_id));
