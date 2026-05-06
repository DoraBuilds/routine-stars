-- Routine Stars is designed around one household per parent account.
-- These constraints prevent concurrent sign-in/bootstrap flows from creating
-- duplicate empty households for the same authenticated user.

create unique index if not exists households_created_by_user_id_unique
on public.households (created_by_user_id);

create unique index if not exists household_members_user_id_unique
on public.household_members (user_id);
