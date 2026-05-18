-- Ensure we don't create multiple owner households for the same parent account.
-- This migration is safe to apply even if duplicates exist; it prevents new ones.

create unique index if not exists households_one_owner_per_user
on public.households (created_by_user_id);

create or replace function public.bootstrap_household(p_name text, p_timezone text)
returns public.households
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_household public.households;
  created_household public.households;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select *
    into existing_household
    from public.households h
    where h.created_by_user_id = auth.uid()
    order by h.created_at asc
    limit 1;

  if existing_household.id is not null then
    return existing_household;
  end if;

  insert into public.households (name, timezone, created_by_user_id)
  values (p_name, p_timezone, auth.uid())
  returning * into created_household;

  insert into public.household_members (household_id, user_id, role)
  values (created_household.id, auth.uid(), 'owner')
  on conflict (household_id, user_id) do nothing;

  return created_household;
end;
$$;

