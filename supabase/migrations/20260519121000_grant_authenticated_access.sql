-- Ensure the authenticated role can access the household schema tables.
-- RLS still applies; these grants just allow PostgREST/Supabase client to reach the tables.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.households to authenticated;
grant select, insert, update, delete on table public.household_members to authenticated;
grant select, insert, update, delete on table public.child_profiles to authenticated;
grant select, insert, update, delete on table public.routines to authenticated;
grant select, insert, update, delete on table public.routine_tasks to authenticated;
grant select, insert, update, delete on table public.daily_routine_progress to authenticated;
grant select, insert, update, delete on table public.daily_task_progress to authenticated;

