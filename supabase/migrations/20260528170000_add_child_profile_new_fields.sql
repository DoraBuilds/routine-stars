-- Add new child profile fields introduced by the Cozy Pastel redesign:
-- mascot_id, affirmations, badges, moods, streak
--
-- All columns are nullable with safe defaults so existing rows keep working.

alter table public.child_profiles
  add column if not exists mascot_id   text,
  add column if not exists streak      integer not null default 0,
  add column if not exists affirmations jsonb not null default '[]'::jsonb,
  add column if not exists badges      jsonb not null default '{}'::jsonb,
  add column if not exists moods       jsonb not null default '[]'::jsonb;
