alter table public.household_entitlements
  drop constraint if exists household_entitlements_status_check;

alter table public.household_entitlements
  add constraint household_entitlements_status_check
  check (status in ('active', 'pending', 'revoked'));
