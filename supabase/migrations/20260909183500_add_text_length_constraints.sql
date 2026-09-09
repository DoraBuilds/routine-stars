-- Adds reasonable length caps to free-text columns (issue #164).
--
-- Nothing enforced a size limit on household/child names or custom task
-- text before this — client inputs now cap them too (see InitialSetup.tsx,
-- ParentSettings.tsx, AccountSettingsCard.tsx), but the DB should not rely
-- on the client alone. Low severity (this is the household's own data,
-- already gated by RLS — there's no cross-tenant risk), but worth closing
-- for basic data hygiene.
--
-- The `households.schedules` jsonb column (item title/note, plan name/
-- description) is not covered here: constraining nested JSON shape would
-- need a trigger or CHECK function, which is disproportionate to what this
-- issue is asking for. The client-side maxLength on those fields
-- (SchedulesPage.tsx) is the only guard for now.

alter table public.households
  add constraint households_name_length check (char_length(name) <= 60);

alter table public.child_profiles
  add constraint child_profiles_name_length check (char_length(name) <= 60);

alter table public.routine_tasks
  add constraint routine_tasks_custom_title_length check (custom_title is null or char_length(custom_title) <= 80),
  add constraint routine_tasks_custom_icon_length check (custom_icon is null or char_length(custom_icon) <= 40);
