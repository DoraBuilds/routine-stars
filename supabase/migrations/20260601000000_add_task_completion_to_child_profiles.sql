-- Adds a task_completion JSONB column to child_profiles.
--
-- Structure stored per child:
--   {
--     "2026-05-31": { "morning": ["Brush teeth", "Make bed"], "evening": ["Wash hands"] }
--   }
--
-- Keyed by local date string (YYYY-MM-DD).  The app writes only today's entry
-- on every save, so the record is always current.  Yesterday's key will never
-- match today's date, giving automatic daily resets with zero extra logic.

ALTER TABLE child_profiles
  ADD COLUMN IF NOT EXISTS task_completion JSONB NOT NULL DEFAULT '{}';
