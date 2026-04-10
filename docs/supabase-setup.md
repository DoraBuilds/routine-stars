# Supabase Setup

## Environment Variables

Add these to your local environment before testing the parent account shell:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can start from [.env.example](/Users/doraangelov/CodexProjects/daily-star-chart/.env.example).

## What Works After Configuring Keys

- parent sign in
- parent sign up
- persisted Supabase session in the browser
- provisional household bootstrap marker after first login

## What Still Comes Next

This scaffolding is intentionally ahead of the database work.

Still required:
- real `households` and membership tables
- row-level security
- true household bootstrap in the database
- cloud-backed child/routine sync
- local-to-cloud import flow
