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

There are two distinct kinds of drift to check for, and they need different
tools.

**1. Schema drift** (production has objects — tables, policies, functions —
that don't match `supabase/migrations/`, or vice versa). Needs Docker
running locally (`supabase db diff` builds a local shadow database to
compare against):

```sh
supabase link --project-ref <your-project-ref>   # one-time per machine
supabase db diff --linked --schema public
```

An empty diff means production matches `supabase/migrations/`. A non-empty
diff means something changed live without a matching migration — write one
from the diff output before it's forgotten (that's exactly how #158 was
found and fixed).

**2. Migration-history drift** (the *content* matches, but the CLI's
tracking table doesn't know it). This one doesn't need Docker:

```sh
supabase migration list
```

If a migration shows a value under `Local` but nothing under `Remote`, the
CLI has no record of it being applied — even if it actually is live (this
happens whenever a migration got applied by hand via the SQL editor instead
of through the CLI, which is how every migration before #164 got onto
production). This matters because `supabase db push` blindly trusts that
table: if it thinks an already-live migration is still pending, it will try
to re-run it, and a `create policy` for a policy that already exists will
fail partway through and leave things half-migrated.

Fix it with `supabase migration repair <version> ... --status applied` for
each affected version (marks it applied without re-executing it), then
confirm with `supabase db push --dry-run` that only the migrations you
actually intend to run are queued, before running `supabase db push` for
real.
