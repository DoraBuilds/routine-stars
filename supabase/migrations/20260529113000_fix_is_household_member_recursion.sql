-- Fix infinite recursion (PostgreSQL error 54001) in is_household_member.
--
-- The problem:
--   The RLS policy on household_members uses is_household_member() to decide
--   which rows a user can see. But is_household_member() itself queries
--   household_members, which triggers the RLS policy again → infinite recursion
--   → "stack depth limit exceeded" on every getCurrentHousehold call.
--
-- The fix:
--   Mark is_household_member as SECURITY DEFINER so it runs as the function
--   owner (postgres role), bypassing RLS on its inner household_members query
--   and breaking the loop. auth.uid() still works correctly because it reads
--   the caller's JWT, not the database.

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = auth.uid()
  );
$$;
