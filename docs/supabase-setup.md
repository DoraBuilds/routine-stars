# Supabase Setup

## Environment Variables

Add these to your local environment before testing the parent account shell:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can start from [.env.example](../.env.example).

## What Works After Configuring Keys

- parent sign in
- parent sign up
- persisted Supabase session in the browser
- real household bootstrap in the app once the Supabase schema exists

## What Still Comes Next

Still required:
- applying the migration in `supabase/migrations/20260410194500_create_household_schema.sql` to the remote project
- making sure the migration includes the `bootstrap_household` RPC so the first owner membership can be created safely under RLS
- cloud-backed child/routine sync
- local-to-cloud import flow

## Checking for schema drift

`supabase/migrations/` is meant to be the source of truth for what's live in
production, but it isn't guaranteed to be — #158 found a `households` DELETE
policy that existed in production but was never captured in a committed
migration (it was added directly via the SQL editor at some point). It
happened to fail safe (blocked every delete instead of allowing an
unintended one), but a drift like that could just as easily go the other
way.

Run this whenever you've made a change directly in the Supabase dashboard/SQL
editor, and periodically otherwise (e.g. before cutting a new migration), to
confirm production actually matches what's committed:

```sh
supabase link --project-ref <your-project-ref>   # one-time per machine
supabase db diff --linked --schema public
```

An empty diff means production matches `supabase/migrations/`. A non-empty
diff means something changed live without a matching migration — write one
from the diff output before it's forgotten (that's exactly how #158 was
found and fixed).
