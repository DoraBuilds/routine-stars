create extension if not exists "pgcrypto";

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Europe/Madrid',
  home_scene text not null default 'bike',
  created_by_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint households_home_scene_check check (home_scene in ('bike', 'school', 'kite', 'sandcastle'))
);

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default timezone('utc', now()),
  unique (household_id, user_id),
  constraint household_members_role_check check (role in ('owner', 'parent'))
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  age integer,
  age_bucket text,
  avatar_animal text,
  avatar_seed text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint child_profiles_age_bucket_check check (age_bucket is null or age_bucket in ('2-4', '4-6', '6-8'))
);

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  type text not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (child_profile_id, type),
  constraint routines_type_check check (type in ('morning', 'evening'))
);

create table if not exists public.routine_tasks (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  task_template_id text,
  custom_title text,
  custom_icon text,
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint routine_tasks_title_check check (task_template_id is not null or custom_title is not null)
);

create table if not exists public.daily_routine_progress (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  routine_type text not null,
  progress_date date not null,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (child_profile_id, routine_type, progress_date),
  constraint daily_routine_progress_type_check check (routine_type in ('morning', 'evening'))
);

create table if not exists public.daily_task_progress (
  id uuid primary key default gen_random_uuid(),
  daily_routine_progress_id uuid not null references public.daily_routine_progress(id) on delete cascade,
  routine_task_id uuid not null references public.routine_tasks(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (daily_routine_progress_id, routine_task_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists households_set_updated_at on public.households;
create trigger households_set_updated_at
before update on public.households
for each row execute procedure public.set_updated_at();

drop trigger if exists child_profiles_set_updated_at on public.child_profiles;
create trigger child_profiles_set_updated_at
before update on public.child_profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists routines_set_updated_at on public.routines;
create trigger routines_set_updated_at
before update on public.routines
for each row execute procedure public.set_updated_at();

drop trigger if exists routine_tasks_set_updated_at on public.routine_tasks;
create trigger routine_tasks_set_updated_at
before update on public.routine_tasks
for each row execute procedure public.set_updated_at();

drop trigger if exists daily_routine_progress_set_updated_at on public.daily_routine_progress;
create trigger daily_routine_progress_set_updated_at
before update on public.daily_routine_progress
for each row execute procedure public.set_updated_at();

drop trigger if exists daily_task_progress_set_updated_at on public.daily_task_progress;
create trigger daily_task_progress_set_updated_at
before update on public.daily_task_progress
for each row execute procedure public.set_updated_at();

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = auth.uid()
  );
$$;

create or replace function public.bootstrap_household(p_name text, p_timezone text)
returns public.households
language plpgsql
security definer
set search_path = public
as $$
declare
  created_household public.households;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.households (name, timezone, created_by_user_id)
  values (p_name, p_timezone, auth.uid())
  returning * into created_household;

  insert into public.household_members (household_id, user_id, role)
  values (created_household.id, auth.uid(), 'owner');

  return created_household;
end;
$$;

grant execute on function public.bootstrap_household(text, text) to authenticated;

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.child_profiles enable row level security;
alter table public.routines enable row level security;
alter table public.routine_tasks enable row level security;
alter table public.daily_routine_progress enable row level security;
alter table public.daily_task_progress enable row level security;

create policy "household members can view households"
on public.households
for select
using (public.is_household_member(id));

create policy "household creators can insert households"
on public.households
for insert
with check (auth.uid() = created_by_user_id);

create policy "household members can update households"
on public.households
for update
using (public.is_household_member(id))
with check (public.is_household_member(id));

create policy "members can view household memberships"
on public.household_members
for select
using (public.is_household_member(household_id));

create policy "owners can insert household memberships"
on public.household_members
for insert
with check (
  (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1
      from public.households h
      where h.id = household_id
        and h.created_by_user_id = auth.uid()
    )
  )
  or exists (
    select 1
    from public.household_members hm
    where hm.household_id = household_id
      and hm.user_id = auth.uid()
      and hm.role = 'owner'
  )
);

create policy "household members can view child profiles"
on public.child_profiles
for select
using (public.is_household_member(household_id));

create policy "household members can insert child profiles"
on public.child_profiles
for insert
with check (public.is_household_member(household_id));

create policy "household members can update child profiles"
on public.child_profiles
for update
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "household members can delete child profiles"
on public.child_profiles
for delete
using (public.is_household_member(household_id));

create policy "household members can manage routines"
on public.routines
for all
using (
  exists (
    select 1
    from public.child_profiles cp
    where cp.id = child_profile_id
      and public.is_household_member(cp.household_id)
  )
)
with check (
  exists (
    select 1
    from public.child_profiles cp
    where cp.id = child_profile_id
      and public.is_household_member(cp.household_id)
  )
);

create policy "household members can manage routine tasks"
on public.routine_tasks
for all
using (
  exists (
    select 1
    from public.routines r
    join public.child_profiles cp on cp.id = r.child_profile_id
    where r.id = routine_id
      and public.is_household_member(cp.household_id)
  )
)
with check (
  exists (
    select 1
    from public.routines r
    join public.child_profiles cp on cp.id = r.child_profile_id
    where r.id = routine_id
      and public.is_household_member(cp.household_id)
  )
);

create policy "household members can manage daily routine progress"
on public.daily_routine_progress
for all
using (
  exists (
    select 1
    from public.child_profiles cp
    where cp.id = child_profile_id
      and public.is_household_member(cp.household_id)
  )
)
with check (
  exists (
    select 1
    from public.child_profiles cp
    where cp.id = child_profile_id
      and public.is_household_member(cp.household_id)
  )
);

create policy "household members can manage daily task progress"
on public.daily_task_progress
for all
using (
  exists (
    select 1
    from public.daily_routine_progress drp
    join public.child_profiles cp on cp.id = drp.child_profile_id
    where drp.id = daily_routine_progress_id
      and public.is_household_member(cp.household_id)
  )
)
with check (
  exists (
    select 1
    from public.daily_routine_progress drp
    join public.child_profiles cp on cp.id = drp.child_profile_id
    where drp.id = daily_routine_progress_id
      and public.is_household_member(cp.household_id)
  )
);
